# 📝 Notes Taking App

A full-stack note-taking application built with React TypeScript frontend, Node.js TypeScript backend, and PostgreSQL database. Features include user authentication with email/OTP verification, Google OAuth, and full CRUD operations for notes.

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React TS)    │◄──►│   (Node.js TS)  │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌────▼────┐              ┌───▼───┐               ┌───▼───┐
    │ Auth UI │              │ Auth  │               │ Users │
    │ Notes   │              │ API   │               │ Notes │
    │ Manager │              │ Notes │               │ OTPs  │
    └─────────┘              │ CRUD  │               └───────┘
                             └───────┘
```

## ✨ Features

### Authentication
- ✅ Email and password signup with OTP verification
- ✅ Google OAuth 2.0 authentication
- ✅ JWT token-based authorization
- ✅ Email verification system
- ✅ Secure password hashing with bcrypt

### Notes Management
- ✅ Create, read, update, and delete notes
- ✅ Real-time note editing
- ✅ Responsive note cards layout
- ✅ Search and filter capabilities
- ✅ User-specific notes (authorization)

### UI/UX
- ✅ Mobile-responsive design with Tailwind CSS
- ✅ Modern, clean interface
- ✅ Loading states and error handling
- ✅ Form validation with real-time feedback
- ✅ Protected routes and navigation

### Security
- ✅ Rate limiting
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Helmet security middleware
- ✅ SQL injection prevention

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd note-taking-app
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb notes_app

   # Or using psql
   psql -U postgres
   CREATE DATABASE notes_app;
   ```

4. **Environment Configuration**
   ```bash
   # Backend environment
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials and other configs

   # Frontend environment
   cd ../frontend
   cp .env.example .env
   # Edit .env with your API URL and Google Client ID
   ```

5. **Start the applications**
   ```bash
   # Start backend (from backend directory)
   npm run dev

   # Start frontend (from frontend directory)
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔧 Configuration

### Backend Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=notes_app
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id

# Email (optional, for OTP)
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
EMAIL_FROM=noreply@notesapp.com

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```

## 📋 API Endpoints

### Authentication Routes
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/send-otp` - Send OTP for email verification
- `POST /api/auth/verify-otp` - Verify OTP and complete registration
- `POST /api/auth/google` - Google OAuth authentication

### Notes Routes (Protected)
- `GET /api/notes` - Get all user notes
- `POST /api/notes` - Create a new note
- `GET /api/notes/:id` - Get a specific note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

### User Routes (Protected)
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests (when implemented)
cd backend
npm test
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Configure environment variables in your hosting dashboard

### Backend (Heroku/Railway/DigitalOcean)
1. Set up a PostgreSQL database
2. Configure environment variables
3. Deploy using your preferred service
4. Run database migrations

### Database Schema

The application automatically creates the following tables:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  google_id VARCHAR(255) UNIQUE,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notes table
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OTPs table
CREATE TABLE otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API requests
- **Lucide React** for icons

### Backend
- **Node.js** with TypeScript
- **Express.js** web framework
- **PostgreSQL** with pg driver
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Google Auth Library** for OAuth
- **Nodemailer** for email sending
- **Helmet** for security
- **Morgan** for logging
- **Express Rate Limit** for rate limiting

## 🔒 Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT token expiration (7 days)
- Rate limiting (100 requests per 15 minutes per IP)
- Input validation and sanitization
- CORS configuration
- SQL injection prevention with parameterized queries
- XSS protection with Helmet
- Email verification for account activation

## 📱 Mobile Responsiveness

The application is fully responsive and works seamlessly on:
- Desktop (1024px and above)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- Google OAuth requires HTTPS in production
- Email sending in development uses Ethereal Email (test service)
- Database migrations are handled automatically on startup

## 🚧 Future Enhancements

- [ ] Rich text editor for notes
- [ ] File attachments support
- [ ] Note categories and tags
- [ ] Search functionality
- [ ] Export notes (PDF, Markdown)
- [ ] Collaborative notes
- [ ] Dark mode theme
- [ ] Real-time synchronization
- [ ] Mobile app (React Native)

## 📞 Support

For support, email support@notesapp.com or create an issue in this repository.

---

Made with ❤️ by [Your Name]
