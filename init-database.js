const mysql = require('mysql2/promise')

async function initDatabase() {
  try {
    console.log('🚀 Initializing database...\n')

    const connection = await mysql.createConnection({
      host: 'sql12.freesqldatabase.com',
      port: 3306,
      user: 'sql12803031',
      password: '2ZgaDVhsTU',
      database: 'sql12803031',
    })

    console.log('✅ Connected to database\n')

    // Create students table
    console.log('Creating students table...')
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NULL,
        major VARCHAR(100) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Students table created\n')

    // Create users table
    console.log('Creating users table...')
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('student','admin') NOT NULL DEFAULT 'student',
        student_id VARCHAR(20) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE SET NULL
      )
    `)
    console.log('✅ Users table created\n')

    // Create grades table
    console.log('Creating grades table...')
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS grades (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id VARCHAR(20) NOT NULL,
        course_code VARCHAR(20),
        course_title VARCHAR(255),
        grade VARCHAR(10),
        FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
      )
    `)
    console.log('✅ Grades table created\n')

    // Create audit_logs table
    console.log('Creating audit_logs table...')
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        action VARCHAR(100) NOT NULL,
        username VARCHAR(100) NULL,
        ip_address VARCHAR(45) NULL,
        status VARCHAR(20) NOT NULL,
        details TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Audit_logs table created\n')

    // Show all tables
    const [tables] = await connection.execute('SHOW TABLES')
    console.log('📊 All tables in database:')
    tables.forEach((table) => {
      console.log('  -', Object.values(table)[0])
    })

    await connection.end()
    console.log('\n✅ Database initialization completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Database initialization failed!')
    console.error('Error:', error.message)
    console.error('\nFull error:', error)
    process.exit(1)
  }
}

initDatabase()
