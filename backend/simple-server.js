const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({
    status: 'UP',
    message: 'AyurSync Backend is running',
    timestamp: new Date().toISOString(),
    environment: 'development',
    version: '1.0.0'
  });
});

// In-memory storage for demo
let patients = [
  {
    _id: '1',
    fullName: 'Sarah Johnson',
    age: 28,
    email: 'sarah@example.com',
    phone: '123-456-7890',
    primaryDosha: 'Vata',
    status: 'Active'
  },
  {
    _id: '2',
    fullName: 'Michael Chen',
    age: 35,
    email: 'michael@example.com',
    phone: '987-654-3210',
    primaryDosha: 'Pitta',
    status: 'Active'
  }
];

let nextPatientId = 3;
let patientHistories = {
  '1': {
    visits: [
      {
        _id: '1',
        date: '2024-01-15',
        type: 'Initial Consultation',
        notes: 'Patient presented with digestive issues and low energy. Vata imbalance noted.',
        prescription: 'Triphala churna morning and evening, warm water intake',
        followUpDate: '2024-01-29'
      },
      {
        _id: '2',
        date: '2024-01-29',
        type: 'Follow-up',
        notes: 'Significant improvement in digestion. Energy levels stable. Continue current protocol.',
        prescription: 'Continue Triphala, add ginger tea before meals',
        followUpDate: '2024-02-12'
      }
    ],
    dietPlans: [
      {
        _id: '1',
        startDate: '2024-01-15',
        endDate: '2024-01-29',
        status: 'Completed',
        adherence: '85%'
      }
    ],
    measurements: [
      {
        date: '2024-01-15',
        weight: '70 kg',
        bmi: '22.4',
        bloodPressure: '120/80'
      },
      {
        date: '2024-01-29',
        weight: '69.5 kg',
        bmi: '22.2',
        bloodPressure: '118/76'
      }
    ]
  },
  '2': {
    visits: [
      {
        _id: '3',
        date: '2024-01-10',
        type: 'Initial Consultation',
        notes: 'Patient shows signs of Pitta aggravation with acid reflux and irritability.',
        prescription: 'Cooling herbs - Shatavari and Amalaki, avoid spicy foods',
        followUpDate: '2024-01-24'
      }
    ],
    dietPlans: [
      {
        _id: '2',
        startDate: '2024-01-10',
        endDate: '2024-01-24',
        status: 'Active',
        adherence: '92%'
      }
    ],
    measurements: [
      {
        date: '2024-01-10',
        weight: '75 kg',
        bmi: '23.1',
        bloodPressure: '125/82'
      }
    ]
  }
};

// Mock patients endpoint
app.get('/api/patients', (req, res) => {
  console.log('Patients GET API requested');
  res.json({
    success: true,
    data: {
      patients: patients
    }
  });
});

// Search patients endpoint
app.get('/api/patients/search', (req, res) => {
  console.log('Patient Search API requested with query:', req.query);
  
  const { q, limit = 10 } = req.query;
  let filteredPatients = patients;
  
  if (q) {
    const searchTerm = q.toLowerCase();
    filteredPatients = patients.filter(patient => 
      (patient.fullName && patient.fullName.toLowerCase().includes(searchTerm)) ||
      (patient.email && patient.email.toLowerCase().includes(searchTerm)) ||
      (patient.phone && patient.phone.includes(searchTerm)) ||
      (patient.primaryDosha && patient.primaryDosha.toLowerCase().includes(searchTerm))
    );
  }
  
  // Limit results
  filteredPatients = filteredPatients.slice(0, parseInt(limit));
  
  res.json({
    success: true,
    data: {
      patients: filteredPatients,
      total: filteredPatients.length
    }
  });
});

