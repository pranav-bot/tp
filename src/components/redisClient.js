// redisClient.js

import Redis from 'ioredis';

// Create a Redis client
const redisClient = new Redis({
  host: '127.0.0.1', // Redis server host
  port: 6379, // Redis server port
  // Optionally, add authentication if Redis is password protected
  // password: 'your_redis_password'
});

// Test the connection
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

// Handle Redis errors
redisClient.on('error', (error) => {
  console.error('Redis error:', error);
});



const supabaseUrl = 'https://annbilbdnvdifaveagps.supabase.co'
// Replace 'your_project_id' with your actual Supabase project ID
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFubmJpbGJkbnZkaWZhdmVhZ3BzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc4NDQ2NTEsImV4cCI6MjAyMzQyMDY1MX0.3FoPOUWSP6kKBrS_B7GoFwAY_rA1pSqCgX-BW2SVGZg'; 

export default redisClient;
