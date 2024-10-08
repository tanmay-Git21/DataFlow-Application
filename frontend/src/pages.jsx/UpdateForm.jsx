import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UpdateForm = () => {
  // State for form visibility and form fields
  const [updateForm, setUpdateForm] = useState(false);
  const [studentFirstName, setStudentFirstName] = useState("");
  const [studentLastName, setStudentLastName] = useState("");
  const [studentAge, setStudentAge] = useState("");
  const [studentPhoneNumber, setStudentPhoneNumber] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentId,setStudentId]= useState("")

  const handleGetStudent = async () => {
    try {
      const response = await fetch("http://localhost:3000/getstudent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ studentEmail }), // passing the student's email
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
        setStudentId(result.student._id)
        setUpdateForm(true); // Show the update form
      } else {
        console.error("Failed to get student:", response.statusText);
      }
    } catch (error) {
      console.error("Error occurred while fetching student data:", error);
    }
  };
  

  // Function to handle form submission
  const handleUpdateFormSubmit = async (e) => {
    e.preventDefault();

    // Collect form data
    const updateFormData = {
      studentId,
      studentFirstName,
      studentLastName,
      studentAge,
      studentPhoneNumber,
      studentEmail,
    };
    console.log(updateFormData)
    try {
      // API call to backend to update student data
      const response = await fetch("http://localhost:3000/updatestudent", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // This will include cookies in the request
        body: JSON.stringify(updateFormData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Student updated: ", result);
        // Handle success (e.g., show a success message)
        console.log("Student updated successfully");
      } else {
        console.error("Issue while updating student:", response.statusText);
        // Handle error
      }
    } catch (error) {
      console.error("Error occurred:", error);
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
      <Button onClick={handleGetStudent}>Get Student</Button>
      {updateForm && (
        <Card className="w-full max-w-md bg-zinc-900 text-white p-6 mx-auto">
          <CardHeader>
            <CardTitle className="text-left text-2xl">
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentFirstName">First Name</Label>
                <Input
                  id="studentFirstName"
                  value={studentFirstName}
                  onChange={(e) => setStudentFirstName(e.target.value)}
                  placeholder="Enter student's first name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentLastName">Last Name</Label>
                <Input
                  id="studentLastName"
                  value={studentLastName}
                  onChange={(e) => setStudentLastName(e.target.value)}
                  placeholder="Enter student's last name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentAge">Age</Label>
                <Input
                  id="studentAge"
                  type="number"
                  value={studentAge}
                  onChange={(e) => setStudentAge(e.target.value)}
                  placeholder="Enter student's age"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentPhoneNumber">Phone Number</Label>
                <Input
                  id="studentPhoneNumber"
                  value={studentPhoneNumber}
                  onChange={(e) => setStudentPhoneNumber(e.target.value)}
                  placeholder="Enter student's phone number"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UpdateForm;
