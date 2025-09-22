const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001

// Security and performance middleware
app.use(helmet())
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}))
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// In-memory storage for demo
let patients = [
  {
    id: '1',
    practitioner_id: 'demo-practitioner',
    full_name: 'Sarah Johnson',
    age: 28,
    gender: 'female',
    email: 'sarah@example.com',
    phone: '123-456-7890',
    primary_dosha: 'Vata',
    health_concerns: ['Weight management', 'Digestive health'],
    allergies: ['Dairy'],
    status: 'active',
    last_visit: '2024-01-15',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    practitioner_id: 'demo-practitioner',
    full_name: 'Michael Chen',
    age: 35,
    gender: 'male',
    email: 'michael@example.com',
    phone: '987-654-3210',
    primary_dosha: 'Pitta',
    health_concerns: ['Energy balance', 'Stress management'],
    allergies: [],
    status: 'active',
    last_visit: '2024-01-12',
    created_at: new Date().toISOString()
  }
];

let dietPlans = [];

// Utility functions
const calculatePrimaryDosha = (doshaAnswers) => {
  if (!doshaAnswers || Object.keys(doshaAnswers).length === 0) {
    return 'Tridoshic'
  }

  const scores = { Vata: 0, Pitta: 0, Kapha: 0 }
  
  Object.values(doshaAnswers).forEach(answer => {
    if (scores.hasOwnProperty(answer)) {
      scores[answer]++
    }
  })

  const total = scores.Vata + scores.Pitta + scores.Kapha
  if (total === 0) return 'Tridoshic'

  const percentages = {
    Vata: (scores.Vata / total) * 100,
    Pitta: (scores.Pitta / total) * 100,
    Kapha: (scores.Kapha / total) * 100
  }

  const dominant = Object.keys(percentages).reduce((a, b) => 
    percentages[a] > percentages[b] ? a : b
  )

  // Check for dual dosha types
  const sorted = Object.entries(percentages).sort((a, b) => b[1] - a[1])
  if (sorted[0][1] - sorted[1][1] < 20) {
    return `${sorted[0][0]}-${sorted[1][0]}`
  }

  return dominant
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    message: 'AyurSync Demo Backend is running',
    timestamp: new Date().toISOString(),
    environment: 'demo',
    version: '2.0.0-demo',
    database: 'In-Memory (Demo Mode)',
    features: [
      'Patient Management (Unlimited Inputs)',
      'AI Diet Plan Generator',
      'PDF Report Generation',
      'Authentication System',
      'Real-time Data Sync'
    ]
  })
})

// Test connection
app.get('/api/test-connection', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Demo backend connected successfully',
    mode: 'demo',
    patientsCount: patients.length,
    featuresAvailable: [
      'Unlimited patient input fields',
      'Unlimited diet plan preferences',
      'AI-powered meal planning',
      'Real-time notifications'
    ]
  })
})

// Authentication endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body
  
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' })
  }

  // Demo authentication
  if (email === 'demo@ayursync.com' && password === 'demo123') {
    const demoUser = {
      id: 'demo-practitioner',
      fullName: 'Dr. Demo Practitioner',
      email: 'demo@ayursync.com',
      specialization: 'Ayurvedic Medicine'
    }

    res.json({
      success: true,
      data: demoUser,
      token: 'demo-jwt-token',
      message: 'Demo login successful'
    })
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials. Use demo@ayursync.com / demo123'
    })
  }
})

