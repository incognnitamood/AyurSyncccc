const express = require('express');
const router = express.Router();
const {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientStats,
  getPatientsByDosha
} = require('../controllers/patientController');
const { authenticateToken, requirePractitioner } = require('../middleware/auth');
const {
  validatePatient,
  validatePatientUpdate,
  validateObjectId,
  validatePagination,
  validateSearch
} = require('../middleware/validation');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/patients - Get all patients with pagination and filtering
router.get('/', validatePagination, validateSearch, getAllPatients);

// GET /api/patients/stats - Get patient statistics
router.get('/stats', getPatientStats);

// GET /api/patients/dosha/:dosha - Get patients by dosha
router.get('/dosha/:dosha', getPatientsByDosha);

// GET /api/patients/:id - Get single patient by ID
router.get('/:id', validateObjectId('id'), getPatientById);

// POST /api/patients - Create new patient
router.post('/', requirePractitioner, validatePatient, createPatient);

// PUT /api/patients/:id - Update patient
router.put('/:id', requirePractitioner, validateObjectId('id'), validatePatientUpdate, updatePatient);

// DELETE /api/patients/:id - Delete patient
router.delete('/:id', requirePractitioner, validateObjectId('id'), deletePatient);

module.exports = router;
