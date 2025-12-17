import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";



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
        { success: false, message: "Email address is already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return NextResponse.json(
      { success: true, message: "User created successfully!" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}









// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const page = Number(searchParams.get("page") || 1);
//     const limit = Number(searchParams.get("limit") || 10);
//     const role = searchParams.get("role") || "";
//     const status = searchParams.get("status") || "";
//     const search = searchParams.get("search") || "";

//     const offset = (page - 1) * limit;
//     const db = await connectDB();

//     let query = "SELECT id, name, email, mobile, dob, image, role, status FROM users";
//     const params: any[] = [];

//     if (role || search || status) {
//       query += " WHERE 1=1";
//       if (role) {
//         query += " AND role = ?";
//         params.push(role);
//       }
//       if (status) {
//         query += " AND status = ?"
//         params.push(status);
//       }
//       if (search) {
//         query += " AND (email LIKE ? OR mobile LIKE ?)";
//         params.push(`%${search}%`, `%${search}%`);
//       }
//     }

//     query += ` ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;

//     const [rows] = await db.execute(query, params);

//     let countQuery = "SELECT COUNT(*) as total FROM users";
//     const countParams: any[] = [];

//     if (role || search || status) {
//       countQuery += " WHERE 1=1";
//       if (role) countQuery += " AND role = ?", countParams.push(role);
//       if (status) countQuery += " AND status = ?", countParams.push(status);
//       if (search) countQuery += " AND (email LIKE ? OR mobile LIKE ?)", countParams.push(`%${search}%`, `%${search}%`);
//     }

//     const [countResult]: any = await db.execute(countQuery, countParams);
//     const total = countResult[0].total;

//     return NextResponse.json({ data: rows, total, page, limit });
//   } catch (err) {
//     console.error("GET /api/users error:", err);
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }




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

    // COUNT
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











