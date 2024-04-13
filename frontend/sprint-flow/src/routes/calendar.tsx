import { useState, useEffect} from 'react';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Axios from 'axios';
import CTasks from './tasks';
import "../index.css";
import handleNavigates from '../services/apiServices';
import CustomAgenda from '../components/customAgendaView';


function App() {
  // const {handleLogout, handleNavigate} = handleNavigates();
  const localizer = momentLocalizer(moment);
  const token = localStorage.getItem("token");
  // const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]); // Specify type for tasks

  const [update, setUpdate] = useState(false);

  const handleTaskCreation = () => {
  setUpdate(true);
}

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
        start: task.startDate,
        end: task.dueDate,
      }));
      setTasks(updatedTasks);
      console.log(data);
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
            agenda: CustomAgenda,
        }as any}
        // components={{event: EventComponent}}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 840, width: 1450 }}
      />
    </div>
  );
}

export default App;
