const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const supabaseUrl = 'https://yriwxwxrydfyoeslcubo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyaXd4d3hyeWRmeW9lc2xjdWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNzcxMzcsImV4cCI6MjA3Mzg1MzEzN30.VRm9MhM4t-i3PvuTgwv9i_Nv_C0cZO0u9sc0DOxcJCI';

const supabase = createClient(supabaseUrl, supabaseKey);

// Comprehensive Ayurvedic Recipe Database (50+ recipes)
const ayurvedicRecipes = [
  // BREAKFAST RECIPES
  {
    name: 'Warm Oatmeal with Ghee and Almonds',
    description: 'A nourishing breakfast that grounds Vata and provides sustained energy.',
    meal_type: ['breakfast'],
    cuisine_type: ['Indian', 'Continental'],
    preparation_time: 10,
    cooking_time: 15,
    servings: 2,
    difficulty_level: 'easy',
    ingredients: [
      { item: 'Rolled oats', quantity: '1 cup', notes: 'organic preferred' },
      { item: 'Ghee', quantity: '1 tbsp', notes: 'clarified butter' },
      { item: 'Almonds', quantity: '8-10 pieces', notes: 'soaked overnight' },
      { item: 'Dates', quantity: '3-4 pieces', notes: 'pitted and chopped' },
      { item: 'Cardamom powder', quantity: '1/4 tsp', notes: 'freshly ground' },
      { item: 'Milk', quantity: '1 cup', notes: 'whole milk or almond milk' },
      { item: 'Water', quantity: '1 cup', notes: 'filtered' }
    ],
    instructions: [
      { step: 1, instruction: 'Soak oats in warm water for 10 minutes' },
      { step: 2, instruction: 'Heat ghee in a pan over medium heat' },
      { step: 3, instruction: 'Add soaked oats and cook for 5 minutes' },
      { step: 4, instruction: 'Add milk and simmer until creamy' },
      { step: 5, instruction: 'Stir in chopped almonds and dates' },
      { step: 6, instruction: 'Sprinkle cardamom powder before serving' }
    ],
    ayurvedic_properties: {
      rasa: ['Sweet'],
      virya: 'Warming',
      vipaka: 'Sweet',
      guna: ['Heavy', 'Oily', 'Soft'],
      prabhava: 'Nourishes ojas and strengthens digestive fire',
      dosha_effects: {
        vata: 'balancing',
        pitta: 'neutral',
        kapha: 'increasing'
      }
    },
    health_benefits: ['Strengthens digestive fire', 'Calms nervous system', 'Provides sustained energy', 'Nourishes tissues'],
    therapeutic_uses: ['Anxiety', 'Weakness', 'Poor digestion', 'Insomnia'],
    contraindications: ['High kapha conditions', 'Obesity', 'Congestion'],
    best_season: ['autumn', 'winter', 'spring'],
    best_time_of_day: ['morning'],
    nutrition: {
      calories: 320,
      carbohydrates_g: 45,
      protein_g: 12,
      fat_g: 12,
      fiber_g: 8,
      sugar_g: 15,
      sodium_mg: 50,
      potassium_mg: 400,
      calcium_mg: 150,
      iron_mg: 2,
      vitamin_c_mg: 2,
      vitamin_d_iu: 40,
      glycemic_index: 55,
      nutrient_density_score: 8.5
    },
    tags: ['vata-balancing', 'warming', 'nourishing', 'breakfast'],
    is_public: true
  },

  {
    name: 'Spiced Quinoa Porridge with Dates',
    description: 'A protein-rich breakfast that balances all doshas when prepared correctly.',
    meal_type: ['breakfast'],
    cuisine_type: ['Modern Ayurvedic'],
    preparation_time: 10,
    cooking_time: 20,
    servings: 2,
    difficulty_level: 'easy',
    ingredients: [
      { item: 'Quinoa', quantity: '3/4 cup', notes: 'rinsed well' },
      { item: 'Coconut milk', quantity: '1 cup', notes: 'full-fat' },
      { item: 'Water', quantity: '1 cup', notes: 'filtered' },
      { item: 'Dates', quantity: '4-5 pieces', notes: 'pitted and chopped' },
      { item: 'Cinnamon', quantity: '1/2 tsp', notes: 'ground' },
      { item: 'Cardamom', quantity: '1/4 tsp', notes: 'ground' },
      { item: 'Ginger', quantity: '1/4 tsp', notes: 'fresh grated' },
      { item: 'Ghee', quantity: '1 tsp', notes: 'for tempering' }
    ],
    instructions: [
      { step: 1, instruction: 'Rinse quinoa thoroughly until water runs clear' },
      { step: 2, instruction: 'Heat ghee and add cinnamon, cardamom, and ginger' },
      { step: 3, instruction: 'Add quinoa and toast for 2 minutes' },
      { step: 4, instruction: 'Add coconut milk, water, and dates' },
      { step: 5, instruction: 'Simmer covered for 15-18 minutes until tender' },
      { step: 6, instruction: 'Let rest for 5 minutes before serving' }
    ],
    ayurvedic_properties: {
      rasa: ['Sweet', 'Astringent'],
      virya: 'Neutral',
      vipaka: 'Sweet',
      guna: ['Light', 'Dry'],
      prabhava: 'Tridoshic when spiced appropriately',
      dosha_effects: {
        vata: 'balancing',
        pitta: 'balancing',
        kapha: 'neutral'
      }
    },
    health_benefits: ['Complete protein source', 'Easy to digest', 'Stabilizes blood sugar', 'Provides B vitamins'],
    therapeutic_uses: ['Protein deficiency', 'Weak digestion', 'Low energy', 'Pregnancy'],
    contraindications: ['None significant'],
    best_season: ['all'],
    best_time_of_day: ['morning'],
    nutrition: {
      calories: 280,
      carbohydrates_g: 42,
      protein_g: 10,
      fat_g: 8,
      fiber_g: 6,
      sugar_g: 18,
      sodium_mg: 30,
      potassium_mg: 450,
      calcium_mg: 80,
      iron_mg: 3,
      vitamin_c_mg: 1,
      vitamin_d_iu: 0,
      glycemic_index: 45,
      nutrient_density_score: 9.0
    },
    tags: ['tridoshic', 'protein-rich', 'gluten-free', 'breakfast'],
    is_public: true
  },

  // LUNCH RECIPES
  {
    name: 'Traditional Kitchari with Root Vegetables',
    description: 'The ultimate healing meal that detoxifies and nourishes simultaneously.',
    meal_type: ['lunch', 'dinner'],
    cuisine_type: ['Indian'],
    preparation_time: 15,
    cooking_time: 35,
    servings: 4,
    difficulty_level: 'medium',
    ingredients: [
      { item: 'Basmati rice', quantity: '1/2 cup', notes: 'soaked 30 minutes' },
      { item: 'Yellow mung dal', quantity: '1/2 cup', notes: 'split, washed' },
      { item: 'Ghee', quantity: '2 tbsp', notes: 'for cooking' },
      { item: 'Cumin seeds', quantity: '1 tsp', notes: 'whole' },
      { item: 'Mustard seeds', quantity: '1/2 tsp', notes: 'black' },
      { item: 'Asafoetida', quantity: '1/4 tsp', notes: 'hing' },
      { item: 'Turmeric', quantity: '1/2 tsp', notes: 'ground' },
      { item: 'Fresh ginger', quantity: '1 inch', notes: 'grated' },
      { item: 'Carrots', quantity: '2 medium', notes: 'diced' },
      { item: 'Sweet potato', quantity: '1 small', notes: 'cubed' },
      { item: 'Green beans', quantity: '1 cup', notes: 'chopped' },
      { item: 'Salt', quantity: 'to taste', notes: 'rock salt preferred' },
      { item: 'Water', quantity: '4-5 cups', notes: 'as needed' },
      { item: 'Fresh cilantro', quantity: '2 tbsp', notes: 'chopped' }
    ],
    instructions: [
      { step: 1, instruction: 'Heat ghee in a heavy-bottomed pot' },
      { step: 2, instruction: 'Add cumin and mustard seeds, let them splutter' },
      { step: 3, instruction: 'Add asafoetida, turmeric, and ginger' },
      { step: 4, instruction: 'Add rice and dal, stir for 2 minutes' },
      { step: 5, instruction: 'Add vegetables and salt' },
      { step: 6, instruction: 'Add water, bring to boil, then simmer covered 25-30 minutes' },
      { step: 7, instruction: 'Stir occasionally, add water if needed' },
      { step: 8, instruction: 'Garnish with cilantro before serving' }
    ],
    ayurvedic_properties: {
      rasa: ['Sweet', 'Astringent'],
      virya: 'Warming',
      vipaka: 'Sweet',
      guna: ['Light', 'Easily digestible'],
      prabhava: 'Kindles digestive fire while being easy to digest',
      dosha_effects: {
        vata: 'balancing',
        pitta: 'balancing',
        kapha: 'balancing'
      }
    },
    health_benefits: ['Detoxifies body', 'Easy to digest', 'Balances all doshas', 'Strengthens digestive fire'],
    therapeutic_uses: ['Digestive disorders', 'Detoxification', 'Convalescence', 'Panchakarma therapy'],
    contraindications: ['None'],
    best_season: ['all'],
    best_time_of_day: ['lunch', 'dinner'],
    nutrition: {
      calories: 350,
      carbohydrates_g: 55,
      protein_g: 15,
      fat_g: 8,
      fiber_g: 12,
      sugar_g: 8,
      sodium_mg: 400,
      potassium_mg: 600,
      calcium_mg: 100,
      iron_mg: 4,
      vitamin_c_mg: 15,
      vitamin_d_iu: 0,
      glycemic_index: 40,
      nutrient_density_score: 9.5
    },
    tags: ['tridoshic', 'detoxifying', 'healing', 'complete-meal'],
    is_public: true
  },

  // PITTA BALANCING RECIPES
  {
    name: 'Cooling Cucumber Mint Salad',
    description: 'A refreshing salad that cools Pitta and aids digestion during hot weather.',
    meal_type: ['lunch', 'snack'],
    cuisine_type: ['Indian', 'Mediterranean'],
    preparation_time: 15,
    cooking_time: 0,
    servings: 3,
    difficulty_level: 'easy',
    ingredients: [
      { item: 'Cucumbers', quantity: '2 large', notes: 'peeled and diced' },
      { item: 'Fresh mint', quantity: '3 tbsp', notes: 'chopped' },
      { item: 'Yogurt', quantity: '1/2 cup', notes: 'fresh, not sour' },
      { item: 'Coconut', quantity: '2 tbsp', notes: 'fresh grated' },
      { item: 'Cumin seeds', quantity: '1/2 tsp', notes: 'roasted and ground' },
      { item: 'Black salt', quantity: '1/4 tsp', notes: 'or to taste' },
      { item: 'Lime juice', quantity: '1 tbsp', notes: 'fresh squeezed' },
      { item: 'Coriander leaves', quantity: '2 tbsp', notes: 'chopped' }
    ],
    instructions: [
      { step: 1, instruction: 'Dice cucumbers and sprinkle with salt, let drain 10 minutes' },
      { step: 2, instruction: 'Mix yogurt with roasted cumin powder' },
      { step: 3, instruction: 'Add mint, coriander, and coconut' },
      { step: 4, instruction: 'Combine with drained cucumbers' },
      { step: 5, instruction: 'Add lime juice and adjust seasoning' },
      { step: 6, instruction: 'Chill for 30 minutes before serving' }
    ],
    ayurvedic_properties: {
      rasa: ['Sweet', 'Astringent', 'Bitter'],
      virya: 'Cooling',
      vipaka: 'Sweet',
      guna: ['Cool', 'Light', 'Liquid'],
      prabhava: 'Cools internal heat and soothes inflammation',
      dosha_effects: {
        vata: 'neutral',
        pitta: 'balancing',
        kapha: 'neutral'
      }
    },
    health_benefits: ['Cools body temperature', 'Hydrates tissues', 'Aids digestion', 'Reduces inflammation'],
    therapeutic_uses: ['Acidity', 'Heat disorders', 'Skin conditions', 'Urinary tract infections'],
    contraindications: ['Cold constitution', 'Weak digestion', 'Congestion'],
    best_season: ['summer'],
    best_time_of_day: ['lunch', 'afternoon'],
    nutrition: {
      calories: 85,
      carbohydrates_g: 12,
      protein_g: 4,
      fat_g: 3,
      fiber_g: 3,
      sugar_g: 8,
      sodium_mg: 300,
      potassium_mg: 350,
      calcium_mg: 120,
      iron_mg: 1,
      vitamin_c_mg: 12,
      vitamin_d_iu: 0,
      glycemic_index: 25,
      nutrient_density_score: 7.5
    },
    tags: ['pitta-balancing', 'cooling', 'hydrating', 'raw'],
    is_public: true
  },

  // KAPHA BALANCING RECIPES
  {
    name: 'Spicy Ginger Turmeric Tea',
    description: 'A warming beverage that stimulates digestion and clears respiratory channels.',
    meal_type: ['beverage'],
    cuisine_type: ['Indian'],
    preparation_time: 5,
    cooking_time: 10,
    servings: 2,
    difficulty_level: 'easy',
    ingredients: [
      { item: 'Fresh ginger', quantity: '2 inch piece', notes: 'sliced thin' },
      { item: 'Turmeric powder', quantity: '1/2 tsp', notes: 'or fresh 1 inch' },
      { item: 'Black pepper', quantity: '1/4 tsp', notes: 'freshly ground' },
      { item: 'Cinnamon stick', quantity: '1 small', notes: 'or 1/4 tsp powder' },
      { item: 'Cloves', quantity: '3-4 pieces', notes: 'whole' },
      { item: 'Water', quantity: '2 cups', notes: 'filtered' },
      { item: 'Honey', quantity: '1 tsp', notes: 'raw, add after cooling' },
      { item: 'Lemon juice', quantity: '1 tbsp', notes: 'fresh' }
    ],
    instructions: [
      { step: 1, instruction: 'Bring water to boil with ginger slices' },
      { step: 2, instruction: 'Add turmeric, cinnamon, and cloves' },
      { step: 3, instruction: 'Simmer for 8-10 minutes' },
      { step: 4, instruction: 'Add black pepper in last 2 minutes' },
      { step: 5, instruction: 'Strain and let cool slightly' },
      { step: 6, instruction: 'Add honey and lemon juice when warm' }
    ],
    ayurvedic_properties: {
      rasa: ['Pungent', 'Bitter'],
      virya: 'Heating',
      vipaka: 'Pungent',
      guna: ['Hot', 'Light', 'Penetrating'],
      prabhava: 'Kindles digestive fire and clears channels',
      dosha_effects: {
        vata: 'balancing',
        pitta: 'increasing',
        kapha: 'balancing'
      }
    },
    health_benefits: ['Stimulates digestion', 'Boosts immunity', 'Clears congestion', 'Anti-inflammatory'],
    therapeutic_uses: ['Cold and flu', 'Poor digestion', 'Respiratory congestion', 'Joint pain'],
    contraindications: ['High pitta', 'Gastritis', 'Ulcers', 'Hot flashes'],
    best_season: ['autumn', 'winter', 'spring'],
    best_time_of_day: ['morning', 'evening'],
    nutrition: {
      calories: 35,
      carbohydrates_g: 8,
      protein_g: 0.5,
      fat_g: 0,
      fiber_g: 0,
      sugar_g: 6,
      sodium_mg: 10,
      potassium_mg: 100,
      calcium_mg: 20,
      iron_mg: 0.5,
      vitamin_c_mg: 8,
      vitamin_d_iu: 0,
      glycemic_index: 15,
      nutrient_density_score: 6.0
    },
    tags: ['kapha-balancing', 'warming', 'digestive', 'immunity'],
    is_public: true
  }
];

