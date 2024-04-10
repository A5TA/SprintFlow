import React, { useState, useEffect} from 'react';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CreateEventButton from '../components/createEventButton';
import MyForm from "../components/eventModal";
import Axios from 'axios';
import CTasks from './tasks';
import "../index.css";
import CustomAgendaView from '../components/customAgendaView';


function App() {
  const localizer = momentLocalizer(moment);

  const [update, setUpdate] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const token = localStorage.getItem('token');
  const [tasks, setTasks] = useState<any[]>([]); // Specify type for tasks

  const handleTaskCreation = () => {
    setUpdate(true);
  }

  const EventComponent = ({ event }) => {
    return (
      <div>
        <strong>{event.title}</strong> {/* Display the event title */}
        <p>{event.description}</p> {/* Display the event description */}
      </div>
    );
  };

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

  useEffect(() => {
    fetchTasks();
    setUpdate(false);
  }, [update]);

  return (
    <div className="App">
      <CreateEventButton forMethod={setShowForm} />
      {showForm && <MyForm setShowForm={setShowForm} />}
      {showForm && <button type="button" onClick={() => setShowForm(false)}>X</button>}
      <CTasks UpdateCalendar = {handleTaskCreation}/>
      <Calendar
        localizer={localizer}
        events={tasks}
        views={{
            day: true,
            week: true,
            month: true,
            agenda: CustomAgendaView,
        } as any}
        components={{event: EventComponent}}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 840, width: 1450 }}
      />
    </div>
  );
}

export default App;
