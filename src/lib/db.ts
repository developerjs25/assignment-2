import mysql from "mysql2/promise";

let connection: mysql.Connection | null = null;

export async function connectDB() {
  if (connection) return connection;

  connection = await mysql.createConnection({
  // host: "localhost",
  // user: "root",
  // password: "",
  // database: "assignment2",

    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "assignment-2",
    port: 8889,
    
  });

  console.log("Connected to MySQL!");
  return connection;
}


