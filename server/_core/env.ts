export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  // Supabase configuration with fallback values for Vercel deployment
  supabaseUrl: process.env.SUPABASE_URL ?? "https://rpkfptvgdjxnnfeltuer.supabase.co",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwa2ZwdHZnZGp4bm5mZWx0dWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxODY5MDgsImV4cCI6MjA3ODc2MjkwOH0.tQsNzxPEqcNmqZYOZMqHbHqB3LqJQYqJlqJQYqJQYqJ",
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwa2ZwdHZnZGp4bm5mZWx0dWVyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzE4NjkwOCwiZXhwIjoyMDc4NzYyOTA4fQ.ZYgCBaUhDYDM_dYEqAR6Zkjs6kDt3LIGncvsANOJtKM",
};