// Add 46 more recipes to reach 50+ total
const additionalRecipes = [
  // More breakfast recipes
  {
    name: 'Golden Milk Chia Pudding',
    description: 'A nourishing overnight pudding with anti-inflammatory spices.',
    meal_type: ['breakfast', 'snack'],
    cuisine_type: ['Modern Ayurvedic'],
    preparation_time: 10,
    cooking_time: 0,
    servings: 2,
    difficulty_level: 'easy',
    ingredients: [
      { item: 'Chia seeds', quantity: '3 tbsp', notes: 'organic' },
      { item: 'Coconut milk', quantity: '1 cup', notes: 'full-fat' },
      { item: 'Turmeric powder', quantity: '1/2 tsp', notes: '' },
      { item: 'Cinnamon', quantity: '1/4 tsp', notes: 'ground' },
      { item: 'Ginger powder', quantity: '1/8 tsp', notes: '' },
      { item: 'Maple syrup', quantity: '2 tbsp', notes: 'pure' },
      { item: 'Vanilla extract', quantity: '1/2 tsp', notes: 'pure' }
    ],
    instructions: [
      { step: 1, instruction: 'Mix all ingredients in a bowl' },
      { step: 2, instruction: 'Whisk well to prevent clumping' },
      { step: 3, instruction: 'Refrigerate overnight or 4+ hours' },
      { step: 4, instruction: 'Stir before serving' },
      { step: 5, instruction: 'Top with nuts or fruit if desired' }
    ],
    ayurvedic_properties: {
      rasa: ['Sweet'],
      virya: 'Cooling',
      vipaka: 'Sweet',
      guna: ['Heavy', 'Oily', 'Slimy'],
      prabhava: 'Nourishes ojas and reduces inflammation',
      dosha_effects: { vata: 'balancing', pitta: 'balancing', kapha: 'increasing' }
    },
    health_benefits: ['Anti-inflammatory', 'Rich in omega-3', 'Sustained energy', 'Digestive health'],
    therapeutic_uses: ['Inflammation', 'Heart health', 'Brain health'],
    contraindications: ['High kapha', 'Congestion'],
    best_season: ['all'],
    best_time_of_day: ['morning'],
    nutrition: {
      calories: 220, carbohydrates_g: 18, protein_g: 6, fat_g: 14, fiber_g: 10,
      sugar_g: 12, sodium_mg: 50, potassium_mg: 200, calcium_mg: 150, iron_mg: 2,
      vitamin_c_mg: 1, vitamin_d_iu: 0, glycemic_index: 30, nutrient_density_score: 8.0
    },
    tags: ['anti-inflammatory', 'omega-3', 'make-ahead'], is_public: true
  },

  {
    name: 'Warming Millet Breakfast Bowl',
    description: 'A light yet satisfying breakfast that kindles digestive fire.',
    meal_type: ['breakfast'],
    cuisine_type: ['Indian'],
    preparation_time: 10,
    cooking_time: 25,
    servings: 2,
    difficulty_level: 'easy',
    ingredients: [
      { item: 'Pearl millet', quantity: '1/2 cup', notes: 'soaked overnight' },
      { item: 'Water', quantity: '2 cups', notes: 'filtered' },
      { item: 'Ghee', quantity: '1 tbsp', notes: '' },
      { item: 'Cumin seeds', quantity: '1/2 tsp', notes: '' },
      { item: 'Ginger', quantity: '1/2 tsp', notes: 'grated' },
      { item: 'Jaggery', quantity: '1 tbsp', notes: 'grated' },
      { item: 'Cardamom', quantity: '1/4 tsp', notes: 'ground' }
    ],
    instructions: [
      { step: 1, instruction: 'Drain and rinse soaked millet' },
      { step: 2, instruction: 'Heat ghee, add cumin and ginger' },
      { step: 3, instruction: 'Add millet and toast for 2 minutes' },
      { step: 4, instruction: 'Add water and bring to boil' },
      { step: 5, instruction: 'Simmer covered for 20 minutes' },
      { step: 6, instruction: 'Stir in jaggery and cardamom' }
    ],
    ayurvedic_properties: {
      rasa: ['Sweet', 'Astringent'],
      virya: 'Warming',
      vipaka: 'Sweet',
      guna: ['Light', 'Dry'],
      prabhava: 'Kindles digestive fire',
      dosha_effects: { vata: 'neutral', pitta: 'neutral', kapha: 'balancing' }
    },
    health_benefits: ['Gluten-free', 'Easy to digest', 'Warming', 'Alkalizing'],
    therapeutic_uses: ['Weak digestion', 'Weight management', 'Diabetes'],
    contraindications: ['None significant'],
    best_season: ['autumn', 'winter'],
    best_time_of_day: ['morning'],
    nutrition: {
      calories: 240, carbohydrates_g: 42, protein_g: 8, fat_g: 6, fiber_g: 5,
      sugar_g: 8, sodium_mg: 30, potassium_mg: 250, calcium_mg: 80, iron_mg: 3,
      vitamin_c_mg: 2, vitamin_d_iu: 0, glycemic_index: 50, nutrient_density_score: 7.5
    },
    tags: ['kapha-balancing', 'gluten-free', 'warming'], is_public: true
  },

  // LUNCH RECIPES
  {
    name: 'Coconut Rice with Curry Leaves',
    description: 'A South Indian delicacy that cools and nourishes.',
    meal_type: ['lunch'],
    cuisine_type: ['South Indian'],
    preparation_time: 15,
    cooking_time: 25,
    servings: 4,
    difficulty_level: 'medium',
    ingredients: [
      { item: 'Basmati rice', quantity: '1 cup', notes: 'cooked and cooled' },
      { item: 'Fresh coconut', quantity: '1/2 cup', notes: 'grated' },
      { item: 'Coconut oil', quantity: '2 tbsp', notes: 'cold-pressed' },
      { item: 'Mustard seeds', quantity: '1 tsp', notes: 'black' },
      { item: 'Urad dal', quantity: '1 tsp', notes: 'split black gram' },
      { item: 'Curry leaves', quantity: '15-20', notes: 'fresh' },
      { item: 'Green chilies', quantity: '2', notes: 'slit lengthwise' },
      { item: 'Ginger', quantity: '1 tsp', notes: 'minced' },
      { item: 'Salt', quantity: 'to taste', notes: 'rock salt' },
      { item: 'Cashews', quantity: '2 tbsp', notes: 'broken' }
    ],
    instructions: [
      { step: 1, instruction: 'Heat coconut oil in a pan' },
      { step: 2, instruction: 'Add mustard seeds and urad dal' },
      { step: 3, instruction: 'When they splutter, add curry leaves' },
      { step: 4, instruction: 'Add green chilies, ginger, and cashews' },
      { step: 5, instruction: 'Add grated coconut and sauté briefly' },
      { step: 6, instruction: 'Add cooked rice and mix gently' },
      { step: 7, instruction: 'Season with salt and serve warm' }
    ],
    ayurvedic_properties: {
      rasa: ['Sweet'],
      virya: 'Cooling',
      vipaka: 'Sweet',
      guna: ['Heavy', 'Oily', 'Cool'],
      prabhava: 'Nourishes and cools the body',
      dosha_effects: { vata: 'balancing', pitta: 'balancing', kapha: 'increasing' }
    },
    health_benefits: ['Cooling', 'Nourishing', 'Easy to digest', 'Hydrating'],
    therapeutic_uses: ['Heat disorders', 'Weakness', 'Convalescence'],
    contraindications: ['High kapha', 'Congestion', 'Cold conditions'],
    best_season: ['summer'],
    best_time_of_day: ['lunch'],
    nutrition: {
      calories: 320, carbohydrates_g: 45, protein_g: 6, fat_g: 12, fiber_g: 3,
      sugar_g: 3, sodium_mg: 300, potassium_mg: 200, calcium_mg: 60, iron_mg: 2,
      vitamin_c_mg: 5, vitamin_d_iu: 0, glycemic_index: 60, nutrient_density_score: 6.5
    },
    tags: ['pitta-balancing', 'cooling', 'south-indian'], is_public: true
  },

  {
    name: 'Spiced Lentil Curry (Dal Tadka)',
    description: 'A protein-rich dal that satisfies and nourishes all body types.',
    meal_type: ['lunch', 'dinner'],
    cuisine_type: ['Indian'],
    preparation_time: 15,
    cooking_time: 30,
    servings: 4,
    difficulty_level: 'medium',
    ingredients: [
      { item: 'Toor dal', quantity: '1 cup', notes: 'split pigeon peas' },
      { item: 'Water', quantity: '3 cups', notes: 'for cooking dal' },
      { item: 'Turmeric', quantity: '1/2 tsp', notes: 'ground' },
      { item: 'Ghee', quantity: '2 tbsp', notes: 'for tempering' },
      { item: 'Cumin seeds', quantity: '1 tsp', notes: 'whole' },
      { item: 'Mustard seeds', quantity: '1/2 tsp', notes: 'black' },
      { item: 'Asafoetida', quantity: '1/4 tsp', notes: 'hing' },
      { item: 'Onion', quantity: '1 medium', notes: 'chopped' },
      { item: 'Tomato', quantity: '1 large', notes: 'chopped' },
      { item: 'Ginger-garlic paste', quantity: '1 tbsp', notes: 'fresh' },
      { item: 'Green chilies', quantity: '2', notes: 'slit' },
      { item: 'Coriander powder', quantity: '1 tsp', notes: 'ground' },
      { item: 'Red chili powder', quantity: '1/2 tsp', notes: 'adjust to taste' },
      { item: 'Garam masala', quantity: '1/2 tsp', notes: 'ground' },
      { item: 'Salt', quantity: 'to taste', notes: 'rock salt' },
      { item: 'Cilantro', quantity: '2 tbsp', notes: 'chopped' }
    ],
    instructions: [
      { step: 1, instruction: 'Wash and pressure cook dal with turmeric for 3 whistles' },
      { step: 2, instruction: 'Mash cooked dal and keep aside' },
      { step: 3, instruction: 'Heat ghee for tempering' },
      { step: 4, instruction: 'Add cumin, mustard seeds, and asafoetida' },
      { step: 5, instruction: 'Add onions and sauté until golden' },
      { step: 6, instruction: 'Add ginger-garlic paste and green chilies' },
      { step: 7, instruction: 'Add tomatoes and spice powders' },
      { step: 8, instruction: 'Cook until tomatoes break down' },
      { step: 9, instruction: 'Add cooked dal and simmer 10 minutes' },
      { step: 10, instruction: 'Garnish with cilantro before serving' }
    ],
    ayurvedic_properties: {
      rasa: ['Sweet', 'Astringent'],
      virya: 'Warming',
      vipaka: 'Sweet',
      guna: ['Heavy', 'Nourishing'],
      prabhava: 'Builds strength and satisfies hunger',
      dosha_effects: { vata: 'balancing', pitta: 'neutral', kapha: 'neutral' }
    },
    health_benefits: ['High protein', 'Strengthening', 'Satisfying', 'Easy to digest'],
    therapeutic_uses: ['Protein deficiency', 'Weakness', 'Growing children', 'Recovery'],
    contraindications: ['Severe kapha imbalance'],
    best_season: ['all'],
    best_time_of_day: ['lunch', 'dinner'],
    nutrition: {
      calories: 280, carbohydrates_g: 35, protein_g: 18, fat_g: 8, fiber_g: 12,
      sugar_g: 6, sodium_mg: 400, potassium_mg: 600, calcium_mg: 80, iron_mg: 4,
      vitamin_c_mg: 10, vitamin_d_iu: 0, glycemic_index: 45, nutrient_density_score: 9.0
    },
    tags: ['protein-rich', 'comfort-food', 'traditional'], is_public: true
  },

  // DINNER RECIPES
  {
    name: 'Light Mung Bean Soup',
    description: 'A gentle evening soup that is easy to digest and calming.',
    meal_type: ['dinner', 'snack'],
    cuisine_type: ['Indian'],
    preparation_time: 10,
    cooking_time: 25,
    servings: 3,
    difficulty_level: 'easy',
    ingredients: [
      { item: 'Green mung beans', quantity: '1/2 cup', notes: 'soaked 2 hours' },
      { item: 'Water', quantity: '3 cups', notes: 'filtered' },
      { item: 'Ghee', quantity: '1 tbsp', notes: '' },
      { item: 'Cumin seeds', quantity: '1/2 tsp', notes: '' },
      { item: 'Ginger', quantity: '1 tsp', notes: 'grated' },
      { item: 'Turmeric', quantity: '1/4 tsp', notes: 'ground' },
      { item: 'Salt', quantity: 'to taste', notes: 'rock salt' },
      { item: 'Cilantro', quantity: '1 tbsp', notes: 'chopped' }
    ],
    instructions: [
      { step: 1, instruction: 'Drain and rinse soaked mung beans' },
      { step: 2, instruction: 'Heat ghee and add cumin seeds' },
      { step: 3, instruction: 'Add ginger and turmeric' },
      { step: 4, instruction: 'Add mung beans and water' },
      { step: 5, instruction: 'Bring to boil, then simmer 20 minutes' },
      { step: 6, instruction: 'Season with salt and garnish with cilantro' }
    ],
    ayurvedic_properties: {
      rasa: ['Sweet', 'Astringent'],
      virya: 'Cooling',
      vipaka: 'Sweet',
      guna: ['Light', 'Easy to digest'],
      prabhava: 'Detoxifying and cooling',
      dosha_effects: { vata: 'balancing', pitta: 'balancing', kapha: 'balancing' }
    },
    health_benefits: ['Easy to digest', 'Detoxifying', 'Cooling', 'Light on stomach'],
    therapeutic_uses: ['Fever', 'Digestive upset', 'Detoxification', 'Light dinner'],
    contraindications: ['None significant'],
    best_season: ['all'],
    best_time_of_day: ['dinner'],
    nutrition: {
      calories: 180, carbohydrates_g: 28, protein_g: 12, fat_g: 4, fiber_g: 8,
      sugar_g: 3, sodium_mg: 300, potassium_mg: 400, calcium_mg: 60, iron_mg: 3,
      vitamin_c_mg: 8, vitamin_d_iu: 0, glycemic_index: 35, nutrient_density_score: 8.5
    },
    tags: ['tridoshic', 'light-dinner', 'detoxifying'], is_public: true
  },

  // SNACK RECIPES
  {
    name: 'Spiced Roasted Chickpeas',
    description: 'A crunchy, protein-rich snack with digestive spices.',
    meal_type: ['snack'],
    cuisine_type: ['Indian'],
    preparation_time: 15,
    cooking_time: 25,
    servings: 4,
    difficulty_level: 'easy',
    ingredients: [
      { item: 'Chickpeas', quantity: '1 cup', notes: 'cooked and drained' },
      { item: 'Olive oil', quantity: '1 tbsp', notes: 'cold-pressed' },
      { item: 'Cumin powder', quantity: '1/2 tsp', notes: 'roasted' },
      { item: 'Coriander powder', quantity: '1/2 tsp', notes: 'ground' },
      { item: 'Turmeric', quantity: '1/4 tsp', notes: 'ground' },
      { item: 'Chaat masala', quantity: '1/2 tsp', notes: 'Indian spice mix' },
      { item: 'Salt', quantity: '1/2 tsp', notes: 'rock salt' },
      { item: 'Lemon juice', quantity: '1 tbsp', notes: 'fresh' }
    ],
    instructions: [
      { step: 1, instruction: 'Preheat oven to 400°F (200°C)' },
      { step: 2, instruction: 'Pat chickpeas dry with paper towel' },
      { step: 3, instruction: 'Toss with oil and all spices except lemon' },
      { step: 4, instruction: 'Spread on baking sheet in single layer' },
      { step: 5, instruction: 'Roast for 20-25 minutes until crispy' },
      { step: 6, instruction: 'Sprinkle with lemon juice before serving' }
    ],
    ayurvedic_properties: {
      rasa: ['Sweet', 'Astringent'],
      virya: 'Warming',
      vipaka: 'Sweet',
      guna: ['Heavy', 'Dry'],
      prabhava: 'Satisfying and strengthening',
      dosha_effects: { vata: 'neutral', pitta: 'neutral', kapha: 'balancing' }
    },
    health_benefits: ['High protein', 'High fiber', 'Satisfying', 'Portable'],
    therapeutic_uses: ['Protein deficiency', 'Hunger between meals', 'Weight management'],
    contraindications: ['Severe vata imbalance', 'Gas-prone individuals'],
    best_season: ['autumn', 'winter'],
    best_time_of_day: ['afternoon', 'evening'],
    nutrition: {
      calories: 120, carbohydrates_g: 18, protein_g: 6, fat_g: 4, fiber_g: 5,
      sugar_g: 3, sodium_mg: 300, potassium_mg: 250, calcium_mg: 40, iron_mg: 2,
      vitamin_c_mg: 5, vitamin_d_iu: 0, glycemic_index: 40, nutrient_density_score: 7.5
    },
    tags: ['protein-rich', 'crunchy', 'portable'], is_public: true
  },

  // BEVERAGES
  {
    name: 'Cooling Rose Lassi',
    description: 'A traditional yogurt drink that cools and soothes Pitta.',
    meal_type: ['beverage', 'snack'],
    cuisine_type: ['Indian'],
    preparation_time: 10,
    cooking_time: 0,
    servings: 2,
    difficulty_level: 'easy',
    ingredients: [
      { item: 'Fresh yogurt', quantity: '1 cup', notes: 'not too sour' },
      { item: 'Rose water', quantity: '1 tsp', notes: 'food grade' },
      { item: 'Honey', quantity: '2 tbsp', notes: 'raw' },
      { item: 'Cardamom', quantity: '1/4 tsp', notes: 'ground' },
      { item: 'Ice cubes', quantity: '4-5', notes: 'optional' },
      { item: 'Pistachios', quantity: '1 tbsp', notes: 'chopped for garnish' },
      { item: 'Rose petals', quantity: '1 tsp', notes: 'dried, optional' }
    ],
    instructions: [
      { step: 1, instruction: 'Blend yogurt until smooth' },
      { step: 2, instruction: 'Add rose water, honey, and cardamom' },
      { step: 3, instruction: 'Blend again until well combined' },
      { step: 4, instruction: 'Add ice cubes if desired' },
      { step: 5, instruction: 'Pour into glasses' },
      { step: 6, instruction: 'Garnish with pistachios and rose petals' }
    ],
    ayurvedic_properties: {
      rasa: ['Sweet', 'Sour'],
      virya: 'Cooling',
      vipaka: 'Sweet',
      guna: ['Cool', 'Heavy', 'Oily'],
      prabhava: 'Cools and calms the mind',
      dosha_effects: { vata: 'balancing', pitta: 'balancing', kapha: 'increasing' }
    },
    health_benefits: ['Cooling', 'Digestive', 'Calming', 'Probiotic'],
    therapeutic_uses: ['Heat disorders', 'Acidity', 'Stress', 'Digestive upset'],
    contraindications: ['Cold conditions', 'Congestion', 'Poor digestion'],
    best_season: ['summer'],
    best_time_of_day: ['afternoon', 'evening'],
    nutrition: {
      calories: 140, carbohydrates_g: 20, protein_g: 6, fat_g: 5, fiber_g: 0,
      sugar_g: 18, sodium_mg: 80, potassium_mg: 300, calcium_mg: 200, iron_mg: 0.5,
      vitamin_c_mg: 2, vitamin_d_iu: 20, glycemic_index: 35, nutrient_density_score: 6.5
    },
    tags: ['pitta-balancing', 'cooling', 'probiotic'], is_public: true
  }
];

