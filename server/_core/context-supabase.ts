import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema-pg";
import { supabase, getUserFromToken, syncUserToDatabase } from "./supabase";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // Get token from Authorization header
    const authHeader = opts.req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      // Verify token with Supabase
      const authUser = await getUserFromToken(token);
      
      if (authUser) {
        // Sync user to our database and get full user record
        user = await syncUserToDatabase(authUser);
      }
    }
  } catch (error) {
    console.error('[Auth] Error authenticating request:', error);
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
