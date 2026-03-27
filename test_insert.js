import oracledb from "oracledb";

async function testInsert() {
  let conn;
  try {
    conn = await oracledb.getConnection({
      user: "gym",
      password: "abc123",
      connectString: "localhost:1521/orcl",
    });

    // Test insert with exact values as in constraint
    const testData = {
      name: "Test Insert Direct",
      position: "HLV",
      phone: "0999999999",
      email: "test@test.com",
      address: "Test Address",
      joinDate: "2023-01-15",
      salary: 5000000,
      status: "Đang làm", // Exact value from constraint
    };

    console.log("💾 Attempting to insert:", testData);

    const result = await conn.execute(
      `INSERT INTO STAFF (NAME, POSITION, PHONE, EMAIL, ADDRESS, JOIN_DATE, SALARY, STATUS)
       VALUES (:name, :position, :phone, :email, :address, 
               TO_DATE(:joinDate, 'YYYY-MM-DD'), :salary, :status)`,
      {
        name: testData.name,
        position: testData.position,
        phone: testData.phone,
        email: testData.email,
        address: testData.address,
        joinDate: testData.joinDate,
        salary: testData.salary,
        status: testData.status,
      },
      { autoCommit: true },
    );

    console.log("✅ INSERT SUCCESS! Rows affected:", result.rowsAffected);
  } catch (err) {
    console.error("❌ INSERT ERROR:", err.message);
    console.error("Full error:", err);
  } finally {
    if (conn) await conn.close();
  }
}

testInsert();
