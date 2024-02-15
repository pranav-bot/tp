// Home.jsx

import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container>
      <Typography variant="h3" align="center" sx={{ marginTop: 4, marginBottom: 4, color: '#FFFFFF' }}>
        Procument Chatbot
      </Typography>
      
      <Container sx={{ display: 'flex', justifyContent: 'center' }}>
        <Link to="/chatbot" style={{ textDecoration: 'none', marginRight: '20px' }}>
          <Button variant="contained" color="primary">
            Go to Chatbot
          </Button>
        </Link>

        <Link to="/pdf-search" style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary">
            Go to PDF Search
          </Button>
        </Link>
      </Container>
    </Container>
  );
};

export default Home;
