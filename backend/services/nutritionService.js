const Recipe = require('../models/Recipe');

class NutritionService {
  constructor() {
    // Nutritional guidelines based on age, gender, and health conditions
    this.nutritionalGuidelines = {
      adult: {
        male: {
          calories: { min: 2000, max: 3000 },
          protein: { min: 56, max: 100 }, // grams
          carbs: { min: 225, max: 325 }, // grams
          fat: { min: 44, max: 78 }, // grams
          fiber: { min: 25, max: 35 }, // grams
          water: { min: 3.7, max: 4.0 } // liters
        },
        female: {
          calories: { min: 1600, max: 2400 },
          protein: { min: 46, max: 80 }, // grams
          carbs: { min: 180, max: 260 }, // grams
          fat: { min: 36, max: 65 }, // grams
          fiber: { min: 21, max: 28 }, // grams
          water: { min: 2.7, max: 3.0 } // liters
        }
      },
      child: {
        calories: { min: 1000, max: 2000 },
        protein: { min: 20, max: 50 },
        carbs: { min: 130, max: 200 },
        fat: { min: 20, max: 50 },
        fiber: { min: 15, max: 25 },
        water: { min: 1.5, max: 2.5 }
      }
    };

    // Ayurvedic nutritional principles
    this.ayurvedicPrinciples = {
      Vata: {
        recommended: ['warm', 'moist', 'grounding', 'sweet', 'sour', 'salty'],
        avoid: ['cold', 'dry', 'raw', 'bitter', 'pungent', 'astringent'],
        mealTiming: 'Regular, warm meals',
        portionSize: 'Moderate'
      },
      Pitta: {
        recommended: ['cooling', 'sweet', 'bitter', 'astringent'],
        avoid: ['hot', 'spicy', 'sour', 'salty'],
        mealTiming: 'Regular, not too hot',
        portionSize: 'Moderate'
      },
      Kapha: {
        recommended: ['light', 'warm', 'spicy', 'bitter', 'pungent', 'astringent'],
        avoid: ['heavy', 'cold', 'sweet', 'sour', 'salty'],
        mealTiming: 'Light meals, avoid overeating',
        portionSize: 'Smaller portions'
      }
    };
  }

  // Calculate nutritional requirements for a patient
  calculateNutritionalRequirements(patient) {
    const { age, gender, weight, height, primaryDosha, healthGoals } = patient;
    
    // Determine age group
    const ageGroup = age < 18 ? 'child' : 'adult';
    const genderKey = gender === 'male' ? 'male' : 'female';
    
    // Get base requirements
    let requirements = this.nutritionalGuidelines[ageGroup];
    if (ageGroup === 'adult') {
      requirements = requirements[genderKey];
    }

    // Calculate BMR and TDEE
    const bmr = this.calculateBMR(age, gender, weight, height);
    const tdee = this.calculateTDEE(bmr, patient);

    // Adjust for health goals
    const adjustedCalories = this.adjustForHealthGoals(tdee, healthGoals, patient);

    // Calculate macronutrient distribution
    const macronutrients = this.calculateMacronutrients(adjustedCalories, patient);

    // Apply Ayurvedic adjustments
    const ayurvedicAdjustments = this.getAyurvedicAdjustments(primaryDosha, patient);

    return {
      calories: Math.round(adjustedCalories),
      macronutrients,
      micronutrients: this.getMicronutrientRequirements(age, gender),
      ayurvedicAdjustments,
      mealTiming: this.getMealTimingRecommendations(primaryDosha),
      hydration: this.getHydrationRequirements(weight, age, gender)
    };
  }

