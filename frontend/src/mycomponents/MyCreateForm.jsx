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
  const [errorMessage, setErrorMessage] = useState("");

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

    // Simulated uniqueness check for studentEmail (you can replace with actual backend logic)
    const existingEmails = ["existing@example.com", "test@example.com"];
    if (existingEmails.includes(studentEmail)) {
      setErrorMessage("Email is already registered.");
      return;
    }

    setErrorMessage("");

    // Collect form data (you can then send this to your backend)
    const formData = {
      studentFirstName,
      studentLastName,
      studentAge,
      studentPhoneNumber,
      studentEmail,
    };

    console.log("Form Submitted", formData);
  };

  return (
    <Card className="w-full max-w-md bg-zinc-900 text-white p-6 mx-auto">
      <CardHeader>
        <CardTitle className="text-left text-2xl">Student Information</CardTitle>
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
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentInformationForm;
