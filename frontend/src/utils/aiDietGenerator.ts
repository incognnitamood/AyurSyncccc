import { Patient } from '../types/patient';

// Type definitions
type DoshaType = 'Vata' | 'Pitta' | 'Kapha';
type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';
type AgeGroup = '18-30' | '31-45' | '46-60' | '60+';
type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
type HealthCondition = 'weight_loss' | 'weight_gain' | 'diabetes' | 'hypertension' | 'digestive_issues' | 'high_cholesterol';

// Comprehensive dosha-based meal database
const MEAL_DATABASE: Record<MealType, Record<DoshaType, Array<{name: string, calories: number, prep: string, benefits: string}>>> = {
  breakfast: {
    Vata: [
      { name: "Warm Oatmeal with Ghee and Dates", calories: 320, prep: "15 min", benefits: "Grounding, warming" },
      { name: "Spiced Quinoa Porridge with Nuts", calories: 280, prep: "20 min", benefits: "Protein-rich, warming" },
      { name: "Golden Milk Chia Pudding", calories: 240, prep: "10 min", benefits: "Anti-inflammatory, soothing" },
      { name: "Warm Rice Pudding with Cardamom", calories: 300, prep: "25 min", benefits: "Comforting, easy to digest" },
      { name: "Avocado Toast with Warm Spices", calories: 280, prep: "8 min", benefits: "Healthy fats, grounding" }
    ],
    Pitta: [
      { name: "Coconut Rice with Sweet Fruits", calories: 260, prep: "15 min", benefits: "Cooling, sweet" },
      { name: "Cool Smoothie Bowl with Berries", calories: 220, prep: "10 min", benefits: "Cooling, antioxidant-rich" },
      { name: "Overnight Oats with Rose Water", calories: 250, prep: "5 min", benefits: "Cooling, gentle" },
      { name: "Fresh Fruit Salad with Mint", calories: 180, prep: "8 min", benefits: "Hydrating, cooling" },
      { name: "Coconut Yogurt Parfait", calories: 240, prep: "5 min", benefits: "Probiotic, cooling" }
    ],
    Kapha: [
      { name: "Spicy Vegetable Scramble", calories: 200, prep: "12 min", benefits: "Stimulating, light" },
      { name: "Green Tea Smoothie with Ginger", calories: 150, prep: "5 min", benefits: "Energizing, metabolism-boosting" },
      { name: "Buckwheat Pancakes with Honey", calories: 220, prep: "20 min", benefits: "Light, energizing" },
      { name: "Warm Lemon Ginger Water + Light Toast", calories: 120, prep: "5 min", benefits: "Digestive, cleansing" },
      { name: "Spiced Apple Porridge", calories: 180, prep: "15 min", benefits: "Warming, stimulating" }
    ]
  },
  lunch: {
    Vata: [
      { name: "Kitchari with Root Vegetables", calories: 380, prep: "30 min", benefits: "Complete protein, grounding" },
      { name: "Warm Quinoa Salad with Tahini", calories: 420, prep: "25 min", benefits: "Nourishing, protein-rich" },
      { name: "Lentil Soup with Warm Bread", calories: 360, prep: "35 min", benefits: "Warming, satisfying" },
      { name: "Roasted Vegetable Bowl with Ghee", calories: 340, prep: "40 min", benefits: "Grounding, nourishing" },
      { name: "Sweet Potato and Black Bean Stew", calories: 380, prep: "45 min", benefits: "Warming, protein-rich" }
    ],
    Pitta: [
      { name: "Cool Cucumber Soup with Herbs", calories: 180, prep: "15 min", benefits: "Cooling, hydrating" },
      { name: "Coconut Rice with Steamed Vegetables", calories: 320, prep: "25 min", benefits: "Cooling, mild" },
      { name: "Fresh Salad with Cooling Herbs", calories: 280, prep: "10 min", benefits: "Cooling, light" },
      { name: "Mint and Cilantro Chutney with Rice", calories: 300, prep: "20 min", benefits: "Cooling, digestive" },
      { name: "Cool Gazpacho with Avocado", calories: 220, prep: "15 min", benefits: "Cooling, antioxidant-rich" }
    ],
    Kapha: [
      { name: "Spicy Lentil Dal with Vegetables", calories: 280, prep: "30 min", benefits: "Stimulating, light" },
      { name: "Quinoa Salad with Warming Spices", calories: 260, prep: "20 min", benefits: "Light, energizing" },
      { name: "Vegetable Stir-fry with Ginger", calories: 240, prep: "15 min", benefits: "Light, stimulating" },
      { name: "Spiced Chickpea Curry", calories: 300, prep: "25 min", benefits: "Protein-rich, warming" },
      { name: "Barley Soup with Warming Herbs", calories: 220, prep: "35 min", benefits: "Light, warming" }
    ]
  },
  dinner: {
    Vata: [
      { name: "Creamy Vegetable Soup with Ghee", calories: 280, prep: "25 min", benefits: "Soothing, easy to digest" },
      { name: "Warm Pasta with Herb Oil", calories: 320, prep: "20 min", benefits: "Comforting, grounding" },
      { name: "Mung Bean Stew with Rice", calories: 300, prep: "30 min", benefits: "Easy to digest, nourishing" },
      { name: "Roasted Root Vegetable Medley", calories: 260, prep: "35 min", benefits: "Grounding, warming" },
      { name: "Warm Milk with Turmeric and Dates", calories: 180, prep: "10 min", benefits: "Calming, sleep-promoting" }
    ],
    Pitta: [
      { name: "Cool Coconut Curry with Vegetables", calories: 240, prep: "20 min", benefits: "Cooling, mild" },
      { name: "Steamed Fish with Cooling Herbs", calories: 280, prep: "25 min", benefits: "Light, cooling" },
      { name: "Cool Zucchini Noodles with Pesto", calories: 220, prep: "15 min", benefits: "Light, cooling" },
      { name: "Fresh Vegetable Wrap with Hummus", calories: 260, prep: "10 min", benefits: "Light, cooling" },
      { name: "Chamomile Tea with Light Snack", calories: 120, prep: "5 min", benefits: "Calming, cooling" }
    ],
    Kapha: [
      { name: "Spicy Vegetable Curry", calories: 200, prep: "25 min", benefits: "Stimulating, light" },
      { name: "Grilled Vegetables with Herbs", calories: 160, prep: "20 min", benefits: "Light, warming" },
      { name: "Spiced Cauliflower Rice", calories: 140, prep: "15 min", benefits: "Light, low-calorie" },
      { name: "Warming Herbal Tea with Spices", calories: 40, prep: "10 min", benefits: "Digestive, warming" },
      { name: "Light Vegetable Broth", calories: 80, prep: "15 min", benefits: "Light, cleansing" }
    ]
  },
  snacks: {
    Vata: [
      { name: "Dates with Almond Butter", calories: 160, prep: "2 min", benefits: "Sweet, grounding" },
      { name: "Warm Spiced Milk", calories: 140, prep: "5 min", benefits: "Calming, nourishing" },
      { name: "Sesame Seed Balls", calories: 120, prep: "3 min", benefits: "Grounding, warming" }
    ],
    Pitta: [
      { name: "Cool Coconut Water", calories: 45, prep: "1 min", benefits: "Cooling, hydrating" },
      { name: "Fresh Fruit Salad", calories: 80, prep: "5 min", benefits: "Cooling, sweet" },
      { name: "Cucumber Mint Water", calories: 10, prep: "2 min", benefits: "Cooling, refreshing" }
    ],
    Kapha: [
      { name: "Ginger Tea with Lemon", calories: 20, prep: "5 min", benefits: "Stimulating, warming" },
      { name: "Apple Slices with Cinnamon", calories: 60, prep: "2 min", benefits: "Light, warming" },
      { name: "Herbal Tea Blend", calories: 5, prep: "3 min", benefits: "Digestive, warming" }
    ]
  }
};

