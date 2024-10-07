
import { createRoot } from 'react-dom/client'

import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './pages.jsx/App';
import Actions from './pages.jsx/Actions';
import UpdateForm from './pages.jsx/UpdateForm';
import DeleteForm from './pages.jsx/DeleteForm';
import ReadData from './pages.jsx/ReadData';
import CreateForm from './pages.jsx/CreateForm';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  
  },{
    path:"/actions",
    element:<Actions></Actions>
  },{
    path:"/createform",
    element:<CreateForm></CreateForm>
  },{
    path:"/readdata",
    element:<ReadData></ReadData>
  },{
    path:"/deleteform",
    element:<DeleteForm></DeleteForm>
  },{
    path:"/updateform",
    element:<UpdateForm></UpdateForm>
  }
]);

createRoot(document.getElementById('root')).render(
<RouterProvider router={router}></RouterProvider>
)
