# EduSolGrow - Educational Platform

A centralized educational platform for sharing and managing handwritten notes with student and admin roles.

## Tech Stack

### Frontend
- React.js with TypeScript
- Bootstrap for styling
- React Router for navigation
- Axios for API calls

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- bcryptjs for password hashing

## Features

### Authentication
- Student and Admin login/register
- JWT-based authentication
- Role-based access control

### Student Features
- Upload handwritten notes (PDF or images)
- View and download approved notes
- Search notes by subject/category
- Track uploaded notes status

### Admin Features
- Dashboard with statistics
- Review and approve/reject notes
- View all uploaded notes
- Filter by status, subject, or search

### Notes System
- Notes include title, subject, description, and file
- Status tracking: Pending / Approved / Rejected
- File upload with validation (images and PDFs only)
- Search and filter functionality

## Project Structure

```
EduSolGrow/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Note.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── notes.js
│   ├── uploads/
│   ├── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── UploadNotes.tsx
│   │   │   ├── NotesList.tsx
│   │   │   └── AdminDashboard.tsx
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/edusolgrow
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   For development with auto-restart:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Notes
- `POST /api/notes/upload` - Upload a new note (authenticated)
- `GET /api/notes/approved` - Get all approved notes (public)
- `GET /api/notes/all` - Get all notes (admin only)
- `GET /api/notes/my-notes` - Get user's uploaded notes (authenticated)
- `PATCH /api/notes/:id/review` - Approve/reject note (admin only)

## Workflow

1. **Student uploads note** → Stored as "Pending"
2. **Admin reviews** → Approves/Rejects
3. **Only approved notes** are publicly visible to students

## File Upload Specifications

- **Allowed formats**: JPEG, PNG, GIF, PDF
- **Maximum file size**: 10MB
- **Storage**: Local filesystem in `backend/uploads/` directory

## Default Admin Account

You can create an admin account by registering with the role "admin" selected, or manually create one in the database.

## Security Notes

- Change the JWT_SECRET in production
- Implement rate limiting for API endpoints
- Add input validation and sanitization
- Consider using cloud storage for file uploads in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
