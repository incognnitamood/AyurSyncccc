const mongoose = require('mongoose');

const doshaAnswerSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

const patientSchema = new mongoose.Schema({
  // Personal Information
  fullName: { type: String, required: true, trim: true },
  dateOfBirth: { type: Date, required: true },
  age: { type: Number, required: true },
  gender: { 
    type: String, 
    required: true, 
    enum: ['male', 'female', 'other'] 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: { type: String, required: true },
  occupation: { type: String, trim: true },
  
  // Physical Measurements
  weight: { type: Number, required: true, min: 20, max: 300 }, // in kg
  height: { type: Number, required: true, min: 100, max: 250 }, // in cm
  bmi: { type: Number, calculated: true },
  
  // Dosha Assessment
  doshaAnswers: [doshaAnswerSchema],
  primaryDosha: { 
    type: String, 
    enum: ['Vata', 'Pitta', 'Kapha', 'Vata-Pitta', 'Vata-Kapha', 'Pitta-Kapha', 'Tridosha', 'Pending'],
    default: 'Pending'
  },
  doshaScores: {
    vata: { type: Number, default: 0 },
    pitta: { type: Number, default: 0 },
    kapha: { type: Number, default: 0 }
  },
  
  // Health Information
  primaryConcerns: { type: String, required: true },
  currentSymptoms: [{ type: String }],
  medications: { type: String },
  allergies: { type: String },
  
  // Lifestyle & Diet
  mealFrequency: { 
    type: String, 
    enum: ['2-3', '3-4', '4-5+'],
    required: true 
  },
  waterIntake: { 
    type: String, 
    enum: ['4-6', '7-8', '9+'],
    required: true 
  },
  dietType: { 
    type: String, 
    enum: ['vegetarian', 'vegan', 'non-vegetarian'],
    required: true 
  },
  cookingSkills: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true 
  },
  cookingTime: { type: String },
  familySize: { type: Number, min: 1 },
  preferredCuisines: { type: String },
  
  // Health Metrics
  healthMetrics: {
    bloodPressure: { systolic: Number, diastolic: Number },
    heartRate: Number,
    energyLevel: { type: Number, min: 1, max: 10 },
    sleepQuality: { type: Number, min: 1, max: 10 },
    stressLevel: { type: Number, min: 1, max: 10 },
    digestiveHealth: { type: String, enum: ['Poor', 'Fair', 'Good', 'Excellent'] }
  },
  
  // Treatment & Progress
  treatmentGoals: [{ type: String }],
  progress: { type: Number, default: 0, min: 0, max: 100 },
  status: { 
    type: String, 
    enum: ['New', 'Active', 'Follow-up', 'Inactive'],
    default: 'New' 
  },
  lastVisit: { type: Date, default: Date.now },
  
  // Diet Plans
  dietPlans: [{
    planId: { type: mongoose.Schema.Types.ObjectId, ref: 'DietPlan' },
    startDate: Date,
    endDate: Date,
    isActive: { type: Boolean, default: false }
  }],
  
  // Additional Notes
  notes: { type: String },
  
  // Metadata
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calculate BMI before saving
patientSchema.pre('save', function(next) {
  if (this.weight && this.height) {
    this.bmi = Math.round((this.weight / Math.pow(this.height / 100, 2)) * 10) / 10;
  }
  next();
});

// Calculate dosha scores from answers
patientSchema.methods.calculateDoshaScores = function() {
  const scores = { vata: 0, pitta: 0, kapha: 0 };
  
  this.doshaAnswers.forEach(answer => {
    if (answer.answer === 'Vata') scores.vata++;
    else if (answer.answer === 'Pitta') scores.pitta++;
    else if (answer.answer === 'Kapha') scores.kapha++;
  });
  
  this.doshaScores = scores;
  
  // Determine primary dosha
  const maxScore = Math.max(scores.vata, scores.pitta, scores.kapha);
  const dominantDoshas = [];
  
  if (scores.vata === maxScore) dominantDoshas.push('Vata');
  if (scores.pitta === maxScore) dominantDoshas.push('Pitta');
  if (scores.kapha === maxScore) dominantDoshas.push('Kapha');
  
  this.primaryDosha = dominantDoshas.length === 1 ? dominantDoshas[0] : 
                     dominantDoshas.length === 2 ? dominantDoshas.join('-') : 'Tridosha';
  
  return this.primaryDosha;
};

// Virtual for age calculation
patientSchema.virtual('calculatedAge').get(function() {
  if (this.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  return null;
});

// Index for better query performance
patientSchema.index({ email: 1 });
patientSchema.index({ primaryDosha: 1 });
patientSchema.index({ status: 1 });
patientSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Patient', patientSchema);
