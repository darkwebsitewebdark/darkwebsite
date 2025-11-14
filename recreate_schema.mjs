import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Drop all tables except users and __drizzle_migrations
const tables = ['cartItems', 'categories'];
for (const table of tables) {
  try {
    await connection.execute(`DROP TABLE IF EXISTS \`${table}\``);
    console.log(`Dropped: ${table}`);
  } catch (e) {
    console.log(`Error dropping ${table}:`, e.message);
  }
}

await connection.end();
console.log('Done!');
