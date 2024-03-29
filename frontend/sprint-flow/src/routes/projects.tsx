import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SelectChangeEvent } from '@mui/material/Select';


const theme = createTheme();

export default function Projects() {
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [data, setData] = useState<string[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const token = localStorage.getItem('token');

interface Project {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  dueDate: Date;
  points: string;
  taskStatus: string;
}

export default function Projects() {
  const token = localStorage.getItem('token');
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedTaskProject, setSelectedTaskProject] = useState<string>("");
  const [data, setData] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<{ [key: string]: boolean }>({});

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
  const [assignedTasks, setAssignedTasks] = useState<string[]>([]);

  // Function to handle task editing
  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditedTaskName(task.name);
    setEditedTaskDesc(task.description);
    setEditedTaskStart(task.startDate);
    setEditedTaskEnd(task.dueDate);
    const points = task.points !== null ? parseInt(task.points, 10) : 0;
    setEditedTaskPoints(points);
    setTaskStatus(task.taskStatus);
    // You can set other edited task properties here if needed
  };

  // Function to save edited task
  const saveEditedTask = (task: Task) => {
    // Perform API call to update task with new information
    // After successful update, reset editing state

    const token = localStorage.getItem('token');
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
  const cancelEditing = () => {
    setEditingTaskId(null);
  };

  // Function to handle task description change
  const handleDescription = (event: any) => {
    setDescription(event.target.value);
  };

  // Function to handle task name change
  const handleTaskName = (event: any) => {
    setTaskName(event.target.value);
  };

  // Function to handle points change
  const handlePoints = (event: any) => {
    setPoints(event.target.value);
  };

  // Function to assign task to a user
  const assignTaskReq = (task: Task) => {
    const bodyParameters = {
      "assignEmail": assignEmail,
      "taskId": task.id
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
            console.log("Your good to go!")
            setAssignedTasks([...assignedTasks, task.id]);
            fetchTasks(selectedTaskProject);
        }
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });
  };

  // Function to send task creation request
  const sendReq = (event: any) => {
    event.preventDefault();
    const token = localStorage.getItem('token'); 
    const javaStartDate = startDate ? new Date(startDate.getTime()) : null;
    const javaDueDate = dueDate ? new Date(dueDate.getTime()) : null;
    const pointsInt = parseInt(points, 10);

    const bodyParameters = {
        "name": taskName,
        "desc": description,
        "startDate": javaStartDate,
        "dueDate": javaDueDate,
        "points": pointsInt,
        "projectName": selectedTaskProject,
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
            console.log("Your good to go!")
            setTaskCreated(true);
        }
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });
  };

  // Function to fetch teams
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

  // Function to fetch projects
  const fetchProjects = async () => {
    try {
      const response = await Axios.get(`http://localhost:8080/api/v1/project-controller/getAllProjectsForTeam/${selectedTeam}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProjects(response.data.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }
  };

  const getProjectIdByName = (projectName: string): string | undefined => {
    const project = projects.find(project => project.name === projectName);
    return project ? project.id : undefined;
  };

  // Function to fetch tasks for a project
  const fetchTasks = async (projName: string) => {
    try {
      const projectId = getProjectIdByName(projName);
      if (!projectId) {
        console.error(`Project with name '${projName}' not found.`);
        return;
      }
  
      const response = await Axios.get(`http://localhost:8080/api/v1/tasks-controller/getTasksForUser`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      // Assuming response.data.data is an array of tasks
      const tasksForProject = response.data.data.filter(task => task.projectId === projectId);
      setTasks(tasksForProject);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam !== '') {
      fetchProjects();
    }
  }, [selectedTeam]);

  const handleTeamChange = (event: SelectChangeEvent<string>) => {
    setSelectedTeam(event.target.value);
  }

  useEffect(() => {
    if (taskCreated) {
      fetchTasks(selectedTaskProject);
      setTaskCreated(false); 

      setTaskName("");
      setDescription("");
      setStartDate(null);
      setDueDate(null);
      setPoints("");
      setSelectedTaskProject("");
    }
  }, [taskCreated, selectedTaskProject]);

  const handleTeamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeam(event.target.value);
  };

  const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTaskProject(event.target.value);
    // When project changes, fetch tasks for the selected project
    fetchTasks(event.target.value);
  };

  const toggleProject = async (project: Project) => {
    const projectId = project.id;
    setExpandedProjects(prevState => ({
      ...prevState,
      [projectId]: !prevState[projectId]
    }));

    if (!expandedProjects[projectId]) {
      // Set the selected project before fetching tasks
      setSelectedProject(project);
      fetchTasks(project.name);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h5" gutterBottom>
            Current Teams
          </Typography>
          <Button component={Link} to="/projects/createTeam" variant="contained" color="primary">
            Create Team
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
          {projects.length > 0 ? (
            projects.map((project: any, index: number) => (
              <Typography key={index} variant="body1">{project.name}</Typography>
            ))
          ) : (
            <Typography variant="body1">No projects available for the selected team</Typography>
          )}
          <Button component={Link} to="/projects/createProject" variant="contained" color="primary" sx={{ mt: 2 }}>
            Create Project
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
              <li key={index}>{team}</li>
            ))}
          </ul>
          <Link to="/projects/createTeam">Create Team</Link>
          <br/>
          <Link to="/projects/joinTeam">Join Team</Link>
          <div>
            <label>Select Team:</label>
            <select onChange={handleTeamChange}>
              <option value="">Select Team</option>
              {data.map((team: string, index: number) => (
                <option key={index} value={team}>{team}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <h2>Current Projects:</h2>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {projects.map((project: Project) => (
              <li key={project.id} style={{ marginBottom: '5px' }}>
                <button onClick={() => toggleProject(project)}>{expandedProjects[project.id] ? '-' : '>'}</button>
                <span>{project.name}</span>
                {expandedProjects[project.id] && (
                  <ul>
                    {/* Render tasks for the selected project */}
                    {tasks.map((task: Task) => (
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
                            <br/>
                            <label>
                              Description:     
                              <input value={editedTaskDesc} onChange={(e) => setEditedTaskDesc(e.target.value)} />
                            </label>
                            <br/>
                            <label>
                              Start Date:     
                              <DatePicker selected={editedTaskStart} onChange={(date: Date | null) => setEditedTaskStart(date)} />
                            </label>
                            <br/>
                            <label>
                              End Date:     
                              <DatePicker selected={editedTaskEnd} onChange={(date: Date | null) => setEditedTaskEnd(date)} />
                            </label>
                            <br/>
                            <label>
                              Points:
                              <input value={editedTaskPoints?.toString()} onChange={(e) =>{ 
                                const inputValue = e.target.value;
                                const parsedValue = inputValue.trim() !== '' && !isNaN(parseInt(inputValue, 10)) ? parseInt(inputValue, 10) : null;
                                setEditedTaskPoints(parsedValue);}} 
                              />
                            </label>
                            <br/>
                            <label>
                              Status:
                              <input value={taskStatus} onChange={(e) => setTaskStatus(e.target.value)} />
                            </label>
                            <br/>
                            <label>
                              Assign Task:
                              <input type="text" value={assignEmail} onChange={(e) => setAssignEmail(e.target.value)} />
                            </label>
                            <button onClick={() => {
                            assignTaskReq(task);
                            cancelEditing();
                            toggleProject(project);
                            }}>Assign</button>
                            <br/>
                            <button onClick={() => {
                            saveEditedTask(task);
                            cancelEditing();
                            toggleProject(project);}}>Save</button>
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
        <Link to="/projects/createProject">Create Project</Link>
        <div style={{position: 'absolute', top: 200, right: 50 }}>
          <h2> Create Task In Project</h2>
          <label>Select Project:</label>
          <select onChange={handleProjectChange}>
            <option value="">Select Project</option>
            {projects.map((project: Project, index: number) => (
              <option key={index} value={project.name}>{project.name}</option>
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
      </div>
    </div>
  );
}
