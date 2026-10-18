require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { UserModel } = require("./model/UserModel");
const { BookModel } = require("./model/BookModel");
const { BorrowModel } = require("./model/BorrowModel");
const { clearCache } = require("./utils/cache");

const DEFAULT_PASSWORD = "FREEFIRE";

// 17 Books configured for CGPIT Library:
// totalCopies = 223, availableCopies = 127 -> borrowed = 96, occupancy = 43%
const booksList = [
  {
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    category: "Computer Science",
    isbn: "978-0132350884",
    description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.",
    totalCopies: 15,
    availableCopies: 9,
    price: 650,
    coverImage: "/assets/cleancode.jpg",
    cloudinaryId: "book_1"
  },
  {
    title: "Introduction to Algorithms (CLRS)",
    author: "Thomas H. Cormen",
    category: "Computer Science",
    isbn: "978-0262033848",
    description: "A comprehensive update of the leading algorithms textbook with new material on matchings, online algorithms, and machine learning.",
    totalCopies: 14,
    availableCopies: 8,
    price: 950,
    coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&auto=format&fit=crop&q=60",
    cloudinaryId: "book_2"
  },
  {
    title: "JavaScript: The Definitive Guide",
    author: "David Flanagan",
    category: "Web Development",
    isbn: "978-1491952023",
    description: "The bible for JavaScript programmers - a programmer's guide and comprehensive reference to the core language.",
    totalCopies: 16,
    availableCopies: 10,
    price: 720,
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60",
    cloudinaryId: "book_3"
  },
  {
    title: "Operating System Concepts",
    author: "Abraham Silberschatz",
    category: "Computer Science",
    isbn: "978-1118063330",
    description: "The tenth edition has been revised to keep it fresh and up-to-date with contemporary examples of how operating systems function.",
    totalCopies: 12,
    availableCopies: 7,
    price: 850,
    coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop&q=60",
    cloudinaryId: "book_4"
  },
  {
    title: "The Lean Startup",
    author: "Eric Ries",
    category: "Management",
    isbn: "978-0307887894",
    description: "Most startups fail. But many of those failures are preventable. The Lean Startup is a new approach being adopted across the globe.",
    totalCopies: 14,
    availableCopies: 8,
    price: 499,
    coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&auto=format&fit=crop&q=60",
    cloudinaryId: "book_5"
  },
  {
    title: "Zero to One: Notes on Startups",
    author: "Peter Thiel",
    category: "Management",
    isbn: "978-0804139298",
    description: "The great secret of our time is that there are still uncharted frontiers to explore and new inventions to create.",
    totalCopies: 15,
    availableCopies: 9,
    price: 450,
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60",
    cloudinaryId: "book_6"
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "Science",
    isbn: "978-0553380163",
    description: "A landmark volume in science writing exploring how the universe began and the nature of black holes.",
    totalCopies: 13,
    availableCopies: 7,
    price: 399,
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=60",
    cloudinaryId: "book_7"
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Help",
    isbn: "978-0735211292",
    description: "An easy and proven way to build good habits and break bad ones. Practical strategies for daily self improvement.",
    totalCopies: 12,
    availableCopies: 6,
    price: 550,
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60",
    cloudinaryId: "book_8"
  },
  {
    title: "Design Patterns: Elements of Reusable Object-Oriented Software",
    author: "Erich Gamma",
    category: "Computer Science",
    isbn: "978-0201633610",
    description: "Captures a wealth of experience in design patterns that make object-oriented designs more flexible, elegant, and ultimately reusable.",
    totalCopies: 14,
    availableCopies: 8,
    price: 899,
    coverImage: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&auto=format&fit=crop&q=60",
    cloudinaryId: "book_9"
  },
  {
    title: "Cracking the Coding Interview",
    author: "Gayle Laakmann McDowell",
    category: "Computer Science",
    isbn: "978-0984782857",
    description: "189 programming interview questions and solutions to prepare you for technical software developer interviews.",
    totalCopies: 12,
    availableCopies: 7,
    price: 799,
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60",
    cloudinaryId: "book_10"
  },
  {
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell",
    category: "AI & Machine Learning",
    isbn: "978-0134610993",
    description: "The most comprehensive, up-to-date introduction to the theory and practice of artificial intelligence.",
    totalCopies: 13,
    availableCopies: 8,
    price: 999,
    coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&auto=format&fit=crop&q=60",
    cloudinaryId: "book_11"
  },
  {
    title: "Deep Learning",
    author: "Ian Goodfellow",
    category: "AI & Machine Learning",
    isbn: "978-0262035613",
    description: "An introduction to a broad range of topics in deep learning, covering mathematical and conceptual background.",
    totalCopies: 11,
    availableCopies: 6,
    price: 1150,
    coverImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60",
    cloudinaryId: "book_12"
  },
  {
    title: "Computer Networking: A Top-Down Approach",
    author: "James Kurose",
    category: "Computer Science",
    isbn: "978-0133594140",
    description: "Motivates readers by offering a top-down approach to computer networking, building from the application layer down.",
    totalCopies: 13,
    availableCopies: 8,
    price: 820,
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=60",
    cloudinaryId: "book_13"
  },
  {
    title: "Database System Concepts",
    author: "Abraham Silberschatz",
    category: "Database",
    isbn: "978-0078022159",
    description: "Presents the fundamental concepts of database management in an intuitive manner geared toward practical systems.",
    totalCopies: 12,
    availableCopies: 7,
    price: 780,
    coverImage: "/assets/database.jpg",
    cloudinaryId: "book_14"
  },
  {
    title: "You Don't Know JS Yet: Get Started",
    author: "Kyle Simpson",
    category: "Web Development",
    isbn: "978-1698222547",
    description: "Deep dive into the core mechanisms of JavaScript to write clear, bug-free and efficient code.",
    totalCopies: 13,
    availableCopies: 8,
    price: 520,
    coverImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&auto=format&fit=crop&q=60",
    cloudinaryId: "book_15"
  },
  {
    title: "Python Crash Course",
    author: "Eric Matthes",
    category: "Programming",
    isbn: "978-1593279288",
    description: "A fast-paced, thorough introduction to Python that will have you writing programs, solving problems, and making things work in no time.",
    totalCopies: 12,
    availableCopies: 7,
    price: 620,
    coverImage: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500&auto=format&fit=crop&q=60",
    cloudinaryId: "book_16"
  },
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt & David Thomas",
    category: "Computer Science",
    isbn: "978-0135957059",
    description: "One of the most significant books in software development, covering modern approaches to software architecture and craft.",
    totalCopies: 12,
    availableCopies: 4,
    price: 750,
    coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&auto=format&fit=crop&q=60",
    cloudinaryId: "book_17"
  }
];

