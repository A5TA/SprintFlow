import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();


export interface Project {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  dueDate: Date;
  points: string;
  taskStatus: string;
}

export default function Projects() {

  const [mapProjects, setMapProjects] = useState(new Map<string, string>());

  // State for team and project selection
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedTaskProject, setSelectedTaskProject] = useState<string>("");
  
  // State for authentication token and fetched data
  const token: string | null = localStorage.getItem('token');
  const [data, setData] = useState<string[]>([]);
  //const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const email = localStorage.getItem('email');
  
  // State for managing project expansion and tasks
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<{ [key: string]: boolean }>({});
  const [projectTasks, setProjectTasks] = useState<{ [key: string]: Task[] }>({});

   // Task creation state
  const [description, setDescription] = useState("");
  const [projectName, setProjectName] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [taskName, setTaskName] = useState("");
  const [points, setPoints] = useState("");
  const [taskCreated, setTaskCreated] = useState<boolean>(false);

  // Task editing state
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTaskName, setEditedTaskName] = useState<string>("");
  const [editedTaskDesc, setEditedTaskDesc] = useState<string>("");
  const [editedTaskStart, setEditedTaskStart] = useState<Date | null>(null);
  const [editedTaskEnd, setEditedTaskEnd] = useState<Date | null>(null);
  const [editedTaskPoints, setEditedTaskPoints] = useState<number | null>(null);
  const [taskStatus, setTaskStatus] = useState("");
  const [assignEmail, setAssignEmail] = useState("");

  //const {mapProjects, setMapProjects} = useMapProjects();

  // Fetch teams and projects on component mount
  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    console.log(mapProjects);
  }, [mapProjects]);

  useEffect(() => {
    if (selectedTeam !== "") {
      fetchProjects();
    }
  }, [selectedTeam]);

  useEffect(() => {
    if (taskCreated) {
      fetchTasks(selectedTaskProject);
      setTaskCreated(false);
      setTaskName("");
      setDescription("");
      setStartDate(null);
      setDueDate(null);
      setPoints("");
      //setSelectedTaskProject("");
    }
  }, [taskCreated]);

  // Function to add project to map
  function addToMap(projectName: string, projectID: string): void {
    const updatedMap = mapProjects;
    updatedMap.set(projectName, projectID);
    // Update the context state with the new map
    setMapProjects(updatedMap);
    console.log(mapProjects);      //setMapProjects(mapProjects);
  }
  // Event handlers for form inputs

  const handleTeamChange = (event: any) => {
    setSelectedTeam(event.target.value);
  };


  const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTaskProject(event.target.value);
    fetchTasks(event.target.value);
  };

  // Function to handle task editing
  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditedTaskName(task.name);
    setEditedTaskDesc(task.description);
    // Ensure that task.startDate is a Date object before assigning it to editedTaskStart
    setEditedTaskStart(task.startDate);
    setEditedTaskEnd(task.dueDate);
    const points = task.points !== null ? parseInt(task.points, 10) : 0;
    setEditedTaskPoints(points);
    setTaskStatus(task.taskStatus);
  };

  // Function to save edited task
  const saveEditedTask = (task: Task) => {
    const javaStartDate = editedTaskStart ? new Date(editedTaskStart).getTime() : null;
    const javaDueDate = editedTaskEnd ? new Date(editedTaskEnd).getTime() : null;
    const points = parseInt(editedTaskPoints!.toString(), 10);

    const bodyParameters = {
      "name": editedTaskName,
      "desc": editedTaskDesc,
      "startDate": javaStartDate,
      "dueDate": javaDueDate,
      "points": points,
      "taskStatus": taskStatus,
      "taskId": task.id,
    };

    const config = {
      headers: { 
        Authorization: `Bearer ${token}`,
      }
    };
  
    Axios.post( 
      'http://localhost:8080/api/v1/tasks-controller/modifyTaskDetails',
      bodyParameters,
      config
    )
    .then((response) => {
      if (response.status === 200){
          console.log("Your good to go!")
          const updatedTasks: Task[] = tasks.map(t => {
            if (t.id === task.id) {
                return {
                    ...t,
                    name: editedTaskName,
                    description: editedTaskDesc,
                    startDate: editedTaskStart || new Date(),
                    dueDate: editedTaskEnd || new Date(),
                    points: editedTaskPoints!.toString(),
                    taskStatus: taskStatus
                };
            } else {
                return t;
            }
          });
          setTasks(updatedTasks);
          setTaskCreated(true);
          cancelEditing();
      }
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });

    setEditingTaskId(null);
  };

  // Function to cancel editing

  const handleDescription = (event: any) => {
    setDescription(event.target.value);
  };

  const handleProjectName = (event: any) => {
    setProjectName(event.target.value);
  };

  const handleTaskName = (event: any) => {
    setTaskName(event.target.value);
  };

  const handlePoints = (event: any) => {
    setPoints(event.target.value);
  };

  // Function to toggle project expansion and fetch tasks if necessary
  const toggleProject = async (project: Project) => {
    const projectId = project.id;
    setExpandedProjects(prevState => ({
      ...prevState,
      [projectId]: !prevState[projectId]
    }));

    if (!expandedProjects[projectId]) {
      setSelectedProject(project);

      if (!projectTasks[projectId]) {
        await fetchTasks(project.name);
      }
    }
  };

  // Fetch team data from API
  const fetchTeams = async () => {
    try {
      const response = await Axios.get('http://localhost:8080/api/v1/team-controller/getAllTeamsForUser', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const assignTaskReq = async (event: any) => {
    const bodyParameters = {
      "assignEmail": assignEmail,
      "taskId": editingTaskId,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };

    Axios.post(
      'http://localhost:8080/api/v1/tasks-controller/assignTaskForUser',
      bodyParameters,
      config
    )
    .then((response) => {
      if (response.status === 200){
        console.log("Task assigned successfully!");
        setTaskCreated(true);      }
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });
    setEditingTaskId(null);
    resetExpandedProjects();
  };

  // Function to reset the state of expanded projects
  const resetExpandedProjects = () => {
    setExpandedProjects(prevState => {
      const resetState: { [key: string]: boolean } = {};
      Object.keys(prevState).forEach(projectId => {
        resetState[projectId] = false;
      });
      return resetState;
    });
  };

  // Function to send task creation request

  useEffect(() => {
    // Fetch data for initial rendering
    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam !== "") {
      fetchProjects();
    }
  }, [selectedTeam]);
  
   // Function to fetch teams

  const fetchProjects = async () => {
    try {
        const response = await Axios.get(`http://localhost:8080/api/v1/project-controller/getAllProjectsForTeam/${selectedTeam}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const projects = response.data.data;
        console.log(projects);
        //(projects);
        projects.forEach((project: Project) => {
            addToMap(project.name, project.id);
        });
        // Update projectNamesArr after setting projects
        const initialExpandedState: { [key: string]: boolean } = {};
        projects.forEach((project: Project) => {
            initialExpandedState[project.id] = false;
        });
        setExpandedProjects(initialExpandedState);
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
};


  // Fetch tasks for the selected project from API
  const fetchTasks = async (projName: string) => {
    const projId = mapProjects.get(projName)?.toString();
    console.log(projId);
    try {
      const response = await Axios.get(`http://localhost:8080/api/v1/tasks-controller/getTaskForProject/${projId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const tasks = response.data.data;

      const userTasks = tasks.filter((task: any) => task.assignedTO === email);
      
        setProjectTasks(prevState => ({
          ...prevState,
          [projName]: userTasks,
        }));

      } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Function to save edited task details
  

  // Function to cancel task editing
  const cancelEditing = () => {
    setEditingTaskId(null);
  };

  // Function to submit task creation form
  const sendReq = (event: any) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const javaStartDate = startDate ? new Date(startDate.getTime()) : null;
    const javaDueDate = dueDate ? new Date(dueDate.getTime()) : null;

    const startDateTime = new Date((startDate?.toISOString().split('T')[0] ?? '') + 'T00:00');
    const endDateTime = new Date((dueDate?.toISOString().split('T')[0] ?? '') + 'T00:00');
    const pointsInt = parseInt(points, 10);

    const bodyParameters = {
      "name": taskName,
      "desc": description,
      "startDate": javaStartDate,
      "dueDate": javaDueDate,
      "points": pointsInt,
      "projectId": mapProjects.get(selectedTaskProject),
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };

    Axios.post(
      'http://localhost:8080/api/v1/tasks-controller/createTaskForProject',
      bodyParameters,
      config
    )
    .then((response) => {
      if (response.status === 200){
        console.log("Task created successfully!");
        setTaskCreated(true);
        resetExpandedProjects();
      }
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });
  };

  // JSX rendering
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h5" gutterBottom>
            Current Teams
          </Typography>
          {data.map((team: string, index: number) => (
              <li key={index} value={team}>{team}</li>
            ))}
          <Button component={Link} to="/projects/createTeam" variant="contained" color="primary">
            Create Team
          </Button>
          <Button component={Link} to="/projects/joinTeam" variant="contained" color="primary">
            Join Team
          </Button>
          <Select value={selectedTeam} onChange={handleTeamChange} displayEmpty>
            <MenuItem value="" disabled>Select Team</MenuItem>
            {data.map((team: string, index: number) => (
              <MenuItem key={index} value={team}>{team}</MenuItem>
            ))}
          </Select>
        </Box>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Current Projects
          </Typography>
          {mapProjects.size > 0 ? (
            <div>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
  {Array.from(mapProjects).map(([projectName, projectId], index) => (
    <li key={index} style={{ marginBottom: '5px' }}>
      <button onClick={() => toggleProject({ id: projectId, name: projectName })}>
        {expandedProjects[projectId] ? '-' : '>'}
      </button>
      <span>{projectName}</span>
      {expandedProjects[projectId] && projectTasks[projectName] && ( // Check if tasks exist for the selected project
        <ul>
          {/* Render tasks for the selected project */}
          {projectTasks[projectName].map((task: Task) => (
            <li key={task.id}>
              {task.name}
              <span onClick={() => handleEditTask(task)}>🖉</span>
              {/* Additional content for editing task */}
              {task.id === editingTaskId && (
                <div>
                  <label>
                    Name:
                    <input value={editedTaskName} onChange={(e) => setEditedTaskName(e.target.value)} />
                  </label>
                  <br />
                  <label>
                    Description:
                    <input value={editedTaskDesc} onChange={(e) => setEditedTaskDesc(e.target.value)} />
                  </label>
                  <br />
                  <label>
                    Start Date:
                    <DatePicker selected={editedTaskStart} onChange={(date: Date | null) => setEditedTaskStart(date)} />
                  </label>
                  <br />
                  <label>
                    End Date:
                    <DatePicker selected={editedTaskEnd} onChange={(date: Date | null) => setEditedTaskEnd(date)} />
                  </label>
                  <br />
                  <label>
                    Points:
                    <input
                      value={editedTaskPoints?.toString()}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const parsedValue = inputValue.trim() !== '' && !isNaN(parseInt(inputValue, 10)) ? parseInt(inputValue, 10) : null;
                        setEditedTaskPoints(parsedValue);
                      }}
                    />
                  </label>
                  <br />
                  <label>
                    Status:
                    <input value={taskStatus} onChange={(e) => setTaskStatus(e.target.value)} />
                  </label>
                  <br />
                  <label>
                    Assign Task:
                    <input type="text" value={assignEmail} onChange={(e) => setAssignEmail(e.target.value)} />
                  </label>
                  <button onClick={() => {
                    assignTaskReq(task);
                    cancelEditing();
                    toggleProject({ id: projectId, name: projectName });
                  }}>Assign</button>
                  <br />
                  <button onClick={() => {
                    saveEditedTask(task);
                    cancelEditing();
                    toggleProject({ id: projectId, name: projectName });
                  }}>Save</button>
                  <button onClick={() => cancelEditing()}>Cancel</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  ))}
</ul>

          </div>
          ) : (
            <Typography variant="body1">No projects available for the selected team</Typography>
          )}
          <Button component={Link} to="/projects/createProject" variant="contained" color="primary" sx={{ mt: 2 }}>
            Create Project
          </Button>
        </Box>
      </Container>

      <div style={{position: 'absolute', top: 200, right: 50 }}>
        <h2> Create Task In Project</h2>
        <label>Select Project:</label>
        <select onChange={handleProjectChange}>
          <option value="">Select Project</option>
          {Array.from(mapProjects).map(([projectName, projectId], index) => (
            <option key={index} value={projectName}>{projectName}</option>
          ))}
        </select>
        <form id="form" onSubmit={sendReq}>
          <label>
            Task Name:
            <input onChange={handleTaskName} value={taskName} type='text'/>
          </label>
          <br/>
          <label>
            Description:
            <input onChange={handleDescription} value={description} type='text'/>
          </label>
          <br/>
          <label>
            Start Date:
            <DatePicker selected={startDate} onChange={(date: Date | null) => setStartDate(date)} />
          </label>
          <br/>
          <label>
            End Date:
            <DatePicker selected={dueDate} onChange={(date: Date | null) => setDueDate(date)} />
          </label>
          <br/>
          <label>
            Points:
            <input onChange={handlePoints} value={points} type='text'/>
          </label>
          <br/>
          <button type='submit'>
            Create Task
          </button>
        </form>  
      </div>
    </ThemeProvider>
  );
}
