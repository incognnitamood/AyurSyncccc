const Patient = require('../models/Patient');
const DietPlan = require('../models/DietPlan');

// Get all patients with pagination and filtering
const getAllPatients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    if (req.query.search) {
      filter.$or = [
        { fullName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { primaryDosha: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    if (req.query.dosha) {
      filter.primaryDosha = req.query.dosha;
    }
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.gender) {
      filter.gender = req.query.gender;
    }
    
    // Execute query
    const patients = await Patient.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email')
      .lean();
    
    const total = await Patient.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        patients,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalPatients: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get all patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patients',
      error: error.message
    });
  }
};

// Get single patient by ID
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('dietPlans.planId', 'name status startDate endDate')
      .lean();
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    console.error('Get patient by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient',
      error: error.message
    });
  }
};

// Create new patient
const createPatient = async (req, res) => {
  try {
    const patientData = req.body;
    
    // Calculate age from date of birth
    if (patientData.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(patientData.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      patientData.age = age;
    }
    
    // Create patient
    const patient = new Patient({
      ...patientData,
      createdBy: req.user ? req.user._id : null
    });
    
    // Calculate dosha scores if answers are provided
    if (patient.doshaAnswers && patient.doshaAnswers.length > 0) {
      patient.calculateDoshaScores();
    }
    
    await patient.save();
    
    // Populate the created patient
    const populatedPatient = await Patient.findById(patient._id)
      .populate('createdBy', 'name email')
      .lean();
    
    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: populatedPatient
    });
  } catch (error) {
    console.error('Create patient error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
        field: 'email'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create patient',
      error: error.message
    });
  }
};

// Update patient
const updatePatient = async (req, res) => {
  try {
    const patientId = req.params.id;
    const updateData = req.body;
    
    // Recalculate age if date of birth is updated
    if (updateData.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(updateData.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      updateData.age = age;
    }
    
    // Add updatedBy field
    updateData.updatedBy = req.user ? req.user._id : null;
    
    const patient = await Patient.findByIdAndUpdate(
      patientId,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    // Recalculate dosha scores if answers are updated
    if (updateData.doshaAnswers) {
      patient.calculateDoshaScores();
      await patient.save();
    }
    
    res.json({
      success: true,
      message: 'Patient updated successfully',
      data: patient
    });
  } catch (error) {
    console.error('Update patient error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
        field: 'email'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update patient',
      error: error.message
    });
  }
};

// Delete patient
const deletePatient = async (req, res) => {
  try {
    const patientId = req.params.id;
    
    // Check if patient has active diet plans
    const activePlans = await DietPlan.find({
      patientId: patientId,
      status: { $in: ['Active', 'Draft'] }
    });
    
    if (activePlans.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete patient with active diet plans',
        activePlans: activePlans.length
      });
    }
    
    const patient = await Patient.findByIdAndDelete(patientId);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete patient',
      error: error.message
    });
  }
};

// Get patient statistics
const getPatientStats = async (req, res) => {
  try {
    const stats = await Patient.aggregate([
      {
        $group: {
          _id: null,
          totalPatients: { $sum: 1 },
          averageAge: { $avg: '$age' },
          averageBMI: { $avg: '$bmi' },
          doshaDistribution: {
            $push: '$primaryDosha'
          },
          genderDistribution: {
            $push: '$gender'
          },
          statusDistribution: {
            $push: '$status'
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalPatients: 1,
          averageAge: { $round: ['$averageAge', 1] },
          averageBMI: { $round: ['$averageBMI', 1] },
          doshaDistribution: {
            $reduce: {
              input: '$doshaDistribution',
              initialValue: {},
              in: {
                $mergeObjects: [
                  '$$value',
                  {
                    $arrayToObject: [
                      [
                        {
                          k: '$$this',
                          v: {
                            $add: [
                              { $ifNull: [{ $getField: { field: '$$this', input: '$$value' } }, 0] },
                              1
                            ]
                          }
                        }
                      ]
                    ]
                  }
                ]
              }
            }
          },
          genderDistribution: {
            $reduce: {
              input: '$genderDistribution',
              initialValue: {},
              in: {
                $mergeObjects: [
                  '$$value',
                  {
                    $arrayToObject: [
                      [
                        {
                          k: '$$this',
                          v: {
                            $add: [
                              { $ifNull: [{ $getField: { field: '$$this', input: '$$value' } }, 0] },
                              1
                            ]
                          }
                        }
                      ]
                    ]
                  }
                ]
              }
            }
          },
          statusDistribution: {
            $reduce: {
              input: '$statusDistribution',
              initialValue: {},
              in: {
                $mergeObjects: [
                  '$$value',
                  {
                    $arrayToObject: [
                      [
                        {
                          k: '$$this',
                          v: {
                            $add: [
                              { $ifNull: [{ $getField: { field: '$$this', input: '$$value' } }, 0] },
                              1
                            ]
                          }
                        }
                      ]
                    ]
                  }
                ]
              }
            }
          }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: stats[0] || {
        totalPatients: 0,
        averageAge: 0,
        averageBMI: 0,
        doshaDistribution: {},
        genderDistribution: {},
        statusDistribution: {}
      }
    });
  } catch (error) {
    console.error('Get patient stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient statistics',
      error: error.message
    });
  }
};

// Get patients by dosha
const getPatientsByDosha = async (req, res) => {
  try {
    const { dosha } = req.params;
    
    const patients = await Patient.find({ primaryDosha: dosha })
      .select('fullName age gender primaryDosha status lastVisit')
      .sort({ createdAt: -1 })
      .lean();
    
    res.json({
      success: true,
      data: {
        dosha,
        count: patients.length,
        patients
      }
    });
  } catch (error) {
    console.error('Get patients by dosha error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patients by dosha',
      error: error.message
    });
  }
};

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientStats,
  getPatientsByDosha
};
