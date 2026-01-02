import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
// import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    const db = await connectDB();
    const [existing]: any = await db.execute(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { message: "Email address is already registered" },
        { status: 400 }
      );
    }

    //  const existing= await pool.query(
    //       "SELECT id FROM users WHERE email = $1",
    //       [email]
    //     );

    // if (existing.rows.length > 0) {
    //   return NextResponse.json(
    //      { message: "Email address is already registered" },
    //      { status: 400 }
    //   );
    //  }


    const hashedPassword = await bcrypt.hash(password, 10);

    const [result]: any = await db.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );
    const userId = result.insertId;


    // const result = await pool.query(
    //   `INSERT INTO users (name, email, password)
    //    VALUES ($1, $2, $3)
    //    RETURNING id, name, email`,
    //   [name, email, hashedPassword]
    // );

    // const userId = result.rows[0];

    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1d" }
    );

    return NextResponse.json({
      token,
      id: userId,
      name,
      image: null,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}




export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);

    const role = (searchParams.get("role") || "").trim();
    const status = (searchParams.get("status") || "").trim();
    const search = (searchParams.get("search") || "").trim();

    const offset = (page - 1) * limit;
    const db = await connectDB();

    let query = `
      SELECT id, name, email, mobile, dob, image, role, status
      FROM users
    `;
    const params: any[] = [];

    if (role || status || search) {
      query += " WHERE 1=1";

      if (role) {
        query += " AND role = ?";
        params.push(role);
      }

      if (status) {
        query += " AND status = ?";
        params.push(status);
      }

      if (search) {
        query += " AND (email LIKE ? OR mobile LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
      }
    }

    query += ` ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await db.execute(query, params);


    let countQuery = "SELECT COUNT(*) as total FROM users";
    const countParams: any[] = [];

    if (role || status || search) {
      countQuery += " WHERE 1=1";

      if (role) {
        countQuery += " AND role = ?";
        countParams.push(role);
      }

      if (status) {
        countQuery += " AND status = ?";
        countParams.push(status);
      }

      if (search) {
        countQuery += " AND (email LIKE ? OR mobile LIKE ?)";
        countParams.push(`%${search}%`, `%${search}%`);
      }
    }

    const [countResult]: any = await db.execute(countQuery, countParams);



    return NextResponse.json({
      data: rows,
      total: countResult[0].total,
      page,
      limit,
    });
  } catch (err) {
    console.error("GET /api/users error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}



// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);

//     const page = Number(searchParams.get("page") || 1);
//     const limit = Number(searchParams.get("limit") || 10);
//     const role = (searchParams.get("role") || "").trim();
//     const status = (searchParams.get("status") || "").trim();
//     const search = (searchParams.get("search") || "").trim();

//     const offset = (page - 1) * limit;

//     let whereClause = "WHERE 1=1";
//     const params: any[] = [];
//     let paramIndex = 1;

//     if (role) {
//       whereClause += ` AND role = $${paramIndex++}`;
//       params.push(role);
//     }

//     if (status) {
//       whereClause += ` AND status = $${paramIndex++}`;
//       params.push(status);
//     }

//     if (search) {
//       whereClause += ` AND (email ILIKE $${paramIndex} OR mobile ILIKE $${paramIndex + 1})`;
//       params.push(`%${search}%`, `%${search}%`);
//       paramIndex += 2;
//     }

//     const usersQuery = `
//       SELECT id, name, email, mobile, dob, image, role, status
//       FROM users
//       ${whereClause}
//       ORDER BY id DESC
//       LIMIT $${paramIndex++} OFFSET $${paramIndex}
//     `;

//     const usersResult = await pool.query(usersQuery, [
//       ...params,
//       limit,
//       offset,
//     ]);

//     const countQuery = `
//       SELECT COUNT(*)::int AS total
//       FROM users
//       ${whereClause}
//     `;

//     const countResult = await pool.query(countQuery, params);

//     return NextResponse.json({
//       data: usersResult.rows,
//       total: countResult.rows[0].total,
//       page,
//       limit,
//     });

//   } catch (error: any) {
//     console.error("GET /api/users error:", error.message);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }


