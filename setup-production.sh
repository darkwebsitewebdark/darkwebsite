#!/bin/bash

# ===================================================================
# dLNk Dark Shop - Automated Production Setup Script
# ===================================================================
# This script will automatically:
# 1. Create Supabase project
# 2. Setup database
# 3. Generate secure keys
# 4. Configure Vercel environment variables
# 5. Deploy to production
# 6. Run end-to-end tests
# ===================================================================

set -e  # Exit on error

echo "🚀 dLNk Dark Shop - Automated Production Setup"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ===================================================================
# Step 1: Check Prerequisites
# ===================================================================
echo "📋 Step 1: Checking prerequisites..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${YELLOW}Installing Supabase CLI...${NC}"
    brew install supabase/tap/supabase || npm install -g supabase
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

echo -e "${GREEN}✓ Prerequisites checked${NC}"
echo ""

# ===================================================================
# Step 2: Generate Secure Keys
# ===================================================================
echo "🔐 Step 2: Generating secure keys..."

JWT_SECRET=$(openssl rand -base64 32)
COOKIE_SECRET=$(openssl rand -base64 32)
APP_ID="darkwebsite-$(date +%s)"

echo -e "${GREEN}✓ Secure keys generated${NC}"
echo ""

# ===================================================================
# Step 3: Setup Supabase Project
# ===================================================================
echo "☁️  Step 3: Setting up Supabase project..."

# Login to Supabase (will open browser)
echo "Please login to Supabase in the browser..."
supabase login

# Initialize Supabase project
supabase init

# Link to new Supabase project
echo "Creating new Supabase project..."
supabase projects create darkwebsite --org-id default --db-password "$(openssl rand -base64 16)" --region southeast-asia

# Get Supabase credentials
SUPABASE_PROJECT_REF=$(supabase projects list --output json | jq -r '.[0].id')
SUPABASE_URL="https://${SUPABASE_PROJECT_REF}.supabase.co"
SUPABASE_ANON_KEY=$(supabase projects api-keys --project-ref $SUPABASE_PROJECT_REF --output json | jq -r '.anon')
SUPABASE_SERVICE_KEY=$(supabase projects api-keys --project-ref $SUPABASE_PROJECT_REF --output json | jq -r '.service_role')

echo -e "${GREEN}✓ Supabase project created${NC}"
echo "  URL: $SUPABASE_URL"
echo ""

# ===================================================================
# Step 4: Setup Database
# ===================================================================
echo "🗄️  Step 4: Setting up database..."

# Run database migrations
supabase db push

# Seed initial data (if needed)
# supabase db seed

echo -e "${GREEN}✓ Database setup complete${NC}"
echo ""

# ===================================================================
# Step 5: Configure Vercel Environment Variables
# ===================================================================
echo "⚙️  Step 5: Configuring Vercel..."

# Login to Vercel
echo "Please login to Vercel..."
vercel login

# Link to Vercel project
vercel link --yes

# Set environment variables
echo "Setting environment variables..."

vercel env add DATABASE_URL production << EOF
$SUPABASE_URL/rest/v1
EOF

vercel env add SUPABASE_URL production << EOF
$SUPABASE_URL
EOF

vercel env add SUPABASE_SERVICE_KEY production << EOF
$SUPABASE_SERVICE_KEY
EOF

vercel env add SUPABASE_ANON_KEY production << EOF
$SUPABASE_ANON_KEY
EOF

vercel env add JWT_SECRET production << EOF
$JWT_SECRET
EOF

vercel env add COOKIE_SECRET production << EOF
$COOKIE_SECRET
EOF

vercel env add VITE_APP_ID production << EOF
$APP_ID
EOF

vercel env add NODE_ENV production << EOF
production
EOF

vercel env add VITE_API_URL production << EOF
https://darkwebsite.vercel.app/api
EOF

echo -e "${GREEN}✓ Vercel configured${NC}"
echo ""

# ===================================================================
# Step 6: Deploy to Production
# ===================================================================
echo "🚀 Step 6: Deploying to production..."

vercel --prod

echo -e "${GREEN}✓ Deployment complete${NC}"
echo ""

# ===================================================================
# Step 7: Run End-to-End Tests
# ===================================================================
echo "🧪 Step 7: Running end-to-end tests..."

# Wait for deployment to be ready
sleep 10

# Test API endpoint
echo "Testing API..."
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://darkwebsite.vercel.app/api/health)

if [ "$API_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ API is working${NC}"
else
    echo -e "${RED}✗ API test failed (HTTP $API_RESPONSE)${NC}"
fi

# Test frontend
echo "Testing frontend..."
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://darkwebsite.vercel.app)

if [ "$FRONTEND_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ Frontend is working${NC}"
else
    echo -e "${RED}✗ Frontend test failed (HTTP $FRONTEND_RESPONSE)${NC}"
fi

echo ""

# ===================================================================
# Step 8: Save Credentials
# ===================================================================
echo "💾 Step 8: Saving credentials..."

cat > .env.production << EOF
# Generated on $(date)
# DO NOT COMMIT THIS FILE TO GIT!

# Database
DATABASE_URL=$SUPABASE_URL/rest/v1

# Supabase
SUPABASE_URL=$SUPABASE_URL
SUPABASE_SERVICE_KEY=$SUPABASE_SERVICE_KEY
SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

# Security
JWT_SECRET=$JWT_SECRET
COOKIE_SECRET=$COOKIE_SECRET

# App Config
VITE_APP_ID=$APP_ID
NODE_ENV=production
PORT=3000

# API
VITE_API_URL=https://darkwebsite.vercel.app/api
EOF

echo -e "${GREEN}✓ Credentials saved to .env.production${NC}"
echo ""

# ===================================================================
# Success!
# ===================================================================
echo "================================================"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "================================================"
echo ""
echo "Your dLNk Dark Shop is now live at:"
echo -e "${GREEN}https://darkwebsite.vercel.app${NC}"
echo ""
echo "Next steps:"
echo "1. Test authentication: https://darkwebsite.vercel.app/register"
echo "2. Create your first seller account"
echo "3. Add some products"
echo "4. Start marketing!"
echo ""
echo "Credentials saved in: .env.production"
echo -e "${YELLOW}⚠️  Keep this file secure and do not commit to Git!${NC}"
echo ""
echo "================================================"
