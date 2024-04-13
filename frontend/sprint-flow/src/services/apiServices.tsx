import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { Project } from "../routes/projects";

const handleNavigates = () => {

    const navigate = useNavigate();

    const handleLogout = (event: any) => {
        event.preventDefault();
        localStorage.clear();
        navigate("/");
    }

    const handleNavigate = (link: string) => {
        navigate(link);
    }

    const [message, setMessage] = useState("");
    



    const fetchProjectss =  async(selectedTeam: string):Promise<any> => {

        const token = localStorage.getItem("token");
        const [mapProjects, setMapProjects] = useState(new Map<string, string>());
        const [expandedProjects, setExpandedProjects] = useState<{ [key: string]: boolean }>({});


        function addToMap(projectName: string, projectID: string): void {
            const updatedMap = mapProjects;
            updatedMap.set(projectName, projectID);
            // Update the context state with the new map
            setMapProjects(updatedMap);
            console.log(mapProjects);      //setMapProjects(mapProjects);
          }

          const fetchAllUsersOnTeam = async () => {
            try {
                const response = await Axios.get(`http://localhost:8080/api/v1/team-controller/getAllUsersForTeam/${selectedTeam}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // console.log("Users are:", response)
                // setEmailList(response.data.data)
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
          };

        console.log("gettingp projects for ", selectedTeam)
        try {
            mapProjects.clear();
            const response = await  Axios.get(`http://localhost:8080/api/v1/project-controller/getAllProjectsForTeam/${selectedTeam}`, {
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
            // Update projectNamesArr after setting projects
            const initialExpandedState: { [key: string]: boolean } = {};
            projects.forEach((project: Project) => {
                initialExpandedState[project.id] = false;
            });
            setExpandedProjects(initialExpandedState);
            fetchAllUsersOnTeam(); //we need to show all the users on the team
        } catch (error) {
            console.error('Error fetching projects:', error);
        }

        return mapProjects;
      };

    return { handleLogout, handleNavigate, message, setMessage, fetchProjectss };

}

export default handleNavigates;

