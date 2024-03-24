import { Link } from "react-router-dom"
export default function Root() {
return(

<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
<header style={{ marginTop: 0 }}>
  <h1>Welcome to SprintFlow!</h1>
</header>
<div style={{ marginTop: '20px' }}>
  <ul>
    <li>
      <Link to="/login">Login</Link>
    </li>
    <li>
      <Link to="/register">Register</Link>
    </li>
  </ul>
</div>
</div>
)
}
