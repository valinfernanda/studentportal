const mysql = require('mysql2/promise')

async function resetDatabase() {
  try {
    console.log('🗑️  Resetting database...\n')

    const connection = await mysql.createConnection({
      host: 'sql12.freesqldatabase.com',
      port: 3306,
      user: 'sql12805290',
      password: 'E7XJ1D5fyY',
      database: 'sql12805290',
    })

    console.log('✅ Connected to database\n')

    // Drop tables in correct order (due to foreign key constraints)
    const tables = ['audit_logs', 'grades', 'users', 'students']

    console.log('Dropping existing tables...')
    for (const table of tables) {
      try {
        await connection.execute(`DROP TABLE IF EXISTS ${table}`)
        console.log(`✅ Dropped table: ${table}`)
      } catch (error) {
        console.log(`⚠️  Table ${table} doesn't exist or couldn't be dropped`)
      }
    }

    console.log('\n🔄 Reinitializing database structure...')

    // Recreate students table
    await connection.execute(`
      CREATE TABLE students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NULL,
        major VARCHAR(100) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Students table created')

    // Recreate users table
    await connection.execute(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('student','admin') NOT NULL DEFAULT 'student',
        student_id VARCHAR(20) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE SET NULL
      )
    `)
    console.log('✅ Users table created')

    // Recreate grades table
    await connection.execute(`
      CREATE TABLE grades (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id VARCHAR(20) NOT NULL,
        course_code VARCHAR(20),
        course_title VARCHAR(255),
        grade VARCHAR(10),
        FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
      )
    `)
    console.log('✅ Grades table created')

    // Recreate audit_logs table
    await connection.execute(`
      CREATE TABLE audit_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        action VARCHAR(100) NOT NULL,
        username VARCHAR(100) NULL,
        ip_address VARCHAR(45) NULL,
        status VARCHAR(20) NOT NULL,
        details TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Audit_logs table created')

    await connection.end()
    console.log('\n✨ Database reset completed successfully!')
    console.log('💡 Run "npm run db:seed" to add sample data')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Database reset failed!')
    console.error('Error:', error.message)
    console.error('\nFull error:', error)
    process.exit(1)
  }
}

resetDatabase()