// CGPIT B.Tech IT 4th/5th Sem Students (Father names removed as requested):
const cgpitStudentsList = [
  { enrollment: "202403103510008", name: "Hitesh Sharma" },
  { enrollment: "202403103510015", name: "Meet Kakadiya" },
  { enrollment: "202403103510016", name: "Samruddhi Kapile" },
  { enrollment: "202403103510018", name: "Hellyben Patel" },
  { enrollment: "202403103510038", name: "Dharmikumari Rabari" },
  { enrollment: "202403103510045", name: "Mohamed Amar Malek" },
  { enrollment: "202403103510052", name: "Vishal Singh" },
  { enrollment: "202403103510055", name: "Heni Patel" },
  { enrollment: "202403103510079", name: "Dharmi Varsani" },
  { enrollment: "202403103510145", name: "Aasmi Talaviya" },
  { enrollment: "202403103510150", name: "Khushi Patel" },
  { enrollment: "202403103510165", name: "Himanshu Patel" },
  { enrollment: "202403103510183", name: "Preetikumari Chaurasia" },
  { enrollment: "202403103510189", name: "Sneha Patel" },
  { enrollment: "202403103510194", name: "Rikhav Shinde" },
  { enrollment: "202403103510198", name: "Om Jani" },
  { enrollment: "202403103510208", name: "Krushil Dobariya" },
  { enrollment: "202403103510212", name: "Harsh Dholakiya" },
  { enrollment: "202403103510218", name: "Jiya Pancholi" },
  { enrollment: "202403103510276", name: "Harshang Kaliya" },
  { enrollment: "202403103510301", name: "Priyal Kheni" },
  { enrollment: "202403103510304", name: "Vidhi Vyas" },
  { enrollment: "202403103510335", name: "Bhavyakumar Patel" },
  { enrollment: "202403103510337", name: "Dhanashri Patil" },
  { enrollment: "202403103510338", name: "Vishwa Patel" },
  { enrollment: "202403103510339", name: "Hansa Chaudhari" },
  { enrollment: "202403103510348", name: "Alok Singh" },
  { enrollment: "202403103510349", name: "Akash Upadhyay" },
  { enrollment: "202403103510350", name: "Chirag Luhar" },
  { enrollment: "202403103510351", name: "Vishesh Parmar" },
  { enrollment: "202403103510353", name: "Iraben Lukhi" },
  { enrollment: "202403103510356", name: "Latika Patel" },
  { enrollment: "202403103510432", name: "Harsh Thorat" },
  { enrollment: "202403103510433", name: "Hitesh Banwani" },
  { enrollment: "202403103510437", name: "Vedant Desai" },
  { enrollment: "202403103510438", name: "Kriyaben Shah" },
  { enrollment: "202403103510441", name: "Het Sheladiya" },
  { enrollment: "202403103510442", name: "Karan Chauhan" },
  { enrollment: "202403103510496", name: "Dev Shah" },
  { enrollment: "202403103510497", name: "Pal Patel" },
  { enrollment: "202403103510499", name: "Yug Baldaniya" },
  { enrollment: "202403103510500", name: "Kairavi Desai" },
  { enrollment: "202403103510506", name: "Raj Patel" },
  { enrollment: "202403103510511", name: "Hema Chaudhari" },
  { enrollment: "202403103510515", name: "Trisha Radadiya" },
  { enrollment: "202403103510518", name: "Romil Lukhi" },
  { enrollment: "202403103510519", name: "Hem Sachani" },
  { enrollment: "202403103510521", name: "Mulank Koladiya" },
  { enrollment: "202403103510522", name: "Rudra Patel" },
  { enrollment: "202403103510523", name: "Panth Patel" },
  { enrollment: "202403103510576", name: "Anjali Akbari" },
  { enrollment: "202403103510588", name: "Pranav Kinge" },
  { enrollment: "202403103510597", name: "Nikhil Kumar Singh" },
  { enrollment: "202403103510604", name: "Dhruv Bhavsar" },
  { enrollment: "202403103510608", name: "Bansi Dungrani" },
  { enrollment: "202503103520018", name: "Sunny Deshmukh" },
  { enrollment: "202503103520030", name: "Snehkumar Mistry" },
  { enrollment: "202503103520032", name: "Prince Patel" },
  { enrollment: "202503103520033", name: "Karan Vaishnani" },
  { enrollment: "202503103520034", name: "Yug Akbari" },
  { enrollment: "202503103520035", name: "Neel Bhanvadiya" },
  { enrollment: "202503103520036", name: "Zeel Pandav" },
  { enrollment: "202503103520040", name: "Virang Ghoghari" },
  { enrollment: "202503103520044", name: "Om Surani" },
  { enrollment: "202503103520047", name: "Fenil Patel" },
  { enrollment: "202503103520048", name: "Ved Akbari" },
  { enrollment: "202503103520051", name: "Harshkumar Naik" },
  { enrollment: "202503103520071", name: "Yug Pipaliya" },
  { enrollment: "202503103520077", name: "Nihar Limbasiya" },
  { enrollment: "202503103520083", name: "Rudra Italiya" },
  { enrollment: "202503103520150", name: "Yashvi Bambhroliya" },
  { enrollment: "202503103520153", name: "Purvaben Pandey" }
];

