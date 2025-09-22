export interface Patient {
  id: string | number;
  fullName: string;
  name?: string;
  age: number;
  email: string;
  phone: string;
  gender?: 'male' | 'female' | 'other';
  weight?: number;
  height?: number;
  primaryDosha: string;
  dosha?: string;
  lastVisit?: string;
  status: string;
  avatar?: string;
  goals?: string;
  progress?: number;
  occupation?: string;
  dob?: string;
  doshaAnswers?: { [key: string]: string };
  primaryConcerns?: string;
  currentSymptoms?: string[];
  medications?: string;
  allergies?: string;
  mealFrequency?: string;
  waterIntake?: string;
  cookingSkills?: string;
  cookingTime?: string;
  familySize?: number;
  dietType?: string;
  preferredCuisines?: string;
}

export interface DietPlan {
  _id: string;
  patientId: string;
  patientName: string;
  primaryDosha: string;
  duration: string;
  createdAt: string;
  meals: DayMeal[];
  guidelines: string[];
  status: string;
}

export interface DayMeal {
  day: number;
  breakfast: MealDetails;
  lunch: MealDetails;
  dinner: MealDetails;
  snack?: MealDetails;
}

export interface MealDetails {
  name: string;
  time: string;
  calories?: number;
  prep?: string;
  benefits?: string;
}