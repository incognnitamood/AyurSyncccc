-- AyurSync Database Schema for Supabase
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for authentication (extends Supabase auth.users)
CREATE TABLE public.practitioners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    license_number TEXT,
    specialization TEXT DEFAULT 'Ayurvedic Practitioner',
    experience_years INTEGER DEFAULT 0,
    clinic_name TEXT,
    clinic_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Patients table
CREATE TABLE public.patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    practitioner_id UUID REFERENCES practitioners(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    email TEXT,
    phone TEXT,
    height DECIMAL(5,2), -- in cm
    weight DECIMAL(5,2), -- in kg
    occupation TEXT,
    
    -- Dosha Assessment
    primary_dosha TEXT NOT NULL CHECK (primary_dosha IN ('Vata', 'Pitta', 'Kapha', 'Vata-Pitta', 'Pitta-Kapha', 'Vata-Kapha', 'Tridoshic')),
    dosha_scores JSONB, -- {vata: 15, pitta: 12, kapha: 8}
    dosha_assessment_answers JSONB, -- Complete questionnaire responses
    
    -- Health Information
    health_concerns TEXT[],
    allergies TEXT[],
    current_medications TEXT[],
    medical_conditions TEXT[],
    dietary_restrictions TEXT[],
    lifestyle_factors JSONB, -- sleep, exercise, stress levels
    
    -- Dietary Habits
    meal_frequency INTEGER DEFAULT 3,
    water_intake_liters DECIMAL(3,1) DEFAULT 2.0,
    cooking_skills TEXT CHECK (cooking_skills IN ('beginner', 'intermediate', 'advanced')),
    cooking_time_preference TEXT CHECK (cooking_time_preference IN ('15min', '30min', '45min', '60min+')),
    preferred_cuisines TEXT[],
    food_preferences JSONB, -- vegetarian, vegan, etc.
    
    -- Tracking
    bmi DECIMAL(5,2) GENERATED ALWAYS AS (weight / ((height/100) * (height/100))) STORED,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
    last_visit DATE DEFAULT CURRENT_DATE,
    next_appointment DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Recipes table with comprehensive Ayurvedic properties
CREATE TABLE public.recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    meal_type TEXT[] NOT NULL CHECK (meal_type <@ ARRAY['breakfast', 'lunch', 'dinner', 'snack', 'beverage']),
    cuisine_type TEXT[] DEFAULT ARRAY['Indian'],
    preparation_time INTEGER NOT NULL, -- in minutes
    cooking_time INTEGER NOT NULL, -- in minutes
    servings INTEGER DEFAULT 2,
    difficulty_level TEXT DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    
    -- Ingredients and Instructions
    ingredients JSONB NOT NULL, -- [{"item": "rice", "quantity": "1 cup", "notes": "basmati"}]
    instructions JSONB NOT NULL, -- [{"step": 1, "instruction": "Wash rice thoroughly"}]
    
    -- Ayurvedic Properties
    ayurvedic_properties JSONB NOT NULL DEFAULT '{
        "rasa": [], 
        "virya": "neutral", 
        "vipaka": "sweet", 
        "guna": [], 
        "prabhava": "",
        "dosha_effects": {
            "vata": "neutral",
            "pitta": "neutral", 
            "kapha": "neutral"
        }
    }',
    
    -- Health Benefits
    health_benefits TEXT[],
    therapeutic_uses TEXT[],
    contraindications TEXT[],
    best_season TEXT[] DEFAULT ARRAY['all'],
    best_time_of_day TEXT[] DEFAULT ARRAY['any'],
    
    -- Modern Nutrition (per serving)
    nutrition JSONB DEFAULT '{
        "calories": 0,
        "carbohydrates_g": 0,
        "protein_g": 0,
        "fat_g": 0,
        "fiber_g": 0,
        "sugar_g": 0,
        "sodium_mg": 0,
        "potassium_mg": 0,
        "calcium_mg": 0,
        "iron_mg": 0,
        "vitamin_c_mg": 0,
        "vitamin_d_iu": 0,
        "glycemic_index": 50,
        "nutrient_density_score": 5
    }',
    
    -- Recipe Management
    created_by UUID REFERENCES practitioners(id),
    is_public BOOLEAN DEFAULT true,
    image_url TEXT,
    tags TEXT[],
    rating DECIMAL(3,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Diet Plans table
CREATE TABLE public.diet_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    practitioner_id UUID REFERENCES practitioners(id) ON DELETE CASCADE,
    plan_name TEXT NOT NULL,
    duration_days INTEGER NOT NULL DEFAULT 7,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE NOT NULL,
    
    -- Plan Configuration
    target_calories_per_day INTEGER,
    plan_goals TEXT[], -- weight_loss, energy_boost, digestive_health
    dietary_preferences TEXT[], -- vegetarian, vegan, gluten_free
    
    -- Generated Meal Plan
    meal_plan JSONB NOT NULL, -- Complete 7-day meal structure
    
    -- AI Generation Details
    ai_model_used TEXT DEFAULT 'ayurvedic_algorithm_v1',
    generation_parameters JSONB, -- All inputs used for generation
    alternative_recipes JSONB, -- Backup recipe suggestions
    
    -- Nutritional Summary
    nutritional_analysis JSONB, -- Daily nutrition breakdown
    ayurvedic_guidelines TEXT[],
    lifestyle_recommendations TEXT[],
    
    -- Plan Status
    status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'modified')),
    adherence_score DECIMAL(5,2) DEFAULT 0.0,
    patient_feedback JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Patient Health Records for tracking progress
