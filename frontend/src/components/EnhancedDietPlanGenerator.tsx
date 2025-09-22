import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { SupabaseService } from '../services/supabase';
import { AIDietGenerator } from '../services/aiDietGenerator';
import {
  ChefHat,
  User,
  Sparkles,
  Calendar,
  Target,
  Clock,
  Activity,
  Heart,
  Utensils,
  Plus,
  X,
  Loader2,
  CheckCircle,
  Download,
  Save,
  RefreshCw
} from 'lucide-react';

interface Patient {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  primary_dosha: string;
  weight?: number;
  height?: number;
  health_concerns?: string[];
  allergies?: string[];
  dietary_restrictions?: string[];
  cooking_skills: string;
  cooking_time_preference: string;
  meal_frequency: number;
  water_intake_liters: number;
  preferred_cuisines?: string[];
  lifestyle_factors?: any;
  food_preferences?: any;
}

interface DietPlan {
  id: string;
  patient_id: string;
  plan_name: string;
  duration_days: number;
  meal_plan: any;
  ayurvedic_guidelines: string[];
  lifestyle_recommendations: string[];
  nutritional_analysis: any;
  created_at: string;
}

const UnlimitedDietPlanGenerator = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<DietPlan | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Unlimited input preferences
  const [preferences, setPreferences] = useState<any>({
    duration_days: 7,
    target_goals: [],
    dietary_restrictions: [],
    meal_types: ['breakfast', 'lunch', 'dinner', 'snacks'],
    calorie_target: '',
    activity_level: 'moderate',
    health_focus: [],
    cuisine_preferences: [],
    cooking_time_limit: '',
    budget_range: '',
    family_size: '',
    special_occasions: [],
    seasonal_preferences: '',
    customPreferences: {}
  });

  const [newPrefKey, setNewPrefKey] = useState('');
  const [newPrefValue, setNewPrefValue] = useState('');

  const healthFocusOptions = [
    'Weight Loss', 'Weight Gain', 'Muscle Building', 'Heart Health', 
    'Diabetes Management', 'Digestive Health', 'Immunity Boost', 
    'Energy Enhancement', 'Stress Reduction', 'Anti-Aging',
    'Detoxification', 'Mental Clarity', 'Joint Health', 'Skin Health'
  ];

  const targetGoalsOptions = [
    'Lose weight', 'Gain weight', 'Maintain weight', 'Build muscle',
    'Improve digestion', 'Boost energy', 'Better sleep', 'Reduce stress',
    'Lower cholesterol', 'Control blood sugar', 'Improve immunity',
    'Enhance mental clarity', 'Better skin health', 'Joint health'
  ];

  const dietaryRestrictionsOptions = [
    'Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Nut-free',
    'Low-carb', 'Keto', 'Paleo', 'Mediterranean', 'DASH',
    'Low-sodium', 'Low-fat', 'High-protein', 'Raw food', 'Organic only'
  ];

  const cuisineOptions = [
    'Indian', 'Mediterranean', 'Asian', 'Mexican', 'Italian',
    'Middle Eastern', 'Thai', 'Japanese', 'Chinese', 'Korean',
    'European', 'American', 'African', 'South American'
  ];

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const result = await SupabaseService.getPatients();
      if (result.data) {
        setPatients(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleArrayPreference = (key: string, value: string) => {
    setPreferences((prev: any) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item: string) => item !== value)
        : [...prev[key], value]
    }));
  };

  const addCustomPreference = () => {
    if (newPrefKey && newPrefValue) {
      setPreferences((prev: any) => ({
        ...prev,
        customPreferences: {
          ...prev.customPreferences,
          [newPrefKey]: newPrefValue
        }
      }));
      setNewPrefKey('');
      setNewPrefValue('');
    }
  };

  const removeCustomPreference = (key: string) => {
    setPreferences((prev: any) => {
      const newCustomPrefs = { ...prev.customPreferences };
      delete newCustomPrefs[key];
      return { ...prev, customPreferences: newCustomPrefs };
    });
  };

  const generateDietPlan = async () => {
    if (!selectedPatient) return;

    try {
      setGenerating(true);
      
      // Combine all preferences including custom ones
      const allPreferences = {
        ...preferences,
        ...preferences.customPreferences
      };

      // Remove the customPreferences object since they're now merged
      delete allPreferences.customPreferences;

      console.log('Generating diet plan with unlimited preferences:', Object.keys(allPreferences));

      const result = await AIDietGenerator.generateComprehensiveDietPlan(
        selectedPatient,
        allPreferences
      );

      if (result.dietPlan) {
        setGeneratedPlan(result.dietPlan as any);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        throw new Error(result.error || 'Failed to generate diet plan');
      }
    } catch (error) {
      console.error('Failed to generate diet plan:', error);
      alert('Failed to generate diet plan. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const exportToPDF = () => {
    // This will be implemented with PDF generation
    alert('PDF export feature coming soon!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#9E7E3D]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#9E7E3D]">AI Diet Plan Generator</h1>
          <p className="text-gray-600">Generate personalized Ayurvedic diet plans with unlimited customization</p>
        </div>
        {generatedPlan && (
          <Button onClick={exportToPDF} className="btn-rustic">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        )}
      </div>

      {/* Success Notification */}
      {showSuccess && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Personalized diet plan generated successfully with AI intelligence!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Selection & Preferences */}
        <div className="space-y-6">
          {/* Patient Selection */}
          <Card className="card-rustic">
            <CardHeader>
              <CardTitle className="text-[#9E7E3D] flex items-center">
                <User className="w-5 h-5 mr-2 text-[#F5C24D]" />
                Select Patient
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={(value) => {
                const patient = patients.find(p => p.id === value);
                setSelectedPatient(patient || null);
              }}>
                <SelectTrigger className="select-rustic">
                  <SelectValue placeholder="Choose a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.full_name} - {patient.primary_dosha} (Age {patient.age})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedPatient && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-[#9E7E3D]">{selectedPatient.full_name}</h4>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>Age: {selectedPatient.age}</div>
                    <div>Dosha: {selectedPatient.primary_dosha}</div>
                    <div>Cooking Skills: {selectedPatient.cooking_skills}</div>
                    <div>Meal Frequency: {selectedPatient.meal_frequency}/day</div>
                  </div>
                  {selectedPatient.health_concerns && selectedPatient.health_concerns.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm font-medium">Health Concerns: </span>
                      <span className="text-sm">{selectedPatient.health_concerns.join(', ')}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Basic Preferences */}
          <Card className="card-rustic">
            <CardHeader>
              <CardTitle className="text-[#9E7E3D] flex items-center">
                <Target className="w-5 h-5 mr-2 text-[#F5C24D]" />
                Diet Plan Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={preferences.duration_days}
                    onChange={(e) => handlePreferenceChange('duration_days', parseInt(e.target.value))}
                    className="input-rustic"
                    min="1"
                    max="30"
                  />
                </div>
                <div>
                  <Label htmlFor="calories">Target Calories (optional)</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={preferences.calorie_target}
                    onChange={(e) => handlePreferenceChange('calorie_target', e.target.value)}
                    placeholder="e.g., 2000"
                    className="input-rustic"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="activity">Activity Level</Label>
                <Select onValueChange={(value) => handlePreferenceChange('activity_level', value)}>
                  <SelectTrigger className="select-rustic">
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary</SelectItem>
                    <SelectItem value="light">Light Activity</SelectItem>
                    <SelectItem value="moderate">Moderate Activity</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="very_active">Very Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Target Goals */}
          <Card className="card-rustic">
            <CardHeader>
              <CardTitle className="text-[#9E7E3D] flex items-center">
                <Target className="w-5 h-5 mr-2 text-[#F5C24D]" />
                Target Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {targetGoalsOptions.map((goal) => (
                  <div key={goal} className="flex items-center space-x-2">
                    <Checkbox
                      id={goal}
                      checked={preferences.target_goals.includes(goal)}
                      onCheckedChange={() => handleArrayPreference('target_goals', goal)}
                    />
                    <Label htmlFor={goal} className="text-sm">{goal}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dietary Restrictions */}
          <Card className="card-rustic">
            <CardHeader>
              <CardTitle className="text-[#9E7E3D] flex items-center">
                <Heart className="w-5 h-5 mr-2 text-[#F5C24D]" />
                Dietary Restrictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {dietaryRestrictionsOptions.map((restriction) => (
                  <div key={restriction} className="flex items-center space-x-2">
                    <Checkbox
                      id={restriction}
                      checked={preferences.dietary_restrictions.includes(restriction)}
                      onCheckedChange={() => handleArrayPreference('dietary_restrictions', restriction)}
                    />
                    <Label htmlFor={restriction} className="text-sm">{restriction}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Health Focus */}
          <Card className="card-rustic">
            <CardHeader>
              <CardTitle className="text-[#9E7E3D] flex items-center">
                <Activity className="w-5 h-5 mr-2 text-[#F5C24D]" />
                Health Focus Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {healthFocusOptions.map((focus) => (
                  <div key={focus} className="flex items-center space-x-2">
                    <Checkbox
                      id={focus}
                      checked={preferences.health_focus.includes(focus)}
                      onCheckedChange={() => handleArrayPreference('health_focus', focus)}
                    />
                    <Label htmlFor={focus} className="text-sm">{focus}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Custom Preferences - Unlimited Inputs */}
          <Card className="card-rustic">
            <CardHeader>
              <CardTitle className="text-[#9E7E3D] flex items-center">
                <Plus className="w-5 h-5 mr-2 text-[#F5C24D]" />
                Custom Preferences (Unlimited)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add new custom preference */}
              <div className="flex gap-2">
                <Input
                  placeholder="Preference name (e.g., Spice Level, Meal Timing)"
                  value={newPrefKey}
                  onChange={(e) => setNewPrefKey(e.target.value)}
                  className="input-rustic flex-1"
                />
                <Input
                  placeholder="Preference value"
                  value={newPrefValue}
                  onChange={(e) => setNewPrefValue(e.target.value)}
                  className="input-rustic flex-1"
                />
                <Button type="button" onClick={addCustomPreference} className="btn-rustic">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Display existing custom preferences */}
              {Object.entries(preferences.customPreferences).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="font-medium text-sm">{key}:</span>
                  <span className="text-sm">{value as string}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomPreference(key)}
                    className="ml-auto"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <div className="text-sm text-gray-600">
                Add any specific preferences like spice level, cooking methods, meal timing, etc.
                This AI generator accepts unlimited customization!
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button
            onClick={generateDietPlan}
            disabled={!selectedPatient || generating}
            className="btn-rustic w-full py-3"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating AI Diet Plan...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Personalized Diet Plan
              </>
            )}
          </Button>
        </div>

        {/* Generated Plan Display */}
        <div className="space-y-6">
          {generatedPlan ? (
            <>
              <Card className="card-rustic">
                <CardHeader>
                  <CardTitle className="text-[#9E7E3D] flex items-center">
                    <ChefHat className="w-5 h-5 mr-2 text-[#F5C24D]" />
                    Generated Diet Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium">Duration:</span> {generatedPlan.duration_days} days
                      </div>
                      <div>
                        <span className="font-medium">Patient:</span> {selectedPatient?.full_name}
                      </div>
                    </div>

                    {/* Meal Plan */}
                    {generatedPlan.meal_plan && (
                      <div>
                        <h4 className="font-semibold text-[#9E7E3D] mb-2">Meal Plan</h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {Object.entries(generatedPlan.meal_plan).map(([day, meals]: [string, any]) => (
                            <div key={day} className="p-3 bg-gray-50 rounded">
                              <h5 className="font-medium capitalize">{day}</h5>
                              <div className="text-sm space-y-1">
                                {meals.breakfast && <div><strong>Breakfast:</strong> {meals.breakfast.recipe_name} ({meals.breakfast.calories} cal)</div>}
                                {meals.lunch && <div><strong>Lunch:</strong> {meals.lunch.recipe_name} ({meals.lunch.calories} cal)</div>}
                                {meals.dinner && <div><strong>Dinner:</strong> {meals.dinner.recipe_name} ({meals.dinner.calories} cal)</div>}
                                {meals.snacks && meals.snacks.length > 0 && (
                                  <div><strong>Snacks:</strong> {meals.snacks.map((s: any) => s.recipe_name).join(', ')}</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ayurvedic Guidelines */}
                    {generatedPlan.ayurvedic_guidelines && generatedPlan.ayurvedic_guidelines.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-[#9E7E3D] mb-2">Ayurvedic Guidelines</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {generatedPlan.ayurvedic_guidelines.map((guideline, index) => (
                            <li key={index}>{guideline}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Lifestyle Recommendations */}
                    {generatedPlan.lifestyle_recommendations && generatedPlan.lifestyle_recommendations.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-[#9E7E3D] mb-2">Lifestyle Recommendations</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {generatedPlan.lifestyle_recommendations.map((recommendation, index) => (
                            <li key={index}>{recommendation}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Nutritional Analysis */}
                    {generatedPlan.nutritional_analysis && (
                      <div>
                        <h4 className="font-semibold text-[#9E7E3D] mb-2">Nutritional Analysis</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(generatedPlan.nutritional_analysis).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium capitalize">{key.replace('_', ' ')}:</span> {value as string}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="card-rustic">
              <CardContent className="text-center py-12">
                <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Diet Plan Generated</h3>
                <p className="text-gray-600 mb-4">
                  Select a patient and configure preferences to generate a personalized AI diet plan.
                </p>
                <div className="text-sm text-gray-500">
                  Our AI will consider Ayurvedic principles, dosha balance, and all your custom preferences.
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnlimitedDietPlanGenerator;