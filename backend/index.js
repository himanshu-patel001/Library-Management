const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const usersRoutes = require("./routes/user");
const booksRoutes = require("./routes/books");
const adminRoutes = require("./routes/admin");
const librarianRoutes = require("./routes/librarian");
const homeRoutes = require("./routes/home");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS policy'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/users", usersRoutes);
app.use("/books", booksRoutes);
app.use("/admin", adminRoutes);
app.use("/librarian", librarianRoutes);
app.use("/home", homeRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Library Management API running",
  });
});

app.use((req, res, next) => {
  res.status(404).json({
    error: true,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || "Internal Server Error"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB();
});