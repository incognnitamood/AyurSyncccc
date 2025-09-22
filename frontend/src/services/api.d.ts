declare module '../services/api' {
  interface Patient {
    _id: string;
    fullName: string;
    age: number;
    email: string;
    phone: string;
    primaryDosha: string;
    status: string;
    gender?: string;
    weight?: number;
    height?: number;
    lastVisit?: string;
    avatar?: string;
    goals?: string;
    progress?: number;
    occupation?: string;
    dob?: string;
    doshaAnswers?: Array<{ question: string; answer: string }>;
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

  interface Recipe {
    _id: string;
    name: string;
    type: string;
    cuisine: string;
    ingredients: Array<{ name: string; quantity: string; note: string }>;
    instructions: string[];
    ayurvedic_properties: {
      rasa: string[];
      virya: string;
      vipaka: string;
      prabhava: string;
      dosha_effect: {
        Vata: string;
        Pitta: string;
        Kapha: string;
      };
      guna: string[];
      guna_properties: string;
    };
    health_benefits: string[];
    nutrition_profile: {
      calories: number;
      protein_g: number;
      carbs_g: number;
      fat_g: number;
      fiber_g: number;
      vitamins: string[];
      minerals: {
        [key: string]: string;
      };
      glycemic_index: number;
      nutrient_density_score: number;
    };
    tags: string[];
  }

  interface DietPlan {
    _id: string;
    patientId: string;
    patientName: string;
    primaryDosha: string;
    duration: string;
    generatedDate: string;
    recommendations: string[];
    meals: Array<{
      day: string;
      breakfast: { name: string; time: string };
      lunch: { name: string; time: string };
      dinner: { name: string; time: string };
      snack: { name: string; time: string };
    }>;
    notes: string;
    status: string;
    createdAt: string;
  }

  interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
  }

  class ApiService {
    setToken(token: string): void;
    getPatients(): Promise<ApiResponse<{ patients: Patient[] }>>;
    getPatient(id: string): Promise<ApiResponse<Patient>>;
    createPatient(patientData: Partial<Patient>): Promise<ApiResponse<Patient>>;
    updatePatient(id: string, patientData: Partial<Patient>): Promise<ApiResponse<Patient>>;
    deletePatient(id: string): Promise<ApiResponse<null>>;
    getRecipes(): Promise<ApiResponse<{ recipes: Recipe[] }>>;
    getRecipe(id: string): Promise<ApiResponse<Recipe>>;
    generateDietPlan(patientId: string, options: any): Promise<ApiResponse<DietPlan>>;
    getPatientHistory(patientId: string): Promise<ApiResponse<any>>;
  }

  const apiService: ApiService;
  export default apiService;
}