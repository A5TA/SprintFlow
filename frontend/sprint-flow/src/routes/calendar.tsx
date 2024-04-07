import React, { useState, useEffect} from 'react';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CreateEventButton from '../components/createEventButton';
import MyForm from "../components/eventModal";
import Axios from 'axios';
import CTasks from './tasks';

function App() {
  const localizer = momentLocalizer(moment);

  const [showForm, setShowForm] = useState(false);
  const token = localStorage.getItem('token');
  const [tasks, setTasks] = useState<any[]>([]); // Specify type for tasks

  const fetchTasks = async () => {
    try {
      const response = await Axios.get('http://localhost:8080/api/v1/tasks-controller/getTasksForUser', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data.data;
      const updatedTasks = data.map((task: any) => ({
        ...task,
        title: task.name,
        description: task.description,
        start: new Date(task.startDate),
        end: new Date(task.dueDate)
      }));
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []); // Run once on component mount

  // Log a message when the component re-renders
  console.log("App component re-rendered");

  return (
    <div className="App">
      <CreateEventButton forMethod={setShowForm} />
      {showForm && <MyForm setShowForm={setShowForm} />}
      {showForm && <button type="button" onClick={() => setShowForm(false)}>X</button>}
      <CTasks />
      <Calendar
        localizer={localizer}
        events={tasks}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 840, width: 1450 }}
      />
    </div>
  );
}

export default App;
