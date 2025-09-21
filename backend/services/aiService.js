const OpenAI = require('openai');
const Recipe = require('../models/Recipe');
const Patient = require('../models/Patient');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class AIService {
  constructor() {
    this.model = 'gpt-4';
    this.maxTokens = 4000;
  }

  // Generate diet plan for a patient
  async generateDietPlan(patientId, options = {}) {
    try {
      // Get patient data
      const patient = await Patient.findById(patientId);
      if (!patient) {
        throw new Error('Patient not found');
      }

      // Get suitable recipes from database
      const suitableRecipes = await this.getSuitableRecipes(patient);
      
      // Prepare patient context for AI
      const patientContext = this.preparePatientContext(patient);
      
      // Generate diet plan using AI
      const dietPlan = await this.generatePlanWithAI(patientContext, suitableRecipes, options);
      
      return dietPlan;
    } catch (error) {
      console.error('AI Diet Plan Generation Error:', error);
      throw error;
    }
  }

  // Get recipes suitable for patient's dosha and preferences
  async getSuitableRecipes(patient) {
    try {
      const query = {
        isActive: true,
        $or: []
      };

      // Add dosha-based filtering
      if (patient.primaryDosha && patient.primaryDosha !== 'Pending') {
        const doshaConditions = [];
        
        if (patient.primaryDosha.includes('Vata')) {
          doshaConditions.push({
            'ayurvedic_properties.dosha_effect.Vata': { $in: ['↓', 'neutral'] }
          });
        }
        if (patient.primaryDosha.includes('Pitta')) {
          doshaConditions.push({
            'ayurvedic_properties.dosha_effect.Pitta': { $in: ['↓', 'neutral'] }
          });
        }
        if (patient.primaryDosha.includes('Kapha')) {
          doshaConditions.push({
            'ayurvedic_properties.dosha_effect.Kapha': { $in: ['↓', 'neutral'] }
          });
        }
        
        if (doshaConditions.length > 0) {
          query.$or.push({ $and: doshaConditions });
        }
      }

      // Add diet type filtering
      if (patient.dietType === 'vegetarian') {
        query.$or.push({
          $and: [
            { 'ingredients.name': { $not: { $regex: /meat|chicken|beef|pork|fish|seafood/i } } },
            { 'ingredients.name': { $not: { $regex: /egg/i } } }
          ]
        });
      } else if (patient.dietType === 'vegan') {
        query.$or.push({
          $and: [
            { 'ingredients.name': { $not: { $regex: /meat|chicken|beef|pork|fish|seafood|egg|dairy|milk|cheese|butter|yogurt/i } } }
          ]
        });
      }

      // If no specific conditions, get all active recipes
      if (query.$or.length === 0) {
        delete query.$or;
      }

      const recipes = await Recipe.find(query)
        .select('name type cuisine ingredients instructions ayurvedic_properties nutrition_profile health_benefits')
        .limit(200) // Limit for performance
        .lean();

      return recipes;
    } catch (error) {
      console.error('Error fetching suitable recipes:', error);
      throw error;
    }
  }

  // Prepare patient context for AI
  preparePatientContext(patient) {
    const context = {
      personalInfo: {
        name: patient.fullName,
        age: patient.age,
        gender: patient.gender,
        weight: patient.weight,
        height: patient.height,
        bmi: patient.bmi
      },
      dosha: {
        primary: patient.primaryDosha,
        scores: patient.doshaScores
      },
      health: {
        concerns: patient.primaryConcerns,
        symptoms: patient.currentSymptoms,
        medications: patient.medications,
        allergies: patient.allergies
      },
      lifestyle: {
        mealFrequency: patient.mealFrequency,
        waterIntake: patient.waterIntake,
        dietType: patient.dietType,
        cookingSkills: patient.cookingSkills,
        familySize: patient.familySize
      },
      preferences: {
        cuisines: patient.preferredCuisines
      }
    };

    return context;
  }

  // Generate diet plan using OpenAI
  async generatePlanWithAI(patientContext, recipes, options = {}) {
    try {
      const duration = options.duration || 7; // Default 7 days
      const targetCalories = options.targetCalories || this.calculateTargetCalories(patientContext);

      // Prepare recipes context for AI
      const recipesContext = recipes.map(recipe => ({
        id: recipe._id,
        name: recipe.name,
        type: recipe.type,
        cuisine: recipe.cuisine,
        calories: recipe.nutrition_profile.calories,
        protein: recipe.nutrition_profile.protein_g,
        carbs: recipe.nutrition_profile.carbs_g,
        fat: recipe.nutrition_profile.fat_g,
        doshaEffects: recipe.ayurvedic_properties.dosha_effect,
        healthBenefits: recipe.health_benefits.slice(0, 3) // Limit for token efficiency
      }));

      const prompt = this.buildDietPlanPrompt(patientContext, recipesContext, duration, targetCalories);

      const response = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `You are an expert Ayurvedic nutritionist and dietitian with deep knowledge of:
            - Ayurvedic principles and dosha balancing
            - Nutritional science and meal planning
            - Indian and international cuisines
            - Health condition management through diet
            
            Your task is to create personalized, nutritionally balanced diet plans that:
            1. Balance the patient's dosha according to Ayurvedic principles
            2. Meet nutritional requirements for their age, gender, and health goals
            3. Consider their dietary restrictions and preferences
            4. Provide variety and practical meal options
            5. Include appropriate portion sizes and timing
            
            Always respond with valid JSON format.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.maxTokens,
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      const aiResponse = JSON.parse(response.choices[0].message.content);
      
      // Validate and structure the AI response
      return this.validateAndStructureDietPlan(aiResponse, patientContext, recipes);
    } catch (error) {
      console.error('AI Diet Plan Generation Error:', error);
      throw new Error(`Failed to generate diet plan: ${error.message}`);
    }
  }

  // Build the prompt for AI diet plan generation
  buildDietPlanPrompt(patientContext, recipes, duration, targetCalories) {
    return `
Create a comprehensive ${duration}-day Ayurvedic diet plan for the following patient:

PATIENT INFORMATION:
- Name: ${patientContext.personalInfo.name}
- Age: ${patientContext.personalInfo.age} years
- Gender: ${patientContext.personalInfo.gender}
- Weight: ${patientContext.personalInfo.weight} kg
- Height: ${patientContext.personalInfo.height} cm
- BMI: ${patientContext.personalInfo.bmi}

DOSHA PROFILE:
- Primary Dosha: ${patientContext.dosha.primary}
- Dosha Scores: Vata: ${patientContext.dosha.scores.vata}, Pitta: ${patientContext.dosha.scores.pitta}, Kapha: ${patientContext.dosha.scores.kapha}

HEALTH INFORMATION:
- Primary Concerns: ${patientContext.health.concerns}
- Current Symptoms: ${patientContext.health.symptoms.join(', ')}
- Medications: ${patientContext.health.medications || 'None'}
- Allergies: ${patientContext.health.allergies || 'None'}

LIFESTYLE PREFERENCES:
- Meal Frequency: ${patientContext.lifestyle.mealFrequency} meals per day
- Water Intake: ${patientContext.lifestyle.waterIntake} glasses per day
- Diet Type: ${patientContext.lifestyle.dietType}
- Cooking Skills: ${patientContext.lifestyle.cookingSkills}
- Family Size: ${patientContext.lifestyle.familySize || 'Not specified'}

TARGET CALORIES: ${targetCalories} per day

AVAILABLE RECIPES (${recipes.length} recipes):
${recipes.map(recipe => 
  `- ${recipe.name} (${recipe.type}, ${recipe.cuisine}): ${recipe.calories} cal, ${recipe.protein}g protein, Dosha effects: ${JSON.stringify(recipe.doshaEffects)}`
).join('\n')}

REQUIREMENTS:
1. Create a ${duration}-day meal plan with breakfast, lunch, dinner, and snacks
2. Ensure daily calorie intake is around ${targetCalories} calories
3. Balance macronutrients appropriately (protein: 15-20%, carbs: 45-65%, fat: 20-35%)
4. Select recipes that balance the patient's dosha (${patientContext.dosha.primary})
5. Consider their dietary restrictions (${patientContext.health.allergies || 'None'})
6. Include variety and avoid repetition
7. Provide appropriate portion sizes
8. Include timing recommendations for meals
9. Add Ayurvedic recommendations for each day

RESPONSE FORMAT (JSON):
{
  "planName": "Personalized Ayurvedic Diet Plan",
  "description": "Brief description of the plan",
  "duration": ${duration},
  "targetCalories": ${targetCalories},
  "dailyPlans": [
    {
      "day": 1,
      "dayOfWeek": "Monday",
      "date": "YYYY-MM-DD",
      "meals": [
        {
          "mealType": "Breakfast",
          "time": "08:00",
          "recipes": [
            {
              "recipeId": "recipe_id_from_available_recipes",
              "quantity": 1,
              "notes": "Optional notes"
            }
          ],
          "totalNutrition": {
            "calories": 0,
            "protein_g": 0,
            "carbs_g": 0,
            "fat_g": 0,
            "fiber_g": 0
          }
        }
      ],
      "totalNutrition": {
        "calories": 0,
        "protein_g": 0,
        "carbs_g": 0,
        "fat_g": 0,
        "fiber_g": 0
      },
      "notes": "Daily Ayurvedic recommendations and notes"
    }
  ],
  "ayurvedicRecommendations": {
    "doshaBalancing": "Specific recommendations for balancing ${patientContext.dosha.primary}",
    "mealTiming": "Optimal meal timing recommendations",
    "lifestyleTips": "Additional lifestyle recommendations"
  },
  "healthGoals": [
    "Specific health goals this plan addresses"
  ]
}

IMPORTANT: Only use recipe IDs from the provided available recipes list. Calculate nutrition totals accurately.`;
  }

  // Calculate target calories based on patient data
  calculateTargetCalories(patientContext) {
    const { age, gender, weight, height } = patientContext.personalInfo;
    
    // Harris-Benedict Equation for BMR
    let bmr;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    
    // Activity factor (sedentary to moderate activity)
    const activityFactor = 1.4;
    
    // Calculate TDEE
    const tdee = bmr * activityFactor;
    
    // Add 200-300 calories for health goals (weight maintenance/slight gain)
    return Math.round(tdee + 250);
  }

  // Validate and structure the AI response
  validateAndStructureDietPlan(aiResponse, patientContext, recipes) {
    try {
      // Validate required fields
      if (!aiResponse.dailyPlans || !Array.isArray(aiResponse.dailyPlans)) {
        throw new Error('Invalid AI response: missing dailyPlans');
      }

      // Create recipe lookup map
      const recipeMap = new Map(recipes.map(recipe => [recipe.id.toString(), recipe]));

      // Validate and calculate nutrition for each day
      aiResponse.dailyPlans.forEach(dayPlan => {
        if (!dayPlan.meals || !Array.isArray(dayPlan.meals)) {
          throw new Error(`Invalid day plan: missing meals for day ${dayPlan.day}`);
        }

        // Calculate nutrition for each meal
        dayPlan.meals.forEach(meal => {
          if (!meal.recipes || !Array.isArray(meal.recipes)) {
            throw new Error(`Invalid meal: missing recipes for ${meal.mealType}`);
          }

          let mealNutrition = {
            calories: 0,
            protein_g: 0,
            carbs_g: 0,
            fat_g: 0,
            fiber_g: 0
          };

          meal.recipes.forEach(recipeRef => {
            const recipe = recipeMap.get(recipeRef.recipeId);
            if (!recipe) {
              throw new Error(`Recipe not found: ${recipeRef.recipeId}`);
            }

            const quantity = recipeRef.quantity || 1;
            mealNutrition.calories += recipe.nutrition_profile.calories * quantity;
            mealNutrition.protein_g += recipe.nutrition_profile.protein_g * quantity;
            mealNutrition.carbs_g += recipe.nutrition_profile.carbs_g * quantity;
            mealNutrition.fat_g += recipe.nutrition_profile.fat_g * quantity;
            mealNutrition.fiber_g += recipe.nutrition_profile.fiber_g * quantity;
          });

          meal.totalNutrition = mealNutrition;
        });

        // Calculate total nutrition for the day
        let dayNutrition = {
          calories: 0,
          protein_g: 0,
          carbs_g: 0,
          fat_g: 0,
          fiber_g: 0
        };

        dayPlan.meals.forEach(meal => {
          dayNutrition.calories += meal.totalNutrition.calories;
          dayNutrition.protein_g += meal.totalNutrition.protein_g;
          dayNutrition.carbs_g += meal.totalNutrition.carbs_g;
          dayNutrition.fat_g += meal.totalNutrition.fat_g;
          dayNutrition.fiber_g += meal.totalNutrition.fiber_g;
        });

        dayPlan.totalNutrition = dayNutrition;
      });

      return aiResponse;
    } catch (error) {
      console.error('Diet plan validation error:', error);
      throw new Error(`Failed to validate diet plan: ${error.message}`);
    }
  }

  // Generate recipe suggestions based on patient preferences
  async generateRecipeSuggestions(patientId, mealType, preferences = {}) {
    try {
      const patient = await Patient.findById(patientId);
      if (!patient) {
        throw new Error('Patient not found');
      }

      const suitableRecipes = await this.getSuitableRecipes(patient);
      const filteredRecipes = suitableRecipes.filter(recipe => 
        recipe.type === mealType || 
        (mealType === 'Snack' && ['Beverage', 'Dessert'].includes(recipe.type))
      );

      if (filteredRecipes.length === 0) {
        return [];
      }

      // Use AI to rank and suggest recipes
      const prompt = `
Based on the patient's profile and preferences, suggest the best ${mealType} recipes from the available options.

PATIENT PROFILE:
- Primary Dosha: ${patient.primaryDosha}
- Diet Type: ${patient.dietType}
- Cooking Skills: ${patient.cookingSkills}
- Health Concerns: ${patient.primaryConcerns}
- Allergies: ${patient.allergies || 'None'}

AVAILABLE RECIPES:
${filteredRecipes.map(recipe => 
  `- ${recipe.name} (${recipe.cuisine}): ${recipe.nutrition_profile.calories} cal, Dosha effects: ${JSON.stringify(recipe.ayurvedic_properties.dosha_effect)}`
).join('\n')}

Return top 5 recommendations in JSON format:
{
  "suggestions": [
    {
      "recipeId": "recipe_id",
      "name": "recipe_name",
      "reason": "Why this recipe is suitable",
      "suitabilityScore": 0.95
    }
  ]
}`;

      const response = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert Ayurvedic nutritionist. Provide personalized recipe recommendations based on patient needs.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Recipe suggestion error:', error);
      throw error;
    }
  }
}

module.exports = new AIService();
