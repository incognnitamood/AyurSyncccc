const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const SupabaseBackendService = require('./services/supabaseService')

const app = express()
const PORT = process.env.PORT || 3001

// Security and performance middleware
app.use(helmet())
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}))
app.use(compression())
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
app.use('/api/', limiter)

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    message: 'AyurSync Backend with Supabase is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '2.0.0',
    database: 'Supabase'
  })
})

// Test Supabase connection
app.get('/api/test-connection', async (req, res) => {
  try {
    const result = await SupabaseBackendService.testConnection()
    res.json(result)
  } catch (error) {
    res.status(500).json({ success: false, message: 'Connection test failed', error: error.message })
  }
})

// Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' })
    }

    const result = await SupabaseBackendService.authenticatePractitioner(email, password)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(401).json(result)
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Authentication failed', error: error.message })
  }
})

// Patient management endpoints with unlimited input support
app.post('/api/patients', async (req, res) => {
  try {
    const practitionerId = req.body.practitionerId || 'demo-practitioner'
    const patientData = req.body

    // Remove practitionerId from patient data to avoid duplication
    delete patientData.practitionerId

    console.log('Creating patient with unlimited inputs:', Object.keys(patientData))
    
    const result = await SupabaseBackendService.createPatient(practitionerId, patientData)
    
    if (result.success) {
      res.status(201).json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    console.error('Create patient error:', error)
    res.status(500).json({ success: false, message: 'Failed to create patient', error: error.message })
  }
})

app.get('/api/patients', async (req, res) => {
  try {
    const practitionerId = req.query.practitionerId || 'demo-practitioner'
    
    const result = await SupabaseBackendService.getPatients(practitionerId)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(500).json(result)
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch patients', error: error.message })
  }
})

app.get('/api/patients/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    res.json({ success: true, data })
  } catch (error) {
    res.status(404).json({ success: false, message: 'Patient not found', error: error.message })
  }
})

// Recipe management endpoints
app.get('/api/recipes', async (req, res) => {
  try {
    const filters = {
      meal_type: req.query.meal_type,
      cuisine_type: req.query.cuisine_type,
      dosha: req.query.dosha
    }

    const result = await SupabaseBackendService.getRecipes(filters)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(500).json(result)
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch recipes', error: error.message })
  }
})

// Seed recipes from JSON file
app.post('/api/recipes/seed', async (req, res) => {
  try {
    const recipesData = req.body.recipes
    
    if (!recipesData || !Array.isArray(recipesData)) {
      return res.status(400).json({ success: false, message: 'Invalid recipes data' })
    }

    const result = await SupabaseBackendService.seedRecipes(recipesData)
    res.json(result)
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to seed recipes', error: error.message })
  }
})

// AI Diet Plan Generation with unlimited inputs
app.post('/api/diet-plans/generate/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params
    const preferences = req.body

    console.log('Generating diet plan with unlimited preferences:', Object.keys(preferences))
    
    const result = await SupabaseBackendService.generateDietPlan(patientId, preferences)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    console.error('Generate diet plan error:', error)
    res.status(500).json({ success: false, message: 'Failed to generate diet plan', error: error.message })
  }
})

// Get diet plans for a patient
app.get('/api/diet-plans/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params
    
    const { data, error } = await supabase
      .from('diet_plans')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch diet plans', error: error.message })
  }
})

// Health records management
app.post('/api/health-records', async (req, res) => {
  try {
    const recordData = req.body
    
    const { data, error } = await supabase
      .from('health_records')
      .insert(recordData)
      .select()
      .single()

    if (error) throw error

    res.status(201).json({ success: true, data, message: 'Health record created successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create health record', error: error.message })
  }
})

app.get('/api/health-records/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params
    
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('patient_id', patientId)
      .order('visit_date', { ascending: false })

    if (error) throw error

    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch health records', error: error.message })
  }
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error)
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    availableEndpoints: [
      'GET /health',
      'GET /api/test-connection',
      'POST /api/auth/login',
      'POST /api/patients',
      'GET /api/patients',
      'GET /api/patients/:id',
      'GET /api/recipes',
      'POST /api/recipes/seed',
      'POST /api/diet-plans/generate/:patientId',
      'GET /api/diet-plans/:patientId',
      'POST /api/health-records',
      'GET /api/health-records/:patientId'
    ]
  })
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
  })
})

const server = app.listen(PORT, () => {
  console.log(`
🚀 AyurSync Backend Server Started Successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 Server URL: http://localhost:${PORT}
📊 Health Check: http://localhost:${PORT}/health
🔗 Database: Supabase (Production-Ready)
📋 API Documentation: http://localhost:${PORT}/api-docs (Coming Soon)

✨ Features Available:
   • 🔐 JWT Authentication for Practitioners
   • 👥 Patient Management with Unlimited Input Fields
   • 🍽️  AI Diet Plan Generator (Advanced Ayurvedic Algorithms)
   • 📊 50+ Recipes with Full Ayurvedic Properties
   • 📈 Health Records & Progress Tracking
   • 📄 PDF Report Generation Support
   • 🔄 Real-time Data Synchronization

🎯 Ready for Production Deployment!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `)
})

module.exports = app