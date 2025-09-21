const express = require('express');
const router = express.Router();
const {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeStats,
  getRecipesByDosha,
  analyzeRecipesNutrition,
  getPopularRecipes
} = require('../controllers/recipeController');
const { authenticateToken, requirePractitioner } = require('../middleware/auth');
const {
  validateRecipe,
  validateObjectId,
  validatePagination,
  validateSearch
} = require('../middleware/validation');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/recipes - Get all recipes with filtering and pagination
router.get('/', validatePagination, validateSearch, getAllRecipes);

// GET /api/recipes/stats - Get recipe statistics
router.get('/stats', getRecipeStats);

// GET /api/recipes/popular - Get popular recipes
router.get('/popular', getPopularRecipes);

// GET /api/recipes/dosha/:dosha - Get recipes suitable for specific dosha
router.get('/dosha/:dosha', getRecipesByDosha);

// GET /api/recipes/:id - Get single recipe by ID
router.get('/:id', validateObjectId('id'), getRecipeById);

// POST /api/recipes - Create new recipe
router.post('/', requirePractitioner, validateRecipe, createRecipe);

// POST /api/recipes/analyze - Analyze nutrition of multiple recipes
router.post('/analyze', analyzeRecipesNutrition);

// PUT /api/recipes/:id - Update recipe
router.put('/:id', requirePractitioner, validateObjectId('id'), updateRecipe);

// DELETE /api/recipes/:id - Delete recipe
router.delete('/:id', requirePractitioner, validateObjectId('id'), deleteRecipe);

module.exports = router;
