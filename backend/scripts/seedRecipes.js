const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
require('dotenv').config();

// Sample recipes data
const sampleRecipes = [
  {
    name: "Kitchari (Ayurvedic Rice and Lentil Porridge)",
    type: "Main Course",
    cuisine: "Indian",
    ingredients: [
      { name: "Basmati rice", quantity: "1 cup", note: "washed and soaked" },
      { name: "Split yellow mung dal", quantity: "1/2 cup", note: "washed and soaked" },
      { name: "Ghee", quantity: "2 tbsp", note: "clarified butter" },
      { name: "Cumin seeds", quantity: "1 tsp", note: "whole" },
      { name: "Turmeric powder", quantity: "1/2 tsp", note: "ground" },
      { name: "Ginger", quantity: "1 inch", note: "fresh, grated" },
      { name: "Salt", quantity: "to taste", note: "rock salt preferred" },
      { name: "Water", quantity: "4 cups", note: "filtered" }
    ],
    instructions: [
      "Soak rice and dal separately for 30 minutes",
      "Heat ghee in a pot and add cumin seeds",
      "Add ginger and turmeric, sauté for 30 seconds",
      "Add drained rice and dal, mix well",
      "Add water and salt, bring to boil",
      "Reduce heat and simmer for 25-30 minutes until soft",
      "Serve warm with ghee on top"
    ],
    ayurvedic_properties: {
      rasa: ["Sweet", "Astringent"],
      virya: "Warm",
      vipaka: "Sweet",
      prabhava: "Balancing for all doshas",
      dosha_effect: {
        Vata: "↓",
        Pitta: "↓",
        Kapha: "neutral"
      },
      guna: ["Light", "Easy to digest", "Nourishing"],
      guna_properties: "Kitchari is considered the perfect food in Ayurveda - easy to digest, nourishing, and balancing for all doshas. It's ideal for cleansing and healing."
    },
    health_benefits: [
      "Supports digestive health and gut healing",
      "Provides complete protein from rice and dal combination",
      "Easy to digest and assimilate nutrients",
      "Helps balance all three doshas",
      "Supports detoxification and cleansing",
      "Provides sustained energy without heaviness"
    ],
    nutrition_profile: {
      calories: 320,
      protein_g: 12,
      carbs_g: 58,
      fat_g: 6,
      fiber_g: 8,
      vitamins: ["B1", "B6", "Folate", "Iron"],
      minerals: {
        Iron: "High",
        Magnesium: "Moderate",
        Calcium: "Low"
      },
      glycemic_index: 65,
      nutrient_density_score: 75
    },
    difficulty: "Easy",
    prepTime: 30,
    cookTime: 30,
    servings: 2,
    tags: ["detox", "healing", "digestive", "comfort food"]
  },
  {
    name: "Golden Milk (Turmeric Latte)",
    type: "Beverage",
    cuisine: "Indian",
    ingredients: [
      { name: "Plant-based milk", quantity: "1 cup", note: "almond, coconut, or oat milk" },
      { name: "Turmeric powder", quantity: "1/2 tsp", note: "ground" },
      { name: "Ginger", quantity: "1/4 tsp", note: "fresh, grated" },
      { name: "Cinnamon", quantity: "1/4 tsp", note: "ground" },
      { name: "Black pepper", quantity: "Pinch", note: "ground" },
      { name: "Ghee", quantity: "1 tsp", note: "optional" },
      { name: "Raw honey", quantity: "1 tsp", note: "optional, to taste" }
    ],
    instructions: [
      "Heat plant-based milk in a small saucepan over medium heat",
      "Add turmeric, ginger, cinnamon, and black pepper",
      "Whisk continuously for 2-3 minutes until well combined",
      "Add ghee and honey if desired",
      "Strain if needed and serve warm",
      "Best consumed before bedtime"
    ],
    ayurvedic_properties: {
      rasa: ["Sweet", "Pungent", "Bitter"],
      virya: "Warm",
      vipaka: "Sweet",
      prabhava: "Anti-inflammatory and immune boosting",
      dosha_effect: {
        Vata: "↓",
        Pitta: "neutral",
        Kapha: "↓"
      },
      guna: ["Light", "Penetrating", "Heating"],
      guna_properties: "Golden milk is a powerful anti-inflammatory beverage that supports immunity, reduces inflammation, and promotes restful sleep."
    },
    health_benefits: [
      "Powerful anti-inflammatory properties from curcumin",
      "Supports immune system function",
      "Promotes restful sleep and relaxation",
      "Aids in digestion and reduces bloating",
      "Supports joint health and mobility",
      "Natural antioxidant properties"
    ],
    nutrition_profile: {
      calories: 120,
      protein_g: 4,
      carbs_g: 8,
      fat_g: 8,
      fiber_g: 2,
      vitamins: ["A", "D", "E", "K"],
      minerals: {
        Calcium: "High",
        Magnesium: "Moderate",
        Iron: "Low"
      },
      glycemic_index: 45,
      nutrient_density_score: 85
    },
    difficulty: "Easy",
    prepTime: 5,
    cookTime: 5,
    servings: 1,
    tags: ["anti-inflammatory", "immune", "sleep", "warming"]
  },
  {
    name: "Quinoa Buddha Bowl with Ayurvedic Spices",
    type: "Main Course",
    cuisine: "Global",
    ingredients: [
      { name: "Quinoa", quantity: "1 cup", note: "rinsed" },
      { name: "Sweet potato", quantity: "1 medium", note: "cubed" },
      { name: "Chickpeas", quantity: "1/2 cup", note: "cooked" },
      { name: "Spinach", quantity: "2 cups", note: "fresh" },
      { name: "Avocado", quantity: "1/2", note: "sliced" },
      { name: "Coconut oil", quantity: "1 tbsp", note: "for cooking" },
      { name: "Cumin", quantity: "1/2 tsp", note: "ground" },
      { name: "Coriander", quantity: "1/2 tsp", note: "ground" },
      { name: "Turmeric", quantity: "1/4 tsp", note: "ground" },
      { name: "Lemon juice", quantity: "2 tbsp", note: "fresh" },
      { name: "Tahini", quantity: "2 tbsp", note: "for dressing" },
      { name: "Water", quantity: "2 tbsp", note: "for dressing" }
    ],
    instructions: [
      "Cook quinoa according to package instructions",
      "Preheat oven to 400°F (200°C)",
      "Toss sweet potato cubes with coconut oil and spices",
      "Roast sweet potatoes for 20-25 minutes until tender",
      "Sauté spinach with a pinch of salt until wilted",
      "Prepare tahini dressing by mixing tahini, lemon juice, and water",
      "Assemble bowl with quinoa, roasted sweet potato, chickpeas, spinach, and avocado",
      "Drizzle with tahini dressing and serve"
    ],
    ayurvedic_properties: {
      rasa: ["Sweet", "Bitter", "Astringent"],
      virya: "Cooling",
      vipaka: "Sweet",
      prabhava: "Balancing and nourishing",
      dosha_effect: {
        Vata: "neutral",
        Pitta: "↓",
        Kapha: "↓"
      },
      guna: ["Light", "Nourishing", "Balancing"],
      guna_properties: "This Buddha bowl provides complete nutrition while being light and easy to digest. The combination of quinoa, vegetables, and healthy fats creates a balanced meal."
    },
    health_benefits: [
      "Complete protein from quinoa and chickpeas",
      "High fiber content supports digestive health",
      "Rich in vitamins and minerals",
      "Anti-inflammatory properties from turmeric and spices",
      "Supports healthy blood sugar levels",
      "Provides sustained energy"
    ],
    nutrition_profile: {
      calories: 450,
      protein_g: 18,
      carbs_g: 65,
      fat_g: 16,
      fiber_g: 12,
      vitamins: ["A", "C", "E", "K", "B6", "Folate"],
      minerals: {
        Iron: "High",
        Magnesium: "High",
        Calcium: "Moderate"
      },
      glycemic_index: 55,
      nutrient_density_score: 90
    },
    difficulty: "Medium",
    prepTime: 15,
    cookTime: 30,
    servings: 2,
    tags: ["complete protein", "fiber-rich", "anti-inflammatory", "balanced"]
  }
];

async function seedRecipes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ayursync');
    console.log('Connected to MongoDB');

    // Clear existing recipes (optional)
    await Recipe.deleteMany({});
    console.log('Cleared existing recipes');

    // Insert sample recipes
    const insertedRecipes = await Recipe.insertMany(sampleRecipes);
    console.log(`Successfully seeded ${insertedRecipes.length} recipes`);

    // Display seeded recipes
    insertedRecipes.forEach(recipe => {
      console.log(`- ${recipe.name} (${recipe.type}, ${recipe.cuisine})`);
    });

  } catch (error) {
    console.error('Error seeding recipes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedRecipes();
}

module.exports = seedRecipes;
