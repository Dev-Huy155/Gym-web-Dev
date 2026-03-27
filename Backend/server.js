import express from "express";
import oracledb from "oracledb";
import cors from "cors";

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.fetchAsString = [oracledb.CLOB];

const app = express();
app.use(cors());
app.use(
  express.json({
    verify: (req, res, buf) => {
      console.log(
        `Received ${req.method} ${req.url} with body:`,
        buf.toString(),
      );
    },
  }),
);

// Error handling for body parser
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("Bad JSON:", err);
    return res.status(400).json({ error: "Invalid JSON" });
  }
  next();
});

// ================== CONFIG DB ==================
const dbConfig = {
  user: "gym",
  password: "abc123",
  connectString: "localhost:1521/orcl",
};

// ================== HELPER ==================
const formatDate = (date) => {
  if (!date) return null;
  return date.split("T")[0]; // fix ISO date từ frontend
};

const toDateString = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString().split("T")[0];
  if (typeof value === "string") return value.split("T")[0];
  return null;
};

const normalizePaymentMethod = (value) => {
  const rawValue = value?.trim();

  if (!rawValue) return "";

  const normalized = rawValue
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d")
    .replace(/\u0110/g, "D")
    .toLowerCase();

  if (normalized === "tien mat") return "Tiền mặt";
  if (normalized === "chuyen khoan") return "Chuyển khoản";
  if (normalized === "the") return "Thẻ";

  return rawValue;
};

const parseNumericInput = (value) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value !== "string") return 0;

  const digitsOnly = value.replace(/\D/g, "");
  return digitsOnly ? Number(digitsOnly) : 0;
};

const getOracleErrorMessage = (err, fallbackMessage) => {
  const message = err?.message || "";

  if (message.includes("ORA-00001")) {
    return "Số điện thoại hoặc email đã tồn tại";
  }

  return fallbackMessage || message || "Unknown error";
};

const normalizeCustomerStatus = (value) => {
  const rawValue = value?.trim();

  if (!rawValue) return "";

  const normalized = rawValue
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d")
    .replace(/\u0110/g, "D")
    .toLowerCase();

  if (normalized === "hoat dong") return "Hoáº¡t Ä‘á»™ng";
  if (normalized === "tam ngung") return "Táº¡m ngá»«ng";
  if (normalized === "het han") return "Háº¿t háº¡n";

  return rawValue;
};

// ================== 1. POST TEST ==================
app.all("/test", (req, res) => {
  console.log(`${req.method} request to /test received, body:`, req.body);
  console.log("Headers:", req.headers);
  res.json({ message: "Test works", method: req.method, received: true });
});

