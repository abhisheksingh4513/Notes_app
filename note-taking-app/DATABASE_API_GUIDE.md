# Database and API Configuration Guide

## 🗄️ Database Setup (PostgreSQL)

### Why PostgreSQL?
- **Reliable**: ACID compliance for data integrity
- **Scalable**: Handles large amounts of data efficiently
- **Secure**: Built-in security features
- **JSON Support**: Can store complex note content
- **Free**: Open-source database

### Database Schema
Your app automatically creates these tables:

```sql
-- Users table - stores user account information
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),                    -- Hashed password (nullable for Google users)
  name VARCHAR(255) NOT NULL,
  google_id VARCHAR(255) UNIQUE,           -- For Google OAuth users
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notes table - stores all user notes
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,                   -- Note content (can be very long)
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OTPs table - stores temporary verification codes
CREATE TABLE otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,               -- 6-digit verification code
  expires_at TIMESTAMP NOT NULL,         -- OTP expires in 10 minutes
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Database Options

### Option 1: Local PostgreSQL (Development)
```bash
# Install PostgreSQL locally
# Windows: Download from https://www.postgresql.org/download/windows/
# Mac: brew install postgresql
# Ubuntu: sudo apt-get install postgresql

# Create database
createdb notes_app

# Or using psql
psql -U postgres
CREATE DATABASE notes_app;
```

### Option 2: Cloud PostgreSQL (Recommended for Production)

#### 🟢 **Neon (Free Tier Available)**
- **Website**: https://neon.tech/
- **Free Tier**: 3 GB storage, 1 database
- **Setup**: 
  1. Sign up at neon.tech
  2. Create a new project
  3. Get connection string
  4. Update your `.env` file

#### 🟢 **Supabase (Free Tier Available)**
- **Website**: https://supabase.com/
- **Free Tier**: 500 MB storage, 2 projects
- **Setup**:
  1. Sign up at supabase.com
  2. Create new project
  3. Go to Settings → Database
  4. Copy connection details

#### 🟡 **Railway (Paid)**
- **Website**: https://railway.app/
- **Cost**: ~$5/month
- **Easy deployment** for both database and backend

#### 🟡 **Heroku Postgres (Paid)**
- **Website**: https://www.heroku.com/postgres
- **Cost**: $5/month for basic plan
- **Reliable and well-supported**

## 🔑 Required API Keys

### 1. **Google OAuth Client ID** (Optional but Recommended)

#### Why needed?
- Enables "Sign in with Google" functionality
- Improves user experience
- Reduces password management burden

#### How to get:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Google+ API" or "Google Identity API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set application type to "Web application"
6. Add authorized origins:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`
7. Copy the Client ID

#### Environment Variables:
```env
# Backend .env
GOOGLE_CLIENT_ID=1234567890-abcdef.apps.googleusercontent.com

# Frontend .env
REACT_APP_GOOGLE_CLIENT_ID=1234567890-abcdef.apps.googleusercontent.com
```

### 2. **Email Service API** (Optional for OTP)

#### Why needed?
- Send OTP verification emails
- Password reset emails (if implemented)
- Welcome emails

#### Options:

##### 🟢 **Gmail SMTP** (Free for low volume)
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password  # Not your regular password!
```

**Setup App Password:**
1. Enable 2FA on Gmail
2. Go to Google Account settings
3. Generate App Password for "Mail"
4. Use this password in EMAIL_PASS

##### 🟢 **SendGrid** (Free tier: 100 emails/day)
- **Website**: https://sendgrid.com/
- **API Key**: Get from SendGrid dashboard
```env
SENDGRID_API_KEY=SG.your-api-key-here
```

##### 🟢 **Resend** (Free tier: 3,000 emails/month)
- **Website**: https://resend.com/
- **Simple setup and great for developers**

## 🔐 Security Keys

### JWT Secret (Required)
```env
JWT_SECRET=your-super-long-random-secret-key-minimum-32-characters
```

**Generate a secure JWT secret:**
```bash
# Option 1: Use Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: Use online generator
# Visit: https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
```

## 📝 Complete Environment Setup

### Backend `.env` file:
```env
# Database Configuration
DB_HOST=localhost                    # Or your cloud database host
DB_PORT=5432
DB_NAME=notes_app
DB_USER=postgres                     # Or your database username
DB_PASSWORD=your_password           # Your database password

# JWT Configuration (REQUIRED)
JWT_SECRET=your-super-secret-jwt-key-change-in-production-please-make-it-very-long-and-random

# Google OAuth Configuration (OPTIONAL)
GOOGLE_CLIENT_ID=your-google-client-id

# Email Configuration (OPTIONAL)
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
EMAIL_FROM=noreply@notesapp.com

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```

## 🚀 Quick Setup Steps

### Minimum Required (Basic functionality):
1. **PostgreSQL Database** - Store users and notes
2. **JWT Secret** - Secure authentication

### Recommended (Full functionality):
1. **PostgreSQL Database** 
2. **JWT Secret**
3. **Google OAuth Client ID** - Better user experience
4. **Email Service** - OTP verification

### For Production:
1. **Cloud PostgreSQL** (Neon/Supabase/Railway)
2. **Strong JWT Secret** (64+ characters)
3. **Google OAuth with production domain**
4. **Professional Email Service** (SendGrid/Resend)

## 💡 Development vs Production

### Development (Minimum):
- Local PostgreSQL or free cloud database
- Simple JWT secret
- Console logging for OTP (no email needed)

### Production:
- Reliable cloud database with backups
- Strong JWT secret (stored securely)
- Real email service for OTP
- Google OAuth with verified domain
- HTTPS enabled
- Environment variables secured

The app will work with just PostgreSQL and JWT secret - other services enhance the user experience but aren't strictly required!
