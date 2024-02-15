import React from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import ChatbotPage from './pages/ChatbotPage';
import PdfSearchPage from './pages/PdfSearchPage';
import Home from './pages/Home';
import { AppBar, Container, CssBaseline, Toolbar, Typography, createTheme, ThemeProvider, Button, Divider } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#303234', // Adjusted main color
    },
    background: {
      default: '#101820', // Charcoal black background
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <div style={{
          background: '#101820', // Charcoal black background
          minHeight: '100vh',
          paddingTop: '50px', // Adjust as per your layout
        }}>
          <div style={{
            position: 'absolute',
            top: '20px', // Adjust the spacing from the top as needed
            left: '50%',
            transform: 'translateX(-50%)',
            width: '30%',
            height:'43px', // Adjust the width as needed
            zIndex: 999, // Ensure the app bar is above other content
          }}>
            <AppBar position="static" color="transparent" sx={{
              backgroundColor: '#8B8000', // Bright yellow background for the navbar
              borderRadius: '20px', // Adjust the border radius for curved edges
              padding: '0 15px', // Adjust the padding for smaller size
              height: '43px', // Adjust the height of the navbar
            }}>
              <Toolbar sx={{ justifyContent: 'center', minHeight: 'auto' }}>
                <Button
                  component={Link}
                  to="/"
                  variant="text"
                  sx={{
                    textDecoration: 'none',
                    color: '#303234',
                    fontSize: '0.8rem', // Adjust the font size
                    textTransform: 'none', // Disable text transformation
                    lineHeight: 1, 
                    alignSelf:'center',
                    paddingBottom:'25px'// Set line height to 1
                  }}
                >
                  <Typography variant="body1" color="inherit" noWrap sx={{fontSize:'1.5rem'}}>
                    Home
                  </Typography>
                </Button>
                <Divider orientation="vertical" flexItem sx={{ marginX: 1, bgcolor: 'grey', height: '43px', alignSelf: 'stretch' }} />
                <Button
                  component={Link}
                  to="/chatbot"
                  variant="text"
                  sx={{
                    textDecoration: 'none',
                    color: '#303234',
                    fontSize: '0.8rem', // Adjust the font size
                    textTransform: 'none', // Disable text transformation
                    lineHeight: 1,
                    alignSelf:'center',
                    paddingBottom:'25px' // Set line height to 1
                  }}
                >
                  <Typography variant="body1" color="inherit" noWrap sx={{fontSize:'1.5rem'}} >
                    Chatbot
                  </Typography>
                </Button>
                <Divider orientation="vertical" flexItem sx={{ marginX: 1, bgcolor: 'grey', height: '43px', alignSelf: 'stretch' }} />
                <Button
                  component={Link}
                  to="/pdf-search"
                  variant="text"
                  sx={{
                    textDecoration: 'none',
                    color: '#101820',
                    fontSize: '0.8rem', // Adjust the font size
                    textTransform: 'none', // Disable text transformation
                    lineHeight: 1,
                    alignSelf:'center' ,
                    paddingBottom:'25px'// Set line height to 1
                  }}
                >
                  <Typography variant="body1" color="inherit" noWrap sx={{fontSize:'1.5rem'}}>
                    Search
                  </Typography>
                </Button>
              </Toolbar>
            </AppBar>
          </div>
          <Container sx={{ marginTop: 8 }}>
            <div id="particles-js"></div>
            <Routes>
              <Route path="/chatbot" element={<ChatbotPage />} />
              <Route path="/pdf-search" element={<PdfSearchPage />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </Container>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
