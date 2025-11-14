import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [rows] = await connection.execute("SHOW TABLES");
console.log("Existing tables:");
rows.forEach(row => console.log(Object.values(row)[0]));

await connection.end();
