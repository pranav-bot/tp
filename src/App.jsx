// App.jsx

import React from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import ChatbotPage from './pages/ChatbotPage';
import PdfSearchPage from './pages/PdfSearchPage';
import Home from './pages/Home';
import { AppBar, Container, CssBaseline, Toolbar, Typography, createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000080', // Dark Blue
    },
    background: {
      default: '#000000', // Midnight Black
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <AppBar position="sticky">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              My Website
            </Typography>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography variant="h6" color="inherit" noWrap>
                Home
              </Typography>
            </Link>
            <Link to="/chatbot" style={{ textDecoration: 'none', color: 'inherit', marginLeft: '20px' }}>
              <Typography variant="h6" color="inherit" noWrap>
                Chatbot
              </Typography>
            </Link>
            <Link to="/pdf-search" style={{ textDecoration: 'none', color: 'inherit', marginLeft: '20px' }}>
              <Typography variant="h6" color="inherit" noWrap>
                Search Engine
              </Typography>
            </Link>
          </Toolbar>
        </AppBar>

        <Container sx={{ marginTop: 8 }}>
          <Routes>
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/pdf-search" element={<PdfSearchPage />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

export default App;
