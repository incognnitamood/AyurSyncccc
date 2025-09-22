import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-supabase-url'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database Types
export interface Practitioner {
  id: string
  auth_user_id: string
  full_name: string
  email: string
  phone?: string
  license_number?: string
  specialization: string
  experience_years: number
  clinic_name?: string
  clinic_address?: string
  created_at: string
  updated_at: string
}

export interface Patient {
  id: string
  practitioner_id: string
  full_name: string
  age: number
  gender: 'male' | 'female' | 'other'
  email?: string
  phone?: string
  height?: number
  weight?: number
  occupation?: string
  primary_dosha: 'Vata' | 'Pitta' | 'Kapha' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Vata-Kapha' | 'Tridoshic'
  dosha_scores?: {
    vata: number
    pitta: number
    kapha: number
  }
  dosha_assessment_answers?: Record<string, any>
  health_concerns?: string[]
  allergies?: string[]
  current_medications?: string[]
  medical_conditions?: string[]
  dietary_restrictions?: string[]
  lifestyle_factors?: Record<string, any>
  meal_frequency: number
  water_intake_liters: number
  cooking_skills: 'beginner' | 'intermediate' | 'advanced'
  cooking_time_preference: '15min' | '30min' | '45min' | '60min+'
  preferred_cuisines?: string[]
  food_preferences?: Record<string, any>
  bmi?: number
  status: 'active' | 'inactive' | 'completed'
  last_visit: string
  next_appointment?: string
  created_at: string
  updated_at: string
}

export interface Recipe {
  id: string
  name: string
  description?: string
  meal_type: string[]
  cuisine_type: string[]
  preparation_time: number
  cooking_time: number
  servings: number
  difficulty_level: 'easy' | 'medium' | 'hard'
  ingredients: Array<{
    item: string
    quantity: string
    notes?: string
  }>
  instructions: Array<{
    step: number
    instruction: string
  }>
  ayurvedic_properties: {
    rasa: string[]
    virya: string
    vipaka: string
    guna: string[]
    prabhava?: string
    dosha_effects: {
      vata: 'increase' | 'decrease' | 'neutral'
      pitta: 'increase' | 'decrease' | 'neutral'
      kapha: 'increase' | 'decrease' | 'neutral'
    }
  }
  health_benefits?: string[]
  therapeutic_uses?: string[]
  contraindications?: string[]
  best_season: string[]
  best_time_of_day: string[]
  nutrition: {
    calories: number
    carbohydrates_g: number
    protein_g: number
    fat_g: number
    fiber_g: number
    sugar_g: number
    sodium_mg: number
    potassium_mg: number
    calcium_mg: number
    iron_mg: number
    vitamin_c_mg: number
    vitamin_d_iu: number
    glycemic_index: number
    nutrient_density_score: number
  }
  created_by?: string
  is_public: boolean
  image_url?: string
  tags?: string[]
  rating: number
  created_at: string
  updated_at: string
}

export interface DietPlan {
  id: string
  patient_id: string
  practitioner_id: string
  plan_name: string
  duration_days: number
  start_date: string
  end_date: string
  target_calories_per_day?: number
  plan_goals: string[]
  dietary_preferences: string[]
  meal_plan: {
    [day: string]: {
      breakfast: {
        recipe_id: string
        recipe_name: string
        calories: number
        time: string
      }
      lunch: {
        recipe_id: string
        recipe_name: string
        calories: number
        time: string
      }
      dinner: {
        recipe_id: string
        recipe_name: string
        calories: number
        time: string
      }
      snacks: Array<{
        recipe_id: string
        recipe_name: string
        calories: number
        time: string
      }>
    }
  }
  ai_model_used: string
  generation_parameters?: Record<string, any>
  alternative_recipes?: Record<string, any>
  nutritional_analysis?: Record<string, any>
  ayurvedic_guidelines: string[]
  lifestyle_recommendations: string[]
  status: 'draft' | 'active' | 'completed' | 'modified'
  adherence_score: number
  patient_feedback?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface HealthRecord {
  id: string
  patient_id: string
  practitioner_id: string
  visit_date: string
  visit_type: 'consultation' | 'follow_up' | 'assessment' | 'review'
  weight?: number
  blood_pressure_systolic?: number
  blood_pressure_diastolic?: number
  pulse_rate?: number
  body_temperature?: number
  dosha_imbalance_notes?: string
  agni_status?: 'balanced' | 'low' | 'high' | 'irregular'
  ama_level?: 'none' | 'mild' | 'moderate' | 'high'
  ojas_level?: 'low' | 'moderate' | 'good' | 'excellent'
  current_symptoms?: string[]
  symptom_severity?: Record<string, number>
  progress_notes?: string
  recommendations?: string[]
  herbal_medicines?: Record<string, any>
  dietary_changes?: string[]
  lifestyle_modifications?: string[]
  next_visit_date?: string
  created_at: string
}

// Database service functions
export class SupabaseService {
  // Authentication
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  static async signUp(email: string, password: string, practitionerData: Partial<Practitioner>) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    
    if (data.user && !error) {
      // Create practitioner profile
      const { error: profileError } = await supabase
        .from('practitioners')
        .insert({
          auth_user_id: data.user.id,
          email,
          ...practitionerData
        })
      
      return { data, error: profileError }
    }
    
