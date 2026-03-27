import oracledb from "oracledb";

async function testAPI() {
  try {
    // Test GET
    console.log("🔍 Testing GET /staff...");
    const getResponse = await fetch("http://localhost:3001/staff");
    const getData = await getResponse.json();
    console.log("✅ GET success, records:", getData.length);

    // Test POST
    console.log("📤 Testing POST /staff...");
    const testStaff = {
      name: "Nguyễn Văn Test API 2",
      position: "HLV Cá Nhân",
      phone: "0987654323", // Thay đổi số điện thoại
      email: "testapi2@test.com", // Thay đổi email
      address: "123 Test Street, Hà Nội",
      joinDate: "2026-03-23",
      salary: 12000000,
      status: "Đang làm",
    };

    const postResponse = await fetch("http://localhost:3001/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testStaff),
    });

    const postResult = await postResponse.json();
    console.log("✅ POST result:", postResult);

    if (postResponse.ok) {
      console.log("🎉 SUCCESS! Staff added to database");

      // Verify in DB
      const conn = await oracledb.getConnection({
        user: "gym",
        password: "abc123",
        connectString: "localhost:1521/orcl",
      });

      const result = await conn.execute(
        `SELECT * FROM STAFF WHERE NAME = :name ORDER BY ID DESC`,
        { name: testStaff.name },
      );

      console.log(
        "📊 DB verification:",
        result.rows.length > 0 ? "Found in DB" : "Not found",
      );
      console.log("📊 Latest record:", result.rows[0]);

      await conn.close();
    } else {
      console.log("❌ POST failed:", postResult.error);
    }
  } catch (err) {
    console.error("❌ Test failed:", err.message);
  }
}

testAPI();
