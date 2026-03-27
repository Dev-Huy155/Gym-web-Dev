import oracledb from "oracledb";

async function checkConstraint() {
  let conn;
  try {
    conn = await oracledb.getConnection({
      user: "gym",
      password: "abc123",
      connectString: "localhost:1521/orcl",
    });

    // Check table structure
    const result = await conn.execute(`
      SELECT CONSTRAINT_NAME, CONSTRAINT_TYPE, SEARCH_CONDITION 
      FROM USER_CONSTRAINTS 
      WHERE TABLE_NAME = 'STAFF'
    `);

    console.log("=== CONSTRAINTS ===");
    console.log(result.rows);

    // Check existing data
    const dataResult = await conn.execute(`
      SELECT ID, NAME, STATUS 
      FROM STAFF 
      ORDER BY ID DESC
    `);

    console.log("\n=== EXISTING DATA ===");
    console.log(dataResult.rows);
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) await conn.close();
  }
}

checkConstraint();