  // Calculate Basal Metabolic Rate (BMR)
  calculateBMR(age, gender, weight, height) {
    if (gender === 'male') {
      return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
  }

  // Calculate Total Daily Energy Expenditure (TDEE)
  calculateTDEE(bmr, patient) {
    // Activity factor based on lifestyle
    let activityFactor = 1.2; // Sedentary baseline

    if (patient.occupation) {
      if (patient.occupation.toLowerCase().includes('active') || 
          patient.occupation.toLowerCase().includes('physical')) {
        activityFactor = 1.5;
      } else if (patient.occupation.toLowerCase().includes('moderate')) {
        activityFactor = 1.375;
      }
    }

    // Adjust for meal frequency (more frequent meals = slightly higher metabolism)
    if (patient.mealFrequency === '4-5+') {
      activityFactor += 0.1;
    }

    return bmr * activityFactor;
  }

  // Adjust calories for health goals
  adjustForHealthGoals(tdee, healthGoals, patient) {
    let adjustment = 0;
    
    if (healthGoals && typeof healthGoals === 'string') {
      const goals = healthGoals.toLowerCase();
      
      if (goals.includes('weight loss') || goals.includes('lose weight')) {
        adjustment = -300; // 300 calorie deficit
      } else if (goals.includes('weight gain') || goals.includes('gain weight')) {
        adjustment = 300; // 300 calorie surplus
      } else if (goals.includes('muscle') || goals.includes('strength')) {
        adjustment = 200; // Slight surplus for muscle building
      }
    }

    // Adjust for BMI
    if (patient.bmi) {
      if (patient.bmi > 30) {
        adjustment -= 200; // Reduce for obesity
      } else if (patient.bmi < 18.5) {
        adjustment += 200; // Increase for underweight
      }
    }

    return Math.max(tdee + adjustment, 1200); // Minimum 1200 calories
  }

  // Calculate macronutrient distribution
  calculateMacronutrients(calories, patient) {
    const { primaryDosha, healthGoals } = patient;
    
    // Base macronutrient ratios
    let proteinPercent = 0.20; // 20%
    let carbPercent = 0.50;    // 50%
    let fatPercent = 0.30;     // 30%

    // Adjust based on dosha
    if (primaryDosha === 'Vata') {
      carbPercent = 0.55; // More carbs for grounding
      fatPercent = 0.25;
    } else if (primaryDosha === 'Pitta') {
      proteinPercent = 0.25; // More protein for cooling
      carbPercent = 0.45;
    } else if (primaryDosha === 'Kapha') {
      proteinPercent = 0.30; // More protein for lightness
      carbPercent = 0.40;
      fatPercent = 0.30;
    }

    // Adjust for health goals
    if (healthGoals && healthGoals.toLowerCase().includes('muscle')) {
      proteinPercent = 0.30;
      carbPercent = 0.45;
      fatPercent = 0.25;
    }

    return {
      protein: {
        grams: Math.round((calories * proteinPercent) / 4), // 4 cal/g
        percentage: proteinPercent * 100
      },
      carbohydrates: {
        grams: Math.round((calories * carbPercent) / 4), // 4 cal/g
        percentage: carbPercent * 100
      },
      fat: {
        grams: Math.round((calories * fatPercent) / 9), // 9 cal/g
        percentage: fatPercent * 100
      }
    };
  }

  // Get micronutrient requirements
  getMicronutrientRequirements(age, gender) {
    const baseRequirements = {
      vitamins: {
        A: age < 18 ? 600 : (gender === 'male' ? 900 : 700), // mcg
        C: age < 18 ? 45 : 90, // mg
        D: 15, // mcg
        E: age < 18 ? 11 : 15, // mg
        K: age < 18 ? 55 : 120, // mcg
        B12: 2.4, // mcg
        Folate: age < 18 ? 300 : 400 // mcg
      },
      minerals: {
        Calcium: age < 18 ? 1300 : 1000, // mg
        Iron: age < 18 ? 11 : (gender === 'female' ? 18 : 8), // mg
        Magnesium: age < 18 ? 240 : (gender === 'male' ? 420 : 320), // mg
        Zinc: age < 18 ? 8 : (gender === 'male' ? 11 : 8), // mg
        Potassium: age < 18 ? 2500 : 3500 // mg
      }
    };

    return baseRequirements;
  }

  // Get Ayurvedic dietary adjustments
  getAyurvedicAdjustments(primaryDosha, patient) {
    if (!primaryDosha || primaryDosha === 'Pending') {
      return {
        recommendations: [],
        avoid: [],
        mealTiming: 'Regular meals',
        cookingMethods: ['steaming', 'boiling', 'sautéing']
      };
    }

    const principles = this.ayurvedicPrinciples[primaryDosha.split('-')[0]] || {};
    
    return {
      recommendations: principles.recommended || [],
      avoid: principles.avoid || [],
      mealTiming: principles.mealTiming || 'Regular meals',
      cookingMethods: this.getCookingMethods(primaryDosha),
      spices: this.getRecommendedSpices(primaryDosha),
      foodTemperature: this.getFoodTemperature(primaryDosha)
    };
  }

  // Get recommended cooking methods based on dosha
  getCookingMethods(primaryDosha) {
    const methods = {
      Vata: ['steaming', 'boiling', 'sautéing', 'baking'],
      Pitta: ['steaming', 'boiling', 'raw (cooled)', 'light sautéing'],
      Kapha: ['grilling', 'roasting', 'sautéing', 'stir-frying']
    };

    return methods[primaryDosha.split('-')[0]] || ['steaming', 'boiling', 'sautéing'];
  }

  // Get recommended spices based on dosha
  getRecommendedSpices(primaryDosha) {
    const spices = {
      Vata: ['ginger', 'cumin', 'coriander', 'cardamom', 'cinnamon'],
      Pitta: ['coriander', 'fennel', 'mint', 'basil', 'turmeric'],
      Kapha: ['ginger', 'black pepper', 'cayenne', 'mustard seeds', 'garlic']
    };

    return spices[primaryDosha.split('-')[0]] || ['turmeric', 'cumin', 'coriander'];
  }

  // Get recommended food temperature based on dosha
  getFoodTemperature(primaryDosha) {
    const temperatures = {
      Vata: 'Warm to hot',
      Pitta: 'Cool to room temperature',
      Kapha: 'Warm to hot'
    };

    return temperatures[primaryDosha.split('-')[0]] || 'Room temperature';
  }

  // Get meal timing recommendations
  getMealTimingRecommendations(primaryDosha) {
    const timing = {
      Vata: {
        breakfast: '07:00-08:00',
        lunch: '12:00-13:00',
        dinner: '18:00-19:00',
        snacks: '10:00, 15:00'
      },
      Pitta: {
        breakfast: '07:00-08:00',
        lunch: '12:00-13:00',
        dinner: '19:00-20:00',
        snacks: '10:00, 16:00'
      },
      Kapha: {
        breakfast: '06:00-07:00',
        lunch: '11:00-12:00',
        dinner: '18:00-19:00',
        snacks: '15:00 only'
      }
    };

    return timing[primaryDosha.split('-')[0]] || timing.Vata;
  }

  // Get hydration requirements
  getHydrationRequirements(weight, age, gender) {
    // Base requirement: 35ml per kg body weight
    let baseWater = (weight * 35) / 1000; // Convert to liters

    // Adjust for age
    if (age < 18) {
      baseWater *= 0.8; // Children need less
    } else if (age > 65) {
      baseWater *= 0.9; // Elderly need slightly less
    }

    // Adjust for gender
    if (gender === 'female') {
      baseWater *= 0.9; // Women typically need less
    }

    return {
      liters: Math.round(baseWater * 10) / 10,
      glasses: Math.round(baseWater * 4.2), // Assuming 240ml per glass
      timing: 'Throughout the day, avoid large amounts with meals'
    };
  }

  // Analyze nutrition of a meal plan
  analyzeMealPlanNutrition(mealPlan) {
    const analysis = {
      totalNutrition: {
        calories: 0,
        protein_g: 0,
        carbs_g: 0,
        fat_g: 0,
        fiber_g: 0,
        vitamins: {},
        minerals: {}
      },
      dailyBreakdown: [],
      recommendations: [],
      warnings: []
    };

    // Analyze each day
    mealPlan.dailyPlans.forEach((day, dayIndex) => {
      const dayNutrition = {
        day: dayIndex + 1,
        calories: 0,
        protein_g: 0,
        carbs_g: 0,
        fat_g: 0,
        fiber_g: 0,
        meals: []
      };

      // Analyze each meal
      day.meals.forEach(meal => {
        const mealNutrition = {
          mealType: meal.mealType,
          calories: meal.totalNutrition.calories,
          protein_g: meal.totalNutrition.protein_g,
          carbs_g: meal.totalNutrition.carbs_g,
          fat_g: meal.totalNutrition.fat_g,
          fiber_g: meal.totalNutrition.fiber_g
        };

        dayNutrition.meals.push(mealNutrition);
        dayNutrition.calories += mealNutrition.calories;
        dayNutrition.protein_g += mealNutrition.protein_g;
        dayNutrition.carbs_g += mealNutrition.carbs_g;
        dayNutrition.fat_g += mealNutrition.fat_g;
        dayNutrition.fiber_g += mealNutrition.fiber_g;
      });

      analysis.dailyBreakdown.push(dayNutrition);
      analysis.totalNutrition.calories += dayNutrition.calories;
      analysis.totalNutrition.protein_g += dayNutrition.protein_g;
      analysis.totalNutrition.carbs_g += dayNutrition.carbs_g;
      analysis.totalNutrition.fat_g += dayNutrition.fat_g;
      analysis.totalNutrition.fiber_g += dayNutrition.fiber_g;
    });

    // Calculate averages
    const days = mealPlan.dailyPlans.length;
    analysis.averageNutrition = {
      calories: Math.round(analysis.totalNutrition.calories / days),
      protein_g: Math.round(analysis.totalNutrition.protein_g / days),
      carbs_g: Math.round(analysis.totalNutrition.carbs_g / days),
      fat_g: Math.round(analysis.totalNutrition.fat_g / days),
      fiber_g: Math.round(analysis.totalNutrition.fiber_g / days)
    };

    return analysis;
  }

  // Generate nutrition recommendations
  generateNutritionRecommendations(patient, mealPlanAnalysis) {
    const requirements = this.calculateNutritionalRequirements(patient);
    const recommendations = [];

    // Compare with requirements
    const avg = mealPlanAnalysis.averageNutrition;

    // Calorie recommendations
    if (avg.calories < requirements.calories * 0.9) {
      recommendations.push({
        type: 'calories',
        message: 'Consider increasing calorie intake',
        current: avg.calories,
        target: requirements.calories,
        suggestion: 'Add healthy snacks or increase portion sizes'
      });
    } else if (avg.calories > requirements.calories * 1.1) {
      recommendations.push({
        type: 'calories',
        message: 'Consider reducing calorie intake',
        current: avg.calories,
        target: requirements.calories,
        suggestion: 'Reduce portion sizes or choose lower-calorie options'
      });
    }

    // Protein recommendations
    if (avg.protein_g < requirements.macronutrients.protein.grams * 0.9) {
      recommendations.push({
        type: 'protein',
        message: 'Increase protein intake',
        current: avg.protein_g,
        target: requirements.macronutrients.protein.grams,
        suggestion: 'Add more legumes, nuts, or lean proteins'
      });
    }

    // Fiber recommendations
    if (avg.fiber_g < 25) {
      recommendations.push({
        type: 'fiber',
        message: 'Increase fiber intake',
        current: avg.fiber_g,
        target: 25,
        suggestion: 'Add more whole grains, fruits, and vegetables'
      });
    }

    return recommendations;
  }
}

module.exports = new NutritionService();
