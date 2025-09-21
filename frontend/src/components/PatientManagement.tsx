import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
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
  AlertCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import apiService from '../services/api';

const initialPatients = [
  {
    id: 1,
    name: "Sarah Johnson",
    age: 34,
    email: "sarah.j@email.com",
    phone: "+1 (555) 123-4567",
    dosha: "Vata-Pitta",
    lastVisit: "2024-01-15",
    status: "Active",
    avatar: "/api/placeholder/32/32",
    goals: "Weight management, digestive health",
    progress: 78
  },
  {
    id: 2,
    name: "Michael Chen",
    age: 42,
    email: "m.chen@email.com",
    phone: "+1 (555) 234-5678",
    dosha: "Pitta",
    lastVisit: "2024-01-12",
    status: "Follow-up",
    avatar: "/api/placeholder/32/32",
    goals: "Energy balance, stress management",
    progress: 85
  },
  {
    id: 3,
    name: "Emma Davis",
    age: 28,
    email: "emma.davis@email.com",
    phone: "+1 (555) 345-6789",
    dosha: "Kapha",
    lastVisit: "2024-01-10",
    status: "Active",
    avatar: "/api/placeholder/32/32",
    goals: "Metabolism boost, immunity",
    progress: 62
  }
];

const doshaQualities = {
  "Vata": {
    color: "bg-[#9E7E3D]/10 text-[#9E7E3D] border-[#9E7E3D]/20",
    qualities: ["Light", "Dry", "Cold", "Rough", "Subtle", "Mobile"],
    description: "Governs movement and communication"
  },
  "Pitta": {
    color: "bg-[#F5C24D]/20 text-[#9E7E3D] border-[#F5C24D]/30",
    qualities: ["Hot", "Sharp", "Light", "Oily", "Liquid", "Spreading"],
    description: "Governs digestion and metabolism"
  },
  "Kapha": {
    color: "bg-[#4C7A5A]/20 text-[#9E7E3D] border-[#4C7A5A]/30",
    qualities: ["Heavy", "Slow", "Cold", "Oily", "Smooth", "Dense"],
    description: "Governs structure and immunity"
  }
};

const healthMetrics = [
  { label: "BMI", value: "22.4", target: "18.5-24.9", status: "normal" },
  { label: "Blood Pressure", value: "118/76", target: "<120/80", status: "normal" },
  { label: "Energy Level", value: "7/10", target: "8+", status: "improving" },
  { label: "Digestive Health", value: "Good", target: "Excellent", status: "improving" },
  { label: "Sleep Quality", value: "8/10", target: "8+", status: "normal" },
  { label: "Stress Level", value: "4/10", target: "<3", status: "attention" }
];

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

const symptomsChecklist = [
  "Digestive issues",
  "Energy levels",
  "Sleep problems",
  "Stress/anxiety",
  "Weight concerns"
];

const PatientForm = ({ onSave, saving = false }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    dob: '',
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
    mealFrequency: '',
    waterIntake: '',
    cookingSkills: '',
    cookingTime: '',
    familySize: '',
    dietType: '',
    preferredCuisines: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (symptom) => {
    setFormData(prev => ({
      ...prev,
      currentSymptoms: prev.currentSymptoms.includes(symptom)
        ? prev.currentSymptoms.filter(s => s !== symptom)
        : [...prev.currentSymptoms, symptom]
    }));
  };

  const handleDoshaAnswer = (question, value) => {
    setFormData(prev => ({
      ...prev,
      doshaAnswers: { ...prev.doshaAnswers, [question]: value }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Personal Details */}
        <Card className="card-rustic col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader><CardTitle className="text-[#9E7E3D] flex items-center"><User className="w-5 h-5 mr-2 text-[#F5C24D]" />Personal Information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={(value) => handleSelectChange('gender', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input id="occupation" name="occupation" value={formData.occupation} onChange={handleChange} placeholder="Software Engineer" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" name="weight" type="number" value={formData.weight} onChange={handleChange} placeholder="e.g., 70" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" name="height" type="number" value={formData.height} onChange={handleChange} placeholder="e.g., 175" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="patient@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+1 (123) 456-7890" />
            </div>
          </CardContent>
        </Card>

        {/* Dosha Determination */}
        <Card className="card-rustic col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader><CardTitle className="text-[#9E7E3D] flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-[#F5C24D]" />Dosha Assessment</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doshaQuestions.map((q, index) => (
              <div key={index} className="space-y-2">
                <Label>{`${index + 1}. ${q.question}`}</Label>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant="outline"
                      onClick={() => handleDoshaAnswer(q.question, option.value)}
                      className={`
                        border-[#9E7E3D]/20 text-[#4C7A5A] hover:bg-[#E1D1A5]/30
                        ${formData.doshaAnswers[q.question] === option.value ? 'bg-[#F5C24D]/30 border-[#F5C24D] text-[#9E7E3D] font-medium' : ''}
                      `}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Health & Diet */}
        <Card className="card-rustic col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader><CardTitle className="text-[#9E7E3D] flex items-center"><Heart className="w-5 h-5 mr-2 text-[#F5C24D]" />Health & Diet</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryConcerns">Primary Health Concerns</Label>
              <Textarea id="primaryConcerns" name="primaryConcerns" value={formData.primaryConcerns} onChange={handleChange} placeholder="e.g., Chronic fatigue, digestive issues, joint pain" />
            </div>
            <div className="space-y-2">
              <Label>Current Symptoms</Label>
              <div className="space-y-2">
                {symptomsChecklist.map((symptom, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`symptom-${index}`}
                      checked={formData.currentSymptoms.includes(symptom)}
                      onCheckedChange={() => handleCheckboxChange(symptom)}
                    />
                    <Label htmlFor={`symptom-${index}`}>{symptom}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="medications">Current Medications/Supplements</Label>
              <Textarea id="medications" name="medications" value={formData.medications} onChange={handleChange} placeholder="List any medications or supplements" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allergies">Food Allergies/Restrictions</Label>
              <Textarea id="allergies" name="allergies" value={formData.allergies} onChange={handleChange} placeholder="e.g., Gluten intolerance, dairy-free" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mealFrequency">Meal Frequency</Label>
              <Select onValueChange={(value) => handleSelectChange('mealFrequency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2-3">2-3 meals per day</SelectItem>
                  <SelectItem value="3-4">3-4 meals per day</SelectItem>
                  <SelectItem value="4-5+">4-5+ meals per day</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="waterIntake">Water Intake</Label>
              <Select onValueChange={(value) => handleSelectChange('waterIntake', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select intake" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4-6">4-6 glasses per day</SelectItem>
                  <SelectItem value="7-8">7-8 glasses per day</SelectItem>
                  <SelectItem value="9+">9+ glasses per day</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dietType">Diet Type</Label>
              <Select onValueChange={(value) => handleSelectChange('dietType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="non-vegetarian">Non-vegetarian</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cookingSkills">Cooking Skills</Label>
              <Select onValueChange={(value) => handleSelectChange('cookingSkills', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="btn-rustic" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Patient'
          )}
        </Button>
      </div>
    </form>
  );
};

export function PatientManagement() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Patient history state
  const [patientHistory, setPatientHistory] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  
  // AI Diet plan state
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [dietPlan, setDietPlan] = useState(null);
  const [showDietPlanDialog, setShowDietPlanDialog] = useState(false);

  // Load patients from backend on component mount
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getPatients();
      setPatients(response.data.patients || []);
      
      // Select first patient if available
      if (response.data.patients && response.data.patients.length > 0) {
        setSelectedPatientId(response.data.patients[0]._id);
      }
    } catch (error) {
      console.error('Failed to load patients:', error);
      setError('Backend server is not running. Using demo data. Please start the backend server for full functionality.');
      // Fallback to initial patients for demo
      setPatients(initialPatients);
      if (initialPatients.length > 0) {
        setSelectedPatientId(initialPatients[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient => {
    const name = patient.fullName || patient.name || '';
    const dosha = patient.primaryDosha || patient.dosha || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           dosha.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const currentPatient = patients.find(p => 
    (p._id && p._id === selectedPatientId) || 
    (p.id && p.id === selectedPatientId)
  ) || patients[0] || null;

  const handleSavePatient = async (newPatientData) => {
    try {
      setSaving(true);
      setError(null);

      // Calculate age from date of birth
      const age = new Date().getFullYear() - new Date(newPatientData.dob).getFullYear();

      // Prepare patient data for backend
      const patientData = {
        ...newPatientData,
        age: age,
        dateOfBirth: newPatientData.dob,
        // Convert dosha answers to the format expected by backend
        doshaAnswers: Object.entries(newPatientData.doshaAnswers).map(([question, answer]) => ({
          question,
          answer
        }))
      };

      // Save to backend
      const response = await apiService.createPatient(patientData);
      
      // Update local state
      setPatients(prevPatients => [...prevPatients, response.data]);
      
      // Set the new patient as the currently selected one
      setSelectedPatientId(response.data._id);

      // Close the dialog
      setIsFormOpen(false);

      // Show success message
      console.log('Patient saved successfully:', response.data);
    } catch (error) {
      console.error('Failed to save patient:', error);
      setError('Failed to save patient. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleViewHistory = async () => {
    if (!currentPatient) return;
    
    try {
      setLoadingHistory(true);
      const patientId = currentPatient._id || currentPatient.id;
      const response = await apiService.getPatientHistory(patientId);
      setPatientHistory(response.data);
      setShowHistoryDialog(true);
    } catch (error) {
      console.error('Failed to load patient history:', error);
      setError('Failed to load patient history. Please try again.');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleGenerateDietPlan = async () => {
    if (!currentPatient) return;
    
    try {
      setGeneratingPlan(true);
      const patientId = currentPatient._id || currentPatient.id;
      
      // Generate personalized plan based on patient data
      const options = {
        duration: '7 days',
        patientAge: currentPatient.age,
        patientDosha: currentPatient.primaryDosha || currentPatient.dosha,
        healthConcerns: currentPatient.primaryConcerns || currentPatient.goals,
        allergies: currentPatient.allergies,
        dietType: currentPatient.dietType || 'vegetarian',
        weight: currentPatient.weight,
        height: currentPatient.height
      };
      
      const response = await apiService.generateDietPlan(patientId, options);
      setDietPlan(response.data);
      setShowDietPlanDialog(true);
    } catch (error) {
      console.error('Failed to generate diet plan:', error);
      setError('Failed to generate diet plan. Please try again.');
    } finally {
      setGeneratingPlan(false);
    }
  };

  const handlePatientClick = (patientId) => {
    // Ensure the patient doesn't disappear by properly setting the state
    setSelectedPatientId(patientId);
    // Clear any previous errors or states that might interfere
    setError(null);
    setPatientHistory(null);
    setDietPlan(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="animate-fade-in-up">
          <h1 className="text-2xl text-[#9E7E3D] mb-2 font-semibold">Patient Management</h1>
          <p className="text-[#4C7A5A]/80">Manage patient profiles and Ayurvedic assessments.</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="btn-rustic animate-slide-in-right" onClick={() => setIsFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[1000px] w-full max-h-[90vh] overflow-y-auto card-rustic p-6">
            <DialogHeader>
              <DialogTitle className="text-[#9E7E3D] text-2xl font-semibold">Add New Patient</DialogTitle>
              <DialogDescription className="text-[#4C7A5A]/80">
                Fill out the form below to create a new patient profile.
              </DialogDescription>
            </DialogHeader>
            {error && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <PatientForm onSave={handleSavePatient} saving={saving} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <Card className="card-rustic animate-slide-in-left">
          <CardHeader>
            <CardTitle className="text-[#9E7E3D] flex items-center">
              <User className="w-5 h-5 mr-2 text-[#F5C24D]" />
              Patients
            </CardTitle>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#9E7E3D]/50" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-[#9E7E3D]/20 focus:border-[#4C7A5A] bg-white transition-all duration-300 focus:shadow-md"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[#9E7E3D]" />
                <span className="ml-2 text-[#4C7A5A]">Loading patients...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-600 text-sm mb-4">{error}</p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>To fix this:</strong><br />
                    1. Open Command Prompt<br />
                    2. Run: <code>cd backend && node simple-server.js</code><br />
                    3. Keep that window open<br />
                    4. Refresh this page
                  </p>
                </div>
                <Button 
                  onClick={loadPatients} 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                >
                  Retry
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPatients.map((patient, index) => {
                  const patientId = patient._id || patient.id;
                  const patientName = patient.fullName || patient.name;
                  const patientDosha = patient.primaryDosha || patient.dosha;
                  const patientStatus = patient.status;
                  
                  return (
                    <div
                      key={patientId}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 animate-on-scroll ${
                        selectedPatientId === patientId
                          ? 'bg-gradient-to-r from-[#F5C24D]/20 to-[#4C7A5A]/20 border border-[#9E7E3D]/20 shadow-md'
                          : 'bg-[#E1D1A5]/30 hover:bg-[#F5C24D]/20 hover:shadow-sm'
                      }`}
                      onClick={() => handlePatientClick(patientId)}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10 ring-2 ring-[#F5C24D]/30">
                          <AvatarImage src={patient.avatar} />
                          <AvatarFallback className="bg-[#F5C24D] text-[#9E7E3D] font-medium">
                            {patientName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate text-[#9E7E3D] font-medium">{patientName}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className="text-xs bg-[#F5C24D]/30 text-[#9E7E3D] border-[#9E7E3D]/20">
                              {patientDosha}
                            </Badge>
                            <Badge
                              variant={patientStatus === 'Active' ? 'default' : 'secondary'}
                              className="text-xs bg-[#4C7A5A]/30 text-[#9E7E3D] border-[#9E7E3D]/20"
                            >
                              {patientStatus}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredPatients.length === 0 && !loading && (
                  <div className="text-center py-8 text-[#4C7A5A]/70">
                    No patients found
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Patient Details */}
        <div className="lg:col-span-2 space-y-6">
          {currentPatient ? (
            <Card className="card-rustic animate-slide-in-right">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16 border-2 border-[#F5C24D]/30">
                      <AvatarImage src={currentPatient.avatar} />
                      <AvatarFallback className="bg-[#F5C24D] text-[#9E7E3D] text-lg font-semibold">
                        {(currentPatient?.fullName || currentPatient?.name || '').split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl text-[#9E7E3D] font-semibold">{currentPatient?.fullName || currentPatient?.name}</h3>
                      <p className="text-[#4C7A5A]/80">Age: {currentPatient?.age}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-[#4C7A5A]/70">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-1 text-[#F5C24D]" />
                          {currentPatient?.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-1 text-[#F5C24D]" />
                          {currentPatient?.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      className="btn-rustic-outline"
                      onClick={handleViewHistory}
                      disabled={loadingHistory}
                    >
                      {loadingHistory ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <FileText className="w-4 h-4 mr-2" />
                      )}
                      View History
                    </Button>
                    <Button 
                      className="btn-rustic"
                      onClick={handleGenerateDietPlan}
                      disabled={generatingPlan}
                    >
                      {generatingPlan ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Target className="w-4 h-4 mr-2" />
                      )}
                      Generate AI Diet Plan
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ) : (
            <Card className="card-rustic animate-slide-in-right">
              <CardContent className="p-8 text-center">
                <div className="text-center py-8">
                  <User className="w-16 h-16 text-[#9E7E3D]/50 mx-auto mb-4" />
                  <h3 className="text-xl text-[#9E7E3D] font-semibold mb-2">No Patient Selected</h3>
                  <p className="text-[#4C7A5A]/70 mb-4">Select a patient from the list or add a new patient to get started.</p>
                  <Button 
                    className="btn-rustic" 
                    onClick={() => setIsFormOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Patient
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Tabs defaultValue="assessment" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-[#E1D1A5]/50 border border-[#9E7E3D]/20">
              <TabsTrigger value="assessment" className="data-[state=active]:bg-white data-[state=active]:text-[#9E7E3D] text-[#4C7A5A]/70 transition-all duration-300">
                Ayurvedic Assessment
              </TabsTrigger>
              <TabsTrigger value="metrics" className="data-[state=active]:bg-white data-[state=active]:text-[#9E7E3D] text-[#4C7A5A]/70 transition-all duration-300">
                Health Metrics
              </TabsTrigger>
              <TabsTrigger value="dosha" className="data-[state=active]:bg-white data-[state=active]:text-[#9E7E3D] text-[#4C7A5A]/70 transition-all duration-300">
                Dosha Analysis
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="assessment">
              <Card className="card-rustic animate-on-scroll">
                <CardHeader>
                  <CardTitle className="text-[#9E7E3D]">Current Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentPatient ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm text-[#4C7A5A]/70">Primary Dosha</label>
                          <Badge className={doshaQualities[(currentPatient?.primaryDosha || currentPatient?.dosha || '').split('-')[0]]?.color || 'bg-gray-100 text-gray-800'}>
                            {currentPatient?.primaryDosha || currentPatient?.dosha || 'Not assessed'}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-[#4C7A5A]/70">Treatment Goals</label>
                          <p className="text-sm text-[#9E7E3D]">{currentPatient?.primaryConcerns || currentPatient?.goals || 'No goals set'}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-[#4C7A5A]/70">Progress</label>
                          <div className="space-y-1">
                            <Progress value={currentPatient?.progress || 0} className="h-3 bg-[#E1D1A5]/50" />
                            <p className="text-sm text-[#4C7A5A]/70">{currentPatient?.progress || 0}% complete</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-[#4C7A5A]/70">Last Visit</label>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-[#F5C24D]" />
                            <span className="text-sm text-[#9E7E3D]">
                              {currentPatient?.lastVisit ? new Date(currentPatient.lastVisit).toLocaleDateString() : 'No visits recorded'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button className="w-full btn-rustic">
                        <Activity className="w-4 h-4 mr-2" />
                        Schedule New Assessment
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 text-[#9E7E3D]/50 mx-auto mb-4" />
                      <p className="text-[#4C7A5A]/70">Select a patient to view assessment details</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="metrics">
              <Card className="card-rustic animate-on-scroll">
                <CardHeader>
                  <CardTitle className="text-[#9E7E3D]">Health Metrics Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  {currentPatient ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-[#9E7E3D]/20 rounded-lg bg-gradient-to-br from-[#E1D1A5]/30 to-[#F5C24D]/10 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-[#4C7A5A]/70">BMI</span>
                          <Badge className="text-xs bg-[#F5C24D]/20 text-[#9E7E3D] border-[#9E7E3D]/20">
                            {currentPatient.weight && currentPatient.height ? 
                              ((currentPatient.weight / Math.pow(currentPatient.height / 100, 2)).toFixed(1) >= 18.5 && 
                               (currentPatient.weight / Math.pow(currentPatient.height / 100, 2)).toFixed(1) <= 24.9 ? 'normal' : 'attention') : 'unknown'}
                          </Badge>
                        </div>
                        <p className="text-lg text-[#9E7E3D] font-semibold">
                          {currentPatient.weight && currentPatient.height ? 
                            (currentPatient.weight / Math.pow(currentPatient.height / 100, 2)).toFixed(1) : 'N/A'}
                        </p>
                        <p className="text-xs text-[#4C7A5A]/60 mt-1">Target: 18.5-24.9</p>
                      </div>
                      
                      <div className="p-4 border border-[#9E7E3D]/20 rounded-lg bg-gradient-to-br from-[#E1D1A5]/30 to-[#F5C24D]/10 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-[#4C7A5A]/70">Weight</span>
                          <Badge className="text-xs bg-[#F5C24D]/20 text-[#9E7E3D] border-[#9E7E3D]/20">tracking</Badge>
                        </div>
                        <p className="text-lg text-[#9E7E3D] font-semibold">{currentPatient.weight ? `${currentPatient.weight} kg` : 'N/A'}</p>
                        <p className="text-xs text-[#4C7A5A]/60 mt-1">Height: {currentPatient.height ? `${currentPatient.height} cm` : 'N/A'}</p>
                      </div>
                      
                      <div className="p-4 border border-[#9E7E3D]/20 rounded-lg bg-gradient-to-br from-[#E1D1A5]/30 to-[#F5C24D]/10 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-[#4C7A5A]/70">Age</span>
                          <Badge className="text-xs bg-[#F5C24D]/20 text-[#9E7E3D] border-[#9E7E3D]/20">info</Badge>
                        </div>
                        <p className="text-lg text-[#9E7E3D] font-semibold">{currentPatient.age || 'N/A'} years</p>
                        <p className="text-xs text-[#4C7A5A]/60 mt-1">Gender: {currentPatient.gender || 'N/A'}</p>
                      </div>
                      
                      <div className="p-4 border border-[#9E7E3D]/20 rounded-lg bg-gradient-to-br from-[#E1D1A5]/30 to-[#F5C24D]/10 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-[#4C7A5A]/70">Dosha Balance</span>
                          <Badge className="text-xs bg-[#F5C24D]/20 text-[#9E7E3D] border-[#9E7E3D]/20">primary</Badge>
                        </div>
                        <p className="text-lg text-[#9E7E3D] font-semibold">{currentPatient.primaryDosha || currentPatient.dosha || 'Not assessed'}</p>
                        <p className="text-xs text-[#4C7A5A]/60 mt-1">Constitutional type</p>
                      </div>
                      
                      {currentPatient.currentSymptoms && currentPatient.currentSymptoms.length > 0 && (
                        <div className="p-4 border border-[#9E7E3D]/20 rounded-lg bg-gradient-to-br from-[#E1D1A5]/30 to-[#F5C24D]/10 hover:shadow-md transition-all duration-300 md:col-span-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-[#4C7A5A]/70">Current Symptoms</span>
                            <Badge className="text-xs bg-[#F5C24D]/20 text-[#9E7E3D] border-[#9E7E3D]/20">active</Badge>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {currentPatient.currentSymptoms.map((symptom, index) => (
                              <Badge key={index} variant="outline" className="text-xs border-[#9E7E3D]/30 text-[#9E7E3D]">
                                {symptom}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="w-12 h-12 text-[#9E7E3D]/50 mx-auto mb-4" />
                      <p className="text-[#4C7A5A]/70">Select a patient to view health metrics</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="dosha">
              <Card className="card-rustic animate-on-scroll">
                <CardHeader>
                  <CardTitle className="text-[#9E7E3D]">Dosha Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  {currentPatient ? (
                    <div className="space-y-6">
                      {/* Patient's Primary Dosha */}
                      <div className="p-6 border-2 border-[#F5C24D]/30 rounded-lg bg-gradient-to-r from-[#F5C24D]/10 to-[#E1D1A5]/20">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-xl text-[#9E7E3D] font-semibold">Your Primary Constitution</h4>
                          <Badge className={doshaQualities[(currentPatient.primaryDosha || currentPatient.dosha || '').split('-')[0]]?.color || 'bg-gray-100 text-gray-800'}>
                            {currentPatient.primaryDosha || currentPatient.dosha || 'Not assessed'}
                          </Badge>
                        </div>
                        <p className="text-[#4C7A5A]/80 mb-4">
                          {doshaQualities[(currentPatient.primaryDosha || currentPatient.dosha || '').split('-')[0]]?.description || 'Complete the dosha assessment to see your constitutional analysis.'}
                        </p>
                        
                        {currentPatient.primaryConcerns && (
                          <div className="mt-4 p-4 bg-white/50 rounded-lg">
                            <h5 className="text-sm font-medium text-[#9E7E3D] mb-2">Primary Health Concerns:</h5>
                            <p className="text-sm text-[#4C7A5A]/80">{currentPatient.primaryConcerns}</p>
                          </div>
                        )}
                      </div>
                      
                      {/* All Doshas Information */}
                      {Object.entries(doshaQualities).map(([dosha, info], index) => {
                        const isPatientDosha = (currentPatient.primaryDosha || currentPatient.dosha || '').includes(dosha);
                        return (
                          <div 
                            key={dosha} 
                            className={`p-4 border rounded-lg transition-all duration-300 ${
                              isPatientDosha 
                                ? 'border-[#F5C24D]/50 bg-gradient-to-r from-[#F5C24D]/20 to-[#E1D1A5]/30 shadow-md' 
                                : 'border-[#9E7E3D]/20 bg-gradient-to-r from-white to-[#E1D1A5]/20 hover:shadow-sm'
                            }`}
                            style={{ animationDelay: `${index * 0.2}s` }}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h4 className={`text-lg font-semibold ${
                                isPatientDosha ? 'text-[#9E7E3D]' : 'text-[#4C7A5A]'
                              }`}>
                                {dosha}
                                {isPatientDosha && <span className="ml-2 text-sm font-normal">(Your Dosha)</span>}
                              </h4>
                              <Badge className={info.color}>{dosha}</Badge>
                            </div>
                            <p className="text-sm text-[#4C7A5A]/80 mb-3">{info.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {info.qualities.map((quality, qualityIndex) => (
                                <Badge 
                                  key={qualityIndex} 
                                  variant="outline" 
                                  className={`text-xs transition-colors duration-200 ${
                                    isPatientDosha 
                                      ? 'border-[#F5C24D]/50 text-[#9E7E3D] hover:bg-[#F5C24D]/30' 
                                      : 'border-[#9E7E3D]/30 text-[#9E7E3D] hover:bg-[#F5C24D]/20'
                                  }`}
                                >
                                  {quality}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Recommendations based on dosha */}
                      {(currentPatient.primaryDosha || currentPatient.dosha) && (
                        <div className="p-4 border border-[#4C7A5A]/20 rounded-lg bg-gradient-to-r from-[#4C7A5A]/10 to-[#E1D1A5]/20">
                          <h4 className="text-lg text-[#9E7E3D] font-semibold mb-3">Lifestyle Recommendations</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-sm font-medium text-[#4C7A5A] mb-2">Diet Guidelines:</h5>
                              <ul className="text-sm text-[#4C7A5A]/80 list-disc list-inside space-y-1">
                                {(currentPatient.primaryDosha || currentPatient.dosha).includes('Vata') && (
                                  <>
                                    <li>Favor warm, cooked foods</li>
                                    <li>Regular meal times</li>
                                    <li>Avoid cold drinks</li>
                                  </>
                                )}
                                {(currentPatient.primaryDosha || currentPatient.dosha).includes('Pitta') && (
                                  <>
                                    <li>Favor cooling foods</li>
                                    <li>Avoid spicy, fried foods</li>
                                    <li>Eat at moderate pace</li>
                                  </>
                                )}
                                {(currentPatient.primaryDosha || currentPatient.dosha).includes('Kapha') && (
                                  <>
                                    <li>Favor light, warm foods</li>
                                    <li>Include spices and herbs</li>
                                    <li>Avoid heavy, oily foods</li>
                                  </>
                                )}
                              </ul>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-[#4C7A5A] mb-2">Lifestyle Tips:</h5>
                              <ul className="text-sm text-[#4C7A5A]/80 list-disc list-inside space-y-1">
                                {(currentPatient.primaryDosha || currentPatient.dosha).includes('Vata') && (
                                  <>
                                    <li>Maintain routine</li>
                                    <li>Practice grounding activities</li>
                                    <li>Stay warm and comfortable</li>
                                  </>
                                )}
                                {(currentPatient.primaryDosha || currentPatient.dosha).includes('Pitta') && (
                                  <>
                                    <li>Stay cool and calm</li>
                                    <li>Practice moderation</li>
                                    <li>Avoid excessive heat</li>
                                  </>
                                )}
                                {(currentPatient.primaryDosha || currentPatient.dosha).includes('Kapha') && (
                                  <>
                                    <li>Stay active and energized</li>
                                    <li>Embrace change and variety</li>
                                    <li>Avoid excessive rest</li>
                                  </>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <TrendingUp className="w-12 h-12 text-[#9E7E3D]/50 mx-auto mb-4" />
                      <p className="text-[#4C7A5A]/70">Select a patient to view dosha analysis</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Patient History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="sm:max-w-[800px] w-full max-h-[90vh] overflow-y-auto card-rustic p-6">
          <DialogHeader>
            <DialogTitle className="text-[#9E7E3D] text-xl font-semibold">
              Patient History - {currentPatient?.fullName || currentPatient?.name}
            </DialogTitle>
            <DialogDescription className="text-[#4C7A5A]/80">
              Complete medical history and visit records
            </DialogDescription>
          </DialogHeader>
          {patientHistory ? (
            <div className="space-y-6">
              {/* Visits */}
              <div>
                <h4 className="text-lg text-[#9E7E3D] font-semibold mb-4">Visit History</h4>
                <div className="space-y-3">
                  {patientHistory.visits.map((visit, index) => (
                    <div key={visit._id} className="p-4 border border-[#9E7E3D]/20 rounded-lg bg-gradient-to-br from-[#E1D1A5]/20 to-white">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-[#F5C24D]" />
                          <span className="font-medium text-[#9E7E3D]">{new Date(visit.date).toLocaleDateString()}</span>
                        </div>
                        <Badge className="bg-[#F5C24D]/20 text-[#9E7E3D] border-[#9E7E3D]/20">{visit.type}</Badge>
                      </div>
                      <p className="text-sm text-[#4C7A5A]/80 mb-2"><strong>Notes:</strong> {visit.notes}</p>
                      <p className="text-sm text-[#4C7A5A]/80 mb-2"><strong>Prescription:</strong> {visit.prescription}</p>
                      <p className="text-sm text-[#4C7A5A]/80"><strong>Follow-up:</strong> {new Date(visit.followUpDate).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Diet Plans */}
              <div>
                <h4 className="text-lg text-[#9E7E3D] font-semibold mb-4">Diet Plan History</h4>
                <div className="space-y-3">
                  {patientHistory.dietPlans.map((plan, index) => (
                    <div key={plan._id} className="p-4 border border-[#9E7E3D]/20 rounded-lg bg-gradient-to-br from-[#4C7A5A]/10 to-white">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-[#9E7E3D]">
                          {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                        </span>
                        <Badge className={plan.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {plan.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#4C7A5A]/80">Adherence: {plan.adherence}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Measurements */}
              <div>
                <h4 className="text-lg text-[#9E7E3D] font-semibold mb-4">Health Measurements</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {patientHistory.measurements.map((measurement, index) => (
                    <div key={index} className="p-4 border border-[#9E7E3D]/20 rounded-lg bg-gradient-to-br from-[#F5C24D]/10 to-white">
                      <div className="flex items-center mb-2">
                        <Heart className="w-4 h-4 mr-2 text-[#F5C24D]" />
                        <span className="font-medium text-[#9E7E3D]">{new Date(measurement.date).toLocaleDateString()}</span>
                      </div>
                      <div className="space-y-1 text-sm text-[#4C7A5A]/80">
                        <p>Weight: {measurement.weight}</p>
                        <p>BMI: {measurement.bmi}</p>
                        <p>BP: {measurement.bloodPressure}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-[#9E7E3D]/50 mx-auto mb-4" />
              <p className="text-[#4C7A5A]/70">No history data available</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Diet Plan Dialog */}
      <Dialog open={showDietPlanDialog} onOpenChange={setShowDietPlanDialog}>
        <DialogContent className="sm:max-w-[900px] w-full max-h-[90vh] overflow-y-auto card-rustic p-6">
          <DialogHeader>
            <DialogTitle className="text-[#9E7E3D] text-xl font-semibold">
              AI Generated Diet Plan - {dietPlan?.patientName}
            </DialogTitle>
            <DialogDescription className="text-[#4C7A5A]/80">
              Personalized {dietPlan?.duration} diet plan based on {dietPlan?.primaryDosha} dosha
            </DialogDescription>
          </DialogHeader>
          {dietPlan ? (
            <div className="space-y-6">
              {/* Plan Overview */}
              <div className="p-4 border border-[#F5C24D]/30 rounded-lg bg-gradient-to-r from-[#F5C24D]/10 to-[#E1D1A5]/20">
                <h4 className="text-lg text-[#9E7E3D] font-semibold mb-2">Plan Overview</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-[#4C7A5A]/70">Duration:</span>
                    <p className="font-medium text-[#9E7E3D]">{dietPlan.duration}</p>
                  </div>
                  <div>
                    <span className="text-[#4C7A5A]/70">Primary Dosha:</span>
                    <p className="font-medium text-[#9E7E3D]">{dietPlan.primaryDosha}</p>
                  </div>
                  <div>
                    <span className="text-[#4C7A5A]/70">Status:</span>
                    <Badge className="bg-green-100 text-green-800">{dietPlan.status}</Badge>
                  </div>
                  <div>
                    <span className="text-[#4C7A5A]/70">Created:</span>
                    <p className="font-medium text-[#9E7E3D]">{new Date(dietPlan.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              {/* Meal Plans */}
              <div>
                <h4 className="text-lg text-[#9E7E3D] font-semibold mb-4">Daily Meal Plans</h4>
                <div className="space-y-4">
                  {dietPlan.meals.map((dayPlan, index) => (
                    <div key={dayPlan.day} className="p-4 border border-[#9E7E3D]/20 rounded-lg bg-gradient-to-br from-white to-[#E1D1A5]/20">
                      <h5 className="font-semibold text-[#9E7E3D] mb-3">Day {dayPlan.day}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-3 border border-[#F5C24D]/20 rounded-lg bg-[#F5C24D]/5">
                          <h6 className="text-sm font-medium text-[#9E7E3D] mb-1">Breakfast</h6>
                          <p className="text-sm text-[#4C7A5A]/80">{dayPlan.breakfast.name}</p>
                          <p className="text-xs text-[#4C7A5A]/60">{dayPlan.breakfast.time}</p>
                        </div>
                        <div className="p-3 border border-[#4C7A5A]/20 rounded-lg bg-[#4C7A5A]/5">
                          <h6 className="text-sm font-medium text-[#9E7E3D] mb-1">Lunch</h6>
                          <p className="text-sm text-[#4C7A5A]/80">{dayPlan.lunch.name}</p>
                          <p className="text-xs text-[#4C7A5A]/60">{dayPlan.lunch.time}</p>
                        </div>
                        <div className="p-3 border border-[#F5C24D]/20 rounded-lg bg-[#F5C24D]/5">
                          <h6 className="text-sm font-medium text-[#9E7E3D] mb-1">Dinner</h6>
                          <p className="text-sm text-[#4C7A5A]/80">{dayPlan.dinner.name}</p>
                          <p className="text-xs text-[#4C7A5A]/60">{dayPlan.dinner.time}</p>
                        </div>
                        <div className="p-3 border border-[#9E7E3D]/20 rounded-lg bg-[#E1D1A5]/20">
                          <h6 className="text-sm font-medium text-[#9E7E3D] mb-1">Snack</h6>
                          <p className="text-sm text-[#4C7A5A]/80">{dayPlan.snack.name}</p>
                          <p className="text-xs text-[#4C7A5A]/60">{dayPlan.snack.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Guidelines */}
              <div>
                <h4 className="text-lg text-[#9E7E3D] font-semibold mb-4">Personalized Guidelines</h4>
                <div className="p-4 border border-[#4C7A5A]/20 rounded-lg bg-gradient-to-br from-[#4C7A5A]/10 to-white">
                  <ul className="space-y-2">
                    {dietPlan.guidelines.map((guideline, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-[#F5C24D] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-sm text-[#4C7A5A]/80">{guideline}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDietPlanDialog(false)}
                  className="border-[#9E7E3D]/20 text-[#4C7A5A] hover:bg-[#E1D1A5]/30"
                >
                  Close
                </Button>
                <Button className="btn-rustic">
                  <Target className="w-4 h-4 mr-2" />
                  Start Plan
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-[#9E7E3D]/50 mx-auto mb-4" />
              <p className="text-[#4C7A5A]/70">No diet plan data available</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}