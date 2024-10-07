import React from 'react'
import MyCreateForm from '../mycomponents/MyCreateForm.jsx'

const CreateForm = () => {
  return (
    <div className="w-full h-[100vh] bg-slate-900 flex flex-col md:flex-row items-center justify-center gap-10">
    <MyCreateForm></MyCreateForm>
  </div>
  )
}

export default CreateForm