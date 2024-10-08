import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

const ReadData = () => {
  const [students, setStudents] = useState([]); // Changed initial state to an empty array
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  const handleGetStudents = () => {
    setIsLoading(true); // Start loading when fetching data
  };

  useEffect(() => {
    const getStudentsFromBackend = async () => {
      try {
        const response = await fetch("http://localhost:3000/readstudents", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Student data: ", result.students[0]);
          setStudents(result); // Update state with fetched student data
        } else {
          console.error("Had some issue while getting student:", response.statusText);
        }
      } catch (error) {
        console.error("Error occurred", error);
      } finally {
        setIsLoading(false); // Stop loading after fetching
      }
    };

    if (isLoading) {
      getStudentsFromBackend(); // Fetch data only if loading is true
    }
  }, [isLoading]); // Depend on loading state

  return (
    <div className="w-full h-[100vh] bg-slate-900 grid grid-row-5 grid-cols-4">
      <Button onClick={handleGetStudents}>
        Get Students
      </Button>

      
      {students.length > 0 && (
        <div className="col-span-4">
          <h2 className="text-white">Student List:</h2>
          <ul className="text-white">
            {students.map((student, index) => (
              <li key={index}>{student.name} - {student.email}</li> // Adjust this based on the data structure
            ))}
          </ul>
        </div>
      )}
      
      {isLoading && <p className="text-white">Loading...</p>} {/* Loading indicator */}
    </div>
  );
};

export default ReadData;
