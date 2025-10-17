const mysql = require('mysql2/promise')

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...\n')

    const connection = await mysql.createConnection({
      host: 'sql12.freesqldatabase.com',
      port: 3306,
      user: 'sql12803031',
      password: '2ZgaDVhsTU',
      database: 'sql12803031',
    })

    console.log('✅ Database connection successful!\n')

    // Test query
    const [rows] = await connection.execute(
      'SELECT 1 as test, NOW() as time_now'
    )
    console.log('Test query result:', rows)

    // Show existing tables
    const [tables] = await connection.execute('SHOW TABLES')
    console.log('\nExisting tables:', tables)

    await connection.end()
    console.log('\n✅ Connection closed successfully')
    process.exit(0)
  } catch (error) {
    console.error('❌ Database connection failed!\n')
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    console.error('\nFull error:', error)
    process.exit(1)
  }
}

testConnection()
