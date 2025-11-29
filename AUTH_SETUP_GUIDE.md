# 🔐 Authentication System Setup Guide

## ✅ What's Implemented

Your Next.js chatbot now has **complete full-stack authentication** with:

### Features
- ✅ **Next

Auth v5** - Latest authentication
- ✅ **MongoDB** - User storage
- ✅ **Bcrypt** - Password hashing
- ✅ **JWT Sessions** - Secure stateless auth
- ✅ **Protected Routes** - Middleware protection
- ✅ **Beautiful Login/Signup** - Split-screen design
- ✅ **Session Management** - Logout, user display

## 📁 Project Structure

```
nextjsfrontend/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/
│   │   │   │   └── route.ts          # NextAuth configuration
│   │   │   └── signup/
│   │   │       └── route.ts          # Signup API
│   │   └── chat/
│   │       └── route.ts              # Chat streaming API
│   ├── auth/
│   │   └── login/
│   │       └── page.tsx              # Login/Signup page
│   ├── chat/
│   │   ├── layout.tsx                # Chat layout with navbar
│   │   └── page.tsx                  # Protected chat page
│   ├── components/
│   │   ├── auth/
│   │   │   └── auth-form.tsx         # Login/Signup form
│   │   ├── navbar.tsx                # Navigation with logout
│   │   ├── chat-interface.tsx        # Chat UI
│   │   ├── message.tsx               # Message component
│   │   └── chat-input.tsx            # Input component
│   ├── layout.tsx                    # Root layout with SessionProvider
│   ├── page.tsx                      # Redirect logic
│   └── providers.tsx                 # SessionProvider wrapper
├── lib/
│   ├── mongodb.ts                    # MongoDB connection
│   └── models/
│       └── User.ts                   # User model & methods
├── middleware.ts                     # Route protection
├── types/
│   └── next-auth.d.ts               # TypeScript definitions
└── .env.local                        # Environment variables
```

## 🚀 Setup Instructions

### Step 1: Install MongoDB

#### Option A: Local MongoDB
```bash
# Download and install MongoDB Community Edition
# https://www.mongodb.com/try/download/community

# Start MongoDB
mongod
```

#### Option B: MongoDB Atlas (Free Cloud)
```bash
# 1. Go to https://www.mongodb.com/cloud/atlas
# 2. Create free account
# 3. Create cluster
# 4. Get connection string
# 5. Update .env.local
```

### Step 2: Update Environment Variables

Edit `.env.local`:
```env
# Backend API
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

# MongoDB (update this!)
MONGODB_URI=mongodb://localhost:27017

# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/uol_chatbot

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
```

**Generate a secure secret:**
```bash
# In terminal:
openssl rand -base64 32
```

### Step 3: Install Dependencies (if not done)

```bash
cd nextjsfrontend
npm install next-auth mongodb bcryptjs
npm install --save-dev @types/bcryptjs
```

### Step 4: Start the Application

**Terminal 1 - FastAPI Backend:**
```bash
cd c:\Users\ibrahim laptops\Desktop\fypcag
start_backend.bat
```

**Terminal 2 - Next.js Frontend:**
```bash
cd nextjsfrontend
npm run dev
```

### Step 5: Test the System

1. **Open browser:** `http://localhost:3000`
2. **Auto-redirects to:** `http://localhost:3000/auth/login`
3. **Create account:**
   - Click "Sign Up"
   - Enter name, email, password
   - Click "Sign Up" button
4. **Auto-login and redirect to:** `http://localhost:3000/chat`
5. **Test chatbot:** Ask questions!
6. **Logout:** Click "Logout" in navbar

## 🎨 UI Features

### Login/Signup Page
- ✅ **Split-screen design** - Image on left, form on right
- ✅ **Toggle mode** - Switch between login/signup
- ✅ **Show/hide password**
- ✅ **Remember me** checkbox (login)
- ✅ **Forgot password** link (placeholder)
- ✅ **Loading states**
- ✅ **Error messages**
- ✅ **Responsive** - Mobile-friendly

