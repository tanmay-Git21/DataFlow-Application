import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UpdateForm = () => {
  // State for form visibility and form fields
  const [delForm, setDelForm] = useState(false);
  const [studentFirstName, setStudentFirstName] = useState("");
  const [studentLastName, setStudentLastName] = useState("");
  const [studentAge, setStudentAge] = useState("");
  const [studentPhoneNumber, setStudentPhoneNumber] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentId, setStudentId] = useState("");

  // Fetch student for deletion
  const handleGetStudentForDeletion = async () => {
    try {
      const response = await fetch("http://localhost:3000/getstudentdeldata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ studentEmail }), // Passing the student's email
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Student data found: ", result.student);
        // Populate form fields with the student's data
        setStudentFirstName(result.student.studentFirstName);
        setStudentLastName(result.student.studentLastName);
        setStudentAge(result.student.studentAge);
        setStudentPhoneNumber(result.student.studentPhoneNumber);
        setStudentEmail(result.student.studentEmail);
        setStudentId(result.student._id); // Store the student ID for later deletion
        setDelForm(true); // Show the delete form
      } else {
        console.error("Failed to get student:", response.statusText);
      }
    } catch (error) {
      console.error("Error occurred while fetching student data:", error);
    }
  };

  // Delete the student
  const handleDeleteStudent = async () => {
    try {
      const response = await fetch("http://localhost:3000/deletestudent", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ studentId }), // Passing the student's ID
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Student deleted successfully: ", result.student);
        // Reset form fields after deletion
        setDelForm(false);
        setStudentFirstName("");
        setStudentLastName("");
        setStudentAge("");
        setStudentPhoneNumber("");
        setStudentEmail("");
        setStudentId("");
      } else {
        console.error("Failed to delete student:", response.statusText);
      }
    } catch (error) {
      console.error("Error occurred while deleting student:", error);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-slate-900">
      <input
        className="min-w-96 p-2 rounded-md outline-none"
        placeholder="Enter student email"
        type="email"
        required
        onChange={(e) => setStudentEmail(e.target.value)}
      />
      <Button onClick={handleGetStudentForDeletion}>Get Student</Button>

      {delForm && (
        <Card className="w-full max-w-md bg-zinc-900 text-white p-6 mx-auto mt-6">
          <CardHeader>
            <CardTitle className="text-left text-2xl">Student Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentFirstName">First Name</Label>
                <Input
                  id="studentFirstName"
                  value={studentFirstName}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentLastName">Last Name</Label>
                <Input
                  id="studentLastName"
                  value={studentLastName}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentAge">Age</Label>
                <Input
                  id="studentAge"
                  type="number"
                  value={studentAge}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentPhoneNumber">Phone Number</Label>
                <Input
                  id="studentPhoneNumber"
                  value={studentPhoneNumber}
                  readOnly
                />
              </div>
              <Button type="button" className="w-full" onClick={handleDeleteStudent}>
                Delete Student
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UpdateForm;
