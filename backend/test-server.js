const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    message: 'AyurSync Backend is running',
    timestamp: new Date(),
    environment: 'development',
    version: '1.0.0'
  });
});

// Mock API endpoints for testing
app.get('/api/patients', (req, res) => {
  res.json({
    success: true,
    data: {
      patients: [
        {
          _id: '1',
          fullName: 'Demo Patient',
          age: 30,
          email: 'demo@example.com',
          phone: '123-456-7890',
          primaryDosha: 'Vata',
          status: 'Active'
        }
      ]
    }
  });
});

app.get('/api/recipes', (req, res) => {
  res.json({
    success: true,
    data: {
      recipes: [
        {
          _id: '1',
          name: 'Demo Recipe',
          type: 'Breakfast',
          cuisine: 'Indian',
          nutrition_profile: {
            calories: 300,
            protein_g: 15
          }
        }
      ]
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`👥 Patients API: http://localhost:${PORT}/api/patients`);
  console.log(`🍽️ Recipes API: http://localhost:${PORT}/api/recipes`);
});
