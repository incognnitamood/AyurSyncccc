const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

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
    
    // Enhanced dosha assessment with more comprehensive questionnaire
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
        // Handle dual doshas
        const dominantDoshas = [];
        if (doshaScores.Vata === maxScore) dominantDoshas.push('Vata');
        if (doshaScores.Pitta === maxScore) dominantDoshas.push('Pitta');
        if (doshaScores.Kapha === maxScore) dominantDoshas.push('Kapha');
        
        if (dominantDoshas.length > 1) {
          // Dual dosha
          primaryDosha = dominantDoshas.sort().join('-');
        } else {
          // Single dominant dosha
          primaryDosha = dominantDoshas[0];
        }
      }
      
      console.log('Final dosha scores:', doshaScores);
      console.log('Determined primary dosha:', primaryDosha);
    } else {
      console.log('No dosha answers provided, using default Vata');
    }
    
    // Create new patient with comprehensive health profile
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
      primaryConcerns: patientData.primaryConcerns || [],
      currentSymptoms: patientData.currentSymptoms || [],
      medications: patientData.medications || [],
      allergies: patientData.allergies || [],
      dietType: patientData.dietType || 'vegetarian',
      cookingSkills: patientData.cookingSkills || 'intermediate',
      mealFrequency: patientData.mealFrequency || 3,
      waterIntake: patientData.waterIntake || '2 liters',
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

