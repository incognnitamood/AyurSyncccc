const { body, param, query, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Patient validation rules
const validatePatient = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Date of birth must be a valid date')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 0 || age > 120) {
        throw new Error('Age must be between 0 and 120 years');
      }
      return true;
    }),
  
  body('gender')
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),
  
  body('phone')
    .isMobilePhone()
    .withMessage('Must be a valid phone number'),
  
  body('weight')
    .isFloat({ min: 20, max: 300 })
    .withMessage('Weight must be between 20 and 300 kg'),
  
  body('height')
    .isFloat({ min: 100, max: 250 })
    .withMessage('Height must be between 100 and 250 cm'),
  
  body('mealFrequency')
    .isIn(['2-3', '3-4', '4-5+'])
    .withMessage('Meal frequency must be 2-3, 3-4, or 4-5+'),
  
  body('waterIntake')
    .isIn(['4-6', '7-8', '9+'])
    .withMessage('Water intake must be 4-6, 7-8, or 9+ glasses'),
  
  body('dietType')
    .isIn(['vegetarian', 'vegan', 'non-vegetarian'])
    .withMessage('Diet type must be vegetarian, vegan, or non-vegetarian'),
  
  body('cookingSkills')
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Cooking skills must be beginner, intermediate, or advanced'),
  
  body('primaryConcerns')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Primary concerns must be between 10 and 500 characters'),
  
  handleValidationErrors
];

// Patient update validation (all fields optional)
const validatePatientUpdate = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid date'),
  
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),
  
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Must be a valid phone number'),
  
  body('weight')
    .optional()
    .isFloat({ min: 20, max: 300 })
    .withMessage('Weight must be between 20 and 300 kg'),
  
  body('height')
    .optional()
    .isFloat({ min: 100, max: 250 })
    .withMessage('Height must be between 100 and 250 cm'),
  
  handleValidationErrors
];

// Diet plan validation
const validateDietPlan = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Plan name must be between 3 and 100 characters'),
  
  body('patientId')
    .isMongoId()
    .withMessage('Patient ID must be a valid MongoDB ObjectId'),
  
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  
  body('duration')
    .isInt({ min: 1, max: 365 })
    .withMessage('Duration must be between 1 and 365 days'),
  
  body('targetCalories')
    .isInt({ min: 800, max: 5000 })
    .withMessage('Target calories must be between 800 and 5000'),
  
  body('primaryDosha')
    .isIn(['Vata', 'Pitta', 'Kapha', 'Vata-Pitta', 'Vata-Kapha', 'Pitta-Kapha', 'Tridosha'])
    .withMessage('Primary dosha must be a valid dosha type'),
  
  handleValidationErrors
];

// Recipe validation
const validateRecipe = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Recipe name must be between 2 and 100 characters'),
  
  body('type')
    .isIn(['Breakfast', 'Main Course', 'Dessert', 'Side Dish', 'Soup', 'Salad', 'Beverage', 'Snack'])
    .withMessage('Recipe type must be a valid meal type'),
  
  body('cuisine')
    .isIn(['Indian', 'Global', 'Beverage', 'Traditional'])
    .withMessage('Cuisine must be a valid cuisine type'),
  
  body('ingredients')
    .isArray({ min: 1 })
    .withMessage('Recipe must have at least one ingredient'),
  
  body('ingredients.*.name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Ingredient name must be between 1 and 50 characters'),
  
  body('ingredients.*.quantity')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Ingredient quantity must be between 1 and 20 characters'),
  
  body('instructions')
    .isArray({ min: 1 })
    .withMessage('Recipe must have at least one instruction'),
  
  body('instructions.*')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Each instruction must be between 10 and 500 characters'),
  
  body('nutrition_profile.calories')
    .isInt({ min: 0, max: 2000 })
    .withMessage('Calories must be between 0 and 2000'),
  
  body('nutrition_profile.protein_g')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Protein must be between 0 and 100 grams'),
  
  body('nutrition_profile.carbs_g')
    .isFloat({ min: 0, max: 200 })
    .withMessage('Carbs must be between 0 and 200 grams'),
  
  body('nutrition_profile.fat_g')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Fat must be between 0 and 100 grams'),
  
  handleValidationErrors
];

// MongoDB ObjectId validation
const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`${paramName} must be a valid MongoDB ObjectId`),
  handleValidationErrors
];

// Pagination validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

// Search validation
const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validatePatient,
  validatePatientUpdate,
  validateDietPlan,
  validateRecipe,
  validateObjectId,
  validatePagination,
  validateSearch
};