// Patient management with unlimited inputs
app.post('/api/patients', (req, res) => {
  try {
    const practitionerId = req.body.practitionerId || 'demo-practitioner'
    const patientData = req.body

    // Remove practitionerId from patient data
    delete patientData.practitionerId

    console.log('Creating patient with unlimited inputs:')
    console.log('Standard fields:', Object.keys(patientData).filter(key => 
      ['fullName', 'age', 'gender', 'email', 'phone', 'weight', 'height'].includes(key)
    ))
    console.log('Custom fields:', Object.keys(patientData).filter(key => 
      !['fullName', 'age', 'gender', 'email', 'phone', 'weight', 'height', 'doshaAnswers', 'currentSymptoms', 'medications', 'allergies'].includes(key)
    ))

    // Create new patient with unlimited fields support
    const newPatient = {
      id: (patients.length + 1).toString(),
      practitioner_id: practitionerId,
      full_name: patientData.fullName || patientData.full_name,
      age: parseInt(patientData.age),
      gender: patientData.gender,
      email: patientData.email,
      phone: patientData.phone,
      height: patientData.height ? parseFloat(patientData.height) : null,
      weight: patientData.weight ? parseFloat(patientData.weight) : null,
      occupation: patientData.occupation,
      primary_dosha: patientData.primaryDosha || calculatePrimaryDosha(patientData.doshaAnswers),
      dosha_assessment_answers: patientData.doshaAnswers || {},
      health_concerns: Array.isArray(patientData.currentSymptoms) ? patientData.currentSymptoms : 
                      (patientData.currentSymptoms ? [patientData.currentSymptoms] : []),
      allergies: patientData.allergies ? patientData.allergies.split(',').map(s => s.trim()) : [],
      current_medications: patientData.medications ? patientData.medications.split(',').map(s => s.trim()) : [],
      dietary_restrictions: patientData.dietaryRestrictions ? patientData.dietaryRestrictions.split(',').map(s => s.trim()) : [],
      meal_frequency: parseInt(patientData.mealFrequency) || 3,
      water_intake_liters: parseFloat(patientData.waterIntake) || 2.0,
      cooking_skills: patientData.cookingSkills || 'intermediate',
      cooking_time_preference: patientData.cookingTime || '30min',
      preferred_cuisines: patientData.preferredCuisines ? patientData.preferredCuisines.split(',').map(s => s.trim()) : [],
      bmi: patientData.height && patientData.weight ? 
           parseFloat((patientData.weight / Math.pow(patientData.height / 100, 2)).toFixed(1)) : null,
      status: 'active',
      last_visit: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      
      // Store all additional custom fields
      ...Object.fromEntries(
        Object.entries(patientData).filter(([key, value]) => 
          !['fullName', 'age', 'gender', 'email', 'phone', 'weight', 'height', 'occupation', 
            'doshaAnswers', 'currentSymptoms', 'medications', 'allergies', 'mealFrequency', 
            'waterIntake', 'cookingSkills', 'cookingTime', 'preferredCuisines'].includes(key) &&
          value !== undefined && value !== ''
        )
      )
    }

    patients.push(newPatient)

    res.status(201).json({
      success: true,
      data: newPatient,
      message: `Patient created successfully with ${Object.keys(patientData).length} total fields (including ${Object.keys(patientData).length - 12} custom fields)`
    })
  } catch (error) {
    console.error('Create patient error:', error)
    res.status(500).json({ success: false, message: 'Failed to create patient', error: error.message })
  }
})

app.get('/api/patients', (req, res) => {
  try {
    const practitionerId = req.query.practitionerId || 'demo-practitioner'
    
    const practitionerPatients = patients.filter(p => p.practitioner_id === practitionerId)
    
    res.json({
      success: true,
      data: practitionerPatients,
      message: `Found ${practitionerPatients.length} patients`
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch patients', error: error.message })
  }
})

app.get('/api/patients/:id', (req, res) => {
  try {
    const { id } = req.params
    const patient = patients.find(p => p.id === id)
    
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' })
    }

    res.json({ success: true, data: patient })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch patient', error: error.message })
  }
})

// AI Diet Plan Generation with unlimited inputs
app.post('/api/diet-plans/generate/:patientId', (req, res) => {
  try {
    const { patientId } = req.params
    const preferences = req.body

    console.log('Generating diet plan with unlimited preferences:')
    console.log('Standard preferences:', Object.keys(preferences).filter(key => 
      ['duration_days', 'target_goals', 'dietary_restrictions', 'activity_level'].includes(key)
    ))
    console.log('Custom preferences:', Object.keys(preferences).filter(key => 
      !['duration_days', 'target_goals', 'dietary_restrictions', 'activity_level', 'health_focus', 'cuisine_preferences'].includes(key)
    ))

    const patient = patients.find(p => p.id === patientId)
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' })
    }

    // Generate AI diet plan (demo implementation)
    const doshaFoods = {
      'Vata': ['warm oatmeal', 'kitchari', 'steamed vegetables', 'warm milk', 'cooked grains'],
      'Pitta': ['cooling salads', 'coconut water', 'sweet fruits', 'leafy greens', 'quinoa'],
      'Kapha': ['spicy foods', 'light soups', 'bitter greens', 'warming spices', 'millet']
    }

    const primaryDosha = patient.primary_dosha.split('-')[0]
    const recommendedFoods = doshaFoods[primaryDosha] || doshaFoods['Vata']

    const mealPlan = {}
    const duration = preferences.duration_days || 7

    for (let day = 0; day < duration; day++) {
      mealPlan[day] = {
        breakfast: {
          recipe_id: `recipe_${day}_b`,
          recipe_name: `${recommendedFoods[day % recommendedFoods.length]} with spices`,
          calories: 350 + (day * 10),
          time: '8:00 AM'
        },
        lunch: {
          recipe_id: `recipe_${day}_l`,
          recipe_name: `${primaryDosha}-balancing ${recommendedFoods[(day + 1) % recommendedFoods.length]}`,
          calories: 450 + (day * 15),
          time: '12:30 PM'
        },
        dinner: {
          recipe_id: `recipe_${day}_d`,
          recipe_name: `Light ${recommendedFoods[(day + 2) % recommendedFoods.length]}`,
          calories: 300 + (day * 8),
          time: '7:00 PM'
        },
        snacks: [{
          recipe_id: `recipe_${day}_s`,
          recipe_name: `Ayurvedic ${recommendedFoods[(day + 3) % recommendedFoods.length]} snack`,
          calories: 150,
          time: '4:00 PM'
        }]
      }
    }

    const dietPlan = {
      id: (dietPlans.length + 1).toString(),
      patient_id: patientId,
      practitioner_id: patient.practitioner_id,
      plan_name: `Personalized ${duration}-Day Plan for ${patient.full_name}`,
      duration_days: duration,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      target_calories_per_day: preferences.calorie_target || 2000,
      plan_goals: preferences.target_goals || [],
      dietary_preferences: preferences.dietary_restrictions || [],
      meal_plan: mealPlan,
      ai_model_used: 'AyurSync AI Demo v1.0',
      generation_parameters: preferences,
      nutritional_analysis: {
        daily_calories: preferences.calorie_target || 2000,
        protein_percentage: 20,
        carbs_percentage: 50,
        fat_percentage: 30,
        dosha_balance: `Optimized for ${primaryDosha} constitution`
      },
      ayurvedic_guidelines: [
        `Eat according to your ${primaryDosha} constitution`,
        'Eat warm, freshly cooked food',
        'Maintain regular meal times',
        'Chew food thoroughly and eat mindfully',
        'Drink warm water throughout the day',
        'Avoid eating when emotionally disturbed'
      ],
      lifestyle_recommendations: [
        `Practice ${primaryDosha}-balancing exercises`,
        'Maintain regular sleep schedule',
        'Practice meditation or pranayama',
        'Follow seasonal routines',
        'Stay hydrated with warm beverages',
        'Create a peaceful eating environment'
      ],
      status: 'active',
      adherence_score: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      
      // Include all custom preferences in the plan
      custom_preferences: Object.fromEntries(
        Object.entries(preferences).filter(([key, value]) => 
          !['duration_days', 'target_goals', 'dietary_restrictions', 'activity_level', 'health_focus', 'cuisine_preferences'].includes(key) &&
          value !== undefined && value !== ''
        )
      )
    }

    dietPlans.push(dietPlan)

    res.json({
      success: true,
      data: dietPlan,
      message: `AI diet plan generated successfully with ${Object.keys(preferences).length} total preferences (including ${Object.keys(dietPlan.custom_preferences).length} custom preferences)`
    })
  } catch (error) {
    console.error('Generate diet plan error:', error)
    res.status(500).json({ success: false, message: 'Failed to generate diet plan', error: error.message })
  }
})

