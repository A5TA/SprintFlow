import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { List, ListItem, ListItemText, Paper, Popper, TextField } from '@mui/material';
import handleNavigates from "../services/apiServices"
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import CTasks from '../components/createTaskInProjects';
import DatePicker from "react-datepicker";


const theme = createTheme();

interface Email {
  firstName: string;
  lastName: string;
  email: string;
}

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

  const { handleLogout, handleNavigate } = handleNavigates();
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  const [mapProjects, setMapProjects] = useState(new Map<string, string>());

  // State for team and project selection
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedTaskProject, setSelectedTaskProject] = useState<string>("");
  const [open, setOpen] = useState(false); // State for modal open/close
  
  // State for authentication token and fetched data
  const [data, setData] = useState<string[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamChanged, setTeamChanged] = useState(false);
  
  // State for managing project expansion and tasks
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<{ [key: string]: boolean }>({});
  const [projectTasks, setProjectTasks] = useState<{ [key: string]: Task[] }>({});

   // Task creation state
  const [description, setDescription] = useState("");
  // const [projectName, setProjectName] = useState("");
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

  const [startTime, setStartTime] = useState<string>('10:00');
  const [endTime, setEndTime] = useState<string>('10:00');

  // Emails for assigning the task
  const [emailList, setEmailList] = useState<Email[]>([]);
  const [emailSearchQuery, setEmailSearchQuery] = useState<string | null>(null);
  const [showDropdownForEmail, setShowDropdownForEmail] = useState<boolean>(false);
  const handleSearchChange = (e: any) => {
    setEmailSearchQuery(e.target.value);
  };

  const filteredEmails = emailList.filter((email) => {
    if (emailSearchQuery === null) {
      return true; //we can just show all of them
    }
    return `${email.firstName} ${email.lastName} ${email.email}`.toLowerCase().includes(emailSearchQuery.toLowerCase());
  });

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
      setTeamChanged(false);
    }
  }, [teamChanged]);


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


  // Function to get project names from map
  function getProjectNames(): string[] {
    return Array.from(mapProjects.keys());
  }

  // Event handlers for form inputs
  const handleTeamChange = (event: any) => {
    setSelectedTeam(event.target.value);
    setTeamChanged(true);
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

  const handleDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };


  // const handleProjectName = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setProjectName(event.target.value);
  // };

  // const handleProjectName = (event: any) => {
  //   setProjectName(event.target.value);
  // };


  const handleTaskName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(event.target.value);
  };

  const handlePoints = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        console.log("Task assigned successfully with email " + assignEmail);
        setTaskCreated(true);  
        setAssignEmail("")
        setEmailSearchQuery(null); 
      }
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
    console.log("gettingp projects for ", selectedTeam)
    try {
        mapProjects.clear();
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
        fetchAllUsersOnTeam(); //we need to show all the users on the team
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

  // Function to cancel task editing
  const cancelEditing = () => {
    setEditingTaskId(null);
  };

  // Function to submit task creation form
  const sendReq = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const javaStartDate = startDate ? new Date(startDate.toISOString().split('T')[0] + 'T' + startTime) : null;
    const javaDueDate = dueDate ? new Date(dueDate.toISOString().split('T')[0] + 'T' + endTime) : null;

    // const startDateTime = new Date((startDate?.toISOString().split('T')[0] ?? '') + 'T00:00');
    // const endDateTime = new Date((dueDate?.toISOString().split('T')[0] ?? '') + 'T00:00');
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
        handleClose();
      }
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });
  };

  // Function to handle opening the modal
  const handleOpen = () => {
    setOpen(true);
  };

  // Function to handle closing the modal
  const handleClose = () => {
    setOpen(false);
  };

  //Get all users on team selected and logic to make the dropdown work
  const fetchAllUsersOnTeam = async () => {
    try {
        const response = await Axios.get(`http://localhost:8080/api/v1/team-controller/getAllUsersForTeam/${selectedTeam}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        // console.log("Users are:", response)
        setEmailList(response.data.data)
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
  };
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);


  const handleClickOutside = (event: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target as Node) &&
      listRef.current &&
      !listRef.current.contains(event.target as Node)
    ) {
      setShowDropdownForEmail(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside); //This is to understand what the user is clicking

  // JSX rendering
return (
    <ThemeProvider theme={theme}>
        <div style={{position: 'absolute', top: 20, right: 20 }}>
        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div style={{position: 'absolute', top: 20, right: 90 }}>
        <button onClick={() => handleNavigate("/calendar")}>
          Calendar
        </button>
      </div>
      <div style={{position: 'absolute', top: 20, right: 175 }}>
        <button onClick={() => handleNavigate("/main")}>
          Home
        </button>
      </div>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h5" gutterBottom>
            Current Teams
          </Typography>
          {data.map((team: string, index: number) => (
              <li key={index} value={team}>{team}</li>
            ))}
          <div>
             <Box sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center", 
            gap: "0.5rem",
            padding: "1rem" 
          }}>
              <Button component={Link} to="/projects/createTeam" variant="contained" color="primary">
                Create Team
              </Button>
              <Button component={Link} to="/projects/joinTeam" variant="contained" color="primary">
                Join Team
              </Button>
            </Box>
            <Select value={selectedTeam} onChange={handleTeamChange} displayEmpty>
              <MenuItem value="" disabled>Select Team</MenuItem>
              {data.map((team: string, index: number) => (
                <MenuItem key={index} value={team}>{team}</MenuItem>
              ))}
            </Select>
          </div>
       
        </Box>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Current Projects
          </Typography>
          {mapProjects.size > 0 ? (
            <div>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
          {Array.from(mapProjects).map(([projectName, projectId]) => (
            <li key={projectId} style={{ marginBottom: '5px' }}>
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
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div>
                      <TextField
                        label="Search Assignee"
                        type="text"
                        value={emailSearchQuery || ''}
                        onChange={handleSearchChange}
                        onClick={() => setShowDropdownForEmail(true)}
                        margin="normal"
                        inputRef={inputRef}
                      />
                      <Popper open={showDropdownForEmail} anchorEl={inputRef.current} placement="bottom-start">
                        <Paper>
                        <List ref={listRef}>
                          {filteredEmails.map((email, index) => (
                            <ListItem key={index} onClick={(e) => {
                              setAssignEmail(email.email)
                              handleSearchChange({ target: { value: `${email.firstName} ${email.lastName}` } });                            
                              }}>
                              <ListItemText primary={`${email.firstName} ${email.lastName}`} secondary={email.email} />
                            </ListItem>
                          ))}
                        </List>
                        </Paper>
                      </Popper>
                      
                    </div>
                    <button style={{ height: '30px', marginLeft: '10px', padding: '5px 10px', }}
                     onClick={() => {
                    assignTaskReq(task);
                    cancelEditing();
                    toggleProject({ id: projectId, name: projectName });
                  }}>Assign</button>
                  </div>
                  <button onClick={() => {
                    saveEditedTask(task);
                    cancelEditing();
                    toggleProject({ id: projectId, name: projectName });
                  }}>Save</button>
                  <button onClick={() => {
                    cancelEditing()
                    setAssignEmail("")
                    setEmailSearchQuery(null);    
                  }}>Cancel</button>
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
          {/* This is useless because its in the form my guy */}
          {/* <FormControl>
            <InputLabel id="project-label">Select Project</InputLabel>
            <Select
              labelId="project-label"
              id="project-select"
              value={selectedTaskProject}
              onChange={handleProjectChange}
              displayEmpty
            >
              <MenuItem value="" disabled>Select Project</MenuItem>
              {getProjectNames().map((projectName: string, index: number) => (
                <MenuItem key={index} value={projectName}>{projectName}</MenuItem>
              ))}
            </Select>
          </FormControl> */}
           <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button component={Link} to="/projects/createProject" variant="contained" color="primary" sx={{ mr: 2 }}>
              Create Project
            </Button>
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Create Task
            </Button>
          </Box>
        </Box>
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
          <Typography id="modal-modal-title" variant="h6" component="h2" color="black" sx={{ textAlign: 'center' }}>
            Create Task
          </Typography>
          <form id="form" onSubmit={sendReq}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Select Project</InputLabel>
                  <Select value={selectedTaskProject} onChange={handleProjectChange}>
                    {Array.from(mapProjects).map(([projectName, projectId]) => (
                      <MenuItem key={projectId} value={projectName}>{projectName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Task Name" value={taskName} onChange={handleTaskName} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Description" value={description} onChange={handleDescription} />
              </Grid>
              <Grid item xs={12}>
              Start Date:
            <DatePicker selected={startDate} onChange={(date: Date | null) => setStartDate(date)} />
            <TimePicker value={startTime} onChange={(e) => setStartTime(e)} clockIcon={null}/>

            </Grid>
            <Grid item xs={12}>
              End Date:
              <DatePicker selected={dueDate} onChange={(date: Date | null) => setDueDate(date)} />
              <TimePicker value={endTime} onChange={(e) => setEndTime(e)} clockIcon={null}/>

            </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Points" value={points} onChange={handlePoints} type="number" />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Create Task
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </Container>
  </ThemeProvider>
);
};