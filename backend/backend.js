import express from "express";
import { connectDb } from "./db/dbconfig.js";
import { User, Student } from "./models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cookieParser()); // Middleware to parse cookies
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend origin
    credentials: true, // Allow cookies to be sent
  })
);

const SECRET_KEY = process.env.SECRET_KEY; // Use environment variable

// Middleware to authenticate and attach the user to req
const authTokenMiddleWare = async (req, res, next) => {
  console.log("inauth")
  console.log("in auth")
  console.log("in auth")
  const token = req.cookies.token; // Retrieve token from cookies
  console.log("Token: ", token);


  
  if (!token ) {
    return res.status(401).json({
      success: false,
      message: "Token not found. Please log in.",
    });
  }
  
  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, SECRET_KEY); // Verify token synchronously
    
    // Find the user from the token's payload
    const loggedInUser = await User.findById(decodedToken.id);
    
    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please log in again.",
      });
    }

    // Attach the user to the request object for further use
    req.loggedInUser = loggedInUser;
    
    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Handle invalid token or any other error
    console.error("Authentication error: ", err);
    return res.status(403).json({
      success: false,
      message: "Invalid token or authentication error.",
    });
  }
};




// Default route
app.get("/", (req, res) => {
  res.send("Show register and login form");
});

// Register route
app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    console.log(firstName, lastName, email, password);

    // Check if the user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists, please use another email",
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      students: [], // Initialize students array
    });

    // Save the user in the database
    await newUser.save();

    // Send success response
    res
      .status(200)
      .json({ success: true, message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: err.message,
    });
  }
});

// Login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Generate JWT token
    const payload = { id: existingUser._id, email: existingUser.email };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "3h" });

    // Set token in cookies (httpOnly and secure)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production with HTTPS
      sameSite: "lax", // Consider 'None' for cross-site requests, especially in production
      maxAge: 3600000, // 1 hour
    });

    // Send success response
    res.status(200).json({ success: true, message: "Login successful" });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Something went wrong",
        error: err.message,
      });
  }
});

// Route to create a student
app.post("/createStudent", authTokenMiddleWare, async (req, res) => {
  try {
    const {
      studentFirstName,
      studentLastName,
      studentAge,
      studentPhoneNumber,
      studentEmail,
    } = req.body;

    console.log(studentEmail);
    // Check if the student email is unique
    const existingStudent = await Student.findOne({ studentEmail });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student with this email already exists.",
      });
    }

    // Create a new student
    const newStudent = new Student({
      studentFirstName,
      studentLastName,
      studentAge,
      studentPhoneNumber,
      studentEmail,
    });

    // Save the student in the Student collection
    await newStudent.save();

    // Find the user and add the student reference (ID)
    const foundUser = await User.findOne({ _id: req.loggedInUser.id });
    if (!foundUser) {
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    }

    foundUser.students.push(newStudent._id); // Add the student ID to the user
    await foundUser.save();

    return res.status(200).json({
      success: true,
      message: "Student created and added to user successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while saving the student.",
      error: err.message,
    });
  }
});

// Route to read all students
app.get("/readstudents", authTokenMiddleWare, async (req, res) => {
  try {
    // Get the logged-in user from the middleware
    const loggedInUser = req.loggedInUser;

    // Find the user by ID and populate the 'students' array with student documents
    const foundUser = await User.findById(loggedInUser._id).populate(
      "students"
    );

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Send back the populated students array
    return res.status(200).json({
      success: true,
      students: foundUser.students, // Populated student documents
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: err.message,
    });
  }
});

app.post("/getstudent", authTokenMiddleWare, async (req, res) => {
  try {
    const studentEmail = req.body.studentEmail; // Get the student email from the request body
    const loggedInUser = req.loggedInUser; // Get the logged-in user from middleware

    console.log(studentEmail);
    // Find the student by email
    const studentToBeFound = await Student.findOne({
      studentEmail: studentEmail,
    });

    if (!studentToBeFound) {
      return res
        .status(400)
        .json({ success: false, message: "Student not found" });
    }

    // Check if the logged-in user has access to this student
    const isAuthorized = loggedInUser.students.some(
      (studentId) => studentId.toString() === studentToBeFound._id.toString()
    );

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied: You are not authorized to view this student's data.",
      });
    }

    // Send the found student details
    return res.status(200).json({ success: true, student: studentToBeFound });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while retrieving the student.",
      error: err.message,
    });
  }
});

app.put("/updatestudent", authTokenMiddleWare, async (req, res) => {
  try {
    console.log("in updateStudent API")
    const { studentId, studentFirstName, studentLastName, studentAge, studentPhoneNumber, studentEmail } = req.body;
    

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required for updating.",
      });
    }

    // Authorization check (comparing userId with studentId)
    const isAuthorized = req.loggedInUser.students.some(
      (id) => id.toString() === studentId.toString()
    );

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this student.",
      });
    }

    // Update student details
    const updatedData = { studentFirstName, studentLastName, studentAge, studentPhoneNumber, studentEmail };
    console.log(updatedData)
    const updatedStudent = await Student.findByIdAndUpdate(studentId, updatedData, { new: true });

    if (!updatedStudent) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    return res.status(200).json({ success: true, student: updatedStudent });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating the student.",
      error: err.message,
    });
  }
});


app.post("/getstudentdeldata", authTokenMiddleWare, async (req, res) => {
  try {
    const studentEmail = req.body.studentEmail; // Get the student email from the request body
    const loggedInUser = req.loggedInUser; // Get the logged-in user from middleware

    // console.log(studentEmail);
    // Find the student by email
    const studentToBeFound = await Student.findOne({
      studentEmail: studentEmail,
    });

    if (!studentToBeFound) {
      return res
        .status(400)
        .json({ success: false, message: "Student not found" });
    }
    // console.log("hello world")
    // console.log(loggedInUser)
    // Check if the logged-in user has access to this student
    const isAuthorized = loggedInUser.students.some(
      (studentId) => studentId.toString() === studentToBeFound._id.toString()
    );
    // can use this method too
    // const foundStudent = loggedInUser.students.find(
    //   (studentId) => studentId.toString() === studentToBeFound._id.toString()
    // );

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied: You are not authorized to access or modify this student's data.",
      });
    }

    // Send the found student details
    return res.status(200).json({ success: true, student: studentToBeFound });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while retrieving the student.",
      error: err.message,
    });
  }
});
app.delete("/deletestudent", authTokenMiddleWare, async (req, res) => {
  try {
    const { studentId } = req.body;
    console.log(studentId);

    // Validate that the studentId is provided
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required for deleting.",
      });
    }

    // Optionally, validate if studentId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Student ID format.",
      });
    }

    // Find the student by ID and delete it
    const deletedStudent = await Student.findByIdAndDelete(studentId);

    // If student is not found, return an error
    if (!deletedStudent) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });
    }

    // Send back the deleted student acknowledgment
    return res.status(200).json({ success: true, student: deletedStudent });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the student.",
      error: err.message,
    });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
  connectDb();
});
