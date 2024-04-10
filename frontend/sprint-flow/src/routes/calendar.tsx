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
import handleNavigates from '../services/apiServices';
import { textAlign } from '@mui/system';




function App() {
  const {handleLogout, handleNavigate} = handleNavigates();
  const localizer = momentLocalizer(moment);
  const token = localStorage.getItem("token");
  // const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]); // Specify type for tasks

  const [update, setUpdate] = useState(false);

  const handleTaskCreation = () => {
  setUpdate(true);
}

const descriptionStyle = {
  paddingLeft: "10px",
  paddingRight: "10px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
};

const containerStyle: React.CSSProperties = {
  width: "200px",
  textAlign: "center"
};

  const EventComponent = ({ event }) => {
    return (
      <div style={containerStyle}>
        <strong style={{color: "black", fontSize:"20px"}}>
          <center>{event.title}</center>
          </strong>
        <p style={{paddingLeft: "5px",
                  paddingRight: "5px",
                  overflow: "hidden",
                  textOverflow: "ellipsis"}}>
          {event.description}
        </p>
        <em>
          <center>{event.points} points</center>
        </em>
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
      <div style={{position: 'absolute', top: 20, right: 20 }}>
        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div style={{position: 'absolute', top: 20, right: 90 }}>
        <button onClick={() => handleNavigate("/projects")}>
          Projects
        </button>
      </div>
      <div style={{position: 'absolute', top: 20, right: 175 }}>
        <button onClick={() => handleNavigate("/main")}>
          Home
        </button>
      </div>
      {/* <CreateEventButton forMethod={setShowForm} />
      {showForm && <MyForm setShowForm={setShowForm} />}
      {showForm && <button type="button" onClick={() => setShowForm(false)}>X</button>} */}
      <div style={{padding: "70px"}}>
      <CTasks UpdateCalendar = {handleTaskCreation}/>
      </div>
      <Calendar
        localizer={localizer}
        events={tasks}
        views={{
            day: true,
            week: true,
            month: true,
            agenda: true,
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