// Create new patient endpoint
app.post('/api/patients', (req, res) => {
  console.log('Patients POST API requested with data:', req.body);
  
  try {
    const patientData = req.body;
    
    // Calculate primary dosha based on answers
    let doshaScores = { Vata: 0, Pitta: 0, Kapha: 0 };
    let primaryDosha = 'Vata'; // Default
    
    if (patientData.doshaAnswers && patientData.doshaAnswers.length > 0) {
      console.log('Processing dosha answers:', patientData.doshaAnswers);
      
      patientData.doshaAnswers.forEach(answer => {
        if (answer.answer && doshaScores[answer.answer] !== undefined) {
          doshaScores[answer.answer]++;
          console.log(`Added point to ${answer.answer}:`, doshaScores);
        }
      });
      
      // Find the dosha with the highest score
      const maxScore = Math.max(doshaScores.Vata, doshaScores.Pitta, doshaScores.Kapha);
      if (maxScore > 0) {
        if (doshaScores.Vata === maxScore && doshaScores.Pitta === maxScore) {
          primaryDosha = 'Vata-Pitta';
        } else if (doshaScores.Vata === maxScore && doshaScores.Kapha === maxScore) {
          primaryDosha = 'Vata-Kapha';
        } else if (doshaScores.Pitta === maxScore && doshaScores.Kapha === maxScore) {
          primaryDosha = 'Pitta-Kapha';
        } else {
          primaryDosha = Object.keys(doshaScores).reduce((a, b) => 
            doshaScores[a] > doshaScores[b] ? a : b
          );
        }
      }
      
      console.log('Final dosha scores:', doshaScores);
      console.log('Determined primary dosha:', primaryDosha);
    } else {
      console.log('No dosha answers provided, using default Vata');
    }
    
    // Create new patient
    const newPatient = {
      _id: nextPatientId.toString(),
      fullName: patientData.fullName,
      age: patientData.age,
      email: patientData.email,
      phone: patientData.phone,
      gender: patientData.gender,
      weight: patientData.weight,
      height: patientData.height,
      occupation: patientData.occupation,
      primaryDosha: primaryDosha,
      doshaScores: doshaScores, // Store the scores for reference
      status: 'Active',
      dateOfBirth: patientData.dateOfBirth,
      primaryConcerns: patientData.primaryConcerns,
      currentSymptoms: patientData.currentSymptoms,
      medications: patientData.medications,
      allergies: patientData.allergies,
      dietType: patientData.dietType,
      cookingSkills: patientData.cookingSkills,
      mealFrequency: patientData.mealFrequency,
      waterIntake: patientData.waterIntake,
      createdAt: new Date().toISOString()
    };
    
    patients.push(newPatient);
    nextPatientId++;
    
    console.log('Patient created successfully with dosha:', newPatient.primaryDosha);
    
    res.json({
      success: true,
      data: newPatient
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create patient',
      error: error.message
    });
  }
});

