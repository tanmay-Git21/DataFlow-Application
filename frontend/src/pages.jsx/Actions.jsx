import { Button } from "@/components/ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";


const Actions = () => {
    const navigateFromAction = useNavigate()

const handleCreate = async () =>{
    
     navigateFromAction("/createform")
}
const handleRead = async () =>{
    
     navigateFromAction("/readdata")
}
const handleUpdate = async () =>{
    
     navigateFromAction("/updateform")
}
const handleDelete = async () =>{
    
     navigateFromAction("/deleteform")
}







  return (
    <div className="w-full h-[100vh] bg-slate-900 flex flex-col md:flex-row items-center justify-center gap-10">
    <Button onClick={handleCreate}>Create</Button>
    <Button onClick={handleRead}>Read</Button>
    <Button onClick={handleUpdate}>Update</Button>
    <Button onClick={handleDelete}>Delete</Button>
  </div>
  
  );
};

export default Actions;
