import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    const { name, email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    const db = await connectDB();
    await db.execute(
      "INSERT INTO data (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );
    return NextResponse.json({ success: true, message: "User saved" });
}



export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const role = searchParams.get("role") || "";

  const offset = (page - 1) * limit;

    const db = await connectDB();

    let query = "SELECT * FROM data";
    const params: any[] = [];

    if (role) {
      query += " WHERE role = ?";
      params.push(role);
    }

    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await db.execute(query, params);

    let countQuery = "SELECT COUNT(*) as total FROM data";
    const countParams: any[] = [];

    if (role) {
      countQuery += " WHERE role = ?";
      countParams.push(role);
    }

    const [countResult]: any = await db.execute(countQuery, countParams);
    const total = countResult[0].total;

    return NextResponse.json({ data: rows, total, page, limit });

  
}


