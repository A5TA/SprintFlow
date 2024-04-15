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

export const Colors = {
    data: {
        1: {color: "#2F3C7E", isUsed: false},
        2: {color: "#97BC62", isUsed: false},
        3: {color: "#2ca02c", isUsed: false},
        4: {color: "#E83A30", isUsed: false},
        5: {color: "#9467bd", isUsed: false},
        6: {color: "#8c564b", isUsed: false},
        7: {color: "#e377c2", isUsed: false},
        8: {color: "#7f7f7f", isUsed: false},
        9: {color: "#bcbd22", isUsed: false},
        10: {color: "#17becf", isUsed: false},
        11: {color: "#aec7e8", isUsed: false},
        12: {color: "#ffbb78", isUsed: false},
        13: {color: "#98df8a", isUsed: false},
        14: {color: "#ff9896", isUsed: false},
        15: {color: "#c5b0d5", isUsed: false},
        16: {color: "#c49c94", isUsed: false},
        17: {color: "#f7b6d2", isUsed: false},
        18: {color: "#c7c7c7", isUsed: false},
        19: {color: "#dbdb8d", isUsed: false}, 
        20: {color: "#9edae5", isUsed: false}
    } as { [key: number]: { color: string; isUsed: boolean } },

    get: function(id: number): { color: string; isUsed: boolean } | undefined {
        return this.data[id];
    },
    setUsed: function(id: number, isUsed: boolean): void {
        if (this.data[id]) {
            this.data[id].isUsed = isUsed;
        }
    }
};


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




