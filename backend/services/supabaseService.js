const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'your-supabase-url'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

class SupabaseBackendService {
  
  // Test connection
  static async testConnection() {
    try {
      const { data, error } = await supabase.from('practitioners').select('count').limit(1)
      if (error) throw error
      return { success: true, message: 'Connected to Supabase successfully' }
    } catch (error) {
      console.error('Supabase connection failed:', error.message)
      return { success: false, message: 'Failed to connect to Supabase', error: error.message }
    }
  }

  // Practitioner Authentication
  static async authenticatePractitioner(email, password) {
    try {
      const { data: practitioner, error } = await supabase
        .from('practitioners')
        .select('*')
        .eq('email', email)
        .single()

      if (error || !practitioner) {
        return { success: false, message: 'Invalid credentials' }
      }

      // In production, implement proper password hashing
      return {
        success: true,
        data: {
          id: practitioner.id,
          fullName: practitioner.full_name,
          email: practitioner.email,
          specialization: practitioner.specialization
        }
      }
    } catch (error) {
      return { success: false, message: 'Authentication failed', error: error.message }
    }
  }

  // Patient Management with Unlimited Inputs
  static async createPatient(practitionerId, patientData) {
    try {
      // Process unlimited inputs - accept any fields provided
      const processedData = {
        practitioner_id: practitionerId,
        full_name: patientData.fullName || patientData.full_name,
        age: parseInt(patientData.age),
        gender: patientData.gender,
        email: patientData.email,
        phone: patientData.phone,
        height: patientData.height ? parseFloat(patientData.height) : null,
        weight: patientData.weight ? parseFloat(patientData.weight) : null,
        occupation: patientData.occupation,
        primary_dosha: patientData.primaryDosha || this.calculatePrimaryDosha(patientData.doshaAnswers),
        dosha_scores: patientData.doshaScores || this.calculateDoshaScores(patientData.doshaAnswers),
        dosha_assessment_answers: patientData.doshaAnswers || {},
        health_concerns: Array.isArray(patientData.healthConcerns) ? patientData.healthConcerns : 
                        (patientData.healthConcerns ? patientData.healthConcerns.split(',').map(s => s.trim()) : []),
        allergies: Array.isArray(patientData.allergies) ? patientData.allergies : 
                  (patientData.allergies ? patientData.allergies.split(',').map(s => s.trim()) : []),
        current_medications: Array.isArray(patientData.medications) ? patientData.medications : 
                            (patientData.medications ? patientData.medications.split(',').map(s => s.trim()) : []),
        medical_conditions: Array.isArray(patientData.medicalConditions) ? patientData.medicalConditions : 
                           (patientData.medicalConditions ? patientData.medicalConditions.split(',').map(s => s.trim()) : []),
        dietary_restrictions: Array.isArray(patientData.dietaryRestrictions) ? patientData.dietaryRestrictions : 
                             (patientData.dietaryRestrictions ? patientData.dietaryRestrictions.split(',').map(s => s.trim()) : []),
        lifestyle_factors: patientData.lifestyleFactors || {},
        meal_frequency: parseInt(patientData.mealFrequency) || 3,
        water_intake_liters: parseFloat(patientData.waterIntake) || 2.0,
        cooking_skills: patientData.cookingSkills || 'intermediate',
        cooking_time_preference: patientData.cookingTime || '30min',
        preferred_cuisines: Array.isArray(patientData.preferredCuisines) ? patientData.preferredCuisines : 
                           (patientData.preferredCuisines ? patientData.preferredCuisines.split(',').map(s => s.trim()) : []),
        food_preferences: patientData.foodPreferences || {},
        bmi: patientData.height && patientData.weight ? 
             parseFloat((patientData.weight / Math.pow(patientData.height / 100, 2)).toFixed(1)) : null,
        status: 'active',
        last_visit: new Date().toISOString().split('T')[0],
        
        // Handle any additional custom fields
        ...this.processCustomFields(patientData)
      }

      const { data, error } = await supabase
        .from('patients')
        .insert(processedData)
        .select()
        .single()

      if (error) throw error

      return { success: true, data, message: 'Patient created successfully' }
    } catch (error) {
      console.error('Create patient error:', error)
      return { success: false, message: 'Failed to create patient', error: error.message }
    }
  }

