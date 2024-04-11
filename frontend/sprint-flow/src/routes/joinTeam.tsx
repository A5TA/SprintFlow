import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

const JoinTeam = () => {
  const [teamName, setTeamName] = useState('');
  const navigate = useNavigate();
  const [allTeams, setAllTeams] = useState<string[]>([]);
  const [userTeams, setUserTeams] = useState<string[]>([]);

  const token = localStorage.getItem('token');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(event.target.value);
  };

  const fetchAllTeams = async () => {
    try {
      const response = await Axios.get('http://localhost:8080/api/v1/team-controller/getAllTeams', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllTeams(response.data.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchUserTeams = async () => {
    try {
      const response = await Axios.get('http://localhost:8080/api/v1/team-controller/getAllTeamsForUser', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserTeams(response.data.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  useEffect(() => {
    fetchAllTeams();
    fetchUserTeams();
  }, []);

  // Merge allTeams and userTeams, then filter out duplicates
  const options = Array.from(new Set([...allTeams, ...userTeams])).map((element) => ({
    label: element,
    value: element,
  }));

  const createTeamReq = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = localStorage.getItem('token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    Axios.post(`http://localhost:8080/api/v1/team-controller/addUserToTeam/${teamName}`, {}, config)
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createTeamReq(event);
  };

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Roboto', mb: 2 }}>
        Join a Team
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <form onSubmit={handleSubmit}>
          <Select value={teamName} onChange={(event) => setTeamName(event.target.value)} displayEmpty>
            <MenuItem value="" disabled>
              Choose Your Team
            </MenuItem>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="teamName"
            label="Team Name"
            name="teamName"
            autoComplete="teamName"
            autoFocus
            value={teamName}
            onChange={(event) => setTeamName(event.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Join Team
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default JoinTeam;
