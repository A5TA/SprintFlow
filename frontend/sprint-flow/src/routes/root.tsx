import { Link } from "react-router-dom"
export default function Root() {
return(
    <div>
    <li>
        <Link to="/calendar">Calendar</Link>
    </li>
    <li>
        <Link to="/createTeam">Create Team</Link>
    </li>
    <li>
        <Link to="/login">Login</Link>
    </li>
    <li>
        <Link to="/register">Register</Link>
    </li>
    </div>
)
}
