import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Drop all tables to start fresh
const tables = [
  'cartItems', 'disputes', 'messages', 'notifications', 
  'orderItems', 'orders', 'products', 'reviews', 
  'sellerApplications', 'transactions', 'wishlist', 
  'withdrawalRequests', 'categories'
];

for (const table of tables) {
  try {
    await connection.execute(`DROP TABLE IF EXISTS ${table}`);
    console.log(`Dropped table: ${table}`);
  } catch (e) {
    console.log(`Could not drop ${table}:`, e.message);
  }
}

await connection.end();
console.log('Done!');
