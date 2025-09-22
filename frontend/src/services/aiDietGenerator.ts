import type { Patient, Recipe, DietPlan } from './supabase'
import { SupabaseService } from './supabase'

export class AyurvedicAIDietGenerator {
  // Dosha-specific guidelines
  private static readonly DOSHA_GUIDELINES = {
    Vata: { 
      tastes: ['sweet', 'sour', 'salty'], 
      qualities: ['warm', 'moist', 'heavy'],
      portions: { breakfast: 0.25, lunch: 0.45, dinner: 0.25, snacks: 0.05 }
    },
    Pitta: { 
      tastes: ['sweet', 'bitter', 'astringent'], 
      qualities: ['cool', 'heavy', 'dry'],
      portions: { breakfast: 0.3, lunch: 0.4, dinner: 0.25, snacks: 0.05 }
    },
    Kapha: { 
      tastes: ['pungent', 'bitter', 'astringent'], 
      qualities: ['warm', 'light', 'dry'],
      portions: { breakfast: 0.2, lunch: 0.5, dinner: 0.2, snacks: 0.1 }
    }
  }

  static async generateComprehensiveDietPlan(
    patient: Patient,
    preferences: {
      duration_days?: number
      target_goals?: string[]
      dietary_restrictions?: string[]
      preferred_cuisines?: string[]
      cooking_time_max?: number
      budget_level?: string
      family_size?: number
      activity_level?: string
      meal_prep_preference?: string
      organic_preference?: boolean
      [key: string]: any // Accept unlimited inputs
    } = {}
  ): Promise<{ dietPlan: DietPlan; error?: string }> {
    
    try {
      console.log('🤖 Generating AI Diet Plan with unlimited inputs...')
      console.log('Patient Profile:', {
        name: patient.full_name,
        dosha: patient.primary_dosha,
        age: patient.age,
        weight: patient.weight,
        health_concerns: patient.health_concerns
      })
      console.log('All Preferences:', preferences)

      // Calculate nutritional needs
      const nutritionalNeeds = this.calculateNutritionalRequirements(patient, preferences)
      
      // Get all recipes
      const { data: allRecipes, error: recipeError } = await SupabaseService.getRecipes()
      if (recipeError || !allRecipes) {
        throw new Error('Failed to fetch recipes')
      }

      // Score and filter recipes
      const suitableRecipes = this.scoreRecipesBySuitability(allRecipes, patient, preferences)
      
      // Generate meal plan
      const mealPlan = this.generateOptimizedMealPlan(
        suitableRecipes, 
        patient, 
        preferences, 
        nutritionalNeeds,
        preferences.duration_days || 7
      )

      // Generate comprehensive plan
      const dietPlan: Omit<DietPlan, 'id' | 'created_at' | 'updated_at'> = {
        patient_id: patient.id,
        practitioner_id: patient.practitioner_id,
        plan_name: `AI Personalized Plan - ${patient.full_name}`,
        duration_days: preferences.duration_days || 7,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + (preferences.duration_days || 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        target_calories_per_day: nutritionalNeeds.calories,
        plan_goals: preferences.target_goals || ['general_wellness'],
        dietary_preferences: Object.keys(preferences).filter(key => preferences[key] === true),
        meal_plan: mealPlan,
        ai_model_used: 'ayurvedic_ai_comprehensive_v2.0',
        generation_parameters: {
          patient_profile: {
            dosha: patient.primary_dosha,
            age: patient.age,
            weight: patient.weight,
            height: patient.height,
            health_concerns: patient.health_concerns,
            allergies: patient.allergies
          },
          all_preferences: preferences,
          generation_timestamp: new Date().toISOString(),
          input_count: Object.keys(preferences).length
        },
        nutritional_analysis: this.calculateNutritionalSummary(mealPlan, nutritionalNeeds),
        ayurvedic_guidelines: this.generatePersonalizedGuidelines(patient, preferences),
        lifestyle_recommendations: this.generateLifestyleRecommendations(patient, preferences),
        status: 'active',
        adherence_score: 0
      }

      console.log('✅ Comprehensive Diet Plan Generated Successfully')
      console.log('📊 Plan includes', Object.keys(mealPlan).length, 'days')
      
      return { dietPlan: dietPlan as DietPlan }

    } catch (error) {
      console.error('❌ Error generating diet plan:', error)
      return { dietPlan: null as any, error: error instanceof Error ? error.message : 'An unknown error occurred' }
    }
  }

  private static calculateNutritionalRequirements(patient: Patient, preferences: any) {
    const weight = patient.weight || 70
    const height = patient.height || 170
    const age = patient.age
    const gender = patient.gender

    // BMR calculation
    let bmr: number
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }

    // Activity multiplier
    const activityMultipliers = {
      sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9
    }
    
    let calories = bmr * (activityMultipliers[preferences.activity_level as keyof typeof activityMultipliers] || 1.55)

    // Dosha adjustments
    const doshaMultipliers = {
      'Vata': 1.1, 'Pitta': 1.15, 'Kapha': 0.9,
      'Vata-Pitta': 1.12, 'Pitta-Kapha': 1.02, 'Vata-Kapha': 1.0
    }
    calories *= doshaMultipliers[patient.primary_dosha as keyof typeof doshaMultipliers] || 1.0

    // Goal adjustments
    if (preferences.target_goals?.includes('weight_loss')) calories *= 0.85
    if (preferences.target_goals?.includes('weight_gain')) calories *= 1.15
    if (preferences.target_goals?.includes('muscle_gain')) calories *= 1.1

    return {
      calories: Math.round(calories),
      protein_g: Math.round(calories * 0.15 / 4),
      carbs_g: Math.round(calories * 0.55 / 4),
      fat_g: Math.round(calories * 0.3 / 9),
      fiber_g: Math.max(25, Math.round(calories / 100)),
      water_l: Math.max(2.0, weight * 0.035)
    }
  }

