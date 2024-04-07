// app.tsx
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Root />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/createTeam" element={<CTeam />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgotPassword" element={<Password />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/createTask" element={<CTasks />} />
      <Route path="/main" element={<Welcome />} />
      <Route path="/projects/createTeam" element={<CTeam />} />
      <Route path="/projects/createProject" element={<CreateProject />} />
      <Route path="/projects/joinTeam" element={<JoinTeam />} />
    </Routes>
  </BrowserRouter>
);

ReactDOM.render(<App />, document.getElementById("root"));

export default App;