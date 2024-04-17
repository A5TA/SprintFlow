import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { Project } from "../routes/projects";

interface FetchTeamsArgs {
    token: string | null;
    setData: React.Dispatch<React.SetStateAction<string[]>>; 
  }


export const fetchTeams = async ({token, setData}: FetchTeamsArgs) => {
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

  export enum Colors {
    Color1 = 1,
    Color2,
    Color3,
    Color4,
    Color5,
    Color6,
    Color7,
    Color8,
    Color9,
    Color10,
    Color11,
    Color12,
    Color13,
    Color14,
    Color15,
    Color16,
    Color17,
    Color18,
    Color19,
    Color20
}

// Reverse mapping object
const ColorMap: { [key: number]: string } = {
    [Colors.Color1]: "#2F3C7E",
    [Colors.Color2]: "#97BC62",
    [Colors.Color3]: "#2ca02c",
    [Colors.Color4]: "#E83A30",
    [Colors.Color5]: "#9467bd",
    [Colors.Color6]: "#8c564b",
    [Colors.Color7]: "#e377c2",
    [Colors.Color8]: "#7f7f7f",
    [Colors.Color9]: "#bcbd22",
    [Colors.Color10]: "#17becf",
    [Colors.Color11]: "#aec7e8",
    [Colors.Color12]: "#ffbb78",
    [Colors.Color13]: "#98df8a",
    [Colors.Color14]: "#ff9896",
    [Colors.Color15]: "#c5b0d5",
    [Colors.Color16]: "#c49c94",
    [Colors.Color17]: "#f7b6d2",
    [Colors.Color18]: "#c7c7c7",
    [Colors.Color19]: "#dbdb8d",
    [Colors.Color20]: "#9edae5"
};

export function getColorById(id: number): string | undefined {
    return ColorMap[id];
}




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


    return { handleLogout, handleNavigate, message, setMessage};

}

export default handleNavigates;




