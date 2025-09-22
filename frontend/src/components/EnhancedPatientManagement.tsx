import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { SupabaseService } from '../services/supabase';
import {
  Search,
  Plus,
  User,
  Calendar,
  Activity,
  FileText,
  Phone,
  Mail,
  MapPin,
  Heart,
  Target,
  TrendingUp,
  Circle,
  Triangle,
  Square,
  Droplet,
  Cloud,
  Thermometer,
  Wind,
  Loader2,
  AlertCircle,
  ChefHat,
  Download,
  Save,
  CheckCircle,
  X
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';

interface Patient {
  id: string;
  practitioner_id: string;
  full_name: string;
  age: number;
  gender: string;
  email?: string;
  phone?: string;
  height?: number;
  weight?: number;
  occupation?: string;
  primary_dosha: string;
  dosha_scores?: any;
  dosha_assessment_answers?: any;
  health_concerns?: string[];
  allergies?: string[];
  current_medications?: string[];
  medical_conditions?: string[];
  dietary_restrictions?: string[];
  lifestyle_factors?: any;
  meal_frequency: number;
  water_intake_liters: number;
  cooking_skills: string;
  cooking_time_preference: string;
  preferred_cuisines?: string[];
  food_preferences?: any;
  bmi?: number;
  status: string;
  last_visit: string;
  created_at: string;
  updated_at: string;
}

const doshaQuestions = [
  { question: "Body Frame", options: [{ label: "Thin", value: "Vata" }, { label: "Medium", value: "Pitta" }, { label: "Heavy", value: "Kapha" }] },
  { question: "Weight Pattern", options: [{ label: "Hard to gain", value: "Vata" }, { label: "Moderate", value: "Pitta" }, { label: "Easy to gain", value: "Kapha" }] },
  { question: "Skin Type", options: [{ label: "Dry", value: "Vata" }, { label: "Sensitive", value: "Pitta" }, { label: "Oily", value: "Kapha" }] },
  { question: "Appetite", options: [{ label: "Variable", value: "Vata" }, { label: "Strong", value: "Pitta" }, { label: "Steady", value: "Kapha" }] },
  { question: "Digestion", options: [{ label: "Fast/Bloating", value: "Vata" }, { label: "Strong/Acidity", value: "Pitta" }, { label: "Slow", value: "Kapha" }] },
  { question: "Energy", options: [{ label: "Bursts", value: "Vata" }, { label: "Intense", value: "Pitta" }, { label: "Steady", value: "Kapha" }] },
  { question: "Sleep", options: [{ label: "Light", value: "Vata" }, { label: "Moderate", value: "Pitta" }, { label: "Heavy", value: "Kapha" }] },
  { question: "Stress Response", options: [{ label: "Worry", value: "Vata" }, { label: "Anger", value: "Pitta" }, { label: "Withdrawal", value: "Kapha" }] },
  { question: "Weather Preference", options: [{ label: "Warm", value: "Vata" }, { label: "Cool", value: "Pitta" }, { label: "Moderate", value: "Kapha" }] },
  { question: "Food Preferences", options: [{ label: "Warm/Moist", value: "Vata" }, { label: "Cool/Sweet", value: "Pitta" }, { label: "Light/Spicy", value: "Kapha" }] }
];

const healthConcernsList = [
  "Digestive issues", "Weight management", "Energy levels", "Sleep problems", 
  "Stress/anxiety", "Immunity", "Joint health", "Heart health", "Diabetes", 
  "Blood pressure", "Cholesterol", "Thyroid", "Hormonal balance", "Skin issues",
  "Mental clarity", "Chronic fatigue", "Inflammation", "Detoxification"
];

const allergiesList = [
  "Dairy", "Gluten", "Nuts", "Shellfish", "Eggs", "Soy", "Fish", "Sesame",
  "Environmental allergies", "Lactose intolerance", "Food additives", "Spices"
];

const dietaryRestrictionsList = [
  "Vegetarian", "Vegan", "Gluten-free", "Dairy-free", "Keto", "Paleo", 
  "Low-carb", "Low-fat", "Diabetic", "Heart-healthy", "DASH diet", 
  "Mediterranean", "Raw food", "Organic only", "No processed foods"
];

const UnlimitedInputPatientForm = ({ onSave, saving = false }) => {
  const [formData, setFormData] = useState<any>({
    fullName: '',
    age: '',
    gender: '',
    email: '',
    phone: '',
    weight: '',
    height: '',
    occupation: '',
    doshaAnswers: {},
    primaryConcerns: '',
    currentSymptoms: [],
    medications: '',
    allergies: '',
    mealFrequency: '3',
    waterIntake: '2',
    cookingSkills: 'intermediate',
    cookingTime: '30min',
    dietType: '',
    preferredCuisines: '',
    // Unlimited additional fields
    customFields: {}
  });

  const [showNotification, setShowNotification] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (name: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: Array.isArray(prev[name]) ? prev[name].includes(value)
        ? prev[name].filter((item: string) => item !== value)
        : [...prev[name], value]
      : [value]
    }));
  };

  const handleDoshaAnswer = (question: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      doshaAnswers: { ...prev.doshaAnswers, [question]: value }
    }));
  };

  const addCustomField = () => {
    if (newFieldName && newFieldValue) {
      setFormData((prev: any) => ({
        ...prev,
        customFields: {
          ...prev.customFields,
          [newFieldName]: newFieldValue
        }
      }));
      setNewFieldName('');
      setNewFieldValue('');
    }
  };

  const removeCustomField = (fieldName: string) => {
    setFormData((prev: any) => {
      const newCustomFields = { ...prev.customFields };
      delete newCustomFields[fieldName];
      return { ...prev, customFields: newCustomFields };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine all form data including custom fields
    const finalData = {
      ...formData,
      ...formData.customFields,
      healthConcerns: Array.isArray(formData.currentSymptoms) ? formData.currentSymptoms : [],
      allergies: formData.allergies ? formData.allergies.split(',').map((s: string) => s.trim()) : [],
      medications: formData.medications ? formData.medications.split(',').map((s: string) => s.trim()) : [],
      preferredCuisines: formData.preferredCuisines ? formData.preferredCuisines.split(',').map((s: string) => s.trim()) : []
    };

    // Remove the separate customFields object since they're now merged
    delete finalData.customFields;

    await onSave(finalData);
    
    // Show success notification
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Success Notification */}
      {showNotification && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Patient data saved successfully to database!
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card className="card-rustic">
          <CardHeader>
            <CardTitle className="text-[#9E7E3D] flex items-center">
              <User className="w-5 h-5 mr-2 text-[#F5C24D]" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="input-rustic"
              />
            </div>
            <div>
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                required
                className="input-rustic"
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender *</Label>
              <Select onValueChange={(value) => handleSelectChange('gender', value)}>
                <SelectTrigger className="select-rustic">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="input-rustic"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-rustic"
              />
            </div>
            <div>
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className="input-rustic"
              />
            </div>
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                value={formData.height}
                onChange={handleChange}
                className="input-rustic"
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                className="input-rustic"
              />
            </div>
          </CardContent>
        </Card>

        {/* Dosha Assessment */}
        <Card className="card-rustic">
          <CardHeader>
            <CardTitle className="text-[#9E7E3D] flex items-center">
              <Circle className="w-5 h-5 mr-2 text-[#F5C24D]" />
              Dosha Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {doshaQuestions.map((question, index) => (
              <div key={index}>
                <Label className="text-sm font-medium">{question.question}</Label>
                <div className="flex gap-2 mt-2">
                  {question.options.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={formData.doshaAnswers[question.question] === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleDoshaAnswer(question.question, option.value)}
                      className="text-xs"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Health Information */}
        <Card className="card-rustic">
          <CardHeader>
            <CardTitle className="text-[#9E7E3D] flex items-center">
              <Heart className="w-5 h-5 mr-2 text-[#F5C24D]" />
              Health Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Health Concerns (Select all that apply)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {healthConcernsList.map((concern) => (
                  <div key={concern} className="flex items-center space-x-2">
                    <Checkbox
                      id={concern}
                      checked={formData.currentSymptoms?.includes(concern)}
                      onCheckedChange={() => handleArrayChange('currentSymptoms', concern)}
                    />
                    <Label htmlFor={concern} className="text-sm">{concern}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="medications">Current Medications (comma-separated)</Label>
                <Textarea
                  id="medications"
                  name="medications"
                  value={formData.medications}
                  onChange={handleChange}
                  placeholder="List any current medications..."
                  className="textarea-rustic"
                />
              </div>
              <div>
                <Label htmlFor="allergies">Allergies (comma-separated)</Label>
                <Textarea
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  placeholder="List any allergies..."
                  className="textarea-rustic"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dietary Information */}
        <Card className="card-rustic">
          <CardHeader>
            <CardTitle className="text-[#9E7E3D] flex items-center">
              <ChefHat className="w-5 h-5 mr-2 text-[#F5C24D]" />
              Dietary Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mealFrequency">Meals per Day</Label>
              <Select onValueChange={(value) => handleSelectChange('mealFrequency', value)}>
                <SelectTrigger className="select-rustic">
                  <SelectValue placeholder="Select meal frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 meals</SelectItem>
                  <SelectItem value="3">3 meals</SelectItem>
                  <SelectItem value="4">4 meals</SelectItem>
                  <SelectItem value="5">5 meals</SelectItem>
                  <SelectItem value="6">6 meals</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="waterIntake">Water Intake (liters/day)</Label>
              <Input
                id="waterIntake"
                name="waterIntake"
                type="number"
                step="0.1"
                value={formData.waterIntake}
                onChange={handleChange}
                className="input-rustic"
              />
            </div>
            <div>
              <Label htmlFor="cookingSkills">Cooking Skills</Label>
              <Select onValueChange={(value) => handleSelectChange('cookingSkills', value)}>
                <SelectTrigger className="select-rustic">
                  <SelectValue placeholder="Select cooking skills" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cookingTime">Cooking Time Preference</Label>
              <Select onValueChange={(value) => handleSelectChange('cookingTime', value)}>
                <SelectTrigger className="select-rustic">
                  <SelectValue placeholder="Select time preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15min">15 minutes</SelectItem>
                  <SelectItem value="30min">30 minutes</SelectItem>
                  <SelectItem value="45min">45 minutes</SelectItem>
                  <SelectItem value="60min+">60+ minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="preferredCuisines">Preferred Cuisines (comma-separated)</Label>
              <Input
                id="preferredCuisines"
                name="preferredCuisines"
                value={formData.preferredCuisines}
                onChange={handleChange}
                placeholder="e.g., Indian, Mediterranean, Asian..."
                className="input-rustic"
              />
            </div>
          </CardContent>
        </Card>

        {/* Custom Fields Section - Unlimited Inputs */}
        <Card className="card-rustic">
          <CardHeader>
            <CardTitle className="text-[#9E7E3D] flex items-center">
              <Plus className="w-5 h-5 mr-2 text-[#F5C24D]" />
              Additional Information (Unlimited Fields)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add new custom field */}
            <div className="flex gap-2">
              <Input
                placeholder="Field name (e.g., Exercise Routine, Sleep Hours)"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                className="input-rustic flex-1"
              />
              <Input
                placeholder="Field value"
                value={newFieldValue}
                onChange={(e) => setNewFieldValue(e.target.value)}
                className="input-rustic flex-1"
              />
              <Button type="button" onClick={addCustomField} className="btn-rustic">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Display existing custom fields */}
            {Object.entries(formData.customFields).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span className="font-medium text-sm">{key}:</span>
                <span className="text-sm">{value as string}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCustomField(key)}
                  className="ml-auto"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}

            <div className="text-sm text-gray-600">
              Add any additional information about the patient that you'd like to track.
              This system accepts unlimited input fields!
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="btn-rustic min-w-[200px]"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving Patient...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Patient
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

const EnhancedPatientManagement = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

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

  const handleSavePatient = async (patientData: any) => {
    try {
      setSaving(true);
      const result = await SupabaseService.createPatient(patientData);
      if (result.data) {
        setPatients(prev => [result.data, ...prev]);
        setShowAddDialog(false);
        return true;
      }
    } catch (error) {
      console.error('Failed to save patient:', error);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.primary_dosha.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-[#9E7E3D]">Patient Management</h1>
          <p className="text-gray-600">Comprehensive patient profiles with unlimited input support</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="btn-rustic">
              <Plus className="w-4 h-4 mr-2" />
              Add New Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
              <DialogDescription>
                Fill in the patient information below. You can add unlimited custom fields.
              </DialogDescription>
            </DialogHeader>
            <UnlimitedInputPatientForm onSave={handleSavePatient} saving={saving} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search patients by name, email, or dosha..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 input-rustic max-w-md"
        />
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="card-rustic hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedPatient(patient)}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-[#9E7E3D] text-white">
                      {patient.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-[#9E7E3D]">{patient.full_name}</h3>
                    <p className="text-sm text-gray-600">Age {patient.age}</p>
                  </div>
                </div>
                <Badge className={`
                  ${patient.primary_dosha === 'Vata' ? 'bg-orange-100 text-orange-800' : ''}
                  ${patient.primary_dosha === 'Pitta' ? 'bg-red-100 text-red-800' : ''}
                  ${patient.primary_dosha === 'Kapha' ? 'bg-green-100 text-green-800' : ''}
                  ${patient.primary_dosha.includes('-') ? 'bg-purple-100 text-purple-800' : ''}
                `}>
                  {patient.primary_dosha}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {patient.email || 'No email'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {patient.phone || 'No phone'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Last visit: {new Date(patient.last_visit).toLocaleDateString()}
                </div>
                {patient.health_concerns && patient.health_concerns.length > 0 && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Heart className="w-4 h-4 mr-2" />
                    {patient.health_concerns.length} health concern(s)
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'No patients match your search criteria.' : 'Get started by adding your first patient.'}
          </p>
          <Button onClick={() => setShowAddDialog(true)} className="btn-rustic">
            <Plus className="w-4 h-4 mr-2" />
            Add First Patient
          </Button>
        </div>
      )}
    </div>
  );
};

export default EnhancedPatientManagement;