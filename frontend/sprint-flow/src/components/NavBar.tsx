import { AppBar, Button, Toolbar } from "@mui/material"
import handleNavigates from "../services/apiServices";

const NavBar = () => {
    const { handleLogout, handleNavigate} = handleNavigates();

  return (
    <AppBar position="static" sx={{ bgcolor: "#1976d2" }}>
      <Toolbar>
        <div style={{ flexGrow: 1 }}>
          <Button color="inherit" onClick={() => handleNavigate("/main")}>
            Home
          </Button>
          <Button color="inherit" onClick={() => handleNavigate("/calendar")}>
            Calendar
          </Button>
          <Button color="inherit" onClick={() => handleNavigate("/projects")}>
            Projects
          </Button>
        </div>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default NavBar