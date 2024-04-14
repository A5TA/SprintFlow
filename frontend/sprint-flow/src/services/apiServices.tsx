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


    return { handleLogout, handleNavigate, message, setMessage};

}

export default handleNavigates;