  private static scoreRecipesBySuitability(
    recipes: Recipe[], 
    patient: Patient, 
    preferences: any
  ): Array<Recipe & { score: number }> {
    
    return recipes.map(recipe => {
      let score = 0
      
      // Dosha compatibility (40%)
      const doshaEffect = recipe.ayurvedic_properties.dosha_effects
      const primaryDosha = patient.primary_dosha.split('-')[0].toLowerCase()
      if (doshaEffect[primaryDosha as keyof typeof doshaEffect] === 'decrease') score += 0.4
      else if (doshaEffect[primaryDosha as keyof typeof doshaEffect] === 'neutral') score += 0.28
      else score += 0.12

      // Health conditions (25%)
      if (patient.health_concerns?.length) {
        const healthMatch = patient.health_concerns.some(concern =>
          recipe.health_benefits?.some(benefit => 
            benefit.toLowerCase().includes(concern.toLowerCase())
          )
        )
        if (healthMatch) score += 0.25
        else score += 0.1
      } else {
        score += 0.15
      }

      // Dietary restrictions (20%)
      let restrictionPenalty = 0
      if (preferences.dietary_restrictions?.includes('vegetarian') && 
          recipe.tags?.includes('non-vegetarian')) restrictionPenalty = 0.2
      if (preferences.dietary_restrictions?.includes('vegan') && 
          recipe.ingredients?.some(ing => ing.item.includes('dairy'))) restrictionPenalty = 0.2
      if (preferences.dietary_restrictions?.includes('gluten_free') && 
          recipe.ingredients?.some(ing => ing.item.includes('wheat'))) restrictionPenalty = 0.2
      
      score += Math.max(0, 0.2 - restrictionPenalty)

      // Cooking time preference (15%)
      const maxTime = preferences.cooking_time_max || 60
      if (recipe.preparation_time + recipe.cooking_time <= maxTime) score += 0.15
      else score += 0.05

      return { ...recipe, score }
    })
    .filter(recipe => recipe.score > 0.3)
    .sort((a, b) => b.score - a.score)
  }

