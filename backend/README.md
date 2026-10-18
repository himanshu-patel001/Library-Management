# ⚙️ Backend API - Library Management System

Node.js + Express.js + Mongoose REST API server for Library Management System.

## 🚀 Running the Backend

```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Run in development mode (with auto-reload on file changes)
npm run dev

# Or run in standard mode
npm start
```

Backend will run on: `http://localhost:5000`

---

## 🍃 MongoDB Connection
Edit `backend/.env` file and set your `MONGO_URI`:
```env
# Local MongoDB:
MONGO_URI=mongodb://localhost:27017/library_management

# Ya MongoDB Atlas:
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/library_db?retryWrites=true&w=majority
```

---

## 📡 API Endpoints Reference

### 1. Users (`/users`)
- `POST /users/register` - New student registration
- `POST /users/login` - Student login & JWT token generation
- `GET /users/profile` - Current logged-in student profile (Protected)
- `POST /users/contact` - Submit contact us message
- `POST /users/forgot-password` - Request password reset OTP
- `POST /users/verify-otp` - Verify received OTP
- `POST /users/reset-password` - Update password after OTP verification

### 2. Books (`/books`)
- `GET /books` - Get all books
- `GET /books/new` - Get latest book arrivals and overview stats
- `GET /books/:id` - Get details of a single book
- `POST /books/add` - Add new book (Admin & Librarian only, supports image upload)
- `PUT /books/update/:id` - Update book details (Admin & Librarian only)
- `DELETE /books/delete/:id` - Delete book and Cloudinary image (Admin & Librarian only)
- `POST /books/borrow/request-issue/:bookid` - Request to issue a book (User only)
- `GET /books/issued` - Get all books issued to the logged-in student
- `PUT /books/returnrequest/:id` - Student submits a return request

### 3. Librarian (`/librarian`)
- `GET /librarian/bookissued` - View all active issued books across all users
- `GET /librarian/issuerequest` - View pending book issue requests
- `PUT /librarian/approverequest/:id` - Approve a book issue request
- `GET /librarian/returnrequest` - View pending return requests with calculated fines
- `PUT /librarian/approvereturnrequest/:id` - Approve a return request and restock book

### 4. Admin (`/admin`)
- `POST /admin/login` - Admin login & JWT token generation
- `POST /admin/addlibrarian` - Admin creates and assigns a librarian account
- `GET /home` - System analytics & top categories
