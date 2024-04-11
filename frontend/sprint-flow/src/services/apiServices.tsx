import { useNavigate } from "react-router-dom";

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

    return { handleLogout, handleNavigate };

}

export default handleNavigates;

