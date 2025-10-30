const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with sample data...\n')

    const connection = await mysql.createConnection({
      host: 'sql12.freesqldatabase.com',
      port: 3306,
      user: 'sql12805290',
      password: 'E7XJ1D5fyY',
      database: 'sql12805290',
    })

    console.log('✅ Connected to database\n')

    // Check if data already exists
    const [existingStudents] = await connection.execute(
      'SELECT COUNT(*) as count FROM students'
    )
    if (existingStudents[0].count > 0) {
      console.log('⚠️  Database already has data. Skipping seed...')
      await connection.end()
      process.exit(0)
    }

    // Sample student data
    const students = [
      {
        student_id: '2024001',
        name: 'Budi Santoso',
        email: 'budi@example.com',
        major: 'Ilmu Komputer',
      },
      {
        student_id: '2024002',
        name: 'Siti Aminah',
        email: 'siti@example.com',
        major: 'Teknologi Informasi',
      },
    ]

    console.log('Adding sample students...')
    for (const student of students) {
      await connection.execute(
        'INSERT INTO students (student_id, name, email, major) VALUES (?, ?, ?, ?)',
        [student.student_id, student.name, student.email, student.major]
      )
      console.log(`✅ Added student: ${student.name} (${student.student_id})`)
    }

    // Sample users with hashed passwords
    console.log('\nAdding sample users...')
    const hashedPassword1 = await bcrypt.hash('Student123', 10)
    const hashedPassword2 = await bcrypt.hash('Admin123', 10)

    await connection.execute(
      'INSERT INTO users (username, password, role, student_id) VALUES (?, ?, ?, ?)',
      ['budi', hashedPassword1, 'student', '2024001']
    )
    console.log('✅ Added user: budi (password: Student123)')

    await connection.execute(
      'INSERT INTO users (username, password, role, student_id) VALUES (?, ?, ?, ?)',
      ['admin', hashedPassword2, 'admin', null]
    )
    console.log('✅ Added user: admin (password: Admin123)')

    // Sample grades for Budi
    console.log('\nAdding sample grades...')
    const grades = [
      {
        student_id: '2024001',
        course_code: 'IF101',
        course_title: 'Pengantar Pemrograman',
        grade: 'A',
      },
      {
        student_id: '2024001',
        course_code: 'IF102',
        course_title: 'Struktur Data',
        grade: 'A-',
      },
      {
        student_id: '2024001',
        course_code: 'IF103',
        course_title: 'Algoritma dan Pemrograman',
        grade: 'B+',
      },
      {
        student_id: '2024001',
        course_code: 'MAT101',
        course_title: 'Kalkulus I',
        grade: 'B',
      },
    ]

    for (const grade of grades) {
      await connection.execute(
        'INSERT INTO grades (student_id, course_code, course_title, grade) VALUES (?, ?, ?, ?)',
        [grade.student_id, grade.course_code, grade.course_title, grade.grade]
      )
      console.log(`✅ Added grade: ${grade.course_code} - ${grade.grade}`)
    }

    await connection.end()

    console.log('\n✨ Database seeded successfully!\n')
    console.log('📝 Test credentials:')
    console.log('   Student: username=budi, password=Student123')
    console.log('   Admin:   username=admin, password=Admin123\n')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Database seeding failed!')
    console.error('Error:', error.message)
    process.exit(1)
  }
}

seedDatabase()
