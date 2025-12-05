import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

const SECRET = 'your_jwt_secret_here';

export async function POST(request: Request) {
  const { identifier, password } = await request.json(); 
  // "identifier" can be email OR phone
// console.log("identifier:", identifier, "password:", password);

  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: "assignment2",
  });

  try {
    // Check user by email OR phone
    const [rows] = await connection.execute(
      'SELECT * FROM data WHERE email = ? OR mobile = ?', 
      [identifier, identifier]
    );

    const user = (rows as any[])[0];
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email/mobile or password' }, 
        { status: 401 }
      );
    }

    const match = await bcrypt.compare(password, user.password);
    
    if (!match) {
      return NextResponse.json(
        { error: 'Invalid email/mobile or password' }, 
        { status: 401 }
      );
    }

    const token = jwt.sign(
    { userId: user.id, email: user.email, mobile: user.mobile, role: user.role },

      SECRET,
      { expiresIn: '1d' }
    );

    return NextResponse.json({ token, role: user.role });

  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  } finally {
    await connection.end();
  }
  
}
