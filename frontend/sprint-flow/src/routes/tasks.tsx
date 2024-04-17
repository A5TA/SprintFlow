import { useEffect, useState } from "react";
import Axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from '@mui/material/Select';
import 'react-select-search/style.css'
import { Project } from "./projects";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import handleNavigates from "../services/apiServices";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

export default function CTasks({UpdateCalendar, UpdateModal}) {
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [taskName, setTaskName] = useState("");
    const [points, setPoints] = useState("");
    const [teams, setTeams] = useState<string[]>([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [selectedProject, setSelectedProject] = useState('');
    const [mapProjects, setMapProjects] = useState(new Map<string, string>());
    const token = localStorage.getItem('token');
    const [startTime, setStartTime] = useState<string>('10:00');
    const [endTime, setEndTime] = useState<string>('10:00');
    const {message, setMessage} = handleNavigates();

    
    const handleDescription = (event: any) => {
        setDescription(event.target.value);
    }
    const handleTaskName = (event: any) => {
        setTaskName(event.target.value);
    }
    const handlePoints = (event: any) => {
        setPoints(event.target.value);
    }

    useEffect(() => {
      fetchTeams();
    }, []);

    useEffect(() => {
      fetchProjects();
    }, [selectedTeam]);

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
      mapProjects.clear();
      try {
          const response = await Axios.get(`http://localhost:8080/api/v1/project-controller/getAllProjectsForTeam/${selectedTeam}`, {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
          const projects = response.data.data;
          projects.forEach((project: Project) => {
              addToMap(project.name, project.id);
          });
      } catch (error) {
          console.error('Error fetching projects:', error);
      }
  };

  function addToMap(projectName: string, projectID: string): void {
    setMapProjects(prevMap => {
      const updatedMap = new Map(prevMap);
      updatedMap.set(projectName, projectID);
      return updatedMap;
  });      //setMapProjects(mapProjects);
  }

    const sendReq = (event: any) => {
        event.preventDefault();
        const javaStartDate = startDate ? new Date(startDate.toISOString().split('T')[0] + 'T' + startTime) : null;
        const javaDueDate = dueDate ? new Date(dueDate.toISOString().split('T')[0] + 'T' + endTime) : null;
        const pointsInt = parseInt(points, 10);

        var [startHours, startMins] = startTime.split(":");
    var [endHours, endMins] = endTime.split(":");

    const startTimeInt = (parseInt(startHours) * 60) + parseInt(startMins);
    const endTimeInt = (parseInt(endHours) * 60) + parseInt(endMins);

    const startTimeMs = startDate!?.getTime();
    const dueTimeMs = dueDate!?.getTime();
    const difInMs = dueTimeMs - startTimeMs;
    const difInDays = difInMs / (1000 * 3600 * 24);


    if (endTimeInt - startTimeInt <= 60 && difInDays < 1){
      setMessage("Task needs to be longer than 1 hour");
      return;
    }

        const bodyParameters = {
            "name": taskName,
            "desc": description,
            "startDate": javaStartDate,
            "dueDate": javaDueDate,
            "points": pointsInt,
            "projectId": mapProjects.get(selectedProject),
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
                UpdateModal();
                UpdateCalendar();
            }
        })
        .catch((error) => {
          setMessage("Error Creating Task. Please Try Again.");
        });
      }

      const handleTeamChange = (event: any) => {
        setSelectedTeam(event.target.value);
      };
    
      const handleProjectChange = (event: any) => {
        setSelectedProject(event.target.value);
      };

    return (
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
              <FormControl fullWidth sx={{marginBottom: "15px"}}>
                  <InputLabel> Select Team</InputLabel>
                  <Select value={selectedTeam} onChange={handleTeamChange}>
                  {teams.map((team: string, index: number) => (
                    <MenuItem key={index} value={team}>{team}</MenuItem>
                  ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Select Project</InputLabel>
                  <Select value={selectedProject} onChange={handleProjectChange}>
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
                  <p style={{color: "red"}}>{message}</p>
              </Grid>
            </Grid>
          </form>  
    </Box>
    );
}