  private static generateOptimizedMealPlan(
    recipes: Array<Recipe & { score: number }>,
    patient: Patient,
    preferences: any,
    nutritionalNeeds: any,
    duration: number
  ) {
    const mealPlan: any = {}
    const usedRecipes = new Set<string>()
    
    const primaryDosha = patient.primary_dosha.split('-')[0] as keyof typeof this.DOSHA_GUIDELINES
    const portions = this.DOSHA_GUIDELINES[primaryDosha]?.portions || this.DOSHA_GUIDELINES.Vata.portions

    for (let day = 1; day <= duration; day++) {
      const dayKey = `day_${day}`
      const dailyCalories = nutritionalNeeds.calories
      
      mealPlan[dayKey] = {
        date: new Date(Date.now() + (day - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        breakfast: this.selectBestMeal(recipes, 'breakfast', dailyCalories * portions.breakfast, usedRecipes, day),
        lunch: this.selectBestMeal(recipes, 'lunch', dailyCalories * portions.lunch, usedRecipes, day),
        dinner: this.selectBestMeal(recipes, 'dinner', dailyCalories * portions.dinner, usedRecipes, day),
        snacks: [this.selectBestMeal(recipes, 'snack', dailyCalories * portions.snacks, usedRecipes, day)]
      }

      // Add timing and daily summary
      mealPlan[dayKey].timing = {
        breakfast: '7:30-8:30 AM',
        lunch: '12:00-1:00 PM', 
        dinner: '6:30-7:30 PM',
        snack: '4:00-5:00 PM'
      }

      mealPlan[dayKey].daily_summary = {
        total_calories: Object.values(mealPlan[dayKey])
          .filter(meal => meal && typeof meal === 'object' && 'calories' in meal && meal.calories)
          .reduce((sum: number, meal: any) => sum + meal.calories, 0),
        water_intake: `${nutritionalNeeds.water_l}L`,
        dosha_focus: `${patient.primary_dosha} balancing foods`,
        ayurvedic_tip: this.getDailyTip(patient.primary_dosha, day)
      }
    }

    return mealPlan
  }

  private static selectBestMeal(
    recipes: Array<Recipe & { score: number }>,
    mealType: string,
    targetCalories: number,
    usedRecipes: Set<string>,
    day: number
  ) {
    const mealRecipes = recipes.filter(r => 
      r.meal_type.includes(mealType) && !usedRecipes.has(r.id)
    )

    if (mealRecipes.length === 0) {
      // Reuse recipes if needed
      const fallback = recipes.filter(r => r.meal_type.includes(mealType))
      if (fallback.length > 0) {
        const selected = fallback[day % fallback.length]
        return this.formatMeal(selected, targetCalories)
      }
    }

    const best = mealRecipes.reduce((prev, curr) => {
      const prevDiff = Math.abs(prev.nutrition.calories - targetCalories)
      const currDiff = Math.abs(curr.nutrition.calories - targetCalories)
      return currDiff < prevDiff ? curr : prev
    })

    usedRecipes.add(best.id)
    return this.formatMeal(best, targetCalories)
  }

  private static formatMeal(recipe: Recipe, targetCalories: number) {
    const adjustment = targetCalories / recipe.nutrition.calories
    
    return {
      recipe_id: recipe.id,
      name: recipe.name,
      calories: Math.round(recipe.nutrition.calories * adjustment),
      servings: Math.round(recipe.servings * adjustment * 10) / 10,
      prep_time: `${recipe.preparation_time} min`,
      cook_time: `${recipe.cooking_time} min`,
      difficulty: recipe.difficulty_level,
      ingredients: recipe.ingredients.slice(0, 8), // Show main ingredients
      instructions: recipe.instructions.slice(0, 5), // Show key steps
      ayurvedic_properties: {
        dosha_effects: recipe.ayurvedic_properties.dosha_effects,
        health_benefits: recipe.health_benefits?.slice(0, 3) || []
      },
      score: (recipe as any).score || 0
    }
  }

  private static generatePersonalizedGuidelines(patient: Patient, preferences: any): string[] {
    const guidelines = []
    const primaryDosha = patient.primary_dosha.split('-')[0]
    
    // Dosha-specific guidelines
    const doshaGuidelines = this.DOSHA_GUIDELINES[primaryDosha as keyof typeof this.DOSHA_GUIDELINES]
    if (doshaGuidelines) {
      guidelines.push(`For ${patient.primary_dosha}: Favor ${doshaGuidelines.tastes.join(', ')} tastes`)
      guidelines.push(`Choose ${doshaGuidelines.qualities.join(', ')} foods`)
    }

    // Personalized guidelines based on all inputs
    Object.entries(preferences).forEach(([key, value]) => {
      if (value === true || (typeof value === 'string' && value.length > 0)) {
        switch (key) {
          case 'organic_preference':
            guidelines.push('Choose organic ingredients when possible for better prana (life energy)')
            break
          case 'meal_prep_preference':
            if (value === 'weekly') guidelines.push('Prepare meals in advance but reheat gently to preserve nutrients')
            break
          case 'budget_level':
            if (value === 'low') guidelines.push('Focus on seasonal, local ingredients and simple preparations')
            break
        }
      }
    })

    // Health-specific guidelines
    if (patient.health_concerns?.includes('diabetes')) {
      guidelines.push('Include bitter tastes (bitter gourd, fenugreek) to help regulate blood sugar')
    }

    // Standard Ayurvedic principles
    guidelines.push('Drink warm water throughout the day, avoid ice-cold beverages')
    guidelines.push('Eat in a peaceful environment without distractions')
    guidelines.push('Allow 4-6 hours between meals for complete digestion')

    return guidelines
  }

  private static generateLifestyleRecommendations(patient: Patient, preferences: any): string[] {
    const recommendations = []
    
    // Exercise based on dosha
    const exerciseMap = {
      'Vata': 'Gentle yoga, walking, swimming (avoid high-intensity)',
      'Pitta': 'Moderate exercise, swimming, cycling (avoid hot environments)',
      'Kapha': 'Vigorous exercise, running, strength training, dancing'
    }
    
    const primaryDosha = patient.primary_dosha.split('-')[0]
    recommendations.push(`Exercise: ${exerciseMap[primaryDosha as keyof typeof exerciseMap] || exerciseMap.Vata}`)
    
    // Lifestyle based on inputs
    if (preferences.family_size > 1) {
      recommendations.push('Cook meals together as a family to enhance the loving energy of food')
    }
    
    if (preferences.organic_preference) {
      recommendations.push('Grow herbs and vegetables at home for fresh, high-prana ingredients')
    }

    // Universal recommendations
    recommendations.push('Sleep by 10 PM and wake by 6 AM for optimal circadian rhythm')
    recommendations.push('Practice 10-15 minutes of meditation or pranayama daily')
    recommendations.push('Spend time in nature daily for grounding and mental peace')
    
    return recommendations
  }

  private static calculateNutritionalSummary(mealPlan: any, needs: any) {
    const days = Object.keys(mealPlan)
    const avgCalories = days.reduce((sum, day) => 
      sum + mealPlan[day].daily_summary.total_calories, 0) / days.length

    return {
      daily_average_calories: Math.round(avgCalories),
      target_calories: needs.calories,
      calorie_variance: `${Math.round(((avgCalories - needs.calories) / needs.calories) * 100)}%`,
      meal_distribution: 'Ayurveda-optimized portions for dosha balance',
      nutritional_focus: 'Whole foods, seasonal ingredients, dosha-specific nutrition'
    }
  }

  private static getDailyTip(dosha: string, day: number): string {
    const tips = [
      `Day ${day}: Start with warm water and lemon to kindle digestive fire`,
      `Day ${day}: Chew each bite 20-30 times for optimal digestion`,
      `Day ${day}: Take a short walk after lunch to aid digestion`,
      `Day ${day}: Practice gratitude before meals to enhance nutrient absorption`,
      `Day ${day}: Eat in silence or with pleasant conversation only`,
      `Day ${day}: Listen to your body's hunger and satiety signals`,
      `Day ${day}: Rest for 5 minutes after eating before resuming activities`
    ]
    
    return tips[(day - 1) % tips.length]
  }
}