// Advanced health condition considerations
const HEALTH_CONDITIONS: Record<HealthCondition, {calorie_modifier?: number, calorie_reduction?: number, calorie_increase?: number, focus: string[], avoid: string[]}> = {
  "weight_loss": {
    calorie_reduction: 0.8,
    focus: ["high fiber", "low calorie", "protein rich"],
    avoid: ["heavy", "oily", "sweet"]
  },
  "weight_gain": {
    calorie_increase: 1.3,
    focus: ["healthy fats", "protein", "complex carbs"],
    avoid: ["light", "dry"]
  },
  "diabetes": {
    calorie_modifier: 1.0,
    focus: ["low glycemic", "fiber rich", "protein"],
    avoid: ["sweet", "refined carbs"]
  },
  "hypertension": {
    calorie_modifier: 1.0,
    focus: ["low sodium", "potassium rich", "cooling"],
    avoid: ["salty", "heating", "spicy"]
  },
  "digestive_issues": {
    calorie_modifier: 0.9,
    focus: ["easy to digest", "warm", "mild"],
    avoid: ["raw", "cold", "heavy"]
  },
  "high_cholesterol": {
    calorie_modifier: 0.9,
    focus: ["fiber rich", "omega-3", "antioxidant"],
    avoid: ["saturated fat", "fried"]
  }
};