// Mock recipes endpoint
app.get('/api/recipes', (req, res) => {
  console.log('Recipes GET API requested');
  
  const recipes = [
    {
      _id: '1',
      name: 'Warm Oatmeal with Ghee',
      type: 'Breakfast',
      cuisine: 'Indian',
      difficulty: 'Easy',
      ingredients: [
        { name: 'Rolled oats', quantity: '1 cup', note: '' },
        { name: 'Ghee', quantity: '1 tbsp', note: 'clarified butter' },
        { name: 'Almonds', quantity: '6-8 pieces', note: 'soaked overnight' },
        { name: 'Dates', quantity: '2-3 pieces', note: 'pitted' },
        { name: 'Cardamom powder', quantity: '1/4 tsp', note: '' }
      ],
      instructions: [
        'Soak oats in warm water for 10 minutes',
        'Cook oats with ghee over medium heat',
        'Add chopped almonds and dates',
        'Sprinkle cardamom powder before serving'
      ],
      ayurvedic_properties: {
        rasa: ['Sweet'],
        virya: 'Warming',
        vipaka: 'Sweet',
        prabhava: null,
        dosha_effect: {
          Vata: '↓',
          Pitta: 'neutral',
          Kapha: '↑'
        },
        guna: ['Heavy', 'Oily'],
        guna_properties: 'Nourishing and grounding'
      },
      health_benefits: ['Supports digestive health', 'Provides sustained energy', 'Calms the nervous system'],
      nutrition_profile: {
        calories: 320,
        protein_g: 12,
        carbs_g: 45,
        fat_g: 12,
        fiber_g: 8,
        vitamins: ['B1', 'B6', 'E'],
        minerals: {
          Iron: '2mg',
          Calcium: '80mg',
          Magnesium: '60mg'
        },
        glycemic_index: 55,
        nutrient_density_score: 85
      },
      tags: ['Vata-balancing', 'Breakfast', 'Warming']
    },
    {
      _id: '2',
      name: 'Cooling Cucumber Mint Raita',
      type: 'Side Dish',
      cuisine: 'Indian',
      difficulty: 'Easy',
      ingredients: [
        { name: 'Cucumber', quantity: '1 large', note: 'grated' },
        { name: 'Yogurt', quantity: '1 cup', note: 'fresh' },
        { name: 'Fresh mint', quantity: '2 tbsp', note: 'chopped' },
        { name: 'Cumin powder', quantity: '1/2 tsp', note: 'roasted' },
        { name: 'Salt', quantity: 'to taste', note: 'rock salt preferred' }
      ],
      instructions: [
        'Grate cucumber and squeeze out excess water',
        'Mix with fresh yogurt',
        'Add chopped mint and roasted cumin',
        'Season with salt and chill before serving'
      ],
      ayurvedic_properties: {
        rasa: ['Sweet', 'Astringent'],
        virya: 'Cooling',
        vipaka: 'Sweet',
        prabhava: null,
        dosha_effect: {
          Vata: '↑',
          Pitta: '↓',
          Kapha: 'neutral'
        },
        guna: ['Cool', 'Light'],
        guna_properties: 'Cooling and refreshing'
      },
      health_benefits: ['Cools body temperature', 'Aids digestion', 'Hydrates tissues'],
      nutrition_profile: {
        calories: 80,
        protein_g: 6,
        carbs_g: 8,
        fat_g: 3,
        fiber_g: 2,
        vitamins: ['C', 'K', 'B12'],
        minerals: {
          Calcium: '150mg',
          Potassium: '300mg'
        },
        glycemic_index: 30,
        nutrient_density_score: 75
      },
      tags: ['Pitta-balancing', 'Cooling', 'Side-dish']
    },
    {
      _id: '3',
      name: 'Spiced Ginger Tea',
      type: 'Beverage',
      cuisine: 'Indian',
      difficulty: 'Easy',
      ingredients: [
        { name: 'Fresh ginger', quantity: '1 inch piece', note: 'sliced' },
        { name: 'Water', quantity: '2 cups', note: 'filtered' },
        { name: 'Black pepper', quantity: '3-4 pieces', note: 'whole' },
        { name: 'Honey', quantity: '1 tsp', note: 'optional' },
        { name: 'Lemon juice', quantity: '1/2 tsp', note: 'fresh' }
      ],
      instructions: [
        'Boil water with ginger slices for 10 minutes',
        'Add black pepper and simmer for 2 minutes',
        'Strain and add honey if desired',
        'Add fresh lemon juice before serving'
      ],
      ayurvedic_properties: {
        rasa: ['Pungent'],
        virya: 'Heating',
        vipaka: 'Pungent',
        prabhava: 'Digestive stimulant',
        dosha_effect: {
          Vata: '↓',
          Pitta: '↑',
          Kapha: '↓'
        },
        guna: ['Hot', 'Light'],
        guna_properties: 'Warming and stimulating'
      },
      health_benefits: ['Improves digestion', 'Boosts metabolism', 'Clears respiratory channels'],
      nutrition_profile: {
        calories: 25,
        protein_g: 0.5,
        carbs_g: 6,
        fat_g: 0,
        fiber_g: 0,
        vitamins: ['C'],
        minerals: {
          Potassium: '50mg'
        },
        glycemic_index: 15,
        nutrient_density_score: 60
      },
      tags: ['Kapha-balancing', 'Warming', 'Digestive']
    },
    {
      _id: '4',
      name: 'Kitchari with Root Vegetables',
      type: 'Lunch',
      cuisine: 'Indian',
      difficulty: 'Medium',
      ingredients: [
        { name: 'Basmati rice', quantity: '1/2 cup', note: 'soaked' },
        { name: 'Yellow mung dal', quantity: '1/2 cup', note: 'split' },
        { name: 'Carrots', quantity: '2 medium', note: 'diced' },
        { name: 'Sweet potato', quantity: '1 small', note: 'cubed' },
        { name: 'Turmeric', quantity: '1/2 tsp', note: 'powder' },
        { name: 'Cumin seeds', quantity: '1 tsp', note: '' },
        { name: 'Ghee', quantity: '2 tbsp', note: '' },
        { name: 'Fresh ginger', quantity: '1 tsp', note: 'minced' }
      ],
      instructions: [
        'Heat ghee and add cumin seeds',
        'Add ginger and sauté briefly',
        'Add rice, dal, and vegetables',
        'Add turmeric and 4 cups water',
        'Cook until soft and creamy (25-30 minutes)'
      ],
      ayurvedic_properties: {
        rasa: ['Sweet', 'Astringent'],
        virya: 'Warming',
        vipaka: 'Sweet',
        prabhava: 'Tri-doshic when prepared properly',
        dosha_effect: {
          Vata: '↓',
          Pitta: 'neutral',
          Kapha: 'neutral'
        },
        guna: ['Light', 'Easy to digest'],
        guna_properties: 'Balancing and nourishing'
      },
      health_benefits: ['Easy to digest', 'Detoxifying', 'Balances all doshas'],
      nutrition_profile: {
        calories: 350,
        protein_g: 15,
        carbs_g: 55,
        fat_g: 8,
        fiber_g: 12,
        vitamins: ['A', 'C', 'B6'],
        minerals: {
          Iron: '3mg',
          Potassium: '500mg',
          Magnesium: '80mg'
        },
        glycemic_index: 45,
        nutrient_density_score: 90
      },
      tags: ['Tri-doshic', 'Complete-meal', 'Detoxifying']
    }
  ];
  
  // Apply filters if provided
  const { limit, search, dosha, effect } = req.query;
  let filteredRecipes = recipes;
  
  if (search) {
    filteredRecipes = filteredRecipes.filter(recipe => 
      recipe.name.toLowerCase().includes(search.toLowerCase()) ||
      recipe.type.toLowerCase().includes(search.toLowerCase()) ||
      recipe.cuisine.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (dosha && effect) {
    filteredRecipes = filteredRecipes.filter(recipe => 
      recipe.ayurvedic_properties.dosha_effect[dosha] === effect
    );
  }
  
  if (limit) {
    filteredRecipes = filteredRecipes.slice(0, parseInt(limit));
  }
  
  res.json({
    success: true,
    data: {
      recipes: filteredRecipes,
      total: filteredRecipes.length
    }
  });
});

// Diet Plan Generation endpoint
app.post('/api/diet-plans/generate/:patientId', (req, res) => {
  console.log('Diet Plan Generation API requested for patient:', req.params.patientId);
  console.log('Options received:', req.body);
  
  const patientId = req.params.patientId;
  const options = req.body;
  
  // Find the patient
  const patient = patients.find(p => p._id === patientId);
  if (!patient) {
    return res.status(404).json({
      success: false,
      message: 'Patient not found'
    });
  }
  
  // Generate personalized diet plan based on patient's characteristics
  const primaryDosha = patient.primaryDosha || 'Vata';
  const age = patient.age || 30;
  const weight = patient.weight || 70;
  const height = patient.height || 170;
  const concerns = patient.primaryConcerns || '';
  const allergies = patient.allergies || '';
  
  // Dosha-specific meal recommendations
  const doshaRecipes = {
    'Vata': {
      breakfast: ['Warm Oatmeal with Ghee and Nuts', 'Spiced Porridge with Dates', 'Warm Milk with Turmeric'],
      lunch: ['Kitchari with Root Vegetables', 'Dal with Basmati Rice', 'Vegetable Curry with Quinoa'],
      dinner: ['Light Mung Bean Soup', 'Steamed Vegetables with Ghee', 'Warm Vegetable Stew'],
      snack: ['Turmeric Golden Milk', 'Almond Milk with Dates', 'Herbal Tea with Honey']
    },
    'Pitta': {
      breakfast: ['Cool Coconut Porridge', 'Fresh Fruit Bowl with Yogurt', 'Cooling Smoothie Bowl'],
      lunch: ['Cooling Cucumber Salad', 'Sweet Rice with Coconut', 'Bitter Greens with Chickpeas'],
      dinner: ['Light Vegetable Broth', 'Cooling Mint Rice', 'Steamed Asparagus with Herbs'],
      snack: ['Coconut Water', 'Cool Mint Tea', 'Fresh Fruit Juice']
    },
    'Kapha': {
      breakfast: ['Spicy Ginger Tea with Light Toast', 'Warm Spiced Quinoa', 'Light Fruit Salad with Ginger'],
      lunch: ['Spicy Lentil Curry', 'Light Vegetable Stir-fry', 'Warming Barley Soup'],
      dinner: ['Light Vegetable Broth', 'Steamed Leafy Greens', 'Warming Ginger Tea'],
      snack: ['Ginger Tea', 'Warm Spiced Water', 'Light Herbal Tea']
    }
  };
  
  // Get dosha-specific recipes
  const doshaMainType = primaryDosha.split('-')[0]; // Handle combined doshas like 'Vata-Pitta'
  const recipes = doshaRecipes[doshaMainType] || doshaRecipes['Vata'];
  
  // Generate personalized guidelines based on patient data
  const personalizedGuidelines = [
    `For ${primaryDosha} constitution: Focus on ${doshaMainType === 'Vata' ? 'warm, grounding foods' : doshaMainType === 'Pitta' ? 'cooling, calming foods' : 'light, warming foods'}`,
    `Age consideration (${age} years): ${age < 25 ? 'Focus on building strength' : age > 50 ? 'Emphasize easy digestion' : 'Maintain balanced nutrition'}`,
    `Weight management: ${weight && height ? (weight / Math.pow(height / 100, 2) > 25 ? 'Focus on lighter portions' : weight / Math.pow(height / 100, 2) < 18.5 ? 'Include nourishing foods' : 'Maintain current balance') : 'Follow portion guidelines'}`,
    concerns ? `Address health concerns: ${concerns.toLowerCase().includes('digest') ? 'Support digestive fire' : concerns.toLowerCase().includes('stress') ? 'Include calming foods' : concerns.toLowerCase().includes('energy') ? 'Include energizing foods' : 'Follow constitutional guidelines'}` : 'Maintain overall health balance',
    allergies ? `Avoid allergens: ${allergies}` : 'No specific food restrictions',
    'Eat at regular times to maintain digestive rhythm',
    'Practice mindful eating and chew food thoroughly'
  ];
  
  // Generate varying meal plans for each day
  const generateDayMeals = (day) => {
    const breakfastOptions = recipes.breakfast;
    const lunchOptions = recipes.lunch;
    const dinnerOptions = recipes.dinner;
    const snackOptions = recipes.snack;
    
    return {
      day: day,
      breakfast: { 
        name: breakfastOptions[day % breakfastOptions.length], 
        time: '8:00 AM',
        calories: doshaMainType === 'Kapha' ? '250-300' : '300-400',
        notes: doshaMainType === 'Vata' ? 'Eat warm and grounding' : doshaMainType === 'Pitta' ? 'Keep cool and light' : 'Light but satisfying'
      },
      lunch: { 
        name: lunchOptions[day % lunchOptions.length], 
        time: '12:30 PM',
        calories: doshaMainType === 'Kapha' ? '350-450' : '450-550',
        notes: 'Main meal of the day - eat mindfully'
      },
      dinner: { 
        name: dinnerOptions[day % dinnerOptions.length], 
        time: '7:00 PM',
        calories: doshaMainType === 'Kapha' ? '200-300' : '300-400',
        notes: 'Light and easy to digest'
      },
      snack: { 
        name: snackOptions[day % snackOptions.length], 
        time: '4:00 PM',
        calories: '100-150',
        notes: 'Optional if hungry'
      }
    };
  };
  
  // Generate 7-day meal plan with variety
  const meals = [];
  for (let day = 1; day <= 7; day++) {
    meals.push(generateDayMeals(day - 1));
  }
  
  const dietPlan = {
    _id: Date.now().toString(),
    patientId: patientId,
    patientName: patient.fullName,
    primaryDosha: primaryDosha,
    duration: options.duration || '7 days',
    createdAt: new Date().toISOString(),
    personalizedFor: {
      age: age,
      weight: weight,
      height: height,
      bmi: weight && height ? (weight / Math.pow(height / 100, 2)).toFixed(1) : null,
      concerns: concerns,
      allergies: allergies
    },
    meals: meals,
    guidelines: personalizedGuidelines,
    doshaBalance: {
      primary: doshaMainType,
      characteristics: doshaMainType === 'Vata' ? ['Mobile', 'Cold', 'Dry'] : doshaMainType === 'Pitta' ? ['Hot', 'Sharp', 'Intense'] : ['Heavy', 'Slow', 'Cool'],
      recommendations: doshaMainType === 'Vata' ? 'Favor warm, moist, grounding foods' : doshaMainType === 'Pitta' ? 'Favor cool, sweet, bitter foods' : 'Favor light, warm, spicy foods'
    },
    status: 'Active'
  };
  
  console.log('Generated personalized diet plan for', patient.fullName, 'with', primaryDosha, 'constitution');
  
  res.json({
    success: true,
    data: dietPlan
  });
});

// Patient History endpoint
app.get('/api/patients/:id/history', (req, res) => {
  console.log('Patient History API requested for patient:', req.params.id);
  
  const patientId = req.params.id;
  const patient = patients.find(p => p._id === patientId);
  
  if (!patient) {
    return res.status(404).json({
      success: false,
      message: 'Patient not found'
    });
  }
  
  // Get patient history or create default if none exists
  let history = patientHistories[patientId];
  
  if (!history) {
    // Create default history for new patients
    history = {
      visits: [
        {
          _id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          type: 'Initial Registration',
          notes: `Patient ${patient.fullName} registered. Primary dosha: ${patient.primaryDosha}. Health concerns: ${patient.primaryConcerns || 'None specified'}.`,
          prescription: 'Awaiting initial consultation',
          followUpDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 14 days from now
        }
      ],
      dietPlans: [],
      measurements: [
        {
          date: new Date().toISOString().split('T')[0],
          weight: patient.weight ? `${patient.weight} kg` : 'Not recorded',
          bmi: patient.weight && patient.height ? (patient.weight / Math.pow(patient.height / 100, 2)).toFixed(1) : 'Not calculated',
          bloodPressure: 'Pending measurement'
        }
      ]
    };
    patientHistories[patientId] = history;
  }
  
  res.json({
    success: true,
    data: history
  });
});

// Create a new visit for a patient
app.post('/api/patients/:id/visits', (req, res) => {
  console.log('Add Patient Visit API requested for patient:', req.params.id);
  
  const patientId = req.params.id;
  const visitData = req.body;
  const patient = patients.find(p => p._id === patientId);
  
  if (!patient) {
    return res.status(404).json({
      success: false,
      message: 'Patient not found'
    });
  }
  
  // Initialize history if it doesn't exist
  if (!patientHistories[patientId]) {
    patientHistories[patientId] = { visits: [], dietPlans: [], measurements: [] };
  }
  
  const newVisit = {
    _id: Date.now().toString(),
    date: visitData.date || new Date().toISOString().split('T')[0],
    type: visitData.type || 'Consultation',
    notes: visitData.notes || '',
    prescription: visitData.prescription || '',
    followUpDate: visitData.followUpDate || ''
  };
  
  patientHistories[patientId].visits.push(newVisit);
  
  res.json({
    success: true,
    data: newVisit
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AyurSync Backend Server Started!`);
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`❤️ Health check: http://localhost:${PORT}/health`);
  console.log(`👥 Patients API: http://localhost:${PORT}/api/patients`);
  console.log(`🍽️ Recipes API: http://localhost:${PORT}/api/recipes`);
  console.log(`\n✅ Backend is ready! You can now start the frontend.`);
});

// Handle errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