// Get diet plans for a patient
app.get('/api/diet-plans/:patientId', (req, res) => {
  try {
    const { patientId } = req.params
    
    const patientPlans = dietPlans.filter(plan => plan.patient_id === patientId)
    
    res.json({ success: true, data: patientPlans })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch diet plans', error: error.message })
  }
})

// Recipes endpoint
app.get('/api/recipes', (req, res) => {
  // Return sample recipes for demo
  const sampleRecipes = [
    {
      id: '1',
      name: 'Warming Kitchari',
      meal_type: ['lunch', 'dinner'],
      cuisine_type: ['Indian'],
      ayurvedic_properties: {
        dosha_effects: { vata: 'decrease', pitta: 'neutral', kapha: 'decrease' }
      },
      nutrition: { calories: 320, protein_g: 12, carbohydrates_g: 45, fat_g: 8 }
    },
    {
      id: '2',
      name: 'Cooling Cucumber Salad',
      meal_type: ['lunch'],
      cuisine_type: ['Mediterranean'],
      ayurvedic_properties: {
        dosha_effects: { vata: 'increase', pitta: 'decrease', kapha: 'neutral' }
      },
      nutrition: { calories: 150, protein_g: 3, carbohydrates_g: 12, fat_g: 6 }
    }
  ]

  res.json({ success: true, data: sampleRecipes })
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
    mode: 'demo',
    availableEndpoints: [
      'GET /health',
      'GET /api/test-connection',
      'POST /api/auth/login',
      'POST /api/patients (unlimited inputs)',
      'GET /api/patients',
      'GET /api/patients/:id',
      'GET /api/recipes',
      'POST /api/diet-plans/generate/:patientId (unlimited preferences)',
      'GET /api/diet-plans/:patientId'
    ]
  })
})

const server = app.listen(PORT, () => {
  console.log(`
🚀 AyurSync Demo Backend Server Started Successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 Server URL: http://localhost:${PORT}
📊 Health Check: http://localhost:${PORT}/health
🔗 Database: In-Memory Demo Mode
📋 Mode: Full Feature Demonstration

✨ Features Available:
   • 🔐 Demo Authentication (demo@ayursync.com / demo123)
   • 👥 Patient Management with UNLIMITED Input Fields
   • 🤖 AI Diet Plan Generator with UNLIMITED Preferences  
   • 📊 Recipe Database with Ayurvedic Properties
   • 📈 Health Records & Progress Tracking
   • 📄 PDF Report Generation Support
   • 🔄 Real-time Data Storage (In-Memory)

🎯 Ready for Full Demonstration!

Demo Login Credentials:
📧 Email: demo@ayursync.com
🔐 Password: demo123

Current Data:
👥 Patients: ${patients.length} 
📋 Diet Plans: ${dietPlans.length}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `)
})

module.exports = app