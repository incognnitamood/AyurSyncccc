const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  note: { type: String }
});

const nutritionSchema = new mongoose.Schema({
  calories: { type: Number, required: true },
  protein_g: { type: Number, required: true },
  carbs_g: { type: Number, required: true },
  fat_g: { type: Number, required: true },
  fiber_g: { type: Number, required: true },
  vitamins: [{ type: String }],
  minerals: {
    Iron: String,
    Calcium: String,
    Magnesium: String
  },
  glycemic_index: { type: Number, min: 0, max: 100 },
  nutrient_density_score: { type: Number, min: 0, max: 100 }
});

const ayurvedicPropertiesSchema = new mongoose.Schema({
  rasa: [{ type: String, enum: ['Sweet', 'Sour', 'Salty', 'Bitter', 'Pungent', 'Astringent'] }],
  virya: { type: String, enum: ['Hot', 'Cold', 'Neutral'] },
  vipaka: { type: String, enum: ['Sweet', 'Sour', 'Pungent'] },
  prabhava: { type: String },
  dosha_effect: {
    Vata: { type: String, enum: ['↓', '↑', 'neutral'] },
    Pitta: { type: String, enum: ['↓', '↑', 'neutral'] },
    Kapha: { type: String, enum: ['↓', '↑', 'neutral'] }
  },
  guna: [{ type: String }],
  guna_properties: { type: String }
});

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { 
    type: String, 
    required: true,
    enum: ['Breakfast', 'Main Course', 'Dessert', 'Side Dish', 'Soup', 'Salad', 'Beverage', 'Snack']
  },
  cuisine: { 
    type: String, 
    required: true,
    enum: ['Indian', 'Global', 'Beverage', 'Traditional']
  },
  ingredients: [ingredientSchema],
  instructions: [{ type: String, required: true }],
  ayurvedic_properties: ayurvedicPropertiesSchema,
  health_benefits: [{ type: String }],
  nutrition_profile: nutritionSchema,
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  prepTime: { type: Number }, // in minutes
  cookTime: { type: Number }, // in minutes
  servings: { type: Number, default: 1 },
  tags: [{ type: String }],
  
  // AI and Analysis
  aiGenerated: { type: Boolean, default: false },
  popularityScore: { type: Number, default: 0 },
  lastUsed: { type: Date },
  usageCount: { type: Number, default: 0 },
  
  // Metadata
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total time
recipeSchema.virtual('totalTime').get(function() {
  return (this.prepTime || 0) + (this.cookTime || 0);
});

// Index for better query performance
recipeSchema.index({ name: 'text', type: 'text', cuisine: 'text' });
recipeSchema.index({ type: 1 });
recipeSchema.index({ cuisine: 1 });
recipeSchema.index({ 'ayurvedic_properties.dosha_effect.Vata': 1 });
recipeSchema.index({ 'ayurvedic_properties.dosha_effect.Pitta': 1 });
recipeSchema.index({ 'ayurvedic_properties.dosha_effect.Kapha': 1 });
recipeSchema.index({ difficulty: 1 });
recipeSchema.index({ isActive: 1 });

// Method to check if recipe is suitable for a dosha
recipeSchema.methods.isSuitableForDosha = function(dosha) {
  if (!this.ayurvedic_properties.dosha_effect) return true;
  
  const effect = this.ayurvedic_properties.dosha_effect[dosha];
  return effect === '↓' || effect === 'neutral';
};

// Method to get dosha compatibility score
recipeSchema.methods.getDoshaCompatibility = function(dosha) {
  if (!this.ayurvedic_properties.dosha_effect) return 0.5;
  
  const effect = this.ayurvedic_properties.dosha_effect[dosha];
  switch (effect) {
    case '↓': return 1.0; // Highly beneficial
    case 'neutral': return 0.7; // Neutral/good
    case '↑': return 0.2; // Should be avoided
    default: return 0.5;
  }
};

module.exports = mongoose.model('Recipe', recipeSchema);
