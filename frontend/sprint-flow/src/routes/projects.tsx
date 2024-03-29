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
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }

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
  );
}
