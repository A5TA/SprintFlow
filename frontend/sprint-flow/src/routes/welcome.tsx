import { Link } from "react-router-dom";
export default function Welcome() {
return(
    <div>
    <li>
        <Link to="/calendar">Calendar</Link>
    </li>
    <li>
        <Link to="/projects">Projects</Link>
    </li>
    </div>

)
}