// Age-based modifications
const AGE_MODIFIERS: Record<AgeGroup, {calorie_modifier: number, focus: string[]}> = {
  "18-30": { calorie_modifier: 1.1, focus: ["energy", "growth"] },
  "31-45": { calorie_modifier: 1.0, focus: ["balance", "maintenance"] },
  "46-60": { calorie_modifier: 0.9, focus: ["metabolism", "joint health"] },
  "60+": { calorie_modifier: 0.8, focus: ["gentle", "easy digest"] }
};

// Activity level considerations
const ACTIVITY_LEVELS: Record<ActivityLevel, {calorie_modifier: number}> = {
  "sedentary": { calorie_modifier: 0.9 },
  "lightly_active": { calorie_modifier: 1.0 },
  "moderately_active": { calorie_modifier: 1.2 },
  "very_active": { calorie_modifier: 1.4 },
  "extremely_active": { calorie_modifier: 1.6 }
};

interface DietPlanOptions {
  duration: number; // days
  preferences: string[];
  healthConditions: string[];
  activityLevel: string;
  goals: string[];
  budget?: string;
  cookingTime?: string;
  familySize?: number;
}

interface MealPlan {
  day: number;
  date: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal[];
  totalCalories: number;
  waterIntake: string;
  exerciseRecommendation: string;
  dayNotes: string;
}

interface Meal {
  name: string;
  calories: number;
  prep: string;
  benefits: string;
  ingredients?: string[];
  instructions?: string[];
  doshaBalance: string;
}

export class AIPersonalizedDietGenerator {
  
  static generatePersonalizedDietPlan(patient: Patient, options: DietPlanOptions): {
    meals: MealPlan[];
    guidelines: string[];
    totalCalories: number;
    expectedResults: string[];
    warnings: string[];
  } {
    
    // Calculate base calorie needs
    const baseCalories = this.calculateBaseCalories(patient);
    
    // Apply modifiers based on conditions, age, activity
    const adjustedCalories = this.applyModifiers(baseCalories, patient, options);
    
    // Generate meal plans for each day
    const meals: MealPlan[] = [];
    
    for (let day = 1; day <= options.duration; day++) {
      const dayPlan = this.generateDayPlan(day, patient, options, adjustedCalories);
      meals.push(dayPlan);
    }
    
    // Generate personalized guidelines
    const guidelines = this.generateGuidelines(patient, options);
    
    // Calculate expected results
    const expectedResults = this.generateExpectedResults(patient, options);
    
    // Generate warnings and precautions
    const warnings = this.generateWarnings(patient, options);
    
    return {
      meals,
      guidelines,
      totalCalories: adjustedCalories,
      expectedResults,
      warnings
    };
  }
  
