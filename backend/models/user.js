import mongoose from "mongoose";

// Define the Student schema as a separate collection
const studentSchema = new mongoose.Schema({
  studentFirstName: {
    type: String,
    required: true,
  },
  studentLastName: {
    type: String,
    required: true,
  },
  studentAge: {
    type: Number,
    required: true,
  },
  studentPhoneNumber: {
    type: String,
    required: true,
  },
  studentEmail: {
    type: String,
    required: true,
    unique: true, // Apply unique constraint directly in the student collection
  },
});

// Define the User schema, referencing students by their IDs
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student", // Reference the Student collection
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Export the User and Student models
export const User = mongoose.model("User", userSchema);
export const Student = mongoose.model("Student", studentSchema);
