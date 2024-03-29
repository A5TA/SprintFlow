import * as React from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const theme = createTheme();

export const ForgotPassword = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Card sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CardContent>
            <Typography component="h1" variant="h5" align="center">
              Reset Password
            </Typography>
            <Typography variant="body2" align="center" gutterBottom>
              Please enter the email address that you used to register, and we will send you a link to reset your password via Email.
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Send Reset Link
              </Button>
            </form>
            <Typography variant="body2" align="center">
              <Link href="/login" variant="body2">
                Back to Sign In
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default ForgotPassword;