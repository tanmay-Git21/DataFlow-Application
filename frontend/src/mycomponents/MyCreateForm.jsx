import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const StudentInformationForm = () => {
  const [studentFirstName, setStudentFirstName] = useState("");
  const [studentLastName, setStudentLastName] = useState("");
  const [studentAge, setStudentAge] = useState("");
  const [studentPhoneNumber, setStudentPhoneNumber] = useState("");
  const [studentEmail, setStudentEmail] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Basic field validation
    if (
      !studentFirstName ||
      !studentLastName ||
      !studentAge ||
      !studentPhoneNumber ||
      !studentEmail
    ) {
      alert("Please fill out all fields.");
      return;
    }

    // Collect form data (you can then send this to your backend)
    const formData = {
      studentFirstName,
      studentLastName,
      studentAge,
      studentPhoneNumber,
      studentEmail,
    };

    try {
      // API call to backend to save the student form data
      const response = await fetch("http://localhost:3000/createstudent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // This will include cookies in the request
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("User logged in: ", result);
        // Handle success (e.g., redirect to login or show success message)
        console.log("Student created and saved successfully");
      } else {
        console.error(
          "Had some issue while saving student:",
          response.statusText
        );
        // Handle error (e.g., show error message to user)
      }
    } catch (error) {
      console.error("Error occured", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <Card className="w-full max-w-md bg-zinc-900 text-white p-6 mx-auto">
      <CardHeader>
        <CardTitle className="text-left text-2xl">
          Student Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-4">
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
          <div className="space-y-2">
            <Label htmlFor="studentEmail">Email</Label>
            <Input
              id="studentEmail"
              type="email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              placeholder="Enter student's email"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentInformationForm;
