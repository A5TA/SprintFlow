import { Link } from "react-router-dom";
import { Box, Typography, Button, Grid } from "@mui/material";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { blue, purple } from "@mui/material/colors";
import Spline from '@splinetool/react-spline';

const theme = createTheme({
  palette: {
    primary: {
      main: blue[500],
    },
    secondary: {
      main: purple[500],
    },
  },
});

export default function Root() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        position="relative"
        minHeight="100vh"
        overflow="hidden" 
        bgcolor={"#666595"}
      >
        <Spline
          scene="https://prod.spline.design/koFVtn5wzzRWNqDy/scene.splinecode"
          style={{
            position: "absolute",
            top: 0,
            left: "25%",
            width: "100%",
            height: "100%",
            zIndex: 0,
            opacity: 100,
          }}
        />
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          py={8}
          zIndex={1} 
        >
          <Typography variant="h3" component="h1" color="primary" align="center" mb={4} zIndex={5}>
            Welcome to SprintFlow!
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                color="primary"
                size="large"
              >
                Login
              </Button>
            </Grid>
            <Grid item>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                color="secondary"
                size="large"
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