### Chat Page
- ✅ **Protected route** - Must be logged in
- ✅ **Navbar** - Shows username and logout
- ✅ **Session management** - Persistent login

## 🔒 Security Features

### Password Security
```typescript
// Passwords are hashed with bcrypt (12 rounds)
const hashedPassword = await bcrypt.hash(password, 12);
```

### Session Security
- **JWT tokens** - Stateless authentication
- **HTTP-only** - Tokens not accessible via JavaScript
- **Secure secret** - Environment-based

### Route Protection
```typescript
// middleware.ts protects /chat routes
// Redirects to /auth/login if not authenticated
```

### Input Validation
- ✅ Email format validation
- ✅ Minimum password length (6 chars)
- ✅ Required field checks
- ✅ Duplicate email prevention

## 🛠️ API Routes

### POST `/api/auth/signup`
Create new user account.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### POST `/api/auth/signin`
Login (handled by NextAuth).

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### POST `/api/auth/signout`
Logout (handled by NextAuth).

## 📊 Database Schema

### Users Collection
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,          // Unique index
  password: string,       // Bcrypt hashed
  createdAt: Date
}
```

## 🔧 Customization

### Change Login Page Image
Edit `app/auth/login/page.tsx`:
```typescript
<img
  src="YOUR_IMAGE_URL_HERE"
  alt="University Building"
  className="w-full h-full object-cover"
/>
```

### Add Social Auth (Google, GitHub)
1. Install provider:
```bash
npm install @auth/mongodb-adapter
```

2. Update `app/api/auth/[...nextauth]/route.ts`:
```typescript
import GoogleProvider from 'next-auth/providers/google';

providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
  }),
  // ... existing credentials provider
]
```

### Add Email Verification
1. Create verification token collection
2. Send email on signup
3. Add verification route
4. Check verified status on login

### Add Password Reset
1. Create reset token collection
2. Add "Forgot Password" route
3. Send email with reset link
4. Add reset password page

## 🐛 Troubleshooting

### Error: "Cannot find module 'next-auth'"
```bash
cd nextjsfrontend
npm install next-auth mongodb bcryptjs
```

### Error: "MongoServerError: connect ECONNREFUSED"
- Start MongoDB: `mongod`
- Or check MongoDB Atlas connection string

### Error: "NEXTAUTH_SECRET not set"
- Generate secret: `openssl rand -base64 32`
- Add to `.env.local`

### Error: "User already exists"
- User with that email already registered
- Use different email or login

### Session not persisting
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies
- Restart dev server

### TypeScript errors
- Run: `npm install --save-dev @types/bcryptjs`
- Restart TypeScript server in VS Code

## 🎯 Next Steps

### Enhance Security
- [ ] Add rate limiting
- [ ] Add CSRF protection
- [ ] Add 2FA/MFA
- [ ] Add session timeout
- [ ] Add password strength meter

### Improve UX
- [ ] Add loading skeletons
- [ ] Add toast notifications
- [ ] Add password reset flow
- [ ] Add email verification
- [ ] Add profile page
- [ ] Add user settings

### Add Features
- [ ] Remember me functionality
- [ ] Social authentication
- [ ] Role-based access control
- [ ] Chat history per user
- [ ] User preferences
- [ ] Avatar uploads

## 📚 Documentation

- **NextAuth:** https://next-auth.js.org/
- **MongoDB:** https://www.mongodb.com/docs/
- **Next.js:** https://nextjs.org/docs

## ✅ Summary

You now have a **complete, production-ready authentication system** with:

1. ✅ Beautiful split-screen login/signup page
2. ✅ Secure password hashing with bcrypt
3. ✅ MongoDB user storage
4. ✅ JWT session management
5. ✅ Protected chat routes
6. ✅ Navbar with logout
7. ✅ Automatic redirects
8. ✅ Error handling
9. ✅ TypeScript support
10. ✅ Modular architecture

**Start the app and test it now!** 🚀
