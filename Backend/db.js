import oracledb from 'oracledb';

async function connectDB() {
  try {
    const connection = await oracledb.getConnection({
      user: 'gym',
      password: 'abc123',
      connectString: 'localhost:1521/orcl'
    });

    console.log('✅ Connected Oracle');

    const result = await connection.execute(`SELECT * FROM dual`);
    console.log(result.rows);

    await connection.close();
  } catch (err) {
    console.error('❌ Lỗi:', err);
  }
}

connectDB();