import { useEffect, useState } from "react";
import Axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import 'react-select-search/style.css'
import { Project } from "./projects";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';

export default function CTasks({UpdateCalendar}) {
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [taskName, setTaskName] = useState("");
    const [points, setPoints] = useState("");
    const [teams, setTeams] = useState<string[]>([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [selectedProject, setSelectedProject] = useState('');
    const [searchStatus, setSearchStatus] = useState(false);
    const [mapProjects, setMapProjects] = useState(new Map<string, string>());
    const token = localStorage.getItem('token');
    const [startTime, setStartTime] = useState<string>('10:00');
    const [endTime, setEndTime] = useState<string>('10:00');

    
    // Access mapProjects from context

    const handleDescription = (event: any) => {
        setDescription(event.target.value);
    }
    const handleTaskName = (event: any) => {
        setTaskName(event.target.value);
    }
    const handlePoints = (event: any) => {
        setPoints(event.target.value);
    }

    // const changeStartTime= (timeValue: string) => {
    //   if (timeValue !== null)
    //   {
    //     setStartTime(timeValue);
    //   }
    // };

    // const changeEndTime= (timeValue: string) => {
    //   if (timeValue !== null)
    //   {
    //     setStartTime(timeValue);
    //   }
    // };

    useEffect(() => {
      fetchTeams();
    }, []);

    useEffect(() => {
      fetchProjects();
    }, [selectedTeam, searchStatus]);

    const fetchTeams = async () => {
      try {
        const response = await Axios.get('http://localhost:8080/api/v1/team-controller/getAllTeamsForUser', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTeams(response.data.data);
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
          const projects = response.data.data;
          console.log(projects);
          //(projects);
          projects.forEach((project: Project) => {
              addToMap(project.name, project.id);
          });
      } catch (error) {
          console.error('Error fetching projects:', error);
      }
  };

  function addToMap(projectName: string, projectID: string): void {
    const updatedMap = mapProjects;
    updatedMap.set(projectName, projectID);
    // Update the context state with the new map
    setMapProjects(updatedMap);
    console.log(mapProjects);      //setMapProjects(mapProjects);
  }

    const sendReq = (event: any) => {
        event.preventDefault();
        const token = localStorage.getItem('token'); 
        const javaStartDate = startDate ? new Date(startDate.toISOString().split('T')[0] + 'T' + startTime) : null;
        const javaDueDate = dueDate ? new Date(dueDate.toISOString().split('T')[0] + 'T' + endTime) : null;
        const pointsInt = parseInt(points, 10);

        const bodyParameters = {
            "name": taskName,
            "desc": description,
            "startDate": javaStartDate,
            "dueDate": javaDueDate,
            "points": pointsInt,
            "projectId": selectedProject,
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
                UpdateCalendar();
            }
        })
        .catch((error) => {
          console.error("There was an error!", error);
          console.log(selectedProject);
          console.log(selectedTeam);
        });
      }

      const teamOptions = teams.map((element) => ({
        label: element,
        value: element,
      }));

      const projectOptions = Array.from(mapProjects).map(([projectName, projectId]) => ({
        label: projectName,
        value: projectId,
      }));

      const handleToggle = () => {
        setSearchStatus(prevState => !prevState);
      }
    

    return (
        <div>
        <form onSubmit={sendReq}>
        <Select onChange={(choice: any) => setSelectedTeam(choice.value)} options={teamOptions} placeholder="Choose Your Team"/>
        <Select onChange={(choice: any) => setSelectedProject(choice.value)} options={projectOptions} placeholder="Choose Your Project" onMenuOpen={handleToggle}/>
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
          <TimePicker value={startTime} onChange={(e) => setStartTime(e)} clockIcon={null}/>
        </label>
        <br/>
        <label>
          End Date:
          <DatePicker selected={dueDate} onChange={(date: Date | null) => setDueDate(date)} />
          <TimePicker value={endTime} onChange={(e) => setEndTime(e)} clockIcon={null}/>
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
    );
}