  private static calculateBaseCalories(patient: Patient): number {
    // Harris-Benedict equation with dosha modifications
    const age = patient.age || 30;
    const weight = patient.weight || 70;
    const height = patient.height || 170;
    const gender = patient.gender || 'male';
    
    let bmr: number;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    
    // Dosha-based modifications
    const doshaModifier = {
      'Vata': 1.1, // Higher metabolism
      'Pitta': 1.15, // Strong digestion
      'Kapha': 0.9, // Slower metabolism
      'Vata-Pitta': 1.12,
      'Pitta-Kapha': 1.02,
      'Vata-Kapha': 1.0
    };
    
    return Math.round(bmr * (doshaModifier[patient.primaryDosha as keyof typeof doshaModifier] || 1.0));
  }
  
  private static applyModifiers(baseCalories: number, patient: Patient, options: DietPlanOptions): number {
    let adjustedCalories = baseCalories;
    
    // Age modifier
    const ageGroup = this.getAgeGroup(patient.age || 30);
    adjustedCalories *= AGE_MODIFIERS[ageGroup as AgeGroup].calorie_modifier;
    
    // Activity level modifier
    adjustedCalories *= ACTIVITY_LEVELS[options.activityLevel as ActivityLevel]?.calorie_modifier || 1.0;
    
    // Health condition modifiers
    options.healthConditions.forEach(condition => {
      const healthCondition = HEALTH_CONDITIONS[condition as HealthCondition];
      if (healthCondition) {
        adjustedCalories *= healthCondition.calorie_modifier || healthCondition.calorie_reduction || healthCondition.calorie_increase || 1.0;
      }
    });
    
    return Math.round(adjustedCalories);
  }
  
  private static generateDayPlan(day: number, patient: Patient, options: DietPlanOptions, targetCalories: number): MealPlan {
    const dosha = this.extractPrimaryDosha(patient.primaryDosha);
    
    // Select meals based on patient profile
    const breakfast = this.selectMeal('breakfast', dosha, patient, options, targetCalories * 0.25);
    const lunch = this.selectMeal('lunch', dosha, patient, options, targetCalories * 0.4);
    const dinner = this.selectMeal('dinner', dosha, patient, options, targetCalories * 0.25);
    const snacks = [this.selectMeal('snacks', dosha, patient, options, targetCalories * 0.1)];
    
    const totalCalories = breakfast.calories + lunch.calories + dinner.calories + 
                         snacks.reduce((sum, snack) => sum + snack.calories, 0);
    
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + day - 1);
    
