import oracledb from "oracledb";

async function checkTableStructure() {
  let conn;
  try {
    conn = await oracledb.getConnection({
      user: "gym",
      password: "abc123",
      connectString: "localhost:1521/orcl",
    });

    const tables = ["EQUIPMENT", "CUSTOMERS", "SERVICES", "TRANSACTIONS"];
    for (const table of tables) {
      console.log(`=== ${table} TABLE STRUCTURE ===`);
      const result = await conn.execute(
        `SELECT column_name, data_type, nullable FROM user_tab_columns WHERE table_name = '${table}' ORDER BY column_id`,
      );
      console.log(result.rows);
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    if (conn) await conn.close();
  }
}

checkTableStructure();
