import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from "react-router-dom";  
import handleNavigates from '../services/apiServices';
import Paper from '@mui/material/Paper';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import GroupIcon from '@mui/icons-material/Group';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import EmailIcon from '@mui/icons-material/Email';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const theme = createTheme();

export default function Welcome() {
    const { handleLogout } = handleNavigates();

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bgcolor: 'white', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
                {/* Navigation Header */}
                <Container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: 20, width: '100%' }}>
                <Typography variant="h6" color={'black'} gutterBottom fontWeight="bold" sx={{background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',}}>
                            SprintFlow
                         </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                        <Button color="inherit" onClick={() => scrollToSection('home')}>Home</Button>
                        <Button color="inherit" onClick={() => scrollToSection('features')}>Features</Button>
                        <Button color="inherit" onClick={() => scrollToSection('about')}>About</Button>
                        <Button color="inherit" onClick={() => scrollToSection('services')}>Services</Button>
                        <Button color="inherit" onClick={() => scrollToSection('team')}>Team</Button>
                    </Box>
                    <Button color="inherit" onClick={handleLogout} sx={{ whiteSpace: 'nowrap', border: `1px solid ${theme.palette.primary.main}`, borderRadius: '5px', padding: '5px 10px', '&:hover': { backgroundColor: theme.palette.primary.main, color: 'white' } }}>Logout</Button>
                </Container>
            </Box>

            {/* Content */}
            <Box>
                {/* Home Section */}
                <Box id="home" sx={{ width: '100%', height: '100vh', bgcolor: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', position: 'relative' }}>
                    {/* Outer Oval Container */}
                    <Box sx={{ position: 'absolute', zIndex: 10, width: '90%', height: '60%', borderRadius: '100%', border: '1px solid', borderColor: '#9c27b0', backgroundColor: 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center',  transition: 'transform 0.3s','&:hover': {transform: 'scale(1.01)'},}}>
                        {/* Inner Oval Container */}
                        <Box sx={{ position: 'relative', zIndex: 20, width: '90%', height: '92%', borderRadius: '100%', border: '2px solid', borderColor: '#2196f3', backgroundColor: 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'transform 0.3s','&:hover': {transform: 'scale(1.02)'}, }}>
                            {/* Content */}
                            <Container sx={{ textAlign: 'center' }}>
                                <Typography sx={{ color: 'primary' }} variant="h2" gutterBottom mt={2}>
                                    Welcome to our&nbsp;
                                    <Typography variant="h2" component="span" sx={{ borderBottom: `3px solid`, backgroundImage: 'linear-gradient(to right, #2196f3, #21cbf3)', paddingBottom: '2px', color: 'white', fontWeight: 'bold' }}>
                                        Agile Calendar!
                                    </Typography>
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom sx={{ marginX: 'auto', maxWidth: '80%' }}>
                                    Welcome to our SprintFlow project, based on an Agile Calendar designed for development teams. Our goal is to improve the efficiency and organization of the different processes in developing any project. Let's get started!
                                </Typography>
                                <Grid container spacing={2} justifyContent="center" mt={2}>
                                    <Grid item>
                                        <Button component={Link} to="/calendar" variant="contained" sx={{ backgroundImage: 'linear-gradient(to right, #2196f3, #21cbf3)', color: 'white', padding: '12px 24px', fontSize: '1.2rem' }}>
                                            Calendar
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button component={Link} to="/projects" variant="contained" sx={{ backgroundImage: 'linear-gradient(to right, #673ab7, #ff4081)', color: 'white', padding: '12px 24px', fontSize: '1.2rem' }}>
                                            Projects
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Container>
                        </Box>
                    </Box>

                    {/* Arrow Down Section */}
                    <Box sx={{ position: 'absolute', bottom: '30px' }}>
                        <Button onClick={() => scrollToSection('features')}>
                            <ArrowDownwardIcon sx={{ fontSize: 40 }} />
                        </Button>
                    </Box>
                </Box>

                {/* Additional Sections */}
                <Box id="features" sx={{
    width: '100%',
    height: '100vh',
    background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    
}}>
    <Container sx={{ textAlign: 'center', mb: 9 }}>
        <Typography variant="h2" color={'white'} gutterBottom fontWeight="bold">
            Features
        </Typography>
        <Typography variant="subtitle1" gutterBottom color={'white'}>
            Check out all of the features
        </Typography>
    </Container>
  <Grid container spacing={3} sx={{ width: '100%', maxWidth: 1200, height: 300 }}>
    {/* Feature 1 */}
    <Grid item xs={12} md={6} lg={3}>
      <Paper
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'white',
          height: '100%',
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0px 5px 20px 0px rgba(0,0,0,0.1)',
          },
        }}
      >
        <Typography variant="h4" gutterBottom color="primary.main" fontWeight="bold" align='center' mt={2} sx={{
          background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Explore the Calendar
        </Typography>
        <Typography variant="body1" align='center' >
        Check the calendar and organize it to your preference, move and choose dates for each of your duties.
        </Typography>
        {/* Icon */}
        <CalendarMonthIcon color="primary" sx={{ fontSize: 50, display: 'block', margin: 'auto', mt: 5, background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
      </Paper>
    </Grid>
    {/* Feature 2 */}
    <Grid item xs={12} md={6} lg={3}>
      <Paper
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'white',
          height: '100%',
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0px 5px 20px 0px rgba(0,0,0,0.1)',
          },
        }}
      >
        <Typography variant="h4" gutterBottom color="primary.main" fontWeight="bold" align='center' mt={4} sx={{
          background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Work in Teams
        </Typography>
        <Typography variant="body1" align='center' mt={3}>
        Create or simply join a previously created team with your teammates to progress together.
        </Typography>
        {/* Icon */}
        <GroupsIcon color="primary" sx={{ fontSize: 50, display: 'block', margin: 'auto', mt: 7, background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
      </Paper>
    </Grid>
    {/* Feature 3 */}
    <Grid item xs={12} md={6} lg={3}>
      <Paper
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'white',
          height: '100%',
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0px 5px 20px 0px rgba(0,0,0,0.1)',
          },
        }}
      >
        <Typography variant="h4" gutterBottom color="primary.main" fontWeight="bold" align='center' mt={4} sx={{
          background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Create Projects
        </Typography>
        <Typography variant="body1" align='center' mt={3}>
        What is your goal? Create a project to visualize is on the calendar and start working on it with your teammates.
        </Typography>
        {/* Icon */}
        <LibraryBooksIcon color="primary" sx={{ fontSize: 50, display: 'block', margin: 'auto', mt: 7, background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
      </Paper>
    </Grid>
    {/* Feature 4 */}
    <Grid item xs={12} md={6} lg={3}>
      <Paper
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'white',
          height: '100%',
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0px 5px 20px 0px rgba(0,0,0,0.1)',
          },
        }}
      >
        <Typography variant="h4" gutterBottom color="primary.main" fontWeight="bold" align='center' mt={4} sx={{
          background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Assign Tasks
        </Typography>
        <Typography variant="body1" align='center' mt={3}>
        For any of your projects, create the tasks you need to accomplish for specific dates in your calendar.
        </Typography>
        {/* Icon */}
        <DriveFileRenameOutlineIcon color="primary" sx={{ fontSize: 50, display: 'block', margin: 'auto', mt: 7, background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
      </Paper>
    </Grid>
  </Grid>
</Box>

<Box id="about" sx={{ width: '100%', height: '100vh', bgcolor: '#ffffff', display: 'flex', alignItems: 'center' }}>
    <Container sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexBasis: '50%', pr: 4 }}>
            <Typography variant="h2" gutterBottom fontWeight= "bold">
                About Us
            </Typography>
            <Typography variant="subtitle1" color="secondary.main" gutterBottom>
                Who we are
            </Typography>
            <Typography variant="body1">
            We are Computer Science majors at Nova Southeastern University taking a Software Engineering class. For our final project, our goal was to create a valuable and accessible agile calendar for all types of workgroups. We worked on creating databases with PostgreSQL, creating a backend framework with Java Springbboot, and user-accessible frontend with React, with the use of Material UI libraries. With all this work, we have obtained this result. We hope you like it and that it is helpful!
            </Typography>
        </Box>
        <Box sx={{ flexBasis: '50%', display: 'flex', justifyContent: 'center' }}>
            <Box
                sx={{
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    backgroundImage: 'linear-gradient(45deg, #673ab7, #ff4081)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden', 
                }}
            >
                <img
                    src="https://react-landing-page-template-93ne.vercel.app/img/about.jpg"
                    alt="About Us"
                    style={{
                        width: '90%', 
                        height: '90%',
                        borderRadius: '90%',
                    }}
                />
            </Box>
        </Box>
    </Container>
</Box>

<Box id="services" sx={{ width: '100%', height: '100vh', bgcolor: '#f5f5f5', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
    {/* Services Section Content */}
    <Container sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h2" gutterBottom color="primary.main" fontWeight="bold">
            Our Services
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
            Explore our range of services
        </Typography>
    </Container>
    <Grid container spacing={5} justify="center" alignItems="center">
        {/* Service 1 */}
        <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box
                    sx={{
                        width: 140,
                        height: 140,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        transition: 'transform 0.3s',
                        '&:hover': { transform: 'scale(1.1)' },
                    }}
                >
                    {/* Icon */}
                    <CheckCircleOutlineIcon sx={{ fontSize: 80, color: '#fff' }} />
                </Box>
                {/* Title */}
                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 3 }}>
                    Task completion
                </Typography>
                {/* Description */}
                <Typography variant="body1" sx={{ maxWidth: 300 }}>
                With our precise system of teams, projects and tasks, you can view and complete your tasks in an efficient and intuitive way.
                </Typography>
            </Box>
        </Grid>
        {/* Service 2 */}
        <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box
                    sx={{
                        width: 140,
                        height: 140,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        transition: 'transform 0.3s',
                        '&:hover': { transform: 'scale(1.1)' },
                    }}
                >
                    {/* Icon */}
                    <GroupIcon sx={{ fontSize: 80, color: '#fff' }} />
                </Box>
                {/* Title */}
                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 3 }}>
                    Shared data
                </Typography>
                {/* Description */}
                <Typography variant="body1" sx={{ maxWidth: 300 }}>
                With the data shared among your teammates you will be able to see changes and updates they have done.
                </Typography>
            </Box>
        </Grid>
        {/* Service 3 */}
        <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box
                    sx={{
                        width: 140,
                        height: 140,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        transition: 'transform 0.3s',
                        '&:hover': { transform: 'scale(1.1)' },
                    }}
                >
                    {/* Icon */}
                    <CloudDoneIcon sx={{ fontSize: 80, color: '#fff' }} />
                </Box>
                {/* Title */}
                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 3 }}>
                    Online database
                </Typography>
                {/* Description */}
                <Typography variant="body1" sx={{ maxWidth: 300 }}>
                  With our database you will have all the data stored and updated, all changes will be saved for the future.
                </Typography>
            </Box>
        </Grid>
    </Grid>
</Box>


<Box id="team" sx={{ width: "100%", height: "100vh", background: "linear-gradient(45deg, #673ab7, #ff4081)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "white" }}>
  {/* Team Section Content */}
  <Container sx={{ textAlign: "center", mb: 8 }}>
    <Typography variant="h2" gutterBottom fontWeight="bold">
      Meet the Team
    </Typography>
    <Typography variant="subtitle1" gutterBottom>
      Get to know the people behind our project
    </Typography>
  </Container>
  <Grid container spacing={3} justifyContent="center">
    {/* Team Member 1 */}
    <Grid item xs={12} sm={6} md={4}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Box
          sx={{
            width: 170,
            height: 170,
            borderRadius: 5,
            overflow: "hidden",
            transition: "transform 0.3s",
          }}
        >
          {/* Profile Picture */}
          <img
            src="https://i.pinimg.com/564x/73/40/f3/7340f34d99606e6d8257143d7efadeb5.jpg"
            alt="Team Member 1"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
        {/* Name */}
        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 3 }}>
          Brandon Cardillo
        </Typography>
        {/* Description */}
        <Typography variant="body1" sx={{ maxWidth: 300 }}>
          Database contributor.
        </Typography>
        {/* Email */}
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <EmailIcon sx={{ mr: 1 }} />
          <Typography variant="body2">
            <a href="mailto:bc1505@mynsu.nova.edu" style={{ textDecoration: "none", color: "inherit"}}>
              bc1505@mynsu.nova.edu
            </a>
          </Typography>
        </Box>
      </Box>
    </Grid>
    {/* Team Member 2 */}
    <Grid item xs={12} sm={6} md={4}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Box
          sx={{
            width: 170,
            height: 170,
            borderRadius: 5,
            overflow: "hidden",
            transition: "transform 0.3s",
          }}
        >
          {/* Profile Picture */}
          <img
            src="https://i.pinimg.com/564x/9b/e9/f9/9be9f9075ee7b58069eb9c817eb81d1b.jpg"
            alt="Team Member 2"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
        {/* Name */}
        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 3 }}>
          Faris Allaf
        </Typography>
        {/* Description */}
        <Typography variant="body1" sx={{ maxWidth: 300 }}>
          Backend contributor.
        </Typography>
        {/* Email */}
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <EmailIcon sx={{ mr: 1 }} />
          <Typography variant="body2">
            <a href="mailto:fa586@mynsu.nova.edu" style={{ textDecoration: "none", color: "inherit" }}>
              fa586@mynsu.nova.edu
            </a>
          </Typography>
        </Box>
      </Box>
    </Grid>
    {/* Team Member 3 */}
    <Grid item xs={12} sm={6} md={4}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Box
          sx={{
            width: 170,
            height: 170,
            borderRadius: 5,
            overflow: "hidden",
            transition: "transform 0.3s",
          }}
        >
          {/* Profile Picture */}
          <img
            src="https://i.pinimg.com/564x/3d/cd/4a/3dcd4af5bc9e06d36305984730ab7888.jpg"
            alt="Team Member 3"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
        {/* Name */}
        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 3 }}>
          Inigo Marina
        </Typography>
        {/* Description */}
        <Typography variant="body1" sx={{ maxWidth: 300 }}>
          Frontend contributor
        </Typography>
        {/* Email */}
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <EmailIcon sx={{ mr: 1 }} />
          <Typography variant="body2">
            <a href="mailto:im699@mynsu.nova.edu" style={{ textDecoration: "none", color: "inherit" }}>
              im699@mynsu.nova.edu
            </a>
          </Typography>
        </Box>
      </Box>
    </Grid>
  </Grid>
</Box>


<Box id="get-started" sx={{ width: '100%', height: '50vh', bgcolor: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <Container>
        <Typography variant="h2" gutterBottom fontWeight="bold" textAlign="center">
            Ready to get <Typography variant="h2" component="span" sx={{ background: 'linear-gradient(45deg, #673ab7, #ff4081)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>started?</Typography>
        </Typography>
        <Typography variant="subtitle1" gutterBottom textAlign="center">
         Start by going to the calendar or creating a project for your team
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }} mt={5}>
            <Button onClick={() => scrollToSection('home')} variant="contained" sx={{ backgroundImage: 'linear-gradient(to right, #2196f3, #21cbf3)', color: 'white', padding: '12px 24px', fontSize: '1.2rem' }}>
                Go
            </Button>
        </Box>
    </Container>
</Box>

</Box>
</ThemeProvider>     
            </Container>
        </ThemeProvider>

    );
}