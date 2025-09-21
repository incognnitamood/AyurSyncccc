const express = require('express');
const router = express.Router();
const {
  generateDietPlan,
  getAllDietPlans,
  getDietPlanById,
  updateDietPlan,
  deleteDietPlan,
  markDayCompleted,
  getDietPlanStats,
  getRecipeSuggestions,
  regenerateDietPlan
} = require('../controllers/dietPlanController');
const { authenticateToken, requirePractitioner } = require('../middleware/auth');
const {
  validateDietPlan,
  validateObjectId,
  validatePagination
} = require('../middleware/validation');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/diet-plans - Get all diet plans with filtering
router.get('/', validatePagination, getAllDietPlans);

// GET /api/diet-plans/stats - Get diet plan statistics
router.get('/stats', getDietPlanStats);

// GET /api/diet-plans/:id - Get single diet plan by ID
router.get('/:id', validateObjectId('id'), getDietPlanById);

// POST /api/diet-plans/generate/:patientId - Generate AI diet plan for patient
router.post('/generate/:patientId', requirePractitioner, validateObjectId('patientId'), generateDietPlan);

// POST /api/diet-plans/:planId/regenerate - Regenerate existing diet plan
router.post('/:planId/regenerate', requirePractitioner, validateObjectId('planId'), regenerateDietPlan);

// PUT /api/diet-plans/:id - Update diet plan
router.put('/:id', requirePractitioner, validateObjectId('id'), updateDietPlan);

// DELETE /api/diet-plans/:id - Delete diet plan
router.delete('/:id', requirePractitioner, validateObjectId('id'), deleteDietPlan);

// POST /api/diet-plans/:planId/complete/:dayIndex - Mark day as completed
router.post('/:planId/complete/:dayIndex', validateObjectId('planId'), markDayCompleted);

// GET /api/diet-plans/suggestions/:patientId - Get recipe suggestions for patient
router.get('/suggestions/:patientId', validateObjectId('patientId'), getRecipeSuggestions);

module.exports = router;
