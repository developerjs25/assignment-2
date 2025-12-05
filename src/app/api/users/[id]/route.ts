import { NextResponse } from "next/server";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "assignment2",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  const [rows]: any = await pool.execute(
    "SELECT name, email ,mobile ,dob FROM data WHERE id = ?",
    [id]
  );
  return NextResponse.json(rows[0]);
}




// export async function PATCH(req: Request, { params }: { params: { id: string } }) {
//   try {
//     const { id } = await params;
//     const formData = await req.formData();

//     const name = formData.get("name");
//     const email = formData.get("email");
//     const mobile = formData.get("mobile");
//     const dob = formData.get("dob");
//     const status = formData.get("status");
//     const role = formData.get("role");

//     const file = formData.get("image");

//     let imagePath = null;

//     if (file && typeof file !== "string") {
//       const uploadDir = path.join(process.cwd(), "public/uploads");

//       if (!fs.existsSync(uploadDir)) {
//         fs.mkdirSync(uploadDir, { recursive: true });
//       }

//       const buffer = Buffer.from(await file.arrayBuffer());
//       const filename = Date.now() + "_" + file.name;
//       const filepath = path.join(uploadDir, filename);

//       fs.writeFileSync(filepath, buffer);

//       imagePath = "/uploads/" + filename;
//     }

//     const updates = [];
//     const values = [];

//     if (name) { updates.push("name = ?"); values.push(name); }
//     if (email) { updates.push("email = ?"); values.push(email); }
//     if (mobile) { updates.push("mobile = ?"); values.push(mobile); }
//     if (dob) { updates.push("dob = ?"); values.push(dob); }
//     if (status) { updates.push("status = ?"); values.push(status); }
//     if (role) { updates.push("role = ?"); values.push(role); }
//     if (imagePath) { updates.push("image = ?"); values.push(imagePath); }



//     values.push(id);

//     await pool.execute(
//       `UPDATE data SET ${updates.join(", ")} WHERE id = ?`,
//       values
//     );

//     return NextResponse.json({ message: "User updated successfully" });
//   } catch (error) {
//     console.error("API PATCH error:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }


 

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
    const { id } = await params;
    const body = await req.json();
    const { name, email, mobile, dob, status , role , image } = body;

    if (
      name === undefined &&
      email === undefined &&
      mobile === undefined &&
      dob === undefined &&
      role === undefined &&
      status === undefined&&
      image === undefined
    ) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

//  let imagePath = null;
//  if (image && typeof image !== "string") {
//     const uploadDir = path.join(process.cwd(), "public/uploads");

//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }

//       if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     const buffer = Buffer.from(await image.arrayBuffer());
//     const filename = Date.now() + "_" + image.name;
//     const filepath = path.join(uploadDir, filename);

//     fs.writeFileSync(filepath, buffer);

//     imagePath = "/uploads/" + filename;
//   }

    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name);
    }
    if (email !== undefined) {
      updates.push("email = ?");
      values.push(email);
    }
    if (mobile !== undefined) {
      updates.push("mobile = ?");
      values.push(mobile);
    }
    if (dob !== undefined) {
      updates.push("dob = ?");
      values.push(dob);
    }
     if (role !== undefined) {
      updates.push("role = ?");
      values.push(role);
    }
     if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
    }
    //  if (imagePath !== undefined) {
    //    updates.push("image = ?");
    //     values.push(imagePath); 
    //   }

    values.push(id);
    const [result] = await pool.execute(
      `UPDATE data SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

     return NextResponse.json({ message: "User updated successfully",  });
  } catch (error) {
    console.error("API PATCH error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}





export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  const [result] = await pool.execute("DELETE FROM data WHERE id = ?", [id]);
  if ((result as any).affectedRows === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "User deleted successfully" });
}