CREATE TABLE public.health_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    practitioner_id UUID REFERENCES practitioners(id) ON DELETE CASCADE,
    visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    visit_type TEXT DEFAULT 'consultation' CHECK (visit_type IN ('consultation', 'follow_up', 'assessment', 'review')),
    
    -- Measurements
    weight DECIMAL(5,2),
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    pulse_rate INTEGER,
    body_temperature DECIMAL(4,2),
    
    -- Ayurvedic Assessment
    dosha_imbalance_notes TEXT,
    agni_status TEXT CHECK (agni_status IN ('balanced', 'low', 'high', 'irregular')),
    ama_level TEXT CHECK (ama_level IN ('none', 'mild', 'moderate', 'high')),
    ojas_level TEXT CHECK (ojas_level IN ('low', 'moderate', 'good', 'excellent')),
    
    -- Symptoms and Progress
    current_symptoms TEXT[],
    symptom_severity JSONB, -- {"fatigue": 3, "digestion": 2} (1-5 scale)
    progress_notes TEXT,
    recommendations TEXT[],
    
    -- Prescriptions
    herbal_medicines JSONB,
    dietary_changes TEXT[],
    lifestyle_modifications TEXT[],
    next_visit_date DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Meal Plan Tracking (for adherence monitoring)
CREATE TABLE public.meal_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diet_plan_id UUID REFERENCES diet_plans(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    meal_date DATE NOT NULL,
    meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    planned_recipe_id UUID REFERENCES recipes(id),
    actual_recipe_id UUID REFERENCES recipes(id),
    consumed BOOLEAN DEFAULT false,
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Indexes for better performance
CREATE INDEX idx_patients_practitioner ON patients(practitioner_id);
CREATE INDEX idx_patients_dosha ON patients(primary_dosha);
CREATE INDEX idx_recipes_meal_type ON recipes USING GIN(meal_type);
CREATE INDEX idx_recipes_dosha_effects ON recipes USING GIN(ayurvedic_properties);
CREATE INDEX idx_diet_plans_patient ON diet_plans(patient_id);
CREATE INDEX idx_diet_plans_status ON diet_plans(status);
CREATE INDEX idx_health_records_patient ON health_records(patient_id);
CREATE INDEX idx_meal_tracking_plan ON meal_tracking(diet_plan_id);

-- Row Level Security (RLS) policies
ALTER TABLE practitioners ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_tracking ENABLE ROW LEVEL SECURITY;

-- Practitioners can only see their own data
CREATE POLICY "Practitioners can view own profile" ON practitioners FOR ALL USING (auth_user_id = auth.uid());
CREATE POLICY "Practitioners can view own patients" ON patients FOR ALL USING (practitioner_id IN (SELECT id FROM practitioners WHERE auth_user_id = auth.uid()));
CREATE POLICY "Practitioners can view public recipes" ON recipes FOR SELECT USING (is_public = true OR created_by IN (SELECT id FROM practitioners WHERE auth_user_id = auth.uid()));
CREATE POLICY "Practitioners can manage own diet plans" ON diet_plans FOR ALL USING (practitioner_id IN (SELECT id FROM practitioners WHERE auth_user_id = auth.uid()));
CREATE POLICY "Practitioners can manage own health records" ON health_records FOR ALL USING (practitioner_id IN (SELECT id FROM practitioners WHERE auth_user_id = auth.uid()));
CREATE POLICY "Practitioners can view own meal tracking" ON meal_tracking FOR ALL USING (patient_id IN (SELECT id FROM patients WHERE practitioner_id IN (SELECT id FROM practitioners WHERE auth_user_id = auth.uid())));

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_practitioners_updated_at BEFORE UPDATE ON practitioners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_diet_plans_updated_at BEFORE UPDATE ON diet_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();