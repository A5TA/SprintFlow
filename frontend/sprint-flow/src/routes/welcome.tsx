import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from "react-router-dom";  

const theme = createTheme();

export default function Welcome() {
    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md">
                <Box sx={{ textAlign: 'center', mt: 8 }}>
                    <Typography variant="h4" gutterBottom>
                        Let's get started
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item>
                            <Button component={Link} to="/calendar" variant="contained" color="primary">
                                Calendar
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button component={Link} to="/projects" variant="contained" color="secondary">
                                Projects
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </ThemeProvider>
    );
}