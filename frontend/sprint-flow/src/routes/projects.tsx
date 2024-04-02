import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Axios from 'axios';

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
  // State for team and project selection
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedTaskProject, setSelectedTaskProject] = useState<string>("");
  
  // State for authentication token and fetched data
  const token: string | null = localStorage.getItem('token');
  const [data, setData] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const email = localStorage.getItem('email');
  
  // State for managing project expansion and tasks
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<{ [key: string]: boolean }>({});
  const [projectTasks, setProjectTasks] = useState<{ [key: string]: Task[] }>({});

  // State for task editing and creation
  const [description, setDescription] = useState("");
  const [projectName, setProjectName] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [taskName, setTaskName] = useState("");
  const [points, setPoints] = useState("");
  const [taskCreated, setTaskCreated] = useState<boolean>(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTaskName, setEditedTaskName] = useState<string>("");
  const [editedTaskDesc, setEditedTaskDesc] = useState<string>("");
  const [editedTaskStart, setEditedTaskStart] = useState<Date | null>(null);
  const [editedTaskEnd, setEditedTaskEnd] = useState<Date | null>(null);
  const [editedTaskPoints, setEditedTaskPoints] = useState<number | null>(null);
  const [taskStatus, setTaskStatus] = useState("");
  const [assignEmail, setAssignEmail] = useState("");

  const [mapProjects, setMapProjects] = useState(new Map<string, string>());

  // Fetch teams and projects on component mount
  useEffect(() => {
    fetchTeams();
  }, []);

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
      setSelectedTaskProject("");
    }
  }, [taskCreated, selectedTaskProject]);

  // Function to add project to map
  function addToMap(projectName: string, projectID: string): void {
      mapProjects.set(projectName, projectID);
  }

  // Function to get the project ID by project name
  function getFromMap(projectName: string) {
    return mapProjects.get(projectName);
  } 

  // Function to get project names from map
  function getProjectNames(): string[] {
    return Object.keys(mapProjects);
  }

  // Event handlers for form inputs
  const handleTeamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeam(event.target.value);
  };

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
    // You can set other edited task properties here if needed
  };

  const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTaskProject(event.target.value);
    fetchTasks(event.target.value);
  };

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

  const assignTask = async (event: any) => {
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
      console.log(selectedTaskProject);
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


  const fetchProjects = async () => {
    try {
        const response = await Axios.get(`http://localhost:8080/api/v1/project-controller/getAllProjectsForTeam/${selectedTeam}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const projects = response.data.data;
        console.log(projects);
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
  const saveEditedTask = (task: Task) => {
    const token = localStorage.getItem('token');
    const javaStartDate = editedTaskStart ? new Date(editedTaskStart).getTime() : null;
    const javaDueDate = editedTaskEnd ? new Date(editedTaskEnd).getTime() : null;
    const points = editedTaskPoints !== null ? parseInt(editedTaskPoints.toString(), 10) : 0;

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
        console.log("Task details updated successfully!");
        setTaskCreated(true);
      }
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });

    setEditingTaskId(null);
  };

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
      console.log(selectedTaskProject);
    });
  };

  // JSX rendering
  return (
    <div>
      {/* Team selection */}
      <div>
        <h2>Current Teams:</h2>
        <ul>
          {data.map((team: string, index: number) => (
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
    
      {/* Current Projects */}
      <div>
        <h2>Current Projects</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {Array.from(mapProjects).map(([projectName, projectId], index) => {
            return (
                <li key={index} style={{ marginBottom: '5px' }}> 
                  <button onClick={() => toggleProject({ id: projectId, name: projectName })}>
                    {expandedProjects[projectId] ? '-' : '>'}
                  </button>
                  {projectName} - {projectId}
                  {expandedProjects[projectId] && (
                    <ul>
                      {projectTasks[projectName] && projectTasks[projectName].map((task: Task) => (
                        <li key={task.id}>
                          {task.name} 
                          <span onClick={() => handleEditTask(task)}>🖉</span>
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
                                <input 
                                  value={editedTaskPoints !== null ? editedTaskPoints.toString() : ''} 
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    const parsedValue = inputValue.trim() !== '' && !isNaN(parseInt(inputValue, 10)) ? parseInt(inputValue, 10) : null;
                                    setEditedTaskPoints(parsedValue);
                                  }} 
                                />
                              </label>
                              <br/>
                              <label>
                                Status:
                                <input value={taskStatus} onChange={(e) => setTaskStatus(e.target.value)} />
                              </label>
                              <br/>
                              <label>
                                Email:
                                <input value={assignEmail} onChange={(e) => setAssignEmail(e.target.value)}/>
                                <button onClick={assignTask}>Assign</button>
                              </label>
                              <br/>
                              <button onClick={() => saveEditedTask(task)}>Save</button>
                              <button onClick={() => cancelEditing()}>Cancel</button>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
            );
          })}
        </ul>
        <Link to="/projects/createProject">Create Project</Link>
      </div>
      
      {/* Task creation form */}
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
    </div>
  );
  
  
  
}
