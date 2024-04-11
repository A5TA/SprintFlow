import ReactDOM from "react-dom";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Root from "./routes/root";
import Calendar from "./routes/calendar";
import CTeam from "./routes/createTeam";
import Login from "./routes/login";
import Register from "./routes/register";
import Projects from "./routes/projects";
import CTasks from "./routes/tasks";
import Welcome from "./routes/welcome";
import CreateProject from "./routes/createProject";
import Password from "./routes/forgotPassword";
import JoinTeam from "./routes/joinTeam";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/calendar",
    element: <Calendar/>,
  },
  {
    path: "/createTeam",
    element: <CTeam />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgotPassword",
    element: <Password />,
  },
  {
    path: "/projects",
    element: <Projects />,
  },
  {
    path: "/createTask",
    element: <CTasks />,
  },
  {
    path: "/main",
    element: <Welcome />,
  },
  {
    path: "/projects/createTeam",
    element: <CTeam />,
  },
  {
    path: "/projects/createProject",
    element: <CreateProject />,
  },
  {
    path: "/projects/joinTeam",
    element: <JoinTeam />,
  },
]);

const App = () => {
  return (
     <RouterProvider router={router} />
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
