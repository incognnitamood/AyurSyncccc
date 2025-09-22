# Supabase Setup Guide for AyurSync

## Quick Setup Instructions

### 1. Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Wait for the project to be fully initialized
4. Note down your Project URL and anon key from Settings > API

### 2. Configure Environment Variables
Replace the placeholder values in both `.env` files:

**Frontend (.env.local):**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Backend (.env):**
```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Initialize Database
Run the schema file in Supabase SQL Editor:
1. Go to your Supabase Dashboard > SQL Editor
2. Copy the contents of `database/supabase-schema.sql`
3. Paste and execute the SQL

### 4. Seed Recipe Data
The system will automatically populate recipes from the JSON file when first accessed.

### 5. Test Connection
Start both servers and verify the "Backend Status" indicator shows green.

## Database Schema Overview

### Core Tables:
- **practitioners**: Doctor/practitioner accounts
- **patients**: Patient profiles with comprehensive Ayurvedic assessment
- **recipes**: 50+ recipes with full Ayurvedic properties
- **diet_plans**: AI-generated personalized meal plans
- **health_records**: Visit history and progress tracking

### Security:
- Row Level Security (RLS) enabled
- Practitioners can only access their own patients
- Secure authentication with JWT tokens

## Features Included:

✅ **Patient Management**: Unlimited input fields, comprehensive dosha assessment
✅ **AI Diet Plans**: Personalized 7-day plans based on Ayurvedic principles  
✅ **Recipe Database**: 50+ recipes with full nutritional and Ayurvedic data
✅ **PDF Reports**: Export diet charts and patient summaries
✅ **JWT Authentication**: Secure practitioner login system
✅ **Real-time Sync**: Instant data persistence with popup notifications
✅ **Mobile Responsive**: Works perfectly on all devices

## Supabase Features Used:
- PostgreSQL Database with JSONB support
- Row Level Security (RLS)
- Real-time subscriptions
- Authentication system
- Edge Functions (for future AI enhancements)

---

**Need Help?** Check the console for any connection errors and ensure your Supabase credentials are correctly configured.