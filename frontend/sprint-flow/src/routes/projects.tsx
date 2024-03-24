import Axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Projects() {
  const [selectedTeam, setSelectedTeam] = useState("");
  const token = localStorage.getItem('token');
  const [data, setData] = useState([]);
  const [projects, setProjects] = useState([]);

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
    if (selectedTeam !== "") {
      fetchProjects();
    }
  }, [selectedTeam]);

  const handleTeamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeam(event.target.value);
  }

  return (
    <div>
      <div>
        <h2>Current Teams:</h2>
        <ul>
          {data.map((team: any, index: number) => (
            <li key={index}>{team}</li>
          ))}
        </ul>
        <Link to="/projects/createTeam">Create Team</Link>
        <div>
          <label>Select Team:</label>
          <select onChange={handleTeamChange}>
            <option value="">Select Team</option>
            {data.map((team: any, index: number) => (
              <option key={index} value={team}>{team}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <h2>Current Projects:</h2>
        {projects.length > 0 ? (
          <ul>
            {projects.map((project: any, index: number) => (
              <li key={index}>{project.name}</li>
            ))}
          </ul>
        ) : (
          <p>No projects available for the selected team</p>
        )}
        <Link to="/projects/createProject">Create Project</Link>
      </div>
    </div>
  );
}
