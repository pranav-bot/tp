// Chatbot.jsx

import React, { useState } from 'react';
import { TextField, Button, Container, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';

const ChatContainer = styled('div')({
  backgroundColor: '#87CEEB', // Light blue
  padding: '20px',
  borderRadius: '10px',
});

const ChatMessagesContainer = styled(Paper)({
  overflowY: 'auto',
  maxHeight: 200,
  backgroundColor: '#282c34', // Dark gray, complements black
  color: '#ffffff', // White text for better contrast
});

const Message = styled(Typography)(({ theme, sender }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  wordWrap: 'break-word',
  backgroundColor: sender === 'user' ? '#007bff' : '#28a745', // Blue for user, Green for chatbot
  color: '#ffffff', // White text for better contrast
}));

const InputContainer = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
}));

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputText.trim() !== '') {
      setMessages([...messages, { text: inputText, sender: 'user' }]);
      // Add logic for chatbot response here
      setInputText('');
    }
  };

  return (
    <Container>
      <ChatContainer>
        <ChatMessagesContainer>
          {messages.map((message, index) => (
            <Message key={index} variant="body1" sender={message.sender}>
              {message.text}
            </Message>
          ))}
        </ChatMessagesContainer>
        <InputContainer>
          <TextField
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Type your message..."
            fullWidth
          />
          <Button variant="contained" color="secondary" onClick={handleSendMessage}>
            Send
          </Button>
        </InputContainer>
      </ChatContainer>
    </Container>
  );
};

export default Chatbot;
