import { Link, useNavigate } from "react-router-dom"; 
export default function Welcome() {
    const navigate = useNavigate();
    const handleLogout = (event: any) => {
        event.preventDefault();
        localStorage.clear();
        navigate("/");

    }
return(

    
    <div>
    <li>
        <Link to="/calendar">Calendar</Link>
    </li>
    <li>
        <Link to="/projects">Projects</Link>
    </li>
    <div style={{position: 'absolute', top: 20, right: 20 }}>
        <button onClick={handleLogout}>
            Logout
        </button>
    </div>
    </div>

)
}
