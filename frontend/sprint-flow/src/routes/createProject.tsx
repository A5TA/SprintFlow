import React, { useState, useEffect } from 'react';
import { Box, Button, Container, TextField, Typography, TextFieldProps } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {DatePicker} from '@mui/lab';
import AdapterDayjs from '@mui/lab/AdapterDayjs';
import Select from 'react-select';
import 'react-select-search/style.css'

const theme = createTheme();

const CreateProject = () => {
  const [teamName, setTeamName] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [projectName, setProjectName] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [data, setData] = useState<string[]>([]);

  const projectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(event.target.value);
  }

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

  useEffect(() => {
    fetchTeams();
  }, []);

  const createReq = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const javaStartDate = startDate ? new Date(startDate.getTime()) : null;
    const javaEndDate = endDate ? new Date(endDate.getTime()) : null;

    const bodyParameters = {
      name: projectName,
      startDate: javaStartDate,
      endDate: javaEndDate,
      teamName: teamName,
    };

    Axios.post(
      'http://localhost:8080/api/v1/project-controller/createProject',
      bodyParameters,
      config
    )
      .then((response) => {
        if (response.status === 200) {
          console.log("You're good to go");
          navigate('/projects');
        }
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  const handleSaveAndSend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createReq(event);
  };

  const options = data.map((element) => ({
    label: element,
    value: element,
  }));
  
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Enter Project Details
          </Typography>
          <Box component="form" onSubmit={handleSaveAndSend} sx={{ mt: 1 }}>
          <Select onChange={(choice: any) => setTeamName(choice.value)} options={options} placeholder="Choose Your Team"/>
            {/* <TextField
              margin="normal"
              required
              fullWidth
              id="teamName"
              label="Team Name"
              name="teamName"
              autoComplete="off"
              autoFocus
              value={teamName}
              onChange={teamNameChange}
            /> */}
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newDate: Date | null) => setStartDate(newDate)}
              renderInput={(params: TextFieldProps) => <TextField {...params} />}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newDate: Date | null) => setEndDate(newDate)}
              renderInput={(params: TextFieldProps) => <TextField {...params} />}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="projectName"
              label="Project Name"
              name="projectName"
              autoComplete="off"
              value={projectName}
              onChange={projectChange}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Create Project
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};


export default CreateProject;
