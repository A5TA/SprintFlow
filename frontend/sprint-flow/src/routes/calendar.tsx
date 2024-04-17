import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Axios from 'axios';
import CTasks from './tasks';
import '../index.css';
import { Colors, getColorById } from '../services/apiServices';
import CustomAgenda from '../components/customAgendaView';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { fetchTeams } from '../services/apiServices';
import { Project } from './projects';
import Button from '@mui/material/Button';

function App() {
  const localizer = momentLocalizer(moment);
  const token = localStorage.getItem('token');
  const [tasks, setTasks] = useState<any[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [update, setUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  const [mapProjects, setMapProjects] = useState(new Map<string, string>());

  const handleTaskCreation = () => {
    setUpdate(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  function addToMap(projectName: string, projectID: string): void {
    setMapProjects((prevMap) => {
      const updatedMap = new Map(prevMap);
      updatedMap.set(projectName, projectID);
      return updatedMap;
    });
  }

  useEffect(() => {
    const fetchAllProjects = async () => {
      for (const teamName of teams) {
        try {
          const response = await Axios.get(`http://localhost:8080/api/v1/project-controller/getAllProjectsForTeam/${teamName}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const projects = response.data.data;
          projects.forEach((project: Project) => {
            addToMap(project.name, project.id);
          });
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
      }
    };

    fetchAllProjects();
  }, [teams]);

  const fetchTasks = async () => {
    try {
      const response = await Axios.get('http://localhost:8080/api/v1/tasks-controller/getTasksForUser', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data.data;
      const updatedTasks = data.map((task: any) => ({
        ...task,
        title: task.name,
        description: task.description,
        start: new Date(task.startDate),
        end: new Date(task.dueDate),
        project: task.projectId,
      }));
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchTeams({ token: token, setData: setTeams });
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    fetchTasks();
    setUpdate(false);
  }, [update]);

  useEffect(() => {
    fetchTasks();
  }, []);

  function getProjectName(id: string, mapProjects: Map<string, string>): string | undefined {
    for (const [projectName, projectId] of mapProjects) {
      if (id.toString() === projectId.toString()){
        return projectName;
      }
    }
  }

  return (
    <div className="App">
      <div style={{paddingBottom: "70px"}}>
      <Button variant="contained" color="primary" onClick={handleOpen} style={{ position: 'absolute', right: "20px", top: "80px" }}>
          Create Task
        </Button>

        {tasks.length > 0 &&  
  <div style={{paddingTop: 0}}>
    <h1>Projects</h1>
    <table>
      {Array.from({length: Math.ceil(tasks.length / 4)}).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {tasks.slice(rowIndex * 4, (rowIndex + 1) * 4).map((task, index) => (
            <td key={rowIndex * 4 + index} style={{backgroundColor: getColorById(task.projectId), color: "white", fontWeight: "bolder", width: 150, textAlign: "center"}}>
              {getProjectName(task.projectId, mapProjects)}
            </td>
          ))}
        </tr>
      ))}
    </table>
  </div>
}
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
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
          }}
        >
          <CTasks UpdateCalendar={handleTaskCreation} UpdateModal={handleClose} />
        </Box>
      </Modal>
      <Calendar
        localizer={localizer}
        events={tasks}
        views={{
          day: true,
          week: true,
          month: true,
          agenda: CustomAgenda,
        } as any}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 840, width: 1450 }}
        eventPropGetter={(event) => {
          const projId = event.projectId;
          console.log(getProjectName(projId, mapProjects));
          const backgroundColor = getColorById(projId);
          return { style: { backgroundColor } };
        }}
      />
    </div>
  );
  
}

export default App;