app.get("/debug/staff-source", async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(dbConfig);

    const envResult = await conn.execute(`
      SELECT
        USER AS CURRENT_USER,
        SYS_CONTEXT('USERENV', 'DB_NAME') AS DB_NAME,
        SYS_CONTEXT('USERENV', 'SERVICE_NAME') AS SERVICE_NAME,
        SYS_CONTEXT('USERENV', 'CON_NAME') AS CON_NAME
      FROM dual
    `);

    const countResult = await conn.execute(`
      SELECT COUNT(*) AS CNT FROM STAFF
    `);

    const sampleResult = await conn.execute(`
      SELECT ID, NAME
      FROM STAFF
      ORDER BY ID
      FETCH FIRST 20 ROWS ONLY
    `);

    res.json({
      env: envResult.rows?.[0] || null,
      count: countResult.rows?.[0]?.CNT ?? null,
      sample: sampleResult.rows || [],
    });
  } catch (err) {
    console.error("GET /debug/staff-source error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// ================== 2. GET ==================
app.get("/staff", async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(dbConfig);

    const result = await conn.execute(`
      SELECT ID, NAME, POSITION, PHONE, EMAIL, TO_CHAR(ADDRESS) AS ADDRESS,
             JOIN_DATE, SALARY, STATUS
      FROM STAFF
      ORDER BY ID DESC
    `);

    const staff = (result.rows || []).map((row) => ({
      id: row.ID,
      name: row.NAME,
      position: row.POSITION,
      phone: row.PHONE,
      email: row.EMAIL,
      address: row.ADDRESS || "",
      joinDate: toDateString(row.JOIN_DATE),
      salary: Number(row.SALARY) || 0,
      status: row.STATUS,
    }));

    res.json(staff);
  } catch (err) {
    console.error("🔥 GET ERROR:", err);
    const statusCode = err?.message?.includes("ORA-00001") ? 400 : 500;
    res.status(statusCode).json({
      error: getOracleErrorMessage(err, "Không thể thêm nhân viên"),
    });
  } finally {
    if (conn) await conn.close();
  }
});
// ================== 3. POST STAFF ==================
app.post("/staff", async (req, res) => {
  console.log("=== POST /staff START ===");
  console.log("POST /staff called with body:", req.body);
  let conn;
  try {
    const { name, position, phone, email, address, joinDate, salary, status } =
      req.body;

    // validate cơ bản
    if (
      !name ||
      !position ||
      !phone ||
      !email ||
      !address ||
      !joinDate ||
      salary === undefined ||
      salary === null
    ) {
      return res.status(400).json({
        error:
          "Thiếu thông tin bắt buộc: name, position, phone, email, address, joinDate, salary",
      });
    }

    // Validate that strings are not empty
    if (
      name.trim() === "" ||
      position.trim() === "" ||
      phone.trim() === "" ||
      email.trim() === "" ||
      address.trim() === ""
    ) {
      return res.status(400).json({ error: "Các trường không được để trống" });
    }

    // VALIDATE STATUS - quan trọng để tránh lỗi Oracle constraint
    const allowedStatuses = ["Đang làm", "Nghỉ phép", "Đã nghỉ"];
    const cleanStatus = (status || "").toString().trim();
    const numericSalary = parseNumericInput(salary);

    console.log("Received status:", JSON.stringify(status));
    console.log("Cleaned status:", JSON.stringify(cleanStatus));
    console.log(
      "Allowed statuses:",
      allowedStatuses.map((s) => JSON.stringify(s)),
    );

    if (!allowedStatuses.includes(cleanStatus)) {
      console.log("Status not in allowed list");
      return res.status(400).json({
        error: `STATUS không hợp lệ. Nhận: '${cleanStatus}'. Cho phép: ${allowedStatuses.join(", ")}`,
      });
    }

    if (false) {
      return res.status(400).json({
        error: "ID khách hàng phải là số nguyên dương",
      });
    }

    console.log("📤 POST DATA:", {
      name,
      position,
      phone,
      email,
      address,
      joinDate,
      salary,
      status: cleanStatus,
    });

    conn = await oracledb.getConnection(dbConfig);

    const result = await conn.execute(
      `INSERT INTO STAFF (NAME, POSITION, PHONE, EMAIL, ADDRESS, JOIN_DATE, SALARY, STATUS)
       VALUES (:name, :position, :phone, :email, :address, 
               TO_DATE(:joinDate, 'YYYY-MM-DD'), :salary, :status)`,
      {
        name,
        position,
        phone,
        email,
        address,
        joinDate: formatDate(joinDate),
        salary: numericSalary,
        status: cleanStatus, // SỬ DỤNG STATUS ĐÃ TRIM VÀ VALIDATE
      },
      { autoCommit: true },
    );

    res.json({
      success: true,
      message: "Thêm thành công",
      rowsAffected: result.rowsAffected,
    });
  } catch (err) {
    console.error("🔥 POST ERROR:", err);
    const statusCode = err?.message?.includes("ORA-00001") ? 400 : 500;
    res.status(statusCode).json({
      error: getOracleErrorMessage(err, "Không thể cập nhật nhân viên"),
    });
  } finally {
    if (conn) await conn.close();
  }
});