    return {
      day,
      date: currentDate.toISOString().split('T')[0],
      breakfast,
      lunch,
      dinner,
      snacks,
      totalCalories,
      waterIntake: this.calculateWaterIntake(patient, options),
      exerciseRecommendation: this.getExerciseRecommendation(patient, day),
      dayNotes: this.generateDayNotes(patient, day, options)
    };
  }
  
  private static selectMeal(mealType: string, dosha: string, patient: Patient, options: DietPlanOptions, targetCalories: number): Meal {
    const mealOptions = MEAL_DATABASE[mealType as MealType]?.[dosha as DoshaType] || [];
    
    if (mealOptions.length === 0) {
      return {
        name: `Custom ${mealType} for ${dosha}`,
        calories: Math.round(targetCalories),
        prep: "15 min",
        benefits: `Balances ${dosha} dosha`,
        doshaBalance: dosha
      };
    }
    
    // Apply intelligent selection based on patient preferences and conditions
    let filteredOptions = mealOptions.filter((meal: any) => {
      // Check dietary preferences
      if (options.preferences.includes('vegetarian') && meal.name.toLowerCase().includes('fish')) {
        return false;
      }
      if (options.preferences.includes('vegan') && 
          (meal.name.toLowerCase().includes('milk') || 
           meal.name.toLowerCase().includes('ghee') || 
           meal.name.toLowerCase().includes('yogurt'))) {
        return false;
      }
      if (options.preferences.includes('gluten-free') && 
          (meal.name.toLowerCase().includes('bread') || 
           meal.name.toLowerCase().includes('pasta'))) {
        return false;
      }
      return true;
    });
    
    if (filteredOptions.length === 0) {
      filteredOptions = mealOptions; // Fallback to all options
    }
    
    // Select meal closest to target calories with some variety
    const dayIndex = Math.floor(Math.random() * filteredOptions.length);
    const selectedMeal = filteredOptions[dayIndex];
    
    return {
      ...selectedMeal,
      doshaBalance: dosha,
      ingredients: this.generateIngredients(selectedMeal, patient, options),
      instructions: this.generateInstructions(selectedMeal, patient)
    };
  }
  
  private static generateIngredients(meal: any, patient: Patient, options: DietPlanOptions): string[] {
    // Generate contextual ingredients based on meal name and patient profile
    const baseIngredients = this.getBaseIngredients(meal.name);
    const doshaSpices = this.getDoshaSpices(patient.primaryDosha);
    const healthIngredients = this.getHealthIngredients(options.healthConditions);
    
    return [...baseIngredients, ...doshaSpices, ...healthIngredients];
  }
  
  private static generateInstructions(meal: any, patient: Patient): string[] {
    return [
      `Prepare ingredients according to ${patient.primaryDosha} dosha principles`,
      `Cook at moderate temperature to preserve nutrients`,
      `Add spices gradually to balance flavors`,
      `Serve warm for optimal digestion`,
      `Eat mindfully and chew thoroughly`
    ];
  }
  
  private static getBaseIngredients(mealName: string): string[] {
    const ingredientMap: { [key: string]: string[] } = {
      "oatmeal": ["rolled oats", "water", "milk of choice"],
      "quinoa": ["quinoa", "vegetable broth", "onion"],
      "smoothie": ["banana", "berries", "liquid base"],
      "soup": ["vegetables", "broth", "herbs"],
      "curry": ["vegetables", "coconut milk", "spices"],
      "salad": ["mixed greens", "cucumber", "tomato"]
    };
    
    const matchingKey = Object.keys(ingredientMap).find(key => 
      mealName.toLowerCase().includes(key)
    );
    
    return matchingKey ? ingredientMap[matchingKey] : ["seasonal vegetables", "healthy fats", "whole grains"];
  }
  
  private static getDoshaSpices(dosha: string): string[] {
    const spiceMap = {
      "Vata": ["ginger", "cardamom", "cinnamon", "nutmeg"],
      "Pitta": ["coriander", "fennel", "mint", "rose"],
      "Kapha": ["black pepper", "cayenne", "mustard seeds", "turmeric"]
    };
    
    const primaryDosha = this.extractPrimaryDosha(dosha);
    return spiceMap[primaryDosha as DoshaType] || ["turmeric", "cumin"];
  }
  
  private static getHealthIngredients(conditions: string[]): string[] {
    const healthMap: Record<string, string[]> = {
      "diabetes": ["cinnamon", "bitter melon", "fenugreek"],
      "weight_loss": ["green tea", "lemon", "ginger"],
      "hypertension": ["garlic", "celery", "potassium-rich foods"],
      "digestive_issues": ["fennel", "ajwain", "ginger"]
    };
    
    let ingredients: string[] = [];
    conditions.forEach(condition => {
      if (healthMap[condition]) {
        ingredients.push(...healthMap[condition]);
      }
    });
    
    return [...new Set(ingredients)]; // Remove duplicates
  }
  
  private static extractPrimaryDosha(dosha: string): string {
    if (dosha.includes('Vata')) return 'Vata';
    if (dosha.includes('Pitta')) return 'Pitta';
    if (dosha.includes('Kapha')) return 'Kapha';
    return 'Vata'; // Default
  }
  
  private static getAgeGroup(age: number): string {
    if (age <= 30) return "18-30";
    if (age <= 45) return "31-45";
    if (age <= 60) return "46-60";
    return "60+";
  }
  
  private static calculateWaterIntake(patient: Patient, options: DietPlanOptions): string {
    const baseWater = 2000; // ml
    const weight = patient.weight || 70;
    const waterNeeds = Math.round((weight * 35) + (options.activityLevel === 'very_active' ? 500 : 0));
    
    return `${waterNeeds}ml (${Math.round(waterNeeds/250)} glasses)`;
  }
  
  private static getExerciseRecommendation(patient: Patient, day: number): string {
    const dosha = this.extractPrimaryDosha(patient.primaryDosha);
    const exercises: Record<DoshaType, string[]> = {
      "Vata": ["Gentle yoga", "Walking", "Swimming", "Tai chi"],
      "Pitta": ["Moderate cardio", "Cycling", "Tennis", "Weight training"],
      "Kapha": ["Vigorous exercise", "Running", "HIIT", "Dance"]
    };
    
    const dayExercises = exercises[dosha as DoshaType] || exercises["Vata"];
    return dayExercises[day % dayExercises.length];
  }
  
  private static generateDayNotes(patient: Patient, day: number, options: DietPlanOptions): string {
    const notes = [
      `Day ${day}: Focus on ${patient.primaryDosha} balance`,
      "Eat meals at regular intervals",
      "Practice mindful eating",
      "Stay hydrated throughout the day"
    ];
    
    if (day === 1) notes.push("Start gradually with new dietary changes");
    if (day % 7 === 0) notes.push("Weekly review: Track progress and adjust as needed");
    
    return notes.join('. ');
  }
  
  private static generateGuidelines(patient: Patient, options: DietPlanOptions): string[] {
    const guidelines = [
      `For ${patient.primaryDosha} constitution: ${this.getDoshaGuideline(patient.primaryDosha)}`,
      "Eat your largest meal at midday when digestive fire is strongest",
      "Avoid eating late at night - finish dinner by 7 PM",
      "Drink warm water throughout the day, especially before meals",
      "Practice mindful eating: chew thoroughly and eat without distractions"
    ];
    
    // Add condition-specific guidelines
    options.healthConditions.forEach(condition => {
      if (condition === 'diabetes') {
        guidelines.push("Monitor blood sugar levels and adjust portions as needed");
      }
      if (condition === 'weight_loss') {
        guidelines.push("Create a moderate calorie deficit through balanced nutrition");
      }
      if (condition === 'hypertension') {
        guidelines.push("Limit sodium intake and include potassium-rich foods");
      }
    });
    
    // Add preference-specific guidelines
    if (options.preferences.includes('vegetarian')) {
      guidelines.push("Ensure adequate protein from plant sources like legumes and quinoa");
    }
    
    return guidelines;
  }
  
  private static getDoshaGuideline(dosha: string): string {
    const guidelines: Record<string, string> = {
      "Vata": "Focus on warm, moist, grounding foods. Avoid cold, dry, light foods.",
      "Pitta": "Emphasize cool, sweet, bitter tastes. Reduce hot, spicy, acidic foods.",
      "Kapha": "Choose light, warm, spicy foods. Minimize heavy, oily, sweet foods.",
      "Vata-Pitta": "Balance warming and cooling foods based on season and symptoms.",
      "Pitta-Kapha": "Combine cooling and light foods, avoid heavy and heating items.",
      "Vata-Kapha": "Focus on warm, light foods that are neither too dry nor too oily."
    };
    
    return guidelines[dosha] || guidelines["Vata"];
  }
  
  private static generateExpectedResults(patient: Patient, options: DietPlanOptions): string[] {
    const results = [
      "Improved digestion and energy levels within 1-2 weeks",
      "Better sleep quality and mental clarity",
      "Enhanced immune function and vitality"
    ];
    
    if (options.goals.includes('weight_loss')) {
      results.push("Gradual, sustainable weight loss of 1-2 pounds per week");
    }
    
    if (options.goals.includes('energy')) {
      results.push("Increased energy levels and reduced fatigue");
    }
    
    if (options.healthConditions.includes('diabetes')) {
      results.push("Better blood sugar stability and glucose management");
    }
    
    return results;
  }
  
  private static generateWarnings(patient: Patient, options: DietPlanOptions): string[] {
    const warnings = [
      "Consult your healthcare provider before starting any new diet plan",
      "Start gradually and monitor your body's response to dietary changes",
      "Stay hydrated and maintain regular meal times"
    ];
    
    if (options.healthConditions.length > 0) {
      warnings.push("Monitor your health conditions closely and adjust as needed");
    }
    
    if (patient.age && patient.age > 65) {
      warnings.push("Seniors should proceed with extra caution and medical supervision");
    }
    
    return warnings;
  }
}