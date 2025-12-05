import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

async function seedAdmin() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
     database: "assignment2",
  });

  try {
    const email = 'peter@example.com';
    const password = 'peter';
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = 'Admin';
    const name = 'Super Admin';

    const [existing] = await connection.execute('SELECT * FROM data WHERE email = ?', [email]);
    if ((existing as any[]).length > 0) {
      console.log('Admin user already exists.');
      return;
    }

    await connection.execute(
      'INSERT INTO data (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    console.log('Admin user created successfully.');
  } catch (err) {
    console.error('Error seeding admin:', err);
  } finally {
    await connection.end();
  }
}

seedAdmin();
