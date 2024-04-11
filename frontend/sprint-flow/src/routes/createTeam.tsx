import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import handleNavigates from '../services/apiServices';

const theme = createTheme();

export default function CTeam() {
  const {handleNavigate} = handleNavigates();
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }

  const sendReq = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };

    const bodyParameters = {
      "name": name
    };

    Axios.post(
      'http://localhost:8080/api/v1/team-controller/createTeamFromUser',
      bodyParameters,
      config
    )
      .then((response) => {
        if (response.status === 200) {
          console.log("Your team has been created successfully");
          navigate("/projects");
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }

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
      <div style={{position: 'absolute', top: 20, right: 20 }}>
        <button onClick={() => handleNavigate("/projects")}>
          Projects
        </button>
      </div>
          <Typography component="h1" variant="h5">
            Enter the name of your team
          </Typography>
          <Box component="form" onSubmit={sendReq} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Team Name"
              name="name"
              autoComplete="off"
              autoFocus
              value={name}
              onChange={onChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create Team
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
