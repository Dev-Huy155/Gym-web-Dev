import oracledb from 'oracledb';

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.fetchAsString = [oracledb.CLOB];

async function test() {
  let conn;
  try {
    conn = await oracledb.getConnection({
      user: 'gym',
      password: 'abc123',
      connectString: 'localhost:1521/orcl'
    });
    const result = await conn.execute(`SELECT * FROM STAFF ORDER BY ID DESC`);
    console.log("first row:", result.rows[0]);
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) await conn.close();
  }
}
test();