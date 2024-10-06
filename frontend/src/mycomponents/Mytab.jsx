import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRef } from "react";

const Mytab = () => {
  const firstNameRef = useRef("");
  const lastNameRef = useRef("");
  const emailRef = useRef("");
  const registerPasswordRef = useRef("");
  const loginEmailRef = useRef("")
  const loginPasswordRef = useRef("")

  const handleLoginFormSubmit = async (e) => {
    e.preventDefault();
   const email = loginEmailRef.current.value
   const password = loginPasswordRef.current.value

   if ( !email || !password) {
    alert("Please fill out all fields.");
    return;
  }

  const loginFormData = {email,password}

  try {
    // API call to backend to register the user
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginFormData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("User logged in: ", result);
      // Handle success (e.g., redirect to login or show success message)
    } else {
      console.error("Failed to register user:", response.statusText);
      // Handle error (e.g., show error message to user)
    }
  } catch (error) {
    console.error("Error during registration:", error);
    // Handle error (e.g., show error message to user)
  }

  };

  const handleRegisterFormSubmit = async (e) => {
    e.preventDefault();

    // Get form values from refs
    const firstName = firstNameRef.current.value;
    const lastName = lastNameRef.current.value;
    const email = emailRef.current.value;
    const password = registerPasswordRef.current.value;

    if (!firstName || !lastName || !email || !password) {
      alert("Please fill out all fields.");
      return;
    }

    // Prepare data object
    const registerFormdata = {
      firstName,
      lastName,
      email,
      password,
    };

    console.log(registerFormdata); // To see the data being collected

    try {
      // API call to backend to register the user
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerFormdata),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("User registered:", result);
        // Handle success (e.g., redirect to login or show success message)
      } else {
        console.error("Failed to register user:", response.statusText);
        // Handle error (e.g., show error message to user)
      }
    } catch (error) {
      console.error("Error during registration:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <Tabs defaultValue="login" className="w-[600px]" >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login" >Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <form onSubmit={handleLoginFormSubmit} >
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Please enter your credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="loginEmail">Email</Label>
              <Input id="loginEmail" placeholder="Enter your email" ref={loginEmailRef} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="loginPassword">Password</Label>
              <Input id="loginPassword" placeholder="Enter your password" ref={loginPasswordRef} />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </CardFooter>
        </Card>
        </form>
      </TabsContent>

      <TabsContent value="register">
        <form onSubmit={handleRegisterFormSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Register Form</CardTitle>
              <CardDescription>Enter your details below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="firstName">First name *</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  ref={firstNameRef}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastName">Last name *</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  ref={lastNameRef}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  ref={emailRef}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">New password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  ref={registerPasswordRef}
                  required
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </CardFooter>
          </Card>
        </form>
      </TabsContent>
    </Tabs>
  );
};

export default Mytab;