async function seedData() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("❌ MONGO_URI missing in backend/.env!");
    process.exit(1);
  }

  try {
    console.log("🍃 Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB Atlas!");

    console.log("🔒 Hashing password 'FREEFIRE'...");
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    // 1. Clean previous data
    await UserModel.deleteMany({});
    await BookModel.deleteMany({});
    await BorrowModel.deleteMany({});
    console.log("🧹 Previous collections cleared.");

    // 2. Create Admin
    const admin = await UserModel.create({
      name: "CGPIT Library Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      stream: "Administration",
      year: 1
    });
    console.log("👤 Admin created: admin@example.com (Password: FREEFIRE)");

    // 3. Create Librarian
    const librarian = await UserModel.create({
      name: "CGPIT Chief Librarian",
      email: "librarian@example.com",
      password: hashedPassword,
      role: "librarian",
      stream: "Library Science",
      year: 1
    });
    console.log("👤 Librarian created: librarian@example.com (Password: FREEFIRE)");

    // 4. Create 72 Unique CGPIT Computer Engineering Students (No repeats, natural attendance order)
    console.log("👥 Generating 72 unique CGPIT Computer Engineering students with password 'FREEFIRE' in MongoDB...");
    const studentUsers = cgpitStudentsList.map((student) => ({
      name: student.name,
      email: `${student.enrollment}@cgpit.ac.in`,
      password: hashedPassword,
      role: "user",
      stream: "Computer Engineering",
      year: 4
    }));

    // Demo student alias for quick testing
    studentUsers.push({
      name: "Demo Student",
      email: "student@example.com",
      password: hashedPassword,
      role: "user",
      stream: "Computer Engineering",
      year: 4
    });

    const insertedStudents = await UserModel.insertMany(studentUsers);
    console.log(`✅ ${insertedStudents.length} CGPIT Students successfully created in MongoDB (72 unique Computer Engineering students + 1 demo alias)!`);

    // 5. Create 17 Books
    console.log("📚 Inserting 17 Books into MongoDB...");
    const booksWithAdmin = booksList.map((book) => ({
      ...book,
      addedBy: admin._id
    }));

    const insertedBooks = await BookModel.insertMany(booksWithAdmin);
    console.log(`✅ ${insertedBooks.length} Books successfully created in MongoDB!`);

    // Calculate metrics
    const totalCopiesSum = insertedBooks.reduce((acc, b) => acc + b.totalCopies, 0);
    const availableCopiesSum = insertedBooks.reduce((acc, b) => acc + b.availableCopies, 0);
    const borrowedSum = totalCopiesSum - availableCopiesSum;
    const occupancyPercent = Math.round((borrowedSum / totalCopiesSum) * 100);

    // 6. Create sample Borrow records for realism
    const sampleBorrowRecords = [];
    for (let i = 0; i < 5; i++) {
      const issueDate = new Date();
      issueDate.setDate(issueDate.getDate() - (i + 2));
      const dueDate = new Date(issueDate);
      dueDate.setDate(dueDate.getDate() + 14);

      sampleBorrowRecords.push({
        bookId: insertedBooks[i]._id,
        userId: insertedStudents[i]._id,
        issueDate: issueDate,
        dueDate: dueDate,
        returnDate: null,
        fineAmount: 0,
        status: "Issued",
        approvedBy: librarian._id
      });
    }

    // Add sample pending request
    sampleBorrowRecords.push({
      bookId: insertedBooks[5]._id,
      userId: insertedStudents[0]._id, // Hitesh Sharma
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: "Requested"
    });

    await BorrowModel.insertMany(sampleBorrowRecords);
    console.log("📋 Sample borrow and issue records inserted into MongoDB.");

    // Clear cache
    clearCache("homeData");

    console.log("Database seeded successfully.");
    console.log(`Total Books: ${insertedBooks.length}`);
    console.log(`Total Students: ${insertedStudents.length}`);
    console.log("Default password for all accounts: FREEFIRE");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
}

seedData();
