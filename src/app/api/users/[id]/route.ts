import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
// import { pool } from "@/lib/db";
import fs from "fs";
import path from "path";
import { toast } from "react-toastify";



export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  const db = await connectDB();
  const [rows]: any = await db.execute(
    "SELECT name, email ,mobile ,dob,image FROM users WHERE id = ?",
    [id]
  );
  return NextResponse.json(rows[0]);

  // const result = await pool.query(
  //   "SELECT name, email, mobile, dob, image FROM users WHERE id = $1",
  //   [id]
  // );
  // return NextResponse.json(result.rows[0]);


}





export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const db = await connectDB();
    const contentType = req.headers.get("content-type") || "";
    let body: any = {};

    if (contentType.includes("application/json")) {
      body = await req.json();
    } else {
      const formData = await req.formData();
      body = Object.fromEntries(formData.entries());
    }

    const { name, mobile, dob, status, role } = body;
    const file = body.image;

    let imagePath: string | null = null;

    if (file && typeof file !== "string" && file.arrayBuffer) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = Date.now() + "_" + file.name;
      const uploadDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      const filepath = path.join(uploadDir, filename);
      fs.writeFileSync(filepath, buffer);
      imagePath = "/uploads/" + filename;
    }

    if (mobile) {
      const [existing]: any = await db.execute(
        "SELECT id FROM users WHERE mobile = ? AND id != ? LIMIT 1",
        [mobile, id]
      );
      if (existing.length > 0) {
        return NextResponse.json(
          { success: false, message: "Mobile number is already registered" },
          { status: 400 }
        );
      }
      // if (mobile) {
      //   const existing = await pool.query(
      //     "SELECT id FROM users WHERE mobile = $1 AND id != $2 LIMIT 1",
      //     [mobile, id]
      //   );
      //   if (existing.rows.length > 0) {
      //     return NextResponse.json(
      //       { success: false, message: "Mobile number is already registered" },
      //       { status: 400 }
      //     );
      //   }

    }

    const updates: string[] = [];
    const values: any[] = [];


    // let paramIndex = 1;
    // if (name !== undefined) { updates.push(`name=$${paramIndex++}`); values.push(name); }
    // if (mobile !== undefined) { updates.push(`mobile=$${paramIndex++}`); values.push(mobile); }
    // if (dob !== undefined) { updates.push(`dob=$${paramIndex++}`); values.push(dob); }
    // if (status !== undefined) { updates.push(`status=$${paramIndex++}`); values.push(status); }
    // if (role !== undefined) { updates.push(`role=$${paramIndex++}`); values.push(role); }
    // if (imagePath) { updates.push(`image=$${paramIndex++}`); values.push(imagePath); }


    if (name !== undefined) { updates.push("name=?"); values.push(name); }
    if (mobile !== undefined) { updates.push("mobile=?"); values.push(mobile); }
    if (dob !== undefined) { const dobValue = dob === "" ? null : dob; updates.push("dob=?"); values.push(dobValue); }
    if (status !== undefined) { updates.push("status=?"); values.push(status); }
    if (role !== undefined) { updates.push("role=?"); values.push(role); }
    if (imagePath) { updates.push("image=?"); values.push(imagePath); }

    if (updates.length === 0) {
      return NextResponse.json({ message: "Nothing to update" });
    }


    values.push(id);
    // const query = `UPDATE users SET ${updates.join(", ")} WHERE id=$${paramIndex}`;
    // await pool.query(query, values);
    await db.execute(`UPDATE users SET ${updates.join(", ")} WHERE id=?`, values);


    // await pool.query(query, values);

    return NextResponse.json({ success: true, message: "User updated successfully", image: imagePath || null });

  } catch (error) {
    console.error("API PATCH error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  const db = await connectDB();
  const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);
  // const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);


  if ((result as any).affectedRows === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "User deleted successfully" });
}


