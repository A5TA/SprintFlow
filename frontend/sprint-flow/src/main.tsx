import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Root from "./routes/root";
import Calendar from "./routes/calendar"
import CTeam from "./routes/createTeam";
import Login from "./routes/login";
import Register from "./routes/register";
import CProject from "./routes/createProject";
import CTasks from "./routes/tasks";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
  },
  {
    path: "/calendar",
    element: <Calendar/>,
  },
  {
    path: "/createTeam", 
    element: <CTeam/>
  },
  {
    path: "/login", 
    element: <Login/>
  },
  {
    path: "/register", 
    element: <Register/>
  },
  {
    path: "/createProject", 
    element: <CProject/>
  },
  {
    path: "/createTask", 
    element: <CTasks/>
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <RouterProvider router={router} />
);