// ================== 3. DELETE ==================
app.delete("/staff/:id", async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(dbConfig);

    const result = await conn.execute(
      `DELETE FROM STAFF WHERE ID = :id`,
      { id: req.params.id },
      { autoCommit: true },
    );

    res.json({
      success: result.rowsAffected > 0,
      rowsAffected: result.rowsAffected,
    });
  } catch (err) {
    console.error("🔥 DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// ================== 4. UPDATE ==================
app.put("/staff/:id", async (req, res) => {
  let conn;
  try {
    const { id } = req.params;
    const { name, position, phone, email, address, joinDate, salary, status } =
      req.body;

    conn = await oracledb.getConnection(dbConfig);

    const result = await conn.execute(
      `UPDATE STAFF 
       SET NAME=:name, POSITION=:position, PHONE=:phone, EMAIL=:email, 
           ADDRESS=:address, JOIN_DATE=TO_DATE(:joinDate, 'YYYY-MM-DD'), 
           SALARY=:salary, STATUS=:status 
       WHERE ID=:id`,
      {
        id,
        name,
        position,
        phone,
        email,
        address,
        joinDate: formatDate(joinDate),
        salary: parseNumericInput(salary),
        status,
      },
      { autoCommit: true },
    );

    res.json({
      success: result.rowsAffected > 0,
      rowsAffected: result.rowsAffected,
    });
  } catch (err) {
    console.error("🔥 UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// ================== EQUIPMENT ENDPOINTS ==================

// 1. GET ALL EQUIPMENT
app.get("/equipment", async (req, res) => {
  console.log("=== GET /equipment START ===");
  let conn;
  try {
    conn = await oracledb.getConnection(dbConfig);

    const result = await conn.execute(`
      SELECT ID, NAME, CATEGORY, STATUS, PURCHASE_DATE, LAST_MAINTENANCE, LOCATION
      FROM EQUIPMENT
      ORDER BY ID
    `);

    const equipment = (result.rows || []).map((row) => ({
      id: row.ID,
      name: row.NAME,
      category: row.CATEGORY,
      status: row.STATUS,
      purchaseDate: toDateString(row.PURCHASE_DATE),
      lastMaintenance: toDateString(row.LAST_MAINTENANCE),
      location: row.LOCATION,
    }));

    console.log("✅ GET equipment success, records:", equipment.length);
    res.json(equipment);
  } catch (err) {
    console.error("🔥 GET EQUIPMENT ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// 2. CREATE EQUIPMENT
app.post("/equipment", async (req, res) => {
  console.log("=== POST /equipment START ===");
  console.log("POST /equipment called with body:", req.body);
  let conn;
  try {
    const { name, category, status, purchaseDate, lastMaintenance, location } =
      req.body;

    // Validate required fields
    if (!name || !category || !status || !purchaseDate) {
      return res
        .status(400)
        .json({
          error:
            "Thiếu thông tin bắt buộc: name, category, status, purchaseDate",
        });
    }

    // Validate that strings are not empty
    if (name.trim() === "" || category.trim() === "" || status.trim() === "") {
      return res.status(400).json({ error: "Các trường không được để trống" });
    }

    // VALIDATE STATUS
    const allowedStatuses = ["Hoạt động", "Bảo trì", "Hỏng"];
    const cleanStatus = (status || "").toString().trim();
    if (!allowedStatuses.includes(cleanStatus)) {
      return res.status(400).json({
        error: `STATUS không hợp lệ. Nhận: '${cleanStatus}'. Cho phép: ${allowedStatuses.join(", ")}`,
      });
    }

    console.log("📤 POST DATA:", {
      name,
      category,
      status: cleanStatus,
      purchaseDate,
      lastMaintenance,
      location,
    });

    conn = await oracledb.getConnection(dbConfig);

    const result = await conn.execute(
      `INSERT INTO EQUIPMENT (NAME, CATEGORY, STATUS, PURCHASE_DATE, LAST_MAINTENANCE, LOCATION)
       VALUES (:name, :category, :status, TO_DATE(:purchaseDate, 'YYYY-MM-DD'),
               TO_DATE(:lastMaintenance, 'YYYY-MM-DD'), :location)`,
      {
        name,
        category,
        status: cleanStatus,
        purchaseDate,
        lastMaintenance,
        location,
      },
    );

    await conn.commit();

    res.json({
      success: result.rowsAffected > 0,
      message: "Thêm thiết bị thành công",
      rowsAffected: result.rowsAffected,
    });
  } catch (err) {
    console.error("🔥 POST EQUIPMENT ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// 3. DELETE EQUIPMENT
app.delete("/equipment/:id", async (req, res) => {
  console.log("=== DELETE /equipment START ===");
  let conn;
  try {
    const { id } = req.params;
    console.log("Deleting equipment ID:", id);

    conn = await oracledb.getConnection(dbConfig);

    const result = await conn.execute("DELETE FROM EQUIPMENT WHERE ID = :id", {
      id: Number(id),
    });

    await conn.commit();

    console.log(
      "✅ DELETE equipment success, rows affected:",
      result.rowsAffected,
    );
    res.json({
      success: result.rowsAffected > 0,
      rowsAffected: result.rowsAffected,
    });
  } catch (err) {
    console.error("🔥 DELETE EQUIPMENT ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// 4. UPDATE EQUIPMENT
app.put("/equipment/:id", async (req, res) => {
  console.log("=== PUT /equipment START ===");
  let conn;
  try {
    const { id } = req.params;
    const { name, category, status, purchaseDate, lastMaintenance, location } =
      req.body;

    // Validate required fields
    if (!name || !category || !status || !purchaseDate) {
      return res
        .status(400)
        .json({
          error:
            "Thiếu thông tin bắt buộc: name, category, status, purchaseDate",
        });
    }

    // Validate that strings are not empty
    if (name.trim() === "" || category.trim() === "" || status.trim() === "") {
      return res.status(400).json({ error: "Các trường không được để trống" });
    }

    // VALIDATE STATUS
    const allowedStatuses = ["Hoạt động", "Bảo trì", "Hỏng"];
    const cleanStatus = (status || "").toString().trim();
    if (!allowedStatuses.includes(cleanStatus)) {
      return res.status(400).json({
        error: `STATUS không hợp lệ. Nhận: '${cleanStatus}'. Cho phép: ${allowedStatuses.join(", ")}`,
      });
    }

    conn = await oracledb.getConnection(dbConfig);

    const result = await conn.execute(
      `UPDATE EQUIPMENT SET
        NAME = :name,
        CATEGORY = :category,
        STATUS = :status,
        PURCHASE_DATE = TO_DATE(:purchaseDate, 'YYYY-MM-DD'),
        LAST_MAINTENANCE = TO_DATE(:lastMaintenance, 'YYYY-MM-DD'),
        LOCATION = :location,
        UPDATED_AT = SYSTIMESTAMP
       WHERE ID = :id`,
      {
        id: Number(id),
        name,
        category,
        status: cleanStatus,
        purchaseDate,
        lastMaintenance,
        location,
      },
    );

    await conn.commit();

    console.log(
      "✅ UPDATE equipment success, rows affected:",
      result.rowsAffected,
    );
    res.json({
      success: result.rowsAffected > 0,
      message: "Cập nhật thiết bị thành công",
      rowsAffected: result.rowsAffected,
    });
  } catch (err) {
    console.error("🔥 UPDATE EQUIPMENT ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// ================== CUSTOMER ENDPOINTS ==================

// 1. GET ALL CUSTOMERS
app.get("/customers", async (req, res) => {
  console.log("=== GET /customers START ===");
  let conn;
  try {
    conn = await oracledb.getConnection(dbConfig);

    const result = await conn.execute(`
      SELECT ID, NAME, PHONE, EMAIL, ADDRESS, MEMBERSHIP_TYPE, START_DATE, END_DATE, STATUS, VISITS
      FROM CUSTOMERS
      ORDER BY ID
    `);

    const customers = (result.rows || []).map((row) => ({
      id: row.ID,
      name: row.NAME,
      phone: row.PHONE,
      email: row.EMAIL,
      address: row.ADDRESS,
      membershipType: row.MEMBERSHIP_TYPE,
      startDate: toDateString(row.START_DATE),
      endDate: toDateString(row.END_DATE),
      status: row.STATUS,
      visits: row.VISITS || 0,
    }));

    console.log("✅ GET customers success, records:", customers.length);
    res.json(customers);
  } catch (err) {
    console.error("🔥 GET CUSTOMERS ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// 2. CREATE CUSTOMER
app.post("/customers", async (req, res) => {
  console.log("=== POST /customers START ===");
  console.log("POST /customers called with body:", req.body);
  let conn;
  try {
    const {
      id,
      name,
      phone,
      email,
      address,
      membershipType,
      startDate,
      endDate,
      status,
      visits,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !phone ||
      !email ||
      !membershipType ||
      !startDate ||
      !endDate ||
      !status
    ) {
      return res
        .status(400)
        .json({
          error:
            "Thiếu thông tin bắt buộc: name, phone, email, membershipType, startDate, endDate, status",
        });
    }

    // Validate that strings are not empty
    if (
      name.trim() === "" ||
      phone.trim() === "" ||
      email.trim() === "" ||
      membershipType.trim() === "" ||
      status.trim() === ""
    ) {
      return res.status(400).json({ error: "Các trường không được để trống" });
    }

    // VALIDATE STATUS
    const allowedStatuses = ["Hoạt động", "Tạm ngừng", "Hết hạn"];
    const cleanStatus = (status || "").toString().trim();
    if (!allowedStatuses.includes(cleanStatus)) {
      return res.status(400).json({
        error: `STATUS không hợp lệ. Nhận: '${cleanStatus}'. Cho phép: ${allowedStatuses.join(", ")}`,
      });
    }

    console.log("📤 POST DATA:", {
      name,
      phone,
      email,
      address,
      membershipType,
      startDate,
      endDate,
      status: cleanStatus,
      visits,
    });

    conn = await oracledb.getConnection(dbConfig);

    const customerId = Number(id);
    if (id !== undefined && (!Number.isInteger(customerId) || customerId <= 0)) {
      return res.status(400).json({
        error: "ID khach hang phai la so nguyen duong",
      });
    }

    const insertSql = id !== undefined
      ? `INSERT INTO CUSTOMERS (ID, NAME, PHONE, EMAIL, ADDRESS, MEMBERSHIP_TYPE, START_DATE, END_DATE, STATUS, VISITS)
         VALUES (:id, :name, :phone, :email, :address, :membershipType,
                 TO_DATE(:startDate, 'YYYY-MM-DD'), TO_DATE(:endDate, 'YYYY-MM-DD'), :status, :visits)`
      : `INSERT INTO CUSTOMERS (NAME, PHONE, EMAIL, ADDRESS, MEMBERSHIP_TYPE, START_DATE, END_DATE, STATUS, VISITS)
         VALUES (:name, :phone, :email, :address, :membershipType,
                 TO_DATE(:startDate, 'YYYY-MM-DD'), TO_DATE(:endDate, 'YYYY-MM-DD'), :status, :visits)`;

    const result = await conn.execute(
      insertSql,
      {
        id: id !== undefined ? customerId : undefined,
        name,
        phone,
        email,
        address,
        membershipType,
        startDate,
        endDate,
        status: cleanStatus,
        visits: visits || 0,
      },
    );

    await conn.commit();

    res.json({
      success: result.rowsAffected > 0,
      message: "Thêm khách hàng thành công",
      rowsAffected: result.rowsAffected,
    });
  } catch (err) {
    console.error("🔥 POST CUSTOMERS ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// 3. DELETE CUSTOMER
app.delete("/customers/:id", async (req, res) => {
  console.log("=== DELETE /customers START ===");
  let conn;
  try {
    const { id } = req.params;
    console.log("Deleting customer ID:", id);

    conn = await oracledb.getConnection(dbConfig);

    const result = await conn.execute("DELETE FROM CUSTOMERS WHERE ID = :id", {
      id: Number(id),
    });

    await conn.commit();

    console.log(
      "✅ DELETE customer success, rows affected:",
      result.rowsAffected,
    );
    res.json({
      success: result.rowsAffected > 0,
      rowsAffected: result.rowsAffected,
    });
  } catch (err) {
    console.error("🔥 DELETE CUSTOMERS ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// 4. UPDATE CUSTOMER
app.put("/customers/:id", async (req, res) => {
  console.log("=== PUT /customers START ===");
  let conn;
  try {
    const { id } = req.params;
    const {
      name,
      phone,
      email,
      address,
      membershipType,
      startDate,
      endDate,
      status,
      visits,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !phone ||
      !email ||
      !membershipType ||
      !startDate ||
      !endDate ||
      !status
    ) {
      return res
        .status(400)
        .json({
          error:
            "Thiếu thông tin bắt buộc: name, phone, email, membershipType, startDate, endDate, status",
        });
    }

    // Validate that strings are not empty
    if (
      name.trim() === "" ||
      phone.trim() === "" ||
      email.trim() === "" ||
      membershipType.trim() === "" ||
      status.trim() === ""
    ) {
      return res.status(400).json({ error: "Các trường không được để trống" });
    }

    // VALIDATE STATUS
    const allowedStatuses = ["Hoạt động", "Tạm ngừng", "Hết hạn"];
    const cleanStatus = (status || "").toString().trim();
    if (!allowedStatuses.includes(cleanStatus)) {
      return res.status(400).json({
        error: `STATUS không hợp lệ. Nhận: '${cleanStatus}'. Cho phép: ${allowedStatuses.join(", ")}`,
      });
    }

    conn = await oracledb.getConnection(dbConfig);

    const result = await conn.execute(
      `UPDATE CUSTOMERS SET
        NAME = :name,
        PHONE = :phone,
        EMAIL = :email,
        ADDRESS = :address,
        MEMBERSHIP_TYPE = :membershipType,
        START_DATE = TO_DATE(:startDate, 'YYYY-MM-DD'),
        END_DATE = TO_DATE(:endDate, 'YYYY-MM-DD'),
        STATUS = :status,
        VISITS = :visits,
        UPDATED_AT = SYSTIMESTAMP
       WHERE ID = :id`,
      {
        id: Number(id),
        name,
        phone,
        email,
        address,
        membershipType,
        startDate,
        endDate,
        status: cleanStatus,
        visits: visits || 0,
      },
    );

    await conn.commit();

    console.log(
      "✅ UPDATE customer success, rows affected:",
      result.rowsAffected,
    );
    res.json({
      success: result.rowsAffected > 0,
      message: "Cập nhật khách hàng thành công",
      rowsAffected: result.rowsAffected,
    });
  } catch (err) {
    console.error("🔥 UPDATE CUSTOMERS ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// ================== SERVICES ENDPOINTS ==================

// 1. GET ALL SERVICES
app.get("/services", async (req, res) => {
  console.log("=== GET /services START ===");
  let conn;
  try {
    conn = await oracledb.getConnection(dbConfig);

    const result = await conn.execute(`
      SELECT ID, NAME, TYPE, PRICE, DURATION_DAYS, DESCRIPTION, MAX_MEMBERS, ACTIVE
      FROM SERVICES
      ORDER BY ID
    `);

    const services = (result.rows || []).map((row) => ({
      id: row.ID,
      name: row.NAME,
      type: row.TYPE,
      price: row.PRICE,
      durationDays: row.DURATION_DAYS,
      description: row.DESCRIPTION,
      maxMembers: row.MAX_MEMBERS,
      active: row.ACTIVE === 1,
    }));

    console.log("✅ GET services success, records:", services.length);
    res.json(services);
  } catch (err) {
    console.error("🔥 GET SERVICES ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// 2. CREATE SERVICE
app.post("/services", async (req, res) => {
  console.log("=== POST /services START ===");
  console.log("POST /services called with body:", req.body);
  let conn;
  try {
    const { name, type, price, durationDays, description, maxMembers, active } =
      req.body;

    // Validate required fields
    if (!name || !type || price === undefined || durationDays === undefined) {
      return res
        .status(400)
        .json({
          error: "Thiếu thông tin bắt buộc: name, type, price, durationDays",
        });
    }

    // Validate that strings are not empty
    if (name.trim() === "" || type.trim() === "") {
      return res.status(400).json({ error: "Các trường không được để trống" });
    }

    console.log("📤 POST DATA:", {
      name,
      type,
      price,
      durationDays,
      description,
      maxMembers,
      active,
    });

    conn = await oracledb.getConnection(dbConfig);

    const result = await conn.execute(
      `INSERT INTO SERVICES (NAME, TYPE, PRICE, DURATION_DAYS, DESCRIPTION, MAX_MEMBERS, ACTIVE)
       VALUES (:name, :type, :price, :durationDays, :description, :maxMembers, :active)`,
      {
        name,
        type,
        price: Number(price),
        durationDays: Number(durationDays),
        description,
        maxMembers: maxMembers || null,
        active: active ? 1 : 0,
      },
    );

    await conn.commit();

    res.json({
      success: result.rowsAffected > 0,
      message: "Thêm dịch vụ thành công",
      rowsAffected: result.rowsAffected,
    });
  } catch (err) {
    console.error("🔥 POST SERVICES ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// 3. DELETE SERVICE
app.delete("/services/:id", async (req, res) => {
  console.log("=== DELETE /services START ===");
  let conn;
  try {
    const { id } = req.params;
    console.log("Deleting service ID:", id);

    conn = await oracledb.getConnection(dbConfig);

    const result = await conn.execute("DELETE FROM SERVICES WHERE ID = :id", {
      id: Number(id),
    });

    await conn.commit();

    console.log(
      "✅ DELETE service success, rows affected:",
      result.rowsAffected,
    );
    res.json({
      success: result.rowsAffected > 0,
      rowsAffected: result.rowsAffected,
    });
  } catch (err) {
    console.error("🔥 DELETE SERVICES ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// 4. UPDATE SERVICE
app.put("/services/:id", async (req, res) => {
  console.log("=== PUT /services START ===");
  let conn;
  try {
    const { id } = req.params;
    const { name, type, price, durationDays, description, maxMembers, active } =
      req.body;

    // Validate required fields
    if (!name || !type || price === undefined || durationDays === undefined) {
      return res
        .status(400)
        .json({
          error: "Thiếu thông tin bắt buộc: name, type, price, durationDays",
        });
    }

    // Validate that strings are not empty
    if (name.trim() === "" || type.trim() === "") {
      return res.status(400).json({ error: "Các trường không được để trống" });
    }

    conn = await oracledb.getConnection(dbConfig);

    const result = await conn.execute(
      `UPDATE SERVICES SET
        NAME = :name,
        TYPE = :type,
        PRICE = :price,
        DURATION_DAYS = :durationDays,
        DESCRIPTION = :description,
        MAX_MEMBERS = :maxMembers,
        ACTIVE = :active,
        UPDATED_AT = SYSTIMESTAMP
       WHERE ID = :id`,
      {
        id: Number(id),
        name,
        type,
        price: Number(price),
        durationDays: Number(durationDays),
        description,
        maxMembers: maxMembers || null,
        active: active ? 1 : 0,
      },
    );

    await conn.commit();

    console.log(
      "✅ UPDATE service success, rows affected:",
      result.rowsAffected,
    );
    res.json({
      success: result.rowsAffected > 0,
      message: "Cập nhật dịch vụ thành công",
      rowsAffected: result.rowsAffected,
    });
  } catch (err) {
    console.error("🔥 UPDATE SERVICES ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// ================== TRANSACTIONS ENDPOINTS ==================

// 1. GET ALL TRANSACTIONS
app.get("/transactions", async (req, res) => {
  console.log("=== GET /transactions START ===");
  let conn;
  try {
    conn = await oracledb.getConnection(dbConfig);

    const result = await conn.execute(`
      SELECT ID, TRANSACTION_DATE, TYPE, CATEGORY, DESCRIPTION, AMOUNT, PAYMENT_METHOD, CUSTOMER_ID
      FROM TRANSACTIONS
      ORDER BY TRANSACTION_DATE DESC
    `);

    const transactions = (result.rows || []).map((row) => ({
      id: row.ID,
      transactionDate: toDateString(row.TRANSACTION_DATE),
      type: row.TYPE,
      category: row.CATEGORY,
      description: row.DESCRIPTION,
      amount: row.AMOUNT,
      paymentMethod: row.PAYMENT_METHOD,
      customerId: row.CUSTOMER_ID,
    }));

    console.log("✅ GET transactions success, records:", transactions.length);
    res.json(transactions);
  } catch (err) {
    console.error("🔥 GET TRANSACTIONS ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// 2. CREATE TRANSACTION
app.post("/transactions", async (req, res) => {
  console.log("=== POST /transactions START ===");
  console.log("POST /transactions called with body:", req.body);
  let conn;
  try {
    const {
      transactionDate,
      type,
      category,
      description,
      amount,
      paymentMethod,
      customerId,
    } = req.body;
    const normalizedPaymentMethod = normalizePaymentMethod(paymentMethod);

    // Validate required fields
    if (
      !transactionDate ||
      !type ||
      !category ||
      amount === undefined ||
      !normalizedPaymentMethod
    ) {
      return res
        .status(400)
        .json({
          error:
            "Thiếu thông tin bắt buộc: transactionDate, type, category, amount, paymentMethod",
        });
    }

    // Validate that strings are not empty
    if (
      type.trim() === "" ||
      category.trim() === "" ||
      normalizedPaymentMethod.trim() === ""
    ) {
      return res.status(400).json({ error: "Các trường không được để trống" });
    }

    console.log("📤 POST DATA:", {
      transactionDate,
      type,
      category,
      description,
      amount,
      paymentMethod: normalizedPaymentMethod,
      customerId,
    });

    conn = await oracledb.getConnection(dbConfig);

    const result = await conn.execute(
      `INSERT INTO TRANSACTIONS (TRANSACTION_DATE, TYPE, CATEGORY, DESCRIPTION, AMOUNT, PAYMENT_METHOD, CUSTOMER_ID)
       VALUES (TO_DATE(:transactionDate, 'YYYY-MM-DD'), :type, :category, :description, :amount, :paymentMethod, :customerId)`,
      {
        transactionDate,
        type,
        category,
        description,
        amount: Number(amount),
        paymentMethod: normalizedPaymentMethod,
        customerId: customerId || null,
      },
    );

    await conn.commit();

    res.json({
      success: result.rowsAffected > 0,
      message: "Thêm giao dịch thành công",
      rowsAffected: result.rowsAffected,
    });
  } catch (err) {
    console.error("🔥 POST TRANSACTIONS ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// 3. DELETE TRANSACTION
app.delete("/transactions/:id", async (req, res) => {
  console.log("=== DELETE /transactions START ===");
  let conn;
  try {
    const { id } = req.params;
    console.log("Deleting transaction ID:", id);

    conn = await oracledb.getConnection(dbConfig);

    const result = await conn.execute(
      "DELETE FROM TRANSACTIONS WHERE ID = :id",
      { id: Number(id) },
    );

    await conn.commit();

    console.log(
      "✅ DELETE transaction success, rows affected:",
      result.rowsAffected,
    );
    res.json({
      success: result.rowsAffected > 0,
      rowsAffected: result.rowsAffected,
    });
  } catch (err) {
    console.error("🔥 DELETE TRANSACTIONS ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// 4. UPDATE TRANSACTION
app.put("/transactions/:id", async (req, res) => {
  console.log("=== PUT /transactions START ===");
  let conn;
  try {
    const { id } = req.params;
    const {
      transactionDate,
      type,
      category,
      description,
      amount,
      paymentMethod,
      customerId,
    } = req.body;
    const normalizedPaymentMethod = normalizePaymentMethod(paymentMethod);

    // Validate required fields
    if (
      !transactionDate ||
      !type ||
      !category ||
      amount === undefined ||
      !normalizedPaymentMethod
    ) {
      return res
        .status(400)
        .json({
          error:
            "Thiếu thông tin bắt buộc: transactionDate, type, category, amount, paymentMethod",
        });
    }

    // Validate that strings are not empty
    if (
      type.trim() === "" ||
      category.trim() === "" ||
      normalizedPaymentMethod.trim() === ""
    ) {
      return res.status(400).json({ error: "Các trường không được để trống" });
    }

    conn = await oracledb.getConnection(dbConfig);

    const result = await conn.execute(
      `UPDATE TRANSACTIONS SET
        TRANSACTION_DATE = TO_DATE(:transactionDate, 'YYYY-MM-DD'),
        TYPE = :type,
        CATEGORY = :category,
        DESCRIPTION = :description,
        AMOUNT = :amount,
        PAYMENT_METHOD = :paymentMethod,
        CUSTOMER_ID = :customerId
       WHERE ID = :id`,
      {
        id: Number(id),
        transactionDate,
        type,
        category,
        description,
        amount: Number(amount),
        paymentMethod: normalizedPaymentMethod,
        customerId: customerId || null,
      },
    );

    await conn.commit();

    console.log(
      "✅ UPDATE transaction success, rows affected:",
      result.rowsAffected,
    );
    res.json({
      success: result.rowsAffected > 0,
      message: "Cập nhật giao dịch thành công",
      rowsAffected: result.rowsAffected,
    });
  } catch (err) {
    console.error("🔥 UPDATE TRANSACTIONS ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// ================== SERVER ==================
console.log("Routes registered:");
console.log("GET /staff - registered");
console.log("POST /staff - registered");
console.log("DELETE /staff/:id - registered");
console.log("PUT /staff/:id - registered");
console.log("GET /equipment - registered");
console.log("POST /equipment - registered");
console.log("DELETE /equipment/:id - registered");
console.log("PUT /equipment/:id - registered");
console.log("GET /customers - registered");
console.log("POST /customers - registered");
console.log("DELETE /customers/:id - registered");
console.log("PUT /customers/:id - registered");
console.log("GET /services - registered");
console.log("POST /services - registered");
console.log("DELETE /services/:id - registered");
console.log("PUT /services/:id - registered");
console.log("GET /transactions - registered");
console.log("POST /transactions - registered");
console.log("DELETE /transactions/:id - registered");
console.log("PUT /transactions/:id - registered");
console.log("ALL /test - registered");

// Catch-all route for debugging
app.use((req, res) => {
  console.log(`Unhandled ${req.method} request to ${req.path}`);
  res
    .status(404)
    .json({ error: "Route not found", method: req.method, path: req.path });
});

app.listen(3001, () => {
  console.log("🚀 Server running at http://localhost:3001");
});
