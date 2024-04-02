import { Link } from "react-router-dom";
import { Box, Typography, Button, Grid } from "@mui/material";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { blue, purple } from "@mui/material/colors";

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
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        
      >
        <Box mb={4}>
          <Typography variant="h3" component="h1" color="primary" align="center">
            Welcome to SprintFlow!
          </Typography>
        </Box>
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
    </ThemeProvider>
  );
}