    return { data, error }
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data: practitioner } = await supabase
        .from('practitioners')
        .select('*')
        .eq('auth_user_id', user.id)
        .single()
      
      return { user, practitioner }
    }
    
    return { user: null, practitioner: null }
  }

  // Patients
  static async createPatient(patientData: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('patients')
      .insert(patientData)
      .select()
      .single()
    
    return { data, error }
  }

  static async getPatients(practitionerId: string) {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('practitioner_id', practitionerId)
      .order('created_at', { ascending: false })
    
    return { data, error }
  }

  static async getPatient(patientId: string) {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single()
    
    return { data, error }
  }

  static async updatePatient(patientId: string, updates: Partial<Patient>) {
    const { data, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', patientId)
      .select()
      .single()
    
    return { data, error }
  }

  static async searchPatients(practitionerId: string, searchTerm: string) {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('practitioner_id', practitionerId)
      .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })
    
    return { data, error }
  }

  // Recipes
  static async getRecipes(filters?: {
    meal_type?: string[]
    dosha_effect?: string
    cuisine_type?: string[]
    max_prep_time?: number
    difficulty?: string
    search?: string
  }) {
    let query = supabase
      .from('recipes')
      .select('*')
      .eq('is_public', true)

    if (filters?.meal_type?.length) {
      query = query.overlaps('meal_type', filters.meal_type)
    }

    if (filters?.cuisine_type?.length) {
      query = query.overlaps('cuisine_type', filters.cuisine_type)
    }

    if (filters?.max_prep_time) {
      query = query.lte('preparation_time', filters.max_prep_time)
    }

    if (filters?.difficulty) {
      query = query.eq('difficulty_level', filters.difficulty)
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    
    return { data, error }
  }

  static async getRecipe(recipeId: string) {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', recipeId)
      .single()
    
    return { data, error }
  }

  static async createRecipe(recipeData: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('recipes')
      .insert(recipeData)
      .select()
      .single()
    
    return { data, error }
  }

  // Diet Plans
  static async createDietPlan(dietPlanData: Omit<DietPlan, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('diet_plans')
      .insert(dietPlanData)
      .select()
      .single()
    
    return { data, error }
  }

  static async getDietPlans(patientId: string) {
    const { data, error } = await supabase
      .from('diet_plans')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })
    
    return { data, error }
  }

  static async getDietPlan(planId: string) {
    const { data, error } = await supabase
      .from('diet_plans')
      .select('*')
      .eq('id', planId)
      .single()
    
    return { data, error }
  }

  static async updateDietPlan(planId: string, updates: Partial<DietPlan>) {
    const { data, error } = await supabase
      .from('diet_plans')
      .update(updates)
      .eq('id', planId)
      .select()
      .single()
    
    return { data, error }
  }

  // Health Records
  static async createHealthRecord(recordData: Omit<HealthRecord, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('health_records')
      .insert(recordData)
      .select()
      .single()
    
    return { data, error }
  }

  static async getHealthRecords(patientId: string) {
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('patient_id', patientId)
      .order('visit_date', { ascending: false })
    
    return { data, error }
  }

  // Analytics and Statistics
  static async getPatientStats(practitionerId: string) {
    const { data: patients, error } = await supabase
      .from('patients')
      .select('primary_dosha, status, created_at')
      .eq('practitioner_id', practitionerId)

    if (error) return { data: null, error }

    const stats = {
      total_patients: patients.length,
      active_patients: patients.filter(p => p.status === 'active').length,
      dosha_distribution: {
        vata: patients.filter(p => p.primary_dosha.includes('Vata')).length,
        pitta: patients.filter(p => p.primary_dosha.includes('Pitta')).length,
        kapha: patients.filter(p => p.primary_dosha.includes('Kapha')).length
      },
      recent_additions: patients.filter(p => 
        new Date(p.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length
    }

    return { data: stats, error: null }
  }

  static async getDietPlanStats(practitionerId: string) {
    const { data: plans, error } = await supabase
      .from('diet_plans')
      .select('status, adherence_score, created_at')
      .eq('practitioner_id', practitionerId)

    if (error) return { data: null, error }

    const stats = {
      total_plans: plans.length,
      active_plans: plans.filter(p => p.status === 'active').length,
      average_adherence: plans.reduce((sum, p) => sum + p.adherence_score, 0) / plans.length || 0,
      recent_plans: plans.filter(p => 
        new Date(p.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length
    }

    return { data: stats, error: null }
  }
}