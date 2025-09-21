const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  mealType: { 
    type: String, 
    required: true,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Beverage']
  },
  time: { type: String, required: true }, // e.g., "08:00", "13:00"
  recipes: [{
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    quantity: { type: Number, default: 1 }, // servings
    notes: { type: String }
  }],
  totalNutrition: {
    calories: { type: Number, default: 0 },
    protein_g: { type: Number, default: 0 },
    carbs_g: { type: Number, default: 0 },
    fat_g: { type: Number, default: 0 },
    fiber_g: { type: Number, default: 0 }
  }
});

const dayPlanSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  dayOfWeek: { 
    type: String, 
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  meals: [mealSchema],
  totalNutrition: {
    calories: { type: Number, default: 0 },
    protein_g: { type: Number, default: 0 },
    carbs_g: { type: Number, default: 0 },
    fat_g: { type: Number, default: 0 },
    fiber_g: { type: Number, default: 0 }
  },
  notes: { type: String },
  isCompleted: { type: Boolean, default: false }
});

const dietPlanSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  
  // Patient Information
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  
  // Plan Configuration
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  duration: { type: Number, required: true }, // in days
  
  // Daily Plans
  dailyPlans: [dayPlanSchema],
  
  // Plan Settings
  targetCalories: { type: Number, required: true },
  targetProtein: { type: Number }, // in grams
  targetCarbs: { type: Number }, // in grams
  targetFat: { type: Number }, // in grams
  
  // Ayurvedic Considerations
  primaryDosha: { 
    type: String, 
    required: true,
    enum: ['Vata', 'Pitta', 'Kapha', 'Vata-Pitta', 'Vata-Kapha', 'Pitta-Kapha', 'Tridosha']
  },
  doshaBalance: {
    vata: { type: Number, min: 0, max: 1 },
    pitta: { type: Number, min: 0, max: 1 },
    kapha: { type: Number, min: 0, max: 1 }
  },
  
  // Health Goals
  healthGoals: [{ type: String }],
  restrictions: [{ type: String }], // allergies, dietary restrictions
  
  // AI Generation Details
  aiGenerated: { type: Boolean, default: true },
  generationPrompt: { type: String },
  aiModel: { type: String, default: 'gpt-4' },
  generationDate: { type: Date, default: Date.now },
  
  // Plan Status
  status: { 
    type: String, 
    enum: ['Draft', 'Active', 'Completed', 'Paused', 'Cancelled'],
    default: 'Draft'
  },
  
  // Progress Tracking
  progress: {
    completedDays: { type: Number, default: 0 },
    totalDays: { type: Number, required: true },
    adherenceRate: { type: Number, default: 0 }, // percentage
    lastUpdated: { type: Date, default: Date.now }
  },
  
  // Feedback and Adjustments
  feedback: [{
    date: { type: Date, default: Date.now },
    rating: { type: Number, min: 1, max: 5 },
    comments: { type: String },
    symptoms: [{ type: String }],
    energyLevel: { type: Number, min: 1, max: 10 },
    satisfaction: { type: Number, min: 1, max: 10 }
  }],
  
  // Modifications
  modifications: [{
    date: { type: Date, default: Date.now },
    reason: { type: String },
    changes: { type: String },
    modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  
  // Metadata
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for plan duration in days
dietPlanSchema.virtual('planDuration').get(function() {
  const diffTime = Math.abs(this.endDate - this.startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for completion percentage
dietPlanSchema.virtual('completionPercentage').get(function() {
  if (this.progress.totalDays === 0) return 0;
  return Math.round((this.progress.completedDays / this.progress.totalDays) * 100);
});

// Method to calculate total nutrition for the plan
dietPlanSchema.methods.calculateTotalNutrition = function() {
  let totalNutrition = {
    calories: 0,
    protein_g: 0,
    carbs_g: 0,
    fat_g: 0,
    fiber_g: 0
  };
  
  this.dailyPlans.forEach(day => {
    totalNutrition.calories += day.totalNutrition.calories;
    totalNutrition.protein_g += day.totalNutrition.protein_g;
    totalNutrition.carbs_g += day.totalNutrition.carbs_g;
    totalNutrition.fat_g += day.totalNutrition.fat_g;
    totalNutrition.fiber_g += day.totalNutrition.fiber_g;
  });
  
  return totalNutrition;
};

// Method to update progress
dietPlanSchema.methods.updateProgress = function() {
  const completedDays = this.dailyPlans.filter(day => day.isCompleted).length;
  this.progress.completedDays = completedDays;
  this.progress.adherenceRate = this.progress.totalDays > 0 ? 
    Math.round((completedDays / this.progress.totalDays) * 100) : 0;
  this.progress.lastUpdated = new Date();
};

// Pre-save middleware to calculate nutrition totals
dietPlanSchema.pre('save', function(next) {
  // Calculate total nutrition for each day
  this.dailyPlans.forEach(day => {
    let dayNutrition = {
      calories: 0,
      protein_g: 0,
      carbs_g: 0,
      fat_g: 0,
      fiber_g: 0
    };
    
    day.meals.forEach(meal => {
      dayNutrition.calories += meal.totalNutrition.calories;
      dayNutrition.protein_g += meal.totalNutrition.protein_g;
      dayNutrition.carbs_g += meal.totalNutrition.carbs_g;
      dayNutrition.fat_g += meal.totalNutrition.fat_g;
      dayNutrition.fiber_g += meal.totalNutrition.fiber_g;
    });
    
    day.totalNutrition = dayNutrition;
  });
  
  // Update progress
  this.updateProgress();
  
  next();
});

// Index for better query performance
dietPlanSchema.index({ patientId: 1 });
dietPlanSchema.index({ status: 1 });
dietPlanSchema.index({ startDate: 1, endDate: 1 });
dietPlanSchema.index({ primaryDosha: 1 });
dietPlanSchema.index({ createdAt: -1 });

module.exports = mongoose.model('DietPlan', dietPlanSchema);
