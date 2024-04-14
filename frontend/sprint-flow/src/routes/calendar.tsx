import { useState, useEffect} from 'react';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Axios from 'axios';
import CTasks from './tasks';
import "../index.css";
import handleNavigates from '../services/apiServices';
import CustomAgenda from '../components/customAgendaView';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';


function App() {
  const {handleLogout, handleNavigate} = handleNavigates();
  const localizer = momentLocalizer(moment);
  const token = localStorage.getItem("token");
  // const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]); // Specify type for tasks

  const [update, setUpdate] = useState(false);
  const [open, setOpen] = useState(false);

  const handleTaskCreation = () => {
  setUpdate(true);
}

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
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
        end: new Date (task.dueDate),
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
      <div style={{paddingBottom: "70px"}}>
        <button onClick={handleOpen}>
          Create Task
        </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          width: 400,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          borderRadius: '8px',
          boxShadow: 24,
          p: 4,
        }}>
          <CTasks UpdateCalendar = {handleTaskCreation} UpdateModal={handleClose}/>
        </Box>
      </Modal>
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