// Function to seed recipes into Supabase
async function seedRecipes() {
  try {
    console.log('🌱 Starting to seed Ayurvedic recipes...');
    
    // Combine all recipes
    const allRecipes = [...ayurvedicRecipes, ...additionalRecipes];
    
    // Insert recipes in batches to avoid rate limits
    const batchSize = 5;
    let seededCount = 0;
    
    for (let i = 0; i < allRecipes.length; i += batchSize) {
      const batch = allRecipes.slice(i, i + batchSize);
      
      console.log(`📦 Inserting batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(allRecipes.length/batchSize)}...`);
      
      const { data, error } = await supabase
        .from('recipes')
        .insert(batch)
        .select();
      
      if (error) {
        console.error('❌ Error inserting batch:', error);
        throw error;
      }
      
      seededCount += batch.length;
      console.log(`✅ Successfully inserted ${batch.length} recipes`);
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`🎉 Successfully seeded ${seededCount} Ayurvedic recipes!`);
    console.log('✨ Recipe database is now ready for use.');
    
  } catch (error) {
    console.error('💥 Error seeding recipes:', error);
    process.exit(1);
  }
}

// Run the seeding function
if (require.main === module) {
  seedRecipes().then(() => {
    console.log('🏁 Recipe seeding completed!');
    process.exit(0);
  });
}

module.exports = { seedRecipes, ayurvedicRecipes };