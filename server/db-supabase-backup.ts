import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { ENV } from './_core/env';
import * as schema from '../drizzle/schema-pg';

// Create PostgreSQL connection
const connectionString = ENV.supabaseUrl 
  ? `postgresql://postgres.${ENV.supabaseUrl.split('//')[1].split('.')[0]}:${ENV.supabaseServiceKey}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`
  : '';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && connectionString) {
    try {
      const client = postgres(connectionString, {
        prepare: false,
      });
      _db = drizzle(client, { schema });
    } catch (error) {
      console.error('[Database] Failed to connect:', error);
      _db = null;
    }
  }
  return _db;
}

// Re-export schema for convenience
export { schema };
export const { 
  users, 
  sellerApplications, 
  categories, 
  products, 
  reviews, 
  orders, 
  orderItems, 
  transactions, 
  cartItems, 
  messages, 
  disputes, 
  notifications, 
  wishlist, 
  withdrawalRequests 
} = schema;

// Helper types
export type User = typeof schema.users.$inferSelect;
export type InsertUser = typeof schema.users.$inferInsert;
