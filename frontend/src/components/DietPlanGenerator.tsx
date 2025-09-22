import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { 
  Calendar,
  Plus,
  Clock,
  Users,
  User,
  ChefHat,
  Leaf,
  AlertCircle,
  Star,
  Download,
  Share,
  Filter,
  Sparkles,
  Loader2,
  Brain,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';

// Types
interface Patient {
  _id: string;
  fullName: string;
  age?: number;
  primaryDosha: string;
  weight?: number;
  height?: number;
  primaryConcerns?: string;
  allergies?: string;
  currentSymptoms?: string[];
  medications?: string;
  dietType?: string;
}

interface Meal {
  name: string;
  calories: number;
  cookTime: string;
  dosha: string;
  ingredients: string[];
  benefits: string;
  ayurvedicNote: string;
}

interface DayMeals {
  [key: string]: Meal;
}

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
const allergyOptions = ['Gluten Free', 'Dairy Free', 'Nut Free', 'Soy Free', 'Egg Free', 'Low Sodium'];
const dietTypes = ['Vegetarian', 'Vegan', 'Lacto-Vegetarian', 'Sattvic', 'Raw Food'];
const doshaOptions = ['Vata', 'Pitta', 'Kapha', 'Vata-Pitta', 'Pitta-Kapha', 'Vata-Kapha'];

// Dynamic meal plans based on dosha
const getDynamicMealPlan = (dosha: string, dietType: string, allergies: string[], maxCookTime: string): { [day: string]: DayMeals } => {
  const baseCalories = dosha.includes('Kapha') ? 350 : dosha.includes('Pitta') ? 420 : 380;
  const cookTimeLimit = parseInt(maxCookTime);
  
  const isVegetarian = dietType === 'Vegetarian';
  const isVegan = dietType === 'Vegan';
  const isDairyFree = allergies.includes('Dairy Free') || isVegan;
  const isGlutenFree = allergies.includes('Gluten Free');
  
  const mealPlan: { [day: string]: DayMeals } = {};
  
  weekDays.forEach(day => {
    mealPlan[day] = {
      'Breakfast': {
        name: dosha.includes('Vata') ? "Warm Spiced Oatmeal" : dosha.includes('Pitta') ? "Cool Fruit Bowl" : "Light Millet Upma",
        calories: baseCalories - 50,
        cookTime: cookTimeLimit > 15 ? "15 minutes" : "10 minutes",
        dosha: dosha,
        ingredients: dosha.includes('Vata') ? ["Oats", "Cinnamon", "Almonds", "Dates"] : 
                    dosha.includes('Pitta') ? ["Fresh fruits", "Coconut", "Mint", "Rose water"] :
                    ["Millet", "Vegetables", "Ginger", "Turmeric"],
        benefits: dosha.includes('Vata') ? "Grounding and warming" : 
                 dosha.includes('Pitta') ? "Cooling and refreshing" : 
                 "Light and energizing",
        ayurvedicNote: `Perfect for ${dosha} constitution - ${dietType} diet`
      },
      'Lunch': {
        name: isGlutenFree ? "Quinoa Bowl with Vegetables" : "Traditional Khichdi",
        calories: baseCalories + 50,
        cookTime: cookTimeLimit > 30 ? "30 minutes" : "25 minutes",
        dosha: "Tridoshic",
        ingredients: isGlutenFree ? ["Quinoa", "Mixed vegetables", "Herbs"] : ["Rice", "Moong dal", "Spices"],
        benefits: "Balanced and nourishing",
        ayurvedicNote: "Lunch should be the heaviest meal"
      },
      'Dinner': {
        name: dosha.includes('Kapha') ? "Light Vegetable Soup" : "Steamed Vegetables with Rice",
        calories: baseCalories - 30,
        cookTime: cookTimeLimit > 20 ? "20 minutes" : "15 minutes",
        dosha: dosha,
        ingredients: dosha.includes('Kapha') ? ["Mixed vegetables", "Ginger", "Black pepper"] : ["Seasonal vegetables", "Basmati rice"],
        benefits: "Light and easy to digest",
        ayurvedicNote: "Light dinner supports nighttime digestion"
      },
      'Snacks': {
        name: isDairyFree ? "Herbal Tea with Dates" : "Golden Milk",
        calories: 120,
        cookTime: "5 minutes",
        dosha: dosha,
        ingredients: isDairyFree ? ["Herbal tea", "Dates", "Almonds"] : ["Turmeric", "Warm milk", "Honey"],
        benefits: "Calming and nourishing",
        ayurvedicNote: "Perfect evening snack"
      }
    };
  });
  
  return mealPlan;
};

export function DietPlanGenerator() {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDosha, setSelectedDosha] = useState('Vata-Pitta');
  const [selectedDietType, setSelectedDietType] = useState('Vegetarian');
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [maxCookTime, setMaxCookTime] = useState('30');
  const [activeDay, setActiveDay] = useState('Monday');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [currentMealPlan, setCurrentMealPlan] = useState<{ [day: string]: DayMeals }>({});
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [planOptions, setPlanOptions] = useState({
    duration: 7,
    targetCalories: 2000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  // Load patients from the same source as PatientManagement
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      // Try to load from backend first (same as PatientManagement)
      try {
        // This would be the API call - for now we'll simulate it
        // const response = await apiService.getPatients();
        // setPatients(response.data.patients || []);
        
        // For now, check if there are patients in localStorage (from PatientManagement)
        const savedPatients = localStorage.getItem('ayursynch_patients');
        if (savedPatients) {
          const parsedPatients = JSON.parse(savedPatients);
          setPatients(parsedPatients);
          if (parsedPatients.length > 0) {
            setSelectedPatient(parsedPatients[0]._id || parsedPatients[0].id);
            setSelectedDosha(parsedPatients[0].primaryDosha || parsedPatients[0].dosha);
            setSelectedDietType(parsedPatients[0].dietType || 'Vegetarian');
            generateMealPlan(parsedPatients[0].primaryDosha || parsedPatients[0].dosha, parsedPatients[0].dietType || 'Vegetarian', [], '30');
          }
        } else {
          // Fallback to demo patients
          const demoPatients: Patient[] = [
            { _id: 'demo1', fullName: 'Sarah Johnson', age: 28, primaryDosha: 'Vata', weight: 55, height: 160, primaryConcerns: 'Digestive issues, anxiety', allergies: 'Nuts', currentSymptoms: ['Bloating', 'Fatigue'], dietType: 'Vegetarian' },
            { _id: 'demo2', fullName: 'Michael Chen', age: 35, primaryDosha: 'Pitta', weight: 75, height: 175, primaryConcerns: 'Acidity, stress', allergies: 'Dairy', currentSymptoms: ['Heartburn', 'Irritability'], dietType: 'Vegan' },
            { _id: 'demo3', fullName: 'Emma Davis', age: 42, primaryDosha: 'Kapha', weight: 68, height: 165, primaryConcerns: 'Weight management', allergies: 'Gluten', currentSymptoms: ['Sluggishness', 'Joint pain'], dietType: 'Lacto-Vegetarian' }
          ];
          setPatients(demoPatients);
          setSelectedPatient(demoPatients[0]._id);
          setSelectedDosha(demoPatients[0].primaryDosha);
          setSelectedDietType(demoPatients[0].dietType || 'Vegetarian');
          generateMealPlan(demoPatients[0].primaryDosha, demoPatients[0].dietType || 'Vegetarian', [], '30');
        }
      } catch (error) {
        console.error('Failed to load patients from backend:', error);
        // Fallback to demo patients
        const demoPatients: Patient[] = [
          { _id: 'demo1', fullName: 'Sarah Johnson', age: 28, primaryDosha: 'Vata', weight: 55, height: 160, primaryConcerns: 'Digestive issues, anxiety', allergies: 'Nuts', currentSymptoms: ['Bloating', 'Fatigue'], dietType: 'Vegetarian' },
          { _id: 'demo2', fullName: 'Michael Chen', age: 35, primaryDosha: 'Pitta', weight: 75, height: 175, primaryConcerns: 'Acidity, stress', allergies: 'Dairy', currentSymptoms: ['Heartburn', 'Irritability'], dietType: 'Vegan' },
          { _id: 'demo3', fullName: 'Emma Davis', age: 42, primaryDosha: 'Kapha', weight: 68, height: 165, primaryConcerns: 'Weight management', allergies: 'Gluten', currentSymptoms: ['Sluggishness', 'Joint pain'], dietType: 'Lacto-Vegetarian' }
        ];
        setPatients(demoPatients);
        setSelectedPatient(demoPatients[0]._id);
        setSelectedDosha(demoPatients[0].primaryDosha);
        setSelectedDietType(demoPatients[0].dietType || 'Vegetarian');
        generateMealPlan(demoPatients[0].primaryDosha, demoPatients[0].dietType || 'Vegetarian', [], '30');
      }
    } catch (error) {
      console.error('Error loading patients:', error);
      setError('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  // Listen for changes in localStorage to update patients list when new patients are added
  useEffect(() => {
    const handleStorageChange = () => {
      loadPatients();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event when patient is added
    window.addEventListener('patientAdded', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('patientAdded', handleStorageChange);
    };
  }, []);

  // Update meal plan whenever inputs change
  useEffect(() => {
    if (selectedPatient) {
      const patient = patients.find(p => p._id === selectedPatient);
      if (patient) {
        const dosha = patient.primaryDosha;
        const dietType = patient.dietType || selectedDietType;
        generateMealPlan(dosha, dietType, selectedAllergies, maxCookTime);
      }
    } else {
      generateMealPlan(selectedDosha, selectedDietType, selectedAllergies, maxCookTime);
    }
  }, [selectedPatient, selectedDosha, selectedDietType, selectedAllergies, maxCookTime, patients]);

  const generateMealPlan = (dosha: string, dietType: string, allergies: string[], cookTime: string) => {
    const newMealPlan = getDynamicMealPlan(dosha, dietType, allergies, cookTime);
    setCurrentMealPlan(newMealPlan);
  };

  const handleAllergyChange = (allergy: string, checked: boolean) => {
    if (checked) {
      setSelectedAllergies([...selectedAllergies, allergy]);
    } else {
      setSelectedAllergies(selectedAllergies.filter(a => a !== allergy));
    }
  };

  const handleGenerateDietPlan = async () => {
    if (!selectedPatient) {
      setError('Please select a patient first.');
      return;
    }

    try {
      setGenerating(true);
      setError(null);
      setSuccess(null);

      const patient = patients.find(p => p._id === selectedPatient);
      if (!patient) {
        setError('Selected patient not found.');
        return;
      }

      // Simulate AI generation with a delay
      setTimeout(() => {
        generateMealPlan(patient.primaryDosha, patient.dietType || selectedDietType, selectedAllergies, maxCookTime);
        setSuccess(`Personalized diet plan generated for ${patient.fullName}!`);
        setIsGenerateDialogOpen(false);
        setGenerating(false);
      }, 2000);

    } catch (error) {
      console.error('Failed to generate diet plan:', error);
      setError('Failed to generate diet plan. Please try again.');
      setGenerating(false);
    }
  };

  // Get current day meals
  const currentDayMeals = currentMealPlan[activeDay] || {};
  const totalCalories = Object.values(currentDayMeals).reduce((total, meal) => total + meal.calories, 0);

  return (
    <div className="space-y-6 p-6 bg-[#FDF8E4] min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 rounded-xl bg-white shadow-lg animate-fade-in-up">
        <div>
          <h1 className="text-3xl text-[#9E7E3D] font-bold flex items-center">
            <Sparkles className="w-8 h-8 mr-3 text-[#F5C24D]" />
            Diet Plan Generator
          </h1>
          <p className="text-[#4C7A5A]/80 mt-1">Create personalized 7-day Ayurvedic meal plans for your patients.</p>
        </div>
        <div className="flex gap-3">
          <Button className="btn-rustic-outline bg-white text-[#9E7E3D] border-[#9E7E3D] hover:bg-[#9E7E3D] hover:text-white">
            <Download className="w-4 h-4 mr-2" />
            Download Plan
          </Button>
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-rustic bg-[#84A15D] text-white hover:bg-[#6a844a]">
                <Brain className="w-4 h-4 mr-2" />
                Generate AI Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-[#9E7E3D] text-2xl font-semibold flex items-center">
                  <Sparkles className="w-6 h-6 mr-2 text-[#F5C24D]" />
                  Generate AI Diet Plan
                </DialogTitle>
                <DialogDescription className="text-[#4C7A5A]/80">
                  Create a personalized 7-day Ayurvedic meal plan using AI.
                </DialogDescription>
              </DialogHeader>
              
              {error && (
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="mb-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (days)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      max="30"
                      value={planOptions.duration}
                      onChange={(e) => setPlanOptions(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetCalories">Target Calories</Label>
                    <Input
                      id="targetCalories"
                      type="number"
                      min="800"
                      max="4000"
                      value={planOptions.targetCalories}
                      onChange={(e) => setPlanOptions(prev => ({ ...prev, targetCalories: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setIsGenerateDialogOpen(false)}
                  disabled={generating}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleGenerateDietPlan}
                  disabled={generating || !selectedPatient}
                  className="btn-rustic bg-[#84A15D] text-white hover:bg-[#6a844a]"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Generate Plan
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Panel */}
        <Card className="card-rustic bg-white rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#9E7E3D] flex items-center">
              <Filter className="w-5 h-5 mr-2 text-[#F5C24D]" />
              Plan Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-[#4C7A5A]/70 font-medium">Patient</label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger className="border-[#9E7E3D]/20 bg-white">
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient._id} value={patient._id}>
                      {patient.fullName} ({patient.primaryDosha})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Patient Information Display */}
            {selectedPatient && (() => {
              const patient = patients.find(p => p._id === selectedPatient);
              if (!patient) return null;
              
              return (
                <div className="p-4 bg-gradient-to-r from-[#E1D1A5]/30 to-[#F5C24D]/20 rounded-lg border border-[#9E7E3D]/20">
                  <h4 className="text-[#9E7E3D] font-medium mb-3 flex items-center">
                    <User className="w-4 h-4 mr-2 text-[#F5C24D]" />
                    Patient Profile
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#4C7A5A]/70">Name:</span>
                      <span className="text-[#9E7E3D] font-medium">{patient.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#4C7A5A]/70">Age:</span>
                      <span className="text-[#9E7E3D]">{patient.age || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#4C7A5A]/70">Dosha:</span>
                      <Badge className="bg-[#F5C24D]/20 text-[#9E7E3D] border-[#9E7E3D]/20">
                        {patient.primaryDosha}
                      </Badge>
                    </div>
                    {patient.weight && patient.height && (
                      <div className="flex justify-between">
                        <span className="text-[#4C7A5A]/70">BMI:</span>
                        <span className="text-[#9E7E3D]">
                          {(patient.weight / Math.pow(patient.height / 100, 2)).toFixed(1)}
                        </span>
                      </div>
                    )}
                    {patient.primaryConcerns && (
                      <div className="mt-2">
                        <span className="text-[#4C7A5A]/70 text-xs">Health Concerns:</span>
                        <p className="text-[#9E7E3D] text-xs mt-1">{patient.primaryConcerns}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            <div className="space-y-2">
              <label className="text-sm text-[#4C7A5A]/70 font-medium">Primary Dosha</label>
              <Select value={selectedDosha} onValueChange={setSelectedDosha}>
                <SelectTrigger className="border-[#9E7E3D]/20 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {doshaOptions.map(dosha => (
                    <SelectItem key={dosha} value={dosha}>
                      {dosha}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#4C7A5A]/70 font-medium">Diet Type</label>
              <Select value={selectedDietType} onValueChange={setSelectedDietType}>
                <SelectTrigger className="border-[#9E7E3D]/20 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dietTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#4C7A5A]/70 font-medium">Max Cooking Time</label>
              <Select value={maxCookTime} onValueChange={setMaxCookTime}>
                <SelectTrigger className="border-[#9E7E3D]/20 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm text-[#4C7A5A]/70 font-medium">Dietary Restrictions</label>
              {allergyOptions.map((allergy) => (
                <div key={allergy} className="flex items-center space-x-2">
                  <Checkbox
                    id={allergy}
                    checked={selectedAllergies.includes(allergy)}
                    onCheckedChange={(checked) => handleAllergyChange(allergy, checked as boolean)}
                    className="border-[#9E7E3D]/30 data-[state=checked]:bg-[#9E7E3D] data-[state=checked]:border-[#9E7E3D]"
                  />
                  <label htmlFor={allergy} className="text-sm text-[#9E7E3D] cursor-pointer">{allergy}</label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Meal Plan Display */}
        <div className="lg:col-span-3 space-y-6">
          {/* Weekly Overview */}
          <Card className="card-rustic bg-white rounded-xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#9E7E3D] flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-[#F5C24D]" />
                  7-Day Meal Plan
                </div>
                <Badge className="bg-gradient-to-r from-[#F5C24D]/20 to-[#4C7A5A]/20 text-[#9E7E3D] border-[#9E7E3D]/20">
                  {totalCalories} calories/day
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {weekDays.map((day) => (
                  <Button
                    key={day}
                    variant={activeDay === day ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveDay(day)}
                    className={`min-w-24 transition-all duration-300 ${
                      activeDay === day 
                        ? 'bg-[#84A15D] text-white transform scale-105' 
                        : 'bg-white text-[#9E7E3D] border-[#9E7E3D] hover:bg-[#9E7E3D] hover:text-white hover:scale-105'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Daily Meals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mealTypes.map((mealType, index) => {
              const meal = currentDayMeals[mealType];
              
              if (!meal) {
                return (
                  <Card key={mealType} className="bg-white rounded-xl shadow-lg">
                    <CardContent className="p-6 text-center">
                      <h4 className="text-lg text-[#9E7E3D] mb-2">{mealType}</h4>
                      <p className="text-[#4C7A5A]/60">No meal plan available for this day</p>
                    </CardContent>
                  </Card>
                );
              }
              
              return (
                <Card key={mealType} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-[#9E7E3D]">{mealType}</CardTitle>
                      <Badge variant="outline" className="border-[#F5C24D]/30 bg-[#F5C24D]/10 text-[#9E7E3D]">
                        {meal.dosha}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <h4 className="text-[#9E7E3D] font-medium">{meal.name}</h4>
                    
                    <div className="flex items-center justify-between text-sm text-[#4C7A5A]/80">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-[#F5C24D]" />
                        {meal.cookTime}
                      </div>
                      <div className="flex items-center">
                        <ChefHat className="w-4 h-4 mr-1 text-[#F5C24D]" />
                        {meal.calories} calories
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-[#4C7A5A]/70">Ingredients:</p>
                      <div className="flex flex-wrap gap-1">
                        {meal.ingredients.map((ingredient, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-[#E1D1A5]/50 text-[#9E7E3D] border-[#9E7E3D]/10">
                            {ingredient}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-gradient-to-r from-[#E1D1A5]/30 to-[#F5C24D]/10 rounded-lg border border-[#9E7E3D]/10">
                      <div className="flex items-start">
                        <Leaf className="w-4 h-4 text-[#4C7A5A] mr-2 mt-0.5" />
                        <div>
                          <p className="text-xs text-[#9E7E3D]">{meal.benefits}</p>
                          <p className="text-xs text-[#4C7A5A]/70 mt-1 italic">{meal.ayurvedicNote}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 border-[#9E7E3D]/30 text-[#9E7E3D] hover:bg-[#9E7E3D] hover:text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 border-[#9E7E3D]/30 text-[#9E7E3D] hover:bg-[#9E7E3D] hover:text-white">
                        <Share className="w-3 h-3 mr-1" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Nutrition Summary */}
          <Card className="bg-white rounded-xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#9E7E3D] flex items-center">
                <ChefHat className="w-5 h-5 mr-2 text-[#F5C24D]" />
                Daily Nutrition Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-[#E1D1A5]/50 to-[#F5C24D]/20 rounded-lg border border-[#9E7E3D]/10">
                  <p className="text-2xl text-[#9E7E3D] font-semibold">{totalCalories}</p>
                  <p className="text-sm text-[#4C7A5A]/70">Total Calories</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-[#4C7A5A]/20 to-[#E1D1A5]/30 rounded-lg border border-[#9E7E3D]/10">
                  <p className="text-2xl text-[#9E7E3D] font-semibold">65g</p>
                  <p className="text-sm text-[#4C7A5A]/70">Protein</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-[#F5C24D]/20 to-[#4C7A5A]/20 rounded-lg border border-[#9E7E3D]/10">
                  <p className="text-2xl text-[#9E7E3D] font-semibold">180g</p>
                  <p className="text-sm text-[#4C7A5A]/70">Carbohydrates</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-[#E1D1A5]/50 to-[#4C7A5A]/20 rounded-lg border border-[#9E7E3D]/10">
                  <p className="text-2xl text-[#9E7E3D] font-semibold">45g</p>
                  <p className="text-sm text-[#4C7A5A]/70">Healthy Fats</p>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gradient-to-r from-[#E1D1A5]/40 to-[#F5C24D]/20 rounded-lg border border-[#9E7E3D]/20">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-[#4C7A5A] mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-[#9E7E3D] font-medium">Ayurvedic Recommendation</p>
                    <p className="text-xs text-[#4C7A5A]/80 mt-1">
                      This meal plan is designed to balance {selectedDosha} constitution. It includes {selectedDietType.toLowerCase()} foods 
                      that support proper digestion and overall wellness.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
