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
}

export default function Projects() {
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedTaskProject, setSelectedTaskProject] = useState<string>("");
  const token: string | null = localStorage.getItem('token');
  const [data, setData] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<{ [key: string]: boolean }>({});

  const [description, setDescription] = useState("");
    const [projectName, setProjectName] = useState("");
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [taskName, setTaskName] = useState("");
    const [points, setPoints] = useState("");
    const [taskCreated, setTaskCreated] = useState<boolean>(false);


    const handleDescription = (event: any) => {
      setDescription(event.target.value);
  }
  const handleProjectName = (event: any) => {
      setProjectName(event.target.value);
  }
  const handleTaskName = (event: any) => {
      setTaskName(event.target.value);
  }
  const handlePoints = (event: any) => {
      setPoints(event.target.value);
  }

  const sendReq = (event: any) => {
    event.preventDefault();
    const token = localStorage.getItem('token'); 
    const javaStartDate = dueDate ? new Date(dueDate.getTime()) : null;
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
  }

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

  const fetchProjects = async () => {
    try {
      const response = await Axios.get(`http://localhost:8080/api/v1/project-controller/getAllProjectsForTeam/${selectedTeam}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProjects(response.data.data);
      // Initialize expanded state for projects
      const initialExpandedState: { [key: string]: boolean } = {};
      response.data.data.forEach((project: Project) => {
        initialExpandedState[project.id] = false;
      });
      setExpandedProjects(initialExpandedState);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchTasks = async (projName: string) => {
    try {
      const response = await Axios.get(`http://localhost:8080/api/v1/tasks-controller/getTaskForProject/${projName}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTasks(response.data.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

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
      setTaskCreated(false); // Reset the state variable
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
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <div>
          <h2>Current Teams:</h2>
          <ul>
            {data.map((team: string, index: number) => (
              <li key={index}>{team}</li>
            ))}
          </ul>
          <Link to="/projects/createTeam">Create Team</Link>
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
                      <li key={task.id}>{task.name}</li>
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
            <form onSubmit={sendReq}>
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
