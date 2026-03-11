# Environment Variables Setup

## Required Environment Variables

Your `.env.local` file needs the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Service Role Key (REQUIRED for KYC submission)
# This key bypasses Row Level Security for server-side operations
# KEEP THIS SECRET - Never expose to client-side code
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## How to Get Service Role Key

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Under **Project API keys**, find the **service_role** key
5. Click the eye icon to reveal it
6. Copy and paste it into your `.env.local` file

## Twilio Configuration

Twilio is configured in Supabase Auth settings, NOT in environment variables:

1. Go to your Supabase Dashboard
2. Go to **Authentication** → **Providers**
3. Enable **Phone** provider
4. Enter your Twilio credentials there

## Security Warning

⚠️ **IMPORTANT**: The service role key has full database access and bypasses all Row Level Security policies. 

- NEVER commit this key to version control
- NEVER expose it to client-side code
- NEVER share it publicly
- Only use it in server-side code (Server Actions, API Routes)

## Why We Need Service Role Key

During the KYC signup flow:
1. User verifies phone with OTP → Account created
2. User is immediately signed out (no active session)
3. User completes all KYC forms without a session
4. When submitting the final form, we need to insert into the database
5. Since there's no active session, RLS blocks the insert
6. Service role key bypasses RLS to allow the insert

This is a secure approach because:
- The operation happens server-side only
- We validate the userId from the form data
- The user will log in after KYC completion
