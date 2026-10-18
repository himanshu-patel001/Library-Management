# 📚 Library Management System (MERN Stack)

A complete, full-stack **Library Management System** built with **MongoDB, Express.js, React.js (Vite), and Node.js**.

This project provides a clean role-based architecture for educational institutions, libraries, and colleges with three user roles: **Student / User**, **Librarian**, and **Admin**.

---

## 🚀 Quick Start Guide (Kaise Run Karein)

### Prerequisites (Zaroori Cheezein):
- [Node.js](https://nodejs.org/) (Version 18 or above recommended)
- [MongoDB](https://www.mongodb.com/) (Local MongoDB Community Server ya MongoDB Atlas Cloud)

---

### Step 1: Backend Setup
```bash
# 1. Backend folder me jayein
cd backend

# 2. Dependencies install karein
npm install

# 3. Environment file check karein
# (backend/.env file already banayi gayi hai. Agar custom settings chahiye toh edit karein)

# 4. Backend server start karein
npm run dev
# ya
npm start
```
> Server runs on: `http://localhost:5000`  
> Health check: `http://localhost:5000/`

---

### Step 2: Frontend Setup
Naya terminal window open karein aur run karein:
```bash
# 1. Frontend folder me jayein
cd frontend

# 2. Dependencies install karein
npm install

# 3. Vite development server start karein
npm run dev
```
> Frontend application opens on: `http://localhost:5173`

---

## 🍃 MongoDB Connection Guide (Apna MongoDB Kaise Connect Karein)

Aapka backend completely ready hai. Jab bhi aapko apna MongoDB connect karna ho, niche diye gaye simple steps follow karein:

### Option A: Local MongoDB (Apne Computer Par)
1. Apne computer par MongoDB Compass ya MongoDB service start karein.
2. `backend/.env` file open karein.
3. `MONGO_URI` me local URL likhein:
   ```env
   MONGO_URI=mongodb://localhost:27017/library_management
   ```
4. Backend server automatically connect ho jayega!

### Option B: MongoDB Atlas (Free Cloud Database)
1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) par free account banayein ya login karein.
2. Ek free **M0 Cluster** create karein.
3. **Database Access** me jakar ek Database User banayein (Username & Password note karein).
4. **Network Access** me jakar IP Address me `0.0.0.0/0` (Allow Access from Anywhere) add karein.
5. **Database** > **Connect** > **Drivers** (Node.js) par click karein aur connection string copy karein.
6. `backend/.env` file open karein aur `MONGO_URI` me paste karein:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/library_db?retryWrites=true&w=majority
   ```
   *(Note: `<username>` aur `<password>` ko apne actual credentials se replace karein)*

---

## 📂 Project Architecture & Folder Arrangement

Project ka structure bilkul simple, modular aur easy-to-understand rakha gaya hai:

```
Library-Management/
│
├── backend/                       # Node.js & Express API Server
│   ├── config/
│   │   └── db.js                  # MongoDB database connection helper
│   ├── controller/                # Request handling logic (Controllers)
│   │   ├── admin.js               # Admin controllers (create librarian, admin login)
│   │   ├── books.js               # Books CRUD, borrow request, fine handling
│   │   ├── home.js                # Aggregated dashboard metrics & recent arrivals
│   │   ├── librarian.js           # Librarian approvals (issue & return)
│   │   └── user.js                # User registration, login, profile, OTP reset
│   ├── middlewares/
│   │   ├── checkRole.js           # Role-based protection ("admin", "librarian", "user")
│   │   └── userAuth.js            # JWT verification middleware
│   ├── model/                     # Mongoose Models (instantiated collections)
│   │   ├── BookModel.js
│   │   ├── BorrowModel.js
│   │   ├── ContactModel.js
│   │   ├── OtpModel.js
│   │   └── UserModel.js
│   ├── routes/                    # API Route definitions
│   │   ├── admin.js               # /admin endpoints
│   │   ├── books.js               # /books endpoints
│   │   ├── home.js                # /home endpoints
│   │   ├── librarian.js           # /librarian endpoints
│   │   └── user.js                # /users endpoints
│   ├── schemas/                   # Mongoose Schemas & Validations
│   ├── utils/
│   │   ├── cache.js               # In-memory caching for home statistics
│   │   ├── cloudConfig.js         # Cloudinary configuration & Multer upload
│   │   └── fineCalculator.js      # Late return fine calculator (₹10/day)
│   ├── .env                       # Backend environment variables
│   ├── .env.example               # Example template for environment configuration
│   ├── index.js                   # Express server entry point & CORS configuration
│   └── package.json
│
├── frontend/                      # React.js (Vite) Single Page Application
│   ├── public/                    # Static public assets & fallback book placeholders
│   │   ├── book-placeholder.svg   # Fallback book cover (no broken images)
│   │   └── default-book-cover.svg
│   ├── src/
│   │   ├── assets/                # Icons & local images
│   │   ├── components/            # Reusable UI components
│   │   │   ├── navbar.jsx         # User navigation bar
│   │   │   ├── adminnavbar.jsx    # Admin/Librarian navigation bar
│   │   │   ├── footer.jsx         # User footer
│   │   │   ├── AdminFooter.jsx    # Admin footer
│   │   │   └── Preloader.jsx      # Loading animation
│   │   ├── layout/                # Layout wrappers (UserLayout, AdminLayout)
│   │   ├── pages/                 # Application views & pages
│   │   │   ├── admin/             # Admin views (dashboard, add book, view books, add librarian)
│   │   │   ├── librarian/         # Librarian views (issue requests, return requests, borrowed list)
│   │   │   └── user/              # User views (home, catalog, book details, profile, login/register)
│   │   ├── utils/                 # Frontend helpers
│   │   │   ├── auth.js            # Auth token storage helpers (localStorage)
│   │   │   ├── config.js          # Server URL configuration (with localhost fallback)
│   │   │   └── toasthelper.js     # Toast notifications helper
│   │   ├── App.jsx                # Main route definitions & role redirection
│   │   ├── index.css              # Global styling
│   │   └── main.jsx               # React DOM entry point
│   ├── .env                       # Frontend environment configuration
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md                      # Project documentation
```

---

## 👥 Roles & Functionality

### 1. 🎓 Student / User
- **Register & Login**: JWT-based secure authentication.
- **Browse Books**: Filter books by title, author, category, and availability.
- **Issue Requests**: Request to borrow any available book (up to a maximum of 4 books).
- **Return Requests**: Request book returns directly from the student profile.
- **Fines & Due Dates**: Transparent tracking of 14-day borrowing duration and automatic late fee calculation (₹10/day).
- **Contact Us & Password Reset**: In-app contact form and email OTP password recovery.

### 2. 📖 Librarian
- **Issue Approvals**: Review pending book issue requests, verify student limit, and approve with one click.
- **Return Approvals**: Review returned books, view any calculated fines, and restock book inventory.
- **Books Borrowed View**: Complete real-time audit of all currently issued books.

### 3. 🛡️ Admin
- **Dashboard Analytics**: Total books, total users, active students, and borrowing metrics.
- **Book Management**: Add new books with cover images, edit existing book details, and remove books.
- **Librarian Management**: Create and authorize new librarian accounts.

---

## ⚙️ Environment Variables Reference

### Backend (`backend/.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `5000` |
| `CLIENT_URL` | Frontend URL allowed for CORS | `http://localhost:5173` |
| `MONGO_URI` | MongoDB Connection URL | *(Set your own database URI)* |
| `JWT_SECRET` | Secret key for JWT signing | `library_management_jwt_secret_key_2026` |
| `EMAIL_USER` | Gmail address for sending OTPs | *(Optional)* |
| `EMAIL_PASS` | Gmail App Password | *(Optional)* |
| `CLOUD_NAME` | Cloudinary account name for book images | *(Optional)* |
| `CLOUD_API_KEY` | Cloudinary API Key | *(Optional)* |
| `CLOUD_API_SECRET` | Cloudinary API Secret | *(Optional)* |

### Frontend (`frontend/.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_BACKEND_URL` | Backend API URL | `http://localhost:5000/` |

---

## 🛠️ Tech Stack Used

- **Frontend**: React 19, Vite, React Router DOM, Bootstrap 5, React Icons, Framer Motion, Axios, React Toastify.
- **Backend**: Node.js, Express.js, Mongoose 8, JWT (jsonwebtoken), BcryptJS, Multer, Cloudinary, Nodemailer.
- **Database**: MongoDB (Local or MongoDB Atlas Cloud).
#   L i b r a r y - M a n a g e m e n t  
 