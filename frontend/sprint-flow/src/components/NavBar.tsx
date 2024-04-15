import { AppBar, Box, Button, Container, Toolbar, Typography, createTheme } from "@mui/material"
import handleNavigates from "../services/apiServices";

const theme = createTheme();

const NavBar = () => {
    const { handleLogout, handleNavigate} = handleNavigates();

  return (
      <Box sx={{ position: 'relative', top: 0, left: 0, right: 0, bgcolor: 'white', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', py: 1.5, borderBottom: `1px solid ${theme.palette.primary.main}`}}>
                {/* Navigation Header */}
                <Container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: 20, width: '100%' }}>
                <Typography variant="h6" color={'black'} gutterBottom fontWeight="bold" sx={{background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',}}>
                            SprintFlow
                         </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                        <Button color="inherit" onClick={() => handleNavigate("/main")}>Home</Button>
                        <Button color="inherit" onClick={() => handleNavigate("/calendar")}>Calendar</Button>
                        <Button color="inherit" onClick={() => handleNavigate("/projects")}>Projects</Button>
                    </Box>
                </Container>
                <Button color="inherit" onClick={handleLogout} sx={{ mr: 10, whiteSpace: 'nowrap', border: `1px solid ${theme.palette.primary.main}`, borderRadius: '5px', padding: '5px 10px', '&:hover': { backgroundColor: theme.palette.primary.main, color: 'white' } }}>Logout</Button>

            </Box>
  )
}

export default NavBar