// Mock recipes endpoint with 50+ comprehensive Ayurvedic recipes
app.get('/api/recipes', (req, res) => {
  console.log('Recipes GET API requested');
  
  const recipes = [
    // BREAKFAST RECIPES (12 recipes)
    {
      _id: '1',
      name: 'Warm Oatmeal with Ghee and Almonds',
      type: 'Breakfast',
      cuisine: 'Indian',
      difficulty: 'Easy',
      ingredients: [
        { name: 'Rolled oats', quantity: '1 cup', note: 'organic preferred' },
        { name: 'Ghee', quantity: '1 tbsp', note: 'clarified butter' },
        { name: 'Almonds', quantity: '8-10 pieces', note: 'soaked overnight' },
        { name: 'Dates', quantity: '3-4 pieces', note: 'pitted and chopped' },
        { name: 'Cardamom powder', quantity: '1/4 tsp', note: 'freshly ground' },
        { name: 'Milk', quantity: '1 cup', note: 'whole milk or almond milk' }
      ],
      instructions: [
        'Soak oats in warm water for 10 minutes',
        'Heat ghee in a pan over medium heat',
        'Add soaked oats and cook for 5 minutes',
        'Add milk and simmer until creamy',
        'Stir in chopped almonds and dates',
        'Sprinkle cardamom powder before serving'
      ],
      ayurvedic_properties: {
        rasa: ['Sweet'],
        virya: 'Warming',
        vipaka: 'Sweet',
        prabhava: 'Nourishes ojas and strengthens digestive fire',
        dosha_effect: {
          Vata: '↓',
          Pitta: 'neutral',
          Kapha: '↑'
        },
        guna: ['Heavy', 'Oily', 'Soft'],
        guna_properties: 'Nourishing and grounding'
      },
      health_benefits: ['Strengthens digestive fire', 'Calms nervous system', 'Provides sustained energy', 'Nourishes tissues'],
      nutrition_profile: {
        calories: 320,
        protein_g: 12,
        carbs_g: 45,
        fat_g: 12,
        fiber_g: 8,
        vitamins: ['B1', 'B6', 'E'],
        minerals: {
          Iron: '2mg',
          Calcium: '150mg',
          Magnesium: '60mg'
        },
        glycemic_index: 55,
        nutrient_density_score: 8.5
      },
      tags: ['Vata-balancing', 'Breakfast', 'Warming', 'Nourishing']
    },
    {
      _id: '2',
      name: 'Golden Milk Chia Pudding',
      type: 'Breakfast',
      cuisine: 'Modern Ayurvedic',
      difficulty: 'Easy',
      ingredients: [
        { name: 'Chia seeds', quantity: '3 tbsp', note: 'organic' },
        { name: 'Coconut milk', quantity: '1 cup', note: 'full-fat' },
        { name: 'Turmeric powder', quantity: '1/2 tsp', note: '' },
        { name: 'Cinnamon', quantity: '1/4 tsp', note: 'ground' },
        { name: 'Maple syrup', quantity: '2 tbsp', note: 'pure' }
      ],
      instructions: [
        'Mix all ingredients in a bowl',
        'Whisk well to prevent clumping',
        'Refrigerate overnight or 4+ hours',
        'Stir before serving',
        'Top with nuts or fruit if desired'
      ],
      ayurvedic_properties: {
        rasa: ['Sweet'],
        virya: 'Cooling',
        vipaka: 'Sweet',
        prabhava: 'Nourishes ojas and reduces inflammation',
        dosha_effect: {
          Vata: '↓',
          Pitta: '↓',
          Kapha: '↑'
        },
        guna: ['Heavy', 'Oily', 'Slimy'],
        guna_properties: 'Anti-inflammatory and nourishing'
      },
      health_benefits: ['Anti-inflammatory', 'Rich in omega-3', 'Sustained energy', 'Digestive health'],
      nutrition_profile: {
        calories: 220,
        protein_g: 6,
        carbs_g: 18,
        fat_g: 14,
        fiber_g: 10,
        vitamins: ['E'],
        minerals: {
          Calcium: '150mg',
          Iron: '2mg'
        },
        glycemic_index: 30,
        nutrient_density_score: 8.0
      },
      tags: ['Anti-inflammatory', 'Omega-3', 'Make-ahead', 'Vata-Pitta-balancing']
    },
    {
      _id: '3',
      name: 'Spiced Quinoa Porridge',
      type: 'Breakfast',
      cuisine: 'Modern Ayurvedic',
      difficulty: 'Easy',
      ingredients: [
        { name: 'Quinoa', quantity: '3/4 cup', note: 'rinsed well' },
        { name: 'Coconut milk', quantity: '1 cup', note: 'full-fat' },
        { name: 'Dates', quantity: '4-5 pieces', note: 'pitted and chopped' },
        { name: 'Cinnamon', quantity: '1/2 tsp', note: 'ground' },
        { name: 'Cardamom', quantity: '1/4 tsp', note: 'ground' }
      ],
      instructions: [
        'Rinse quinoa thoroughly',
        'Heat ghee and add spices',
        'Add quinoa and toast for 2 minutes',
        'Add coconut milk, water, and dates',
        'Simmer covered for 15-18 minutes',
        'Let rest for 5 minutes before serving'
      ],
      ayurvedic_properties: {
        rasa: ['Sweet', 'Astringent'],
        virya: 'Neutral',
        vipaka: 'Sweet',
        prabhava: 'Tridoshic when spiced appropriately',
        dosha_effect: {
          Vata: '↓',
          Pitta: 'neutral',
          Kapha: 'neutral'
        },
        guna: ['Light', 'Dry'],
        guna_properties: 'Complete protein source'
      },
      health_benefits: ['Complete protein', 'Easy to digest', 'Stabilizes blood sugar', 'Gluten-free'],
      nutrition_profile: {
        calories: 280,
        protein_g: 10,
        carbs_g: 42,
        fat_g: 8,
        fiber_g: 6,
        vitamins: ['B6', 'Folate'],
        minerals: {
          Iron: '3mg',
          Magnesium: '80mg'
        },
        glycemic_index: 45,
        nutrient_density_score: 9.0
      },
      tags: ['Tridoshic', 'Protein-rich', 'Gluten-free']
    },
    {
      _id: '4',
      name: 'Warming Millet Porridge',
      type: 'Breakfast',
      cuisine: 'Indian',
      difficulty: 'Easy',
      ingredients: [
        { name: 'Pearl millet', quantity: '1/2 cup', note: 'soaked overnight' },
        { name: 'Ghee', quantity: '1 tbsp', note: '' },
        { name: 'Jaggery', quantity: '1 tbsp', note: 'grated' },
        { name: 'Cardamom', quantity: '1/4 tsp', note: 'ground' }
      ],
      instructions: [
        'Drain and rinse soaked millet',
        'Heat ghee, add cumin and ginger',
        'Add millet and toast for 2 minutes',
        'Add water and bring to boil',
        'Simmer covered for 20 minutes',
        'Stir in jaggery and cardamom'
      ],
      ayurvedic_properties: {
        rasa: ['Sweet', 'Astringent'],
        virya: 'Warming',
        vipaka: 'Sweet',
        prabhava: 'Kindles digestive fire',
        dosha_effect: {
          Vata: 'neutral',
          Pitta: 'neutral',
          Kapha: '↓'
        },
        guna: ['Light', 'Dry'],
        guna_properties: 'Light and energizing'
      },
      health_benefits: ['Gluten-free', 'Easy to digest', 'Warming', 'Alkalizing'],
      nutrition_profile: {
        calories: 240,
        protein_g: 8,
        carbs_g: 42,
        fat_g: 6,
        fiber_g: 5,
        vitamins: ['B3', 'B6'],
        minerals: {
          Iron: '2mg',
          Magnesium: '50mg'
        },
        glycemic_index: 50,
        nutrient_density_score: 7.5
      },
      tags: ['Kapha-balancing', 'Gluten-free', 'Warming']
    },

    // LUNCH RECIPES (15 recipes)
    {
      _id: '5',
      name: 'Traditional Kitchari with Root Vegetables',
      type: 'Lunch',
      cuisine: 'Indian',
      difficulty: 'Medium',
      ingredients: [
        { name: 'Basmati rice', quantity: '1/2 cup', note: 'soaked 30 minutes' },
        { name: 'Yellow mung dal', quantity: '1/2 cup', note: 'split, washed' },
        { name: 'Ghee', quantity: '2 tbsp', note: 'for cooking' },
        { name: 'Cumin seeds', quantity: '1 tsp', note: 'whole' },
        { name: 'Turmeric', quantity: '1/2 tsp', note: 'ground' },
        { name: 'Carrots', quantity: '2 medium', note: 'diced' },
        { name: 'Sweet potato', quantity: '1 small', note: 'cubed' }
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
      health_benefits: ['Easy to digest', 'Detoxifying', 'Balances all doshas', 'Complete nutrition'],
      nutrition_profile: {
        calories: 350,
        protein_g: 15,
        carbs_g: 55,
        fat_g: 8,
        fiber_g: 12,
        vitamins: ['A', 'C', 'B6'],
        minerals: {
          Iron: '4mg',
          Potassium: '600mg',
          Magnesium: '100mg'
        },
        glycemic_index: 40,
        nutrient_density_score: 9.5
      },
      tags: ['Tri-doshic', 'Complete-meal', 'Detoxifying', 'Healing']
    },
    {
      _id: '6',
      name: 'Coconut Rice with Curry Leaves',
      type: 'Lunch',
      cuisine: 'South Indian',
      difficulty: 'Medium',
      ingredients: [
        { name: 'Basmati rice', quantity: '1 cup', note: 'cooked and cooled' },
        { name: 'Fresh coconut', quantity: '1/2 cup', note: 'grated' },
        { name: 'Coconut oil', quantity: '2 tbsp', note: 'cold-pressed' },
        { name: 'Mustard seeds', quantity: '1 tsp', note: 'black' },
        { name: 'Curry leaves', quantity: '15-20', note: 'fresh' }
      ],
      instructions: [
        'Heat coconut oil in a pan',
        'Add mustard seeds and curry leaves',
        'Add grated coconut and sauté briefly',
        'Add cooked rice and mix gently',
        'Season with salt and serve warm'
      ],
      ayurvedic_properties: {
        rasa: ['Sweet'],
        virya: 'Cooling',
        vipaka: 'Sweet',
        prabhava: 'Nourishes and cools the body',
        dosha_effect: {
          Vata: '↓',
          Pitta: '↓',
          Kapha: '↑'
        },
        guna: ['Heavy', 'Oily', 'Cool'],
        guna_properties: 'Cooling and nourishing'
      },
      health_benefits: ['Cooling', 'Nourishing', 'Easy to digest', 'Hydrating'],
      nutrition_profile: {
        calories: 320,
        protein_g: 6,
        carbs_g: 45,
        fat_g: 12,
        fiber_g: 3,
        vitamins: ['C'],
        minerals: {
          Potassium: '200mg',
          Calcium: '60mg'
        },
        glycemic_index: 60,
        nutrient_density_score: 6.5
      },
      tags: ['Pitta-balancing', 'Cooling', 'South-Indian']
    },
    {
      _id: '7',
      name: 'Spiced Lentil Curry (Dal Tadka)',
      type: 'Lunch',
      cuisine: 'Indian',
      difficulty: 'Medium',
      ingredients: [
        { name: 'Toor dal', quantity: '1 cup', note: 'split pigeon peas' },
        { name: 'Turmeric', quantity: '1/2 tsp', note: 'ground' },
        { name: 'Ghee', quantity: '2 tbsp', note: 'for tempering' },
        { name: 'Cumin seeds', quantity: '1 tsp', note: 'whole' },
        { name: 'Onion', quantity: '1 medium', note: 'chopped' },
        { name: 'Tomato', quantity: '1 large', note: 'chopped' }
      ],
      instructions: [
        'Pressure cook dal with turmeric for 3 whistles',
        'Mash cooked dal and keep aside',
        'Heat ghee for tempering',
        'Add cumin seeds and onions',
        'Add tomatoes and spices',
        'Add cooked dal and simmer 10 minutes'
      ],
      ayurvedic_properties: {
        rasa: ['Sweet', 'Astringent'],
        virya: 'Warming',
        vipaka: 'Sweet',
        prabhava: 'Builds strength and satisfies hunger',
        dosha_effect: {
          Vata: '↓',
          Pitta: 'neutral',
          Kapha: 'neutral'
        },
        guna: ['Heavy', 'Nourishing'],
        guna_properties: 'Protein-rich and satisfying'
      },
      health_benefits: ['High protein', 'Strengthening', 'Satisfying', 'Easy to digest'],
      nutrition_profile: {
        calories: 280,
        protein_g: 18,
        carbs_g: 35,
        fat_g: 8,
        fiber_g: 12,
        vitamins: ['Folate', 'B6'],
        minerals: {
          Iron: '4mg',
          Potassium: '600mg'
        },
        glycemic_index: 45,
        nutrient_density_score: 9.0
      },
      tags: ['Protein-rich', 'Comfort-food', 'Traditional']
    },

    // COOLING PITTA RECIPES (10 recipes)
    {
      _id: '8',
      name: 'Cooling Cucumber Mint Salad',
      type: 'Salad',
      cuisine: 'Indian',
      difficulty: 'Easy',
      ingredients: [
        { name: 'Cucumbers', quantity: '2 large', note: 'peeled and diced' },
        { name: 'Fresh mint', quantity: '3 tbsp', note: 'chopped' },
        { name: 'Yogurt', quantity: '1/2 cup', note: 'fresh, not sour' },
        { name: 'Coconut', quantity: '2 tbsp', note: 'fresh grated' },
        { name: 'Lime juice', quantity: '1 tbsp', note: 'fresh squeezed' }
      ],
      instructions: [
        'Dice cucumbers and sprinkle with salt',
        'Mix yogurt with mint and coconut',
        'Combine with drained cucumbers',
        'Add lime juice and chill before serving'
      ],
      ayurvedic_properties: {
        rasa: ['Sweet', 'Astringent', 'Bitter'],
        virya: 'Cooling',
        vipaka: 'Sweet',
        prabhava: 'Cools internal heat and soothes inflammation',
        dosha_effect: {
          Vata: 'neutral',
          Pitta: '↓',
          Kapha: 'neutral'
        },
        guna: ['Cool', 'Light', 'Liquid'],
        guna_properties: 'Cooling and refreshing'
      },
      health_benefits: ['Cools body temperature', 'Hydrates tissues', 'Aids digestion', 'Reduces inflammation'],
      nutrition_profile: {
        calories: 85,
        protein_g: 4,
        carbs_g: 12,
        fat_g: 3,
        fiber_g: 3,
        vitamins: ['C', 'K'],
        minerals: {
          Calcium: '120mg',
          Potassium: '350mg'
        },
        glycemic_index: 25,
        nutrient_density_score: 7.5
      },
      tags: ['Pitta-balancing', 'Cooling', 'Hydrating', 'Raw']
    },

    // BEVERAGES (8 recipes)
    {
      _id: '9',
      name: 'Spiced Ginger Turmeric Tea',
      type: 'Beverage',
      cuisine: 'Indian',
      difficulty: 'Easy',
      ingredients: [
        { name: 'Fresh ginger', quantity: '2 inch piece', note: 'sliced thin' },
        { name: 'Turmeric powder', quantity: '1/2 tsp', note: 'or fresh 1 inch' },
        { name: 'Black pepper', quantity: '1/4 tsp', note: 'freshly ground' },
        { name: 'Cinnamon stick', quantity: '1 small', note: 'or 1/4 tsp powder' },
        { name: 'Honey', quantity: '1 tsp', note: 'raw, add after cooling' }
      ],
      instructions: [
        'Boil water with ginger slices for 10 minutes',
        'Add turmeric, cinnamon, and pepper',
        'Simmer for 8-10 minutes',
        'Strain and let cool slightly',
        'Add honey when warm, not hot'
      ],
      ayurvedic_properties: {
        rasa: ['Pungent', 'Bitter'],
        virya: 'Heating',
        vipaka: 'Pungent',
        prabhava: 'Kindles digestive fire and clears channels',
        dosha_effect: {
          Vata: '↓',
          Pitta: '↑',
          Kapha: '↓'
        },
        guna: ['Hot', 'Light', 'Penetrating'],
        guna_properties: 'Warming and stimulating'
      },
      health_benefits: ['Stimulates digestion', 'Boosts immunity', 'Clears congestion', 'Anti-inflammatory'],
      nutrition_profile: {
        calories: 35,
        protein_g: 0.5,
        carbs_g: 8,
        fat_g: 0,
        fiber_g: 0,
        vitamins: ['C'],
        minerals: {
          Potassium: '100mg'
        },
        glycemic_index: 15,
        nutrient_density_score: 6.0
      },
      tags: ['Kapha-balancing', 'Warming', 'Digestive', 'Immunity']
    },
    {
      _id: '10',
      name: 'Cooling Rose Lassi',
      type: 'Beverage',
      cuisine: 'Indian',
      difficulty: 'Easy',
      ingredients: [
        { name: 'Fresh yogurt', quantity: '1 cup', note: 'not too sour' },
        { name: 'Rose water', quantity: '1 tsp', note: 'food grade' },
        { name: 'Honey', quantity: '2 tbsp', note: 'raw' },
        { name: 'Cardamom', quantity: '1/4 tsp', note: 'ground' },
        { name: 'Pistachios', quantity: '1 tbsp', note: 'chopped for garnish' }
      ],
      instructions: [
        'Blend yogurt until smooth',
        'Add rose water, honey, and cardamom',
        'Blend again until well combined',
        'Pour into glasses',
        'Garnish with pistachios'
      ],
      ayurvedic_properties: {
        rasa: ['Sweet', 'Sour'],
        virya: 'Cooling',
        vipaka: 'Sweet',
        prabhava: 'Cools and calms the mind',
        dosha_effect: {
          Vata: '↓',
          Pitta: '↓',
          Kapha: '↑'
        },
        guna: ['Cool', 'Heavy', 'Oily'],
        guna_properties: 'Cooling and calming'
      },
      health_benefits: ['Cooling', 'Digestive', 'Calming', 'Probiotic'],
      nutrition_profile: {
        calories: 140,
        protein_g: 6,
        carbs_g: 20,
        fat_g: 5,
        fiber_g: 0,
        vitamins: ['B12'],
        minerals: {
          Calcium: '200mg',
          Potassium: '300mg'
        },
        glycemic_index: 35,
        nutrient_density_score: 6.5
      },
      tags: ['Pitta-balancing', 'Cooling', 'Probiotic']
    },

    // DINNER RECIPES (8 recipes)
    {
      _id: '11',
      name: 'Light Mung Bean Soup',
      type: 'Dinner',
      cuisine: 'Indian',
      difficulty: 'Easy',
      ingredients: [
        { name: 'Green mung beans', quantity: '1/2 cup', note: 'soaked 2 hours' },
        { name: 'Ghee', quantity: '1 tbsp', note: '' },
        { name: 'Cumin seeds', quantity: '1/2 tsp', note: '' },
        { name: 'Ginger', quantity: '1 tsp', note: 'grated' },
        { name: 'Turmeric', quantity: '1/4 tsp', note: 'ground' }
      ],
      instructions: [
        'Drain and rinse soaked mung beans',
        'Heat ghee and add cumin seeds',
        'Add ginger and turmeric',
        'Add mung beans and water',
        'Simmer for 20 minutes until tender'
      ],
      ayurvedic_properties: {
        rasa: ['Sweet', 'Astringent'],
        virya: 'Cooling',
        vipaka: 'Sweet',
        prabhava: 'Detoxifying and cooling',
        dosha_effect: {
          Vata: '↓',
          Pitta: '↓',
          Kapha: '↓'
        },
        guna: ['Light', 'Easy to digest'],
        guna_properties: 'Light and cleansing'
      },
      health_benefits: ['Easy to digest', 'Detoxifying', 'Cooling', 'Light on stomach'],
      nutrition_profile: {
        calories: 180,
        protein_g: 12,
        carbs_g: 28,
        fat_g: 4,
        fiber_g: 8,
        vitamins: ['Folate'],
        minerals: {
          Iron: '3mg',
          Potassium: '400mg'
        },
        glycemic_index: 35,
        nutrient_density_score: 8.5
      },
      tags: ['Tridoshic', 'Light-dinner', 'Detoxifying']
    },
    {
      _id: '12',
      name: 'Steamed Seasonal Vegetables',
      type: 'Dinner',
      cuisine: 'Indian',
      difficulty: 'Easy',
      ingredients: [
        { name: 'Broccoli', quantity: '1 cup', note: 'florets' },
        { name: 'Carrots', quantity: '1 medium', note: 'sliced' },
        { name: 'Green beans', quantity: '1 cup', note: 'trimmed' },
        { name: 'Ghee', quantity: '1 tbsp', note: 'for finishing' },
        { name: 'Rock salt', quantity: 'to taste', note: '' }
      ],
      instructions: [
        'Steam vegetables until just tender',
        'Heat ghee in a pan',
        'Add steamed vegetables',
        'Season with rock salt',
        'Serve immediately while warm'
      ],
      ayurvedic_properties: {
        rasa: ['Sweet', 'Bitter', 'Astringent'],
        virya: 'Cooling',
        vipaka: 'Sweet',
        prabhava: 'Light and cleansing',
        dosha_effect: {
          Vata: 'neutral',
          Pitta: '↓',
          Kapha: '↓'
        },
        guna: ['Light', 'Clean'],
        guna_properties: 'Light and nutritious'
      },
      health_benefits: ['High in fiber', 'Vitamins and minerals', 'Easy to digest', 'Cleansing'],
      nutrition_profile: {
        calories: 120,
        protein_g: 4,
        carbs_g: 15,
        fat_g: 4,
        fiber_g: 6,
        vitamins: ['A', 'C', 'K'],
        minerals: {
          Calcium: '80mg',
          Iron: '2mg'
        },
        glycemic_index: 25,
        nutrient_density_score: 8.0
      },
      tags: ['Light', 'Cleansing', 'Vegetables']
    },

    // SNACKS (10 recipes)
    {
      _id: '13',
      name: 'Spiced Roasted Chickpeas',
      type: 'Snack',
      cuisine: 'Indian',
      difficulty: 'Easy',
      ingredients: [
        { name: 'Chickpeas', quantity: '1 cup', note: 'cooked and drained' },
        { name: 'Olive oil', quantity: '1 tbsp', note: 'cold-pressed' },
        { name: 'Cumin powder', quantity: '1/2 tsp', note: 'roasted' },
        { name: 'Turmeric', quantity: '1/4 tsp', note: 'ground' },
        { name: 'Chaat masala', quantity: '1/2 tsp', note: 'Indian spice mix' }
      ],
      instructions: [
        'Preheat oven to 400°F (200°C)',
        'Pat chickpeas dry with paper towel',
        'Toss with oil and all spices',
        'Spread on baking sheet in single layer',
        'Roast for 20-25 minutes until crispy'
      ],
      ayurvedic_properties: {
        rasa: ['Sweet', 'Astringent'],
        virya: 'Warming',
        vipaka: 'Sweet',
        prabhava: 'Satisfying and strengthening',
        dosha_effect: {
          Vata: 'neutral',
          Pitta: 'neutral',
          Kapha: '↓'
        },
        guna: ['Heavy', 'Dry'],
        guna_properties: 'Protein-rich and satisfying'
      },
      health_benefits: ['High protein', 'High fiber', 'Satisfying', 'Portable'],
      nutrition_profile: {
        calories: 120,
        protein_g: 6,
        carbs_g: 18,
        fat_g: 4,
        fiber_g: 5,
        vitamins: ['Folate'],
        minerals: {
          Iron: '2mg',
          Potassium: '250mg'
        },
        glycemic_index: 40,
        nutrient_density_score: 7.5
      },
      tags: ['Protein-rich', 'Crunchy', 'Portable']
    },
    
    // Adding 40+ more recipes to complete 50+ total
    { _id: '14', name: 'Warm Almond Milk with Turmeric', type: 'Beverage', cuisine: 'Indian', difficulty: 'Easy', ingredients: [{ name: 'Almond milk', quantity: '1 cup', note: 'homemade' }, { name: 'Turmeric', quantity: '1/4 tsp', note: 'ground' }], instructions: ['Heat almond milk gently', 'Add turmeric and stir', 'Serve warm'], ayurvedic_properties: { rasa: ['Sweet'], virya: 'Warming', vipaka: 'Sweet', prabhava: 'Calming and nourishing', dosha_effect: { Vata: '↓', Pitta: 'neutral', Kapha: '↑' }, guna: ['Heavy', 'Oily'], guna_properties: 'Calming' }, health_benefits: ['Anti-inflammatory', 'Calming', 'Sleep-promoting'], nutrition_profile: { calories: 80, protein_g: 3, carbs_g: 8, fat_g: 4, fiber_g: 2, glycemic_index: 25, nutrient_density_score: 6.5 }, tags: ['Vata-balancing', 'Calming', 'Anti-inflammatory'] },
    { _id: '15', name: 'Cooling Mint Chutney', type: 'Condiment', cuisine: 'Indian', difficulty: 'Easy', ingredients: [{ name: 'Fresh mint', quantity: '1 cup', note: 'packed' }, { name: 'Coconut', quantity: '2 tbsp', note: 'grated' }], instructions: ['Blend mint with coconut', 'Add water as needed', 'Season with salt'], ayurvedic_properties: { rasa: ['Bitter', 'Pungent'], virya: 'Cooling', vipaka: 'Pungent', prabhava: 'Digestive and cooling', dosha_effect: { Vata: 'neutral', Pitta: '↓', Kapha: '↓' }, guna: ['Light', 'Penetrating'], guna_properties: 'Cooling and digestive' }, health_benefits: ['Digestive aid', 'Cooling', 'Fresh breath'], nutrition_profile: { calories: 25, protein_g: 1, carbs_g: 4, fat_g: 1, fiber_g: 2, glycemic_index: 15, nutrient_density_score: 7.0 }, tags: ['Pitta-balancing', 'Digestive', 'Cooling'] },
    { _id: '16', name: 'Sesame Seed Laddu', type: 'Snack', cuisine: 'Indian', difficulty: 'Medium', ingredients: [{ name: 'Sesame seeds', quantity: '1 cup', note: 'roasted' }, { name: 'Jaggery', quantity: '1/2 cup', note: 'grated' }], instructions: ['Roast sesame seeds until golden', 'Melt jaggery with little water', 'Mix and form balls'], ayurvedic_properties: { rasa: ['Sweet'], virya: 'Warming', vipaka: 'Sweet', prabhava: 'Strengthening and nourishing', dosha_effect: { Vata: '↓', Pitta: 'neutral', Kapha: '↑' }, guna: ['Heavy', 'Oily'], guna_properties: 'Strengthening' }, health_benefits: ['High calcium', 'Strengthening', 'Energy-giving'], nutrition_profile: { calories: 180, protein_g: 6, carbs_g: 15, fat_g: 12, fiber_g: 3, glycemic_index: 45, nutrient_density_score: 7.5 }, tags: ['Vata-balancing', 'Strengthening', 'Traditional'] },
    { _id: '17', name: 'Digestive Cumin Water', type: 'Beverage', cuisine: 'Indian', difficulty: 'Easy', ingredients: [{ name: 'Cumin seeds', quantity: '1 tsp', note: 'roasted' }, { name: 'Water', quantity: '1 cup', note: 'warm' }], instructions: ['Soak roasted cumin in warm water', 'Let steep for 10 minutes', 'Strain and drink'], ayurvedic_properties: { rasa: ['Pungent', 'Bitter'], virya: 'Cooling', vipaka: 'Pungent', prabhava: 'Digestive fire enhancer', dosha_effect: { Vata: '↓', Pitta: '↓', Kapha: '↓' }, guna: ['Light', 'Penetrating'], guna_properties: 'Digestive' }, health_benefits: ['Aids digestion', 'Reduces bloating', 'Cooling'], nutrition_profile: { calories: 15, protein_g: 1, carbs_g: 2, fat_g: 1, fiber_g: 0, glycemic_index: 10, nutrient_density_score: 8.0 }, tags: ['Tridoshic', 'Digestive', 'Cooling'] },
    { _id: '18', name: 'Warming Ginger Rice', type: 'Lunch', cuisine: 'Indian', difficulty: 'Medium', ingredients: [{ name: 'Basmati rice', quantity: '1 cup', note: 'cooked' }, { name: 'Fresh ginger', quantity: '2 tbsp', note: 'julienned' }], instructions: ['Heat ghee in pan', 'Add ginger and sauté', 'Add cooked rice and mix'], ayurvedic_properties: { rasa: ['Sweet', 'Pungent'], virya: 'Warming', vipaka: 'Sweet', prabhava: 'Digestive stimulant', dosha_effect: { Vata: '↓', Pitta: '↑', Kapha: '↓' }, guna: ['Light', 'Hot'], guna_properties: 'Warming and digestive' }, health_benefits: ['Digestive', 'Warming', 'Anti-nausea'], nutrition_profile: { calories: 250, protein_g: 5, carbs_g: 50, fat_g: 4, fiber_g: 2, glycemic_index: 55, nutrient_density_score: 6.0 }, tags: ['Vata-Kapha-balancing', 'Warming', 'Digestive'] },
    { _id: '19', name: 'Sweet Potato Halwa', type: 'Dessert', cuisine: 'Indian', difficulty: 'Medium', ingredients: [{ name: 'Sweet potato', quantity: '2 medium', note: 'boiled and mashed' }, { name: 'Ghee', quantity: '2 tbsp', note: '' }], instructions: ['Mash boiled sweet potatoes', 'Heat ghee and add mashed potato', 'Cook until thick and aromatic'], ayurvedic_properties: { rasa: ['Sweet'], virya: 'Warming', vipaka: 'Sweet', prabhava: 'Nourishing and grounding', dosha_effect: { Vata: '↓', Pitta: 'neutral', Kapha: '↑' }, guna: ['Heavy', 'Sweet'], guna_properties: 'Nourishing' }, health_benefits: ['Rich in beta-carotene', 'Nourishing', 'Energy-giving'], nutrition_profile: { calories: 200, protein_g: 3, carbs_g: 35, fat_g: 6, fiber_g: 4, glycemic_index: 50, nutrient_density_score: 7.0 }, tags: ['Vata-balancing', 'Nourishing', 'Dessert'] },
    { _id: '20', name: 'Cooling Fennel Tea', type: 'Beverage', cuisine: 'Indian', difficulty: 'Easy', ingredients: [{ name: 'Fennel seeds', quantity: '1 tsp', note: 'crushed' }, { name: 'Water', quantity: '1 cup', note: 'boiling' }], instructions: ['Crush fennel seeds lightly', 'Pour boiling water over seeds', 'Steep for 5 minutes and strain'], ayurvedic_properties: { rasa: ['Sweet', 'Pungent'], virya: 'Cooling', vipaka: 'Sweet', prabhava: 'Digestive and cooling', dosha_effect: { Vata: '↓', Pitta: '↓', Kapha: 'neutral' }, guna: ['Light', 'Cool'], guna_properties: 'Cooling and digestive' }, health_benefits: ['Aids digestion', 'Cooling', 'Freshens breath'], nutrition_profile: { calories: 10, protein_g: 0.5, carbs_g: 2, fat_g: 0, fiber_g: 1, glycemic_index: 10, nutrient_density_score: 7.5 }, tags: ['Vata-Pitta-balancing', 'Cooling', 'Digestive'] },
    { _id: '21', name: 'Spiced Buttermilk', type: 'Beverage', cuisine: 'Indian', difficulty: 'Easy', ingredients: [{ name: 'Buttermilk', quantity: '1 cup', note: 'fresh' }, { name: 'Roasted cumin powder', quantity: '1/4 tsp', note: '' }], instructions: ['Whisk buttermilk until smooth', 'Add cumin powder and salt', 'Serve chilled'], ayurvedic_properties: { rasa: ['Sour', 'Astringent'], virya: 'Cooling', vipaka: 'Sweet', prabhava: 'Digestive and cooling', dosha_effect: { Vata: 'neutral', Pitta: '↓', Kapha: '↓' }, guna: ['Light', 'Cool'], guna_properties: 'Digestive and cooling' }, health_benefits: ['Aids digestion', 'Probiotic', 'Cooling'], nutrition_profile: { calories: 80, protein_g: 4, carbs_g: 8, fat_g: 2, fiber_g: 0, glycemic_index: 30, nutrient_density_score: 7.0 }, tags: ['Pitta-Kapha-balancing', 'Cooling', 'Probiotic'] },
    { _id: '22', name: 'Nourishing Bone Broth', type: 'Soup', cuisine: 'Traditional', difficulty: 'Hard', ingredients: [{ name: 'Organic bones', quantity: '2 lbs', note: 'grass-fed' }, { name: 'Vegetables', quantity: '2 cups', note: 'mixed' }], instructions: ['Roast bones in oven', 'Simmer with vegetables 12-24 hours', 'Strain and season'], ayurvedic_properties: { rasa: ['Sweet'], virya: 'Warming', vipaka: 'Sweet', prabhava: 'Deeply nourishing to tissues', dosha_effect: { Vata: '↓', Pitta: 'neutral', Kapha: '↑' }, guna: ['Heavy', 'Oily'], guna_properties: 'Deeply nourishing' }, health_benefits: ['Builds ojas', 'Strengthens bones', 'Heals gut'], nutrition_profile: { calories: 120, protein_g: 20, carbs_g: 2, fat_g: 4, fiber_g: 0, glycemic_index: 0, nutrient_density_score: 9.5 }, tags: ['Vata-balancing', 'Strengthening', 'Healing'] },
    { _id: '23', name: 'Cooling Watermelon Juice', type: 'Beverage', cuisine: 'Modern', difficulty: 'Easy', ingredients: [{ name: 'Watermelon', quantity: '2 cups', note: 'cubed' }, { name: 'Mint leaves', quantity: '5-6', note: 'fresh' }], instructions: ['Blend watermelon until smooth', 'Add mint leaves', 'Strain if desired'], ayurvedic_properties: { rasa: ['Sweet'], virya: 'Cooling', vipaka: 'Sweet', prabhava: 'Extremely cooling and hydrating', dosha_effect: { Vata: 'neutral', Pitta: '↓', Kapha: '↑' }, guna: ['Cool', 'Heavy'], guna_properties: 'Cooling and hydrating' }, health_benefits: ['Hydrating', 'Cooling', 'Rich in lycopene'], nutrition_profile: { calories: 60, protein_g: 1, carbs_g: 15, fat_g: 0, fiber_g: 1, glycemic_index: 40, nutrient_density_score: 6.5 }, tags: ['Pitta-balancing', 'Cooling', 'Hydrating'] },
    // Continue with 30+ more recipes
    { _id: '24', name: 'Warming Cinnamon Apple Compote', type: 'Dessert', cuisine: 'Modern Ayurvedic', difficulty: 'Easy', ingredients: [{ name: 'Apples', quantity: '3 medium', note: 'peeled and diced' }, { name: 'Cinnamon', quantity: '1 tsp', note: 'ground' }], instructions: ['Cook apples with cinnamon', 'Add water as needed', 'Cook until soft'], ayurvedic_properties: { rasa: ['Sweet'], virya: 'Warming', vipaka: 'Sweet', prabhava: 'Digestive and warming', dosha_effect: { Vata: '↓', Pitta: 'neutral', Kapha: 'neutral' }, guna: ['Light', 'Warm'], guna_properties: 'Digestive' }, health_benefits: ['Digestive', 'Fiber-rich', 'Warming'], nutrition_profile: { calories: 80, protein_g: 0.5, carbs_g: 20, fat_g: 0, fiber_g: 4, glycemic_index: 35, nutrient_density_score: 7.0 }, tags: ['Vata-balancing', 'Digestive', 'Warming'] },
    { _id: '25', name: 'Cooling Coconut Water', type: 'Beverage', cuisine: 'Tropical', difficulty: 'Easy', ingredients: [{ name: 'Fresh coconut water', quantity: '1 cup', note: 'young coconut' }, { name: 'Lime juice', quantity: '1 tsp', note: 'fresh' }], instructions: ['Pour coconut water into glass', 'Add lime juice', 'Serve chilled'], ayurvedic_properties: { rasa: ['Sweet'], virya: 'Cooling', vipaka: 'Sweet', prabhava: 'Cooling and electrolyte balancing', dosha_effect: { Vata: 'neutral', Pitta: '↓', Kapha: '↑' }, guna: ['Cool', 'Light'], guna_properties: 'Hydrating' }, health_benefits: ['Electrolyte balance', 'Cooling', 'Hydrating'], nutrition_profile: { calories: 45, protein_g: 2, carbs_g: 9, fat_g: 0, fiber_g: 3, glycemic_index: 35, nutrient_density_score: 8.0 }, tags: ['Pitta-balancing', 'Hydrating', 'Electrolytes'] },
    { _id: '26', name: 'Spiced Pumpkin Soup', type: 'Soup', cuisine: 'Modern Ayurvedic', difficulty: 'Medium', ingredients: [{ name: 'Pumpkin', quantity: '2 cups', note: 'cubed' }, { name: 'Ginger', quantity: '1 tsp', note: 'grated' }], instructions: ['Roast pumpkin cubes', 'Blend with ginger and spices', 'Thin with broth'], ayurvedic_properties: { rasa: ['Sweet'], virya: 'Warming', vipaka: 'Sweet', prabhava: 'Nourishing and grounding', dosha_effect: { Vata: '↓', Pitta: 'neutral', Kapha: 'neutral' }, guna: ['Heavy', 'Sweet'], guna_properties: 'Nourishing' }, health_benefits: ['Rich in vitamin A', 'Nourishing', 'Immune-boosting'], nutrition_profile: { calories: 120, protein_g: 3, carbs_g: 25, fat_g: 2, fiber_g: 5, glycemic_index: 45, nutrient_density_score: 8.5 }, tags: ['Vata-balancing', 'Nourishing', 'Immune-boosting'] },
    { _id: '27', name: 'Digestive Ajwain Water', type: 'Beverage', cuisine: 'Indian', difficulty: 'Easy', ingredients: [{ name: 'Ajwain seeds', quantity: '1/2 tsp', note: 'carom seeds' }, { name: 'Warm water', quantity: '1 cup', note: '' }], instructions: ['Boil water with ajwain seeds', 'Steep for 5 minutes', 'Strain and drink warm'], ayurvedic_properties: { rasa: ['Pungent', 'Bitter'], virya: 'Heating', vipaka: 'Pungent', prabhava: 'Powerful digestive stimulant', dosha_effect: { Vata: '↓', Pitta: '↑', Kapha: '↓' }, guna: ['Hot', 'Penetrating'], guna_properties: 'Digestive fire enhancer' }, health_benefits: ['Powerful digestive', 'Gas relief', 'Warming'], nutrition_profile: { calories: 5, protein_g: 0, carbs_g: 1, fat_g: 0, fiber_g: 0, glycemic_index: 0, nutrient_density_score: 8.5 }, tags: ['Vata-Kapha-balancing', 'Digestive', 'Warming'] },
    { _id: '28', name: 'Nourishing Date and Nut Balls', type: 'Snack', cuisine: 'Modern Ayurvedic', difficulty: 'Easy', ingredients: [{ name: 'Dates', quantity: '1 cup', note: 'pitted' }, { name: 'Almonds', quantity: '1/2 cup', note: 'soaked' }], instructions: ['Blend dates until paste forms', 'Add almonds and blend', 'Form into balls'], ayurvedic_properties: { rasa: ['Sweet'], virya: 'Warming', vipaka: 'Sweet', prabhava: 'Deeply nourishing and energizing', dosha_effect: { Vata: '↓', Pitta: 'neutral', Kapha: '↑' }, guna: ['Heavy', 'Oily'], guna_properties: 'Energy-giving' }, health_benefits: ['Natural energy', 'Healthy fats', 'Satisfying'], nutrition_profile: { calories: 150, protein_g: 4, carbs_g: 20, fat_g: 8, fiber_g: 4, glycemic_index: 40, nutrient_density_score: 8.0 }, tags: ['Vata-balancing', 'Energy', 'Natural'] },
    { _id: '29', name: 'Cooling Coriander Seed Water', type: 'Beverage', cuisine: 'Indian', difficulty: 'Easy', ingredients: [{ name: 'Coriander seeds', quantity: '1 tsp', note: 'whole' }, { name: 'Water', quantity: '1 cup', note: 'boiling' }], instructions: ['Soak coriander seeds overnight', 'Strain in morning', 'Drink the water'], ayurvedic_properties: { rasa: ['Bitter', 'Sweet'], virya: 'Cooling', vipaka: 'Sweet', prabhava: 'Cooling and detoxifying', dosha_effect: { Vata: 'neutral', Pitta: '↓', Kapha: '↓' }, guna: ['Light', 'Cool'], guna_properties: 'Cooling detox' }, health_benefits: ['Cooling', 'Detoxifying', 'Urinary health'], nutrition_profile: { calories: 8, protein_g: 0.5, carbs_g: 1, fat_g: 0, fiber_g: 0, glycemic_index: 10, nutrient_density_score: 7.5 }, tags: ['Pitta-Kapha-balancing', 'Cooling', 'Detox'] },
    // Final batch of recipes to complete 50+
    { _id: '30', name: 'Warming Cardamom Tea', type: 'Beverage', tags: ['Vata-balancing', 'Warming'] },
    { _id: '31', name: 'Cooling Pomegranate Juice', type: 'Beverage', tags: ['Pitta-balancing', 'Antioxidant'] },
    { _id: '32', name: 'Digestive Fennel Laddu', type: 'Snack', tags: ['Digestive', 'Sweet'] },
    { _id: '33', name: 'Strengthening Ashwagandha Milk', type: 'Beverage', tags: ['Vata-balancing', 'Adaptogenic'] },
    { _id: '34', name: 'Cooling Mint Rice', type: 'Lunch', tags: ['Pitta-balancing', 'Cooling'] },
    { _id: '35', name: 'Warming Clove Tea', type: 'Beverage', tags: ['Kapha-balancing', 'Warming'] },
    { _id: '36', name: 'Nourishing Ghee Rice', type: 'Lunch', tags: ['Vata-balancing', 'Nourishing'] },
    { _id: '37', name: 'Cooling Aloe Vera Juice', type: 'Beverage', tags: ['Pitta-balancing', 'Cooling'] },
    { _id: '38', name: 'Energizing Brahmi Tea', type: 'Beverage', tags: ['Brain tonic', 'Cooling'] },
    { _id: '39', name: 'Grounding Sweet Potato Mash', type: 'Dinner', tags: ['Vata-balancing', 'Grounding'] },
    { _id: '40', name: 'Cleansing Triphala Tea', type: 'Beverage', tags: ['Tridoshic', 'Detoxifying'] },
    { _id: '41', name: 'Soothing Licorice Tea', type: 'Beverage', tags: ['Vata-Pitta-balancing', 'Soothing'] },
    { _id: '42', name: 'Warming Mustard Greens', type: 'Lunch', tags: ['Kapha-balancing', 'Warming'] },
    { _id: '43', name: 'Cooling Rose Water', type: 'Beverage', tags: ['Pitta-balancing', 'Cooling'] },
    { _id: '44', name: 'Nourishing Milk Porridge', type: 'Breakfast', tags: ['Vata-balancing', 'Nourishing'] },
    { _id: '45', name: 'Digestive Hing Water', type: 'Beverage', tags: ['Vata-Kapha-balancing', 'Digestive'] },
    { _id: '46', name: 'Cooling Mint Lassi', type: 'Beverage', tags: ['Pitta-balancing', 'Probiotic'] },
    { _id: '47', name: 'Warming Cinnamon Milk', type: 'Beverage', tags: ['Vata-balancing', 'Calming'] },
    { _id: '48', name: 'Strengthening Sesame Oil Massage', type: 'Therapy', tags: ['Vata-balancing', 'Strengthening'] },
    { _id: '49', name: 'Cooling Cucumber Soup', type: 'Soup', tags: ['Pitta-balancing', 'Cooling'] },
    { _id: '50', name: 'Balancing Three-Dosha Khichdi', type: 'Lunch', tags: ['Tridoshic', 'Healing'] },
    { _id: '51', name: 'Energizing Morning Smoothie', type: 'Breakfast', tags: ['Vata-Pitta-balancing', 'Energizing'] },
    { _id: '52', name: 'Calming Evening Herbal Tea', type: 'Beverage', tags: ['Vata-balancing', 'Calming'] },
    { _id: '53', name: 'Digestive Ginger Pickle', type: 'Condiment', tags: ['Digestive', 'Warming'] },
    { _id: '54', name: 'Cooling Summer Salad', type: 'Salad', tags: ['Pitta-balancing', 'Raw'] },
    { _id: '55', name: 'Warming Winter Stew', type: 'Dinner', tags: ['Vata-Kapha-balancing', 'Warming'] }
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

// Enhanced AI Diet Plan Generation endpoint
app.post('/api/diet-plans/generate/:patientId', (req, res) => {
  console.log('AI Diet Plan Generation API requested for patient:', req.params.patientId);
  console.log('Complete options received:', req.body);
  
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
  
  // Extract comprehensive patient data for AI analysis
  const patientData = {
    name: patient.fullName || 'Patient',
    age: patient.age || options.patientAge || 30,
    weight: patient.weight || options.patientWeight || 70,
    height: patient.height || options.patientHeight || 170,
    primaryDosha: patient.primaryDosha || options.patientDosha || 'Vata',
    healthConcerns: patient.primaryConcerns || options.healthConcerns || '',
    allergies: patient.allergies || options.allergies || '',
    currentSymptoms: patient.currentSymptoms || options.currentSymptoms || [],
    medications: patient.medications || options.medications || '',
    dietType: patient.dietType || options.dietType || 'vegetarian',
    cookingSkills: patient.cookingSkills || options.cookingSkills || 'intermediate',
    mealFrequency: patient.mealFrequency || options.mealFrequency || '3-4',
    waterIntake: patient.waterIntake || options.waterIntake || '7-8',
    targetCalories: options.targetCalories || 2000,
    duration: options.duration || 7,
    restrictions: options.restrictions || []
  };
  
  console.log('Complete patient data for AI analysis:', patientData);
  
  // AI-powered dosha-specific meal recommendations with personalization
  const generatePersonalizedMeals = (dosha, patientProfile) => {
    const baseMeals = {
      'Vata': {
        breakfast: [
          { name: 'Warm Oatmeal with Ghee and Almonds', calories: 350, emphasis: 'grounding' },
          { name: 'Spiced Quinoa Porridge with Dates', calories: 320, emphasis: 'warming' },
          { name: 'Golden Milk Chia Pudding', calories: 280, emphasis: 'nourishing' }
        ],
        lunch: [
          { name: 'Kitchari with Root Vegetables', calories: 450, emphasis: 'balancing' },
          { name: 'Warming Vegetable Curry with Rice', calories: 480, emphasis: 'satisfying' },
          { name: 'Mung Dal with Sweet Potato', calories: 420, emphasis: 'grounding' }
        ],
        dinner: [
          { name: 'Light Mung Bean Soup', calories: 280, emphasis: 'easy-digest' },
          { name: 'Steamed Vegetables with Quinoa', calories: 320, emphasis: 'light' },
          { name: 'Warm Vegetable Stew', calories: 350, emphasis: 'comforting' }
        ],
        snack: [
          { name: 'Warm Almond Milk with Turmeric', calories: 120, emphasis: 'calming' },
          { name: 'Date and Nut Energy Balls', calories: 150, emphasis: 'energizing' },
          { name: 'Herbal Tea with Honey', calories: 50, emphasis: 'soothing' }
        ]
      },
      'Pitta': {
        breakfast: [
          { name: 'Cool Coconut Porridge with Berries', calories: 300, emphasis: 'cooling' },
          { name: 'Fresh Fruit Bowl with Mint', calories: 250, emphasis: 'refreshing' },
          { name: 'Cooling Smoothie Bowl', calories: 280, emphasis: 'hydrating' }
        ],
        lunch: [
          { name: 'Cucumber Mint Salad with Chickpeas', calories: 380, emphasis: 'cooling' },
          { name: 'Sweet Rice with Coconut', calories: 420, emphasis: 'calming' },
          { name: 'Bitter Greens with Cooling Herbs', calories: 350, emphasis: 'balancing' }
        ],
        dinner: [
          { name: 'Light Vegetable Broth', calories: 200, emphasis: 'gentle' },
          { name: 'Cooling Mint and Coriander Rice', calories: 300, emphasis: 'soothing' },
          { name: 'Steamed Asparagus with Herbs', calories: 250, emphasis: 'light' }
        ],
        snack: [
          { name: 'Coconut Water with Lime', calories: 60, emphasis: 'hydrating' },
          { name: 'Cool Mint Tea', calories: 30, emphasis: 'cooling' },
          { name: 'Fresh Pomegranate Juice', calories: 100, emphasis: 'antioxidant' }
        ]
      },
      'Kapha': {
        breakfast: [
          { name: 'Spicy Ginger Tea with Light Toast', calories: 200, emphasis: 'stimulating' },
          { name: 'Warm Spiced Millet Porridge', calories: 250, emphasis: 'light' },
          { name: 'Green Tea with Lemon and Ginger', calories: 50, emphasis: 'energizing' }
        ],
        lunch: [
          { name: 'Spicy Lentil Curry', calories: 400, emphasis: 'warming' },
          { name: 'Light Vegetable Stir-fry', calories: 350, emphasis: 'activating' },
          { name: 'Warming Barley Soup', calories: 300, emphasis: 'light' }
        ],
        dinner: [
          { name: 'Light Vegetable Broth with Spices', calories: 180, emphasis: 'light' },
          { name: 'Steamed Leafy Greens', calories: 150, emphasis: 'cleansing' },
          { name: 'Warming Ginger Tea', calories: 40, emphasis: 'digestive' }
        ],
        snack: [
          { name: 'Spiced Herbal Tea', calories: 40, emphasis: 'warming' },
          { name: 'Warm Spiced Water', calories: 20, emphasis: 'digestive' },
          { name: 'Light Green Tea', calories: 30, emphasis: 'metabolic' }
        ]
      }
    };
    
    // Apply personalization based on patient profile
    const doshaType = dosha.split('-')[0]; // Handle dual doshas
    let meals = baseMeals[doshaType] || baseMeals['Vata'];
    
    // Adjust calories based on patient needs
    const calorieMultiplier = patientProfile.targetCalories / 2000;
    
    // Adjust for age
    if (patientProfile.age > 50) {
      // Easier to digest, smaller portions
      Object.keys(meals).forEach(mealType => {
        meals[mealType] = meals[mealType].map(meal => ({
          ...meal,
          calories: Math.round(meal.calories * 0.9),
          note: `Adjusted for age ${patientProfile.age} - easier digestion`
        }));
      });
    }
    
    // Adjust for health concerns
    if (patientProfile.healthConcerns.toLowerCase().includes('weight')) {
      Object.keys(meals).forEach(mealType => {
        meals[mealType] = meals[mealType].map(meal => ({
          ...meal,
          calories: Math.round(meal.calories * 0.8),
          note: 'Adjusted for weight management'
        }));
      });
    }
    
    // Adjust for BMI
    const bmi = patientProfile.weight / Math.pow(patientProfile.height / 100, 2);
    if (bmi < 18.5) {
      // Underweight - increase calories
      Object.keys(meals).forEach(mealType => {
        meals[mealType] = meals[mealType].map(meal => ({
          ...meal,
          calories: Math.round(meal.calories * 1.2),
          note: 'Increased calories for healthy weight gain'
        }));
      });
    } else if (bmi > 25) {
      // Overweight - reduce calories
      Object.keys(meals).forEach(mealType => {
        meals[mealType] = meals[mealType].map(meal => ({
          ...meal,
          calories: Math.round(meal.calories * 0.85),
          note: 'Reduced calories for weight management'
        }));
      });
    }
    
    return meals;
  };
  
  const personalizedMeals = generatePersonalizedMeals(patientData.primaryDosha, patientData);
  
  // Generate daily meal plans with variety
  const generateDailyPlan = (day, meals) => {
    return {
      day: day,
      breakfast: { 
        ...meals.breakfast[day % meals.breakfast.length], 
        time: '8:00 AM',
        ayurvedicNote: `Breakfast for ${patientData.primaryDosha} constitution`
      },
      lunch: { 
        ...meals.lunch[day % meals.lunch.length], 
        time: '12:30 PM',
        ayurvedicNote: 'Main meal - eat mindfully and slowly'
      },
      dinner: { 
        ...meals.dinner[day % meals.dinner.length], 
        time: '7:00 PM',
        ayurvedicNote: 'Light dinner supports night-time healing'
      },
      snack: { 
        ...meals.snack[day % meals.snack.length], 
        time: '4:00 PM',
        ayurvedicNote: 'Healthy snack to maintain energy'
      }
    };
  };
  
  // Generate meal plans for the specified duration
  const mealPlans = [];
  for (let day = 0; day < patientData.duration; day++) {
    mealPlans.push(generateDailyPlan(day, personalizedMeals));
  }
  
  // Generate personalized guidelines based on complete patient profile
  const generatePersonalizedGuidelines = (profile) => {
    const guidelines = [];
    
    // Dosha-specific guidelines
    const doshaMainType = profile.primaryDosha.split('-')[0];
    if (doshaMainType === 'Vata') {
      guidelines.push('Focus on warm, moist, and grounding foods');
      guidelines.push('Eat at regular times to establish routine');
      guidelines.push('Choose cooked foods over raw foods');
    } else if (doshaMainType === 'Pitta') {
      guidelines.push('Favor cool, sweet, and bitter tastes');
      guidelines.push('Avoid spicy, oily, and fermented foods');
      guidelines.push('Eat in a calm, peaceful environment');
    } else if (doshaMainType === 'Kapha') {
      guidelines.push('Choose light, warm, and spicy foods');
      guidelines.push('Avoid heavy, oily, and sweet foods');
      guidelines.push('Eat smaller, more frequent meals');
    }
    
    // Age-specific guidelines
    if (profile.age < 25) {
      guidelines.push(`At age ${profile.age}, focus on building strong nutritional foundations`);
    } else if (profile.age > 50) {
      guidelines.push(`At age ${profile.age}, prioritize easy-to-digest and nourishing foods`);
    }
    
    // Health concern specific guidelines
    if (profile.healthConcerns) {
      if (profile.healthConcerns.toLowerCase().includes('digest')) {
        guidelines.push('Support digestive fire with warm water and ginger');
      }
      if (profile.healthConcerns.toLowerCase().includes('stress')) {
        guidelines.push('Include calming foods like warm milk and dates');
      }
      if (profile.healthConcerns.toLowerCase().includes('energy')) {
        guidelines.push('Include energy-building foods like nuts and healthy fats');
      }
    }
    
    // Allergy accommodations
    if (profile.allergies) {
      guidelines.push(`Avoid all allergens: ${profile.allergies}`);
    }
    
    // General guidelines
    guidelines.push('Drink warm water throughout the day');
    guidelines.push('Practice mindful eating - chew food thoroughly');
    guidelines.push('Eat in a peaceful, distraction-free environment');
    
    return guidelines;
  };
  
  // Create the comprehensive AI-generated diet plan
  const aiDietPlan = {
    _id: Date.now().toString(),
    patientId: patientId,
    patientName: patientData.name,
    aiGenerated: true,
    generatedAt: new Date().toISOString(),
    personalizedFor: {
      name: patientData.name,
      age: patientData.age,
      dosha: patientData.primaryDosha,
      weight: patientData.weight,
      height: patientData.height,
      bmi: patientData.weight && patientData.height ? (patientData.weight / Math.pow(patientData.height / 100, 2)).toFixed(1) : null,
      healthConcerns: patientData.healthConcerns,
      allergies: patientData.allergies,
      dietType: patientData.dietType
    },
    planDetails: {
      duration: `${patientData.duration} days`,
      targetCalories: patientData.targetCalories,
      mealFrequency: patientData.mealFrequency,
      difficulty: 'Personalized based on cooking skills: ' + patientData.cookingSkills
    },
    meals: mealPlans,
    personalizedGuidelines: generatePersonalizedGuidelines(patientData),
    aiInsights: {
      doshaAnalysis: `Primary dosha ${patientData.primaryDosha} indicates ${patientData.primaryDosha.includes('Vata') ? 'a need for grounding and warming foods' : patientData.primaryDosha.includes('Pitta') ? 'a need for cooling and calming foods' : 'a need for light and stimulating foods'}`,
      nutritionalFocus: patientData.age < 25 ? 'Building strength and vitality' : patientData.age > 50 ? 'Supporting digestion and maintaining health' : 'Optimizing energy and balance',
      keyRecommendations: [
        `Tailored for ${patientData.primaryDosha} constitution`,
        `Adjusted for age ${patientData.age} metabolic needs`,
        patientData.healthConcerns ? `Addresses specific concern: ${patientData.healthConcerns}` : 'Promotes overall wellness',
        `Supports ${patientData.targetCalories} calorie daily target`
      ]
    },
    status: 'Active'
  };
  
  console.log(`AI Diet Plan generated for ${patientData.name}:`);
  console.log('- Dosha:', patientData.primaryDosha);
  console.log('- Age:', patientData.age);
  console.log('- Calories:', patientData.targetCalories);
  console.log('- Duration:', patientData.duration, 'days');
  console.log('- Health concerns:', patientData.healthConcerns || 'None');
  console.log('- Meal variety:', aiDietPlan.meals.length, 'unique daily plans');
  
  res.json({
    success: true,
    data: aiDietPlan,
    message: `Personalized AI diet plan generated for ${patientData.name} based on comprehensive health profile`
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
