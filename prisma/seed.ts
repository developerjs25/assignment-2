// // import mysql from "mysql2/promise";
// import bcrypt from "bcrypt";
// // import { connectDB } from "@/lib/db";
// import { pool } from "@/lib/db";


// async function seed() {
// //  const db = await connectDB()
//   const users = [
//    ['Alice', 'alice@test.com', 'alice', '1234567890', 'active', 'user'],
//     ['Bob', 'bob@test.com', 'bob', '0987654321', 'active', 'user'],
//     ['John', 'john@test.com', 'john', '1111111111', 'active', 'user'],
//     ['sam', 'sam@test.com', 'sam', '2222222222', 'active', 'user'],
//     ['gary', 'gary@test.com', 'gary', '3333333333', 'active', 'user'],
//     ['gorv', 'gorv@test.com', 'gorv', '4444444444', 'active', 'user'],
//     ['ali', 'ali@test.com', 'ali', '5555555555', 'active', 'user'],
//     ['sahil', 'sahil@test.com', 'sahil', '6666666666', 'active', 'user'],
//     ['ram', 'ram@test.com', 'ram', '7777777777', 'active', 'user'],
//     ['soni', 'soni@test.com', 'soni', '8888888888', 'active', 'user'],
//     ['sohi', 'sohi@test.com', 'sohi', '9999999999', 'active', 'user'],
//   ];

//   for (const u of users) {
//     const hashedPassword = await bcrypt.hash(u[2], 10);

//     // await db.execute(
//   //   await pool.query(

//   //     "INSERT INTO users (name, email, password, mobile, status, role) VALUES (?, ?, ?, ?, ?, ?)",
//   //     [u[0], u[1], hashedPassword, u[3], u[4], u[5]]
//   //   );
//   // }
//     await pool.query(
//       `INSERT INTO users (name, email, password, mobile, status, role) 
//        VALUES ($1, $2, $3, $4, $5, $6)`,
//       [u[0], u[1], hashedPassword, u[3], u[4], u[5]]
//     );
//   }
//   console.log(" Database seeded successfully!");
//   await pool.end();
// }

// seed().catch(console.error);
import bcrypt from "bcrypt";
import { pool } from "@/lib/db";

async function seed() {
  const users = [
    ['Alice', 'alice@test.com', 'alice', '1234567890', 'active', 'user'],
    ['Bob', 'bob@test.com', 'bob', '0987654321', 'active', 'user'],
    ['John', 'john@test.com', 'john', '1111111111', 'active', 'user'],
    ['Sam', 'sam@test.com', 'sam', '2222222222', 'active', 'user'],
    ['Gary', 'gary@test.com', 'gary', '3333333333', 'active', 'user'],
    ['Gorv', 'gorv@test.com', 'gorv', '4444444444', 'active', 'user'],
    ['Ali', 'ali@test.com', 'ali', '5555555555', 'active', 'user'],
    ['Sahil', 'sahil@test.com', 'sahil', '6666666666', 'active', 'user'],
    ['Ram', 'ram@test.com', 'ram', '7777777777', 'active', 'user'],
    ['Soni', 'soni@test.com', 'soni', '8888888888', 'active', 'user'],
    ['Sohi', 'sohi@test.com', 'sohi', '9999999999', 'active', 'user'],
  ];

  for (const u of users) {
    const hashedPassword = await bcrypt.hash(u[2], 10);

    await pool.query(
      `INSERT INTO users (name, email, password, mobile, status, role) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [u[0], u[1], hashedPassword, u[3], u[4], u[5]]
    );
  }

  console.log("✅ Database seeded successfully!");
  await pool.end();
}

seed().catch(console.error);
