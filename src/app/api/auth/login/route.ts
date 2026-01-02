import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import { pool } from "@/lib/db";
import { connectDB } from "@/lib/db";



const SECRET = 'your_jwt_secret_here';

export async function POST(request: Request) {
  const { identifier, password } = await request.json();
  console.log("identifier:", identifier, "password:", password);
  const db = await connectDB()

  try {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ? OR mobile = ?',
      [identifier, identifier]
    );

    const user = (rows as any[])[0];

    //  const result = await pool.query(
    //   'SELECT * FROM users WHERE email = $1 OR mobile = $2',
    //   [identifier, identifier]
    // );

    // const user = result.rows[0];


    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email/mobile or password' },
        { status: 401 }
      );
    }

     if (user.status === "inactive") {
      return NextResponse.json(
        { error: 'Your account is inactive' },
        { status: 403 }
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
    return NextResponse.json({
      token,
      role: user.role,
      name: user.name,
      image: user.image,
    });

  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  } 

}
