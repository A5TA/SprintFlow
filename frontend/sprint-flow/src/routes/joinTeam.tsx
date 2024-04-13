import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box'
import { useNavigate } from 'react-router-dom';
import handleNavigates from '../services/apiServices';

const joinTeam = () => {
    const [teamName, setTeamName] = useState("");
    const navigate = useNavigate();
    const {handleNavigate, message, setMessage} = handleNavigates();
    const [allTeams, setAllTeams] = useState<string[]>([]);
    const [userTeams, setUserTeams] = useState<string[]>([]);

    const token = localStorage.getItem('token');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTeamName(event.target.value);
    }

    const fetchAllTeams = async () => {
      try {
        const response = await Axios.get('http://localhost:8080/api/v1/team-controller/getAllTeams', {
          headers: {
            Authorization: `Bearer ${token}`
          }
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
            Authorization: `Bearer ${token}`
          }
        });
        setUserTeams(response.data.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    const options = allTeams.filter(team => !userTeams.includes(team)).map((element) => ({
      label: element,
      value: element,
    }));

    useEffect(() => {
      fetchAllTeams();
      fetchUserTeams();
    }, []);

    const createTeamReq = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); 
        const token = localStorage.getItem('token');
    
        const config = {
          headers: { 
            Authorization: `Bearer ${token}`,
          }
        };
        
        Axios.post( 
          `http://localhost:8080/api/v1/team-controller/addUserToTeam/${teamName}`,
          {},
          config
        )
        .then((response) => {
          if(response.status === 200){
            console.log("You're good to go");
            navigate("/projects")
          }
        })
        .catch((error) => {
          setMessage("Error Joining Team. Please Try Again.");
        });
      }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("JUST JOINED THE TEAM", teamName)
        createTeamReq(event);
    }
    return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <div style={{position: 'absolute', top: 20, right: 20 }}>
        <button onClick={() => handleNavigate("/projects")}>
          Projects
        </button>
      </div>
      <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Roboto', mb: 2 }}>
        Join a Team
      </Typography>
      <Box>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
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
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Join Team
          </Button>
          <p style={{color: "red"}}>{message}</p>
        </form>
      </Box>
    </Box>
  );
};

export default joinTeam