  // Helper method to process custom fields not in standard schema
  static processCustomFields(patientData) {
    const standardFields = [
      'fullName', 'full_name', 'age', 'gender', 'email', 'phone', 'height', 'weight', 
      'occupation', 'primaryDosha', 'doshaScores', 'doshaAnswers', 'healthConcerns', 
      'allergies', 'medications', 'medicalConditions', 'dietaryRestrictions', 
      'lifestyleFactors', 'mealFrequency', 'waterIntake', 'cookingSkills', 
      'cookingTime', 'preferredCuisines', 'foodPreferences'
    ]
    
    const customFields = {}
    for (const [key, value] of Object.entries(patientData)) {
      if (!standardFields.includes(key) && value !== undefined && value !== '') {
        // Store additional fields in lifestyle_factors or food_preferences
        if (key.toLowerCase().includes('lifestyle') || key.toLowerCase().includes('activity')) {
          customFields.lifestyle_factors = customFields.lifestyle_factors || {}
          customFields.lifestyle_factors[key] = value
        } else if (key.toLowerCase().includes('food') || key.toLowerCase().includes('diet')) {
          customFields.food_preferences = customFields.food_preferences || {}
          customFields.food_preferences[key] = value
        }
      }
    }
    
    return customFields
  }

  // Calculate primary dosha from assessment answers
  static calculatePrimaryDosha(doshaAnswers) {
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

  // Calculate detailed dosha scores
  static calculateDoshaScores(doshaAnswers) {
    if (!doshaAnswers) return { vata: 33, pitta: 33, kapha: 34 }

    const scores = { vata: 0, pitta: 0, kapha: 0 }
    
    Object.values(doshaAnswers).forEach(answer => {
      if (answer === 'Vata') scores.vata++
      else if (answer === 'Pitta') scores.pitta++
      else if (answer === 'Kapha') scores.kapha++
    })

    const total = scores.vata + scores.pitta + scores.kapha
    if (total === 0) return { vata: 33, pitta: 33, kapha: 34 }

    return {
      vata: Math.round((scores.vata / total) * 100),
      pitta: Math.round((scores.pitta / total) * 100),
      kapha: Math.round((scores.kapha / total) * 100)
    }
  }

  // Get all patients for a practitioner
  static async getPatients(practitionerId) {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('practitioner_id', practitionerId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      return { success: false, message: 'Failed to fetch patients', error: error.message }
    }
  }

  // Recipe Management
  static async getRecipes(filters = {}) {
    try {
      let query = supabase.from('recipes').select('*')

      // Apply filters
      if (filters.meal_type) {
        query = query.contains('meal_type', [filters.meal_type])
      }
      if (filters.cuisine_type) {
        query = query.contains('cuisine_type', [filters.cuisine_type])
      }
      if (filters.dosha) {
        query = query.eq(`ayurvedic_properties->dosha_effects->${filters.dosha.toLowerCase()}`, 'decrease')
      }

      const { data, error } = await query.order('rating', { ascending: false })

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      return { success: false, message: 'Failed to fetch recipes', error: error.message }
    }
  }

  // Seed recipes from JSON file
  static async seedRecipes(recipesData) {
    try {
      const processedRecipes = recipesData.map(recipe => ({
        name: recipe.name,
        description: `Delicious ${recipe.type} from ${recipe.cuisine} cuisine`,
        meal_type: [recipe.type],
        cuisine_type: [recipe.cuisine],
        preparation_time: 15,
        cooking_time: 30,
        servings: 4,
        difficulty_level: 'medium',
        ingredients: recipe.ingredients.map((ing, index) => ({
          item: ing.name,
          quantity: ing.quantity,
          notes: ing.note
        })),
        instructions: recipe.instructions.filter(inst => inst.trim() !== '').map((inst, index) => ({
          step: index + 1,
          instruction: inst
        })),
        ayurvedic_properties: {
          rasa: recipe.ayurvedic_properties.rasa.filter(r => r !== ''),
          virya: recipe.ayurvedic_properties.virya,
          vipaka: recipe.ayurvedic_properties.vipaka,
          guna: recipe.ayurvedic_properties.guna,
          prabhava: recipe.ayurvedic_properties.prabhava,
          dosha_effects: {
            vata: recipe.ayurvedic_properties.dosha_effect.Vata === '↓' ? 'decrease' : 
                  recipe.ayurvedic_properties.dosha_effect.Vata === '↑' ? 'increase' : 'neutral',
            pitta: recipe.ayurvedic_properties.dosha_effect.Pitta === '↓' ? 'decrease' : 
                   recipe.ayurvedic_properties.dosha_effect.Pitta === '↑' ? 'increase' : 'neutral',
            kapha: recipe.ayurvedic_properties.dosha_effect.Kapha === '↓' ? 'decrease' : 
                   recipe.ayurvedic_properties.dosha_effect.Kapha === '↑' ? 'increase' : 'neutral'
          }
        },
        health_benefits: recipe.health_benefits,
        nutrition: {
          calories: recipe.nutrition_profile.calories,
          carbohydrates_g: recipe.nutrition_profile.carbs_g,
          protein_g: recipe.nutrition_profile.protein_g,
          fat_g: recipe.nutrition_profile.fat_g,
          fiber_g: recipe.nutrition_profile.fiber_g,
          sugar_g: 5, // Default value
          sodium_mg: 200, // Default value
          potassium_mg: 300, // Default value
          calcium_mg: 50, // Default value
          iron_mg: 2, // Default value
          vitamin_c_mg: 10, // Default value
          vitamin_d_iu: 0, // Default value
          glycemic_index: recipe.nutrition_profile.glycemic_index,
          nutrient_density_score: recipe.nutrition_profile.nutrient_density_score
        },
        is_public: true,
        rating: 4.5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))

      // Insert in batches to avoid timeout
      const batchSize = 10
      for (let i = 0; i < processedRecipes.length; i += batchSize) {
        const batch = processedRecipes.slice(i, i + batchSize)
        const { error } = await supabase.from('recipes').insert(batch)
        if (error) throw error
      }

      return { success: true, message: `Successfully seeded ${processedRecipes.length} recipes` }
    } catch (error) {
      console.error('Seed recipes error:', error)
      return { success: false, message: 'Failed to seed recipes', error: error.message }
    }
  }

  // AI Diet Plan Generation with unlimited inputs
  static async generateDietPlan(patientId, preferences = {}) {
    try {
      // Get patient data
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single()

      if (patientError) throw patientError

      // Get available recipes
      const { data: recipes, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_public', true)

      if (recipesError) throw recipesError

      // Generate personalized diet plan using AI logic from aiDietGenerator
      const { default: AIDietGenerator } = await import('../frontend/src/services/aiDietGenerator.js')
      const result = await AIDietGenerator.generateComprehensiveDietPlan(patient, preferences)

      if (result.error) {
        throw new Error(result.error)
      }

      // Save diet plan to database
      const { data: savedPlan, error: saveError } = await supabase
        .from('diet_plans')
        .insert({
          patient_id: patientId,
          practitioner_id: patient.practitioner_id,
          plan_name: `Personalized Plan for ${patient.full_name}`,
          duration_days: preferences.duration_days || 7,
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + (preferences.duration_days || 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          target_calories_per_day: result.dietPlan.nutritionalRequirements?.calories || 2000,
          plan_goals: preferences.target_goals || [],
          dietary_preferences: preferences.dietary_restrictions || [],
          meal_plan: result.dietPlan.mealPlan || {},
          ai_model_used: 'AyurSync AI v1.0',
          generation_parameters: preferences,
          nutritional_analysis: result.dietPlan.nutritionalSummary || {},
          ayurvedic_guidelines: result.dietPlan.ayurvedicGuidelines || [],
          lifestyle_recommendations: result.dietPlan.lifestyleRecommendations || [],
          status: 'active',
          adherence_score: 0
        })
        .select()
        .single()

      if (saveError) throw saveError

      return { 
        success: true, 
        data: { 
          ...savedPlan, 
          generatedPlan: result.dietPlan 
        }, 
        message: 'Diet plan generated and saved successfully' 
      }
    } catch (error) {
      console.error('Generate diet plan error:', error)
      return { success: false, message: 'Failed to generate diet plan', error: error.message }
    }
  }
}

module.exports = SupabaseBackendService