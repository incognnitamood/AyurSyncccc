const DietPlan = require('../models/DietPlan');
const Patient = require('../models/Patient');
const Recipe = require('../models/Recipe');
const aiService = require('../services/aiService');

// Generate AI-powered diet plan for a patient
const generateDietPlan = async (req, res) => {
  try {
    const { patientId } = req.params;
    const options = req.body;

    // Validate patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Generate diet plan using AI
    const aiGeneratedPlan = await aiService.generateDietPlan(patientId, options);

    // Create diet plan document
    const dietPlan = new DietPlan({
      name: aiGeneratedPlan.planName || `Diet Plan for ${patient.fullName}`,
      description: aiGeneratedPlan.description || 'AI-generated personalized diet plan',
      patientId: patientId,
      startDate: new Date(options.startDate || Date.now()),
      endDate: new Date(options.endDate || new Date(Date.now() + (options.duration || 7) * 24 * 60 * 60 * 1000)),
      duration: options.duration || 7,
      dailyPlans: aiGeneratedPlan.dailyPlans,
      targetCalories: aiGeneratedPlan.targetCalories,
      primaryDosha: patient.primaryDosha,
      doshaBalance: patient.doshaScores,
      healthGoals: aiGeneratedPlan.healthGoals || [patient.primaryConcerns],
      restrictions: patient.allergies ? [patient.allergies] : [],
      aiGenerated: true,
      generationPrompt: `Generated for ${patient.fullName} (${patient.primaryDosha})`,
      aiModel: 'gpt-4',
      status: 'Draft',
      progress: {
        totalDays: options.duration || 7,
        completedDays: 0,
        adherenceRate: 0
      },
      createdBy: req.user ? req.user._id : null
    });

    await dietPlan.save();

    // Update patient's diet plans
    await Patient.findByIdAndUpdate(patientId, {
      $push: {
        dietPlans: {
          planId: dietPlan._id,
          startDate: dietPlan.startDate,
          endDate: dietPlan.endDate,
          isActive: true
        }
      }
    });

    // Populate the response
    const populatedPlan = await DietPlan.findById(dietPlan._id)
      .populate('patientId', 'fullName email primaryDosha')
      .populate('createdBy', 'name email')
      .lean();

    res.status(201).json({
      success: true,
      message: 'Diet plan generated successfully',
      data: populatedPlan
    });
  } catch (error) {
    console.error('Generate diet plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate diet plan',
      error: error.message
    });
  }
};

// Get all diet plans with filtering
const getAllDietPlans = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    if (req.query.patientId) {
      filter.patientId = req.query.patientId;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.dosha) {
      filter.primaryDosha = req.query.dosha;
    }

    if (req.query.aiGenerated !== undefined) {
      filter.aiGenerated = req.query.aiGenerated === 'true';
    }

    // Date range filtering
    if (req.query.startDate || req.query.endDate) {
      filter.startDate = {};
      if (req.query.startDate) {
        filter.startDate.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter.startDate.$lte = new Date(req.query.endDate);
      }
    }

    const dietPlans = await DietPlan.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('patientId', 'fullName email primaryDosha')
      .populate('createdBy', 'name email')
      .lean();

    const total = await DietPlan.countDocuments(filter);

    res.json({
      success: true,
      data: {
        dietPlans,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalPlans: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get all diet plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch diet plans',
      error: error.message
    });
  }
};

// Get single diet plan by ID
const getDietPlanById = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findById(req.params.id)
      .populate('patientId', 'fullName email primaryDosha age gender')
      .populate('createdBy', 'name email')
      .lean();

    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        message: 'Diet plan not found'
      });
    }

    res.json({
      success: true,
      data: dietPlan
    });
  } catch (error) {
    console.error('Get diet plan by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch diet plan',
      error: error.message
    });
  }
};

// Update diet plan
const updateDietPlan = async (req, res) => {
  try {
    const dietPlanId = req.params.id;
    const updateData = req.body;

    // Add lastModifiedBy field
    updateData.lastModifiedBy = req.user ? req.user._id : null;

    const dietPlan = await DietPlan.findByIdAndUpdate(
      dietPlanId,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('patientId', 'fullName email primaryDosha')
      .populate('createdBy', 'name email');

    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        message: 'Diet plan not found'
      });
    }

    res.json({
      success: true,
      message: 'Diet plan updated successfully',
      data: dietPlan
    });
  } catch (error) {
    console.error('Update diet plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update diet plan',
      error: error.message
    });
  }
};

// Delete diet plan
const deleteDietPlan = async (req, res) => {
  try {
    const dietPlanId = req.params.id;

    const dietPlan = await DietPlan.findByIdAndDelete(dietPlanId);

    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        message: 'Diet plan not found'
      });
    }

    // Remove from patient's diet plans
    await Patient.findByIdAndUpdate(dietPlan.patientId, {
      $pull: { dietPlans: { planId: dietPlanId } }
    });

    res.json({
      success: true,
      message: 'Diet plan deleted successfully'
    });
  } catch (error) {
    console.error('Delete diet plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete diet plan',
      error: error.message
    });
  }
};

// Mark day as completed
const markDayCompleted = async (req, res) => {
  try {
    const { planId, dayIndex } = req.params;
    const { feedback } = req.body;

    const dietPlan = await DietPlan.findById(planId);
    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        message: 'Diet plan not found'
      });
    }

    const dayIndexNum = parseInt(dayIndex);
    if (dayIndexNum < 0 || dayIndexNum >= dietPlan.dailyPlans.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid day index'
      });
    }

    // Mark day as completed
    dietPlan.dailyPlans[dayIndexNum].isCompleted = true;

    // Add feedback if provided
    if (feedback) {
      dietPlan.feedback.push({
        date: new Date(),
        rating: feedback.rating,
        comments: feedback.comments,
        symptoms: feedback.symptoms || [],
        energyLevel: feedback.energyLevel,
        satisfaction: feedback.satisfaction
      });
    }

    // Update progress
    dietPlan.updateProgress();
    await dietPlan.save();

    res.json({
      success: true,
      message: 'Day marked as completed',
      data: {
        completedDays: dietPlan.progress.completedDays,
        adherenceRate: dietPlan.progress.adherenceRate
      }
    });
  } catch (error) {
    console.error('Mark day completed error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark day as completed',
      error: error.message
    });
  }
};

// Get diet plan statistics
const getDietPlanStats = async (req, res) => {
  try {
    const stats = await DietPlan.aggregate([
      {
        $group: {
          _id: null,
          totalPlans: { $sum: 1 },
          activePlans: {
            $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
          },
          completedPlans: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          },
          averageAdherence: { $avg: '$progress.adherenceRate' },
          averageDuration: { $avg: '$duration' },
          doshaDistribution: {
            $push: '$primaryDosha'
          },
          aiGeneratedCount: {
            $sum: { $cond: ['$aiGenerated', 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalPlans: 1,
          activePlans: 1,
          completedPlans: 1,
          averageAdherence: { $round: ['$averageAdherence', 1] },
          averageDuration: { $round: ['$averageDuration', 1] },
          aiGeneratedCount: 1,
          manualGeneratedCount: { $subtract: ['$totalPlans', '$aiGeneratedCount'] },
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
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: stats[0] || {
        totalPlans: 0,
        activePlans: 0,
        completedPlans: 0,
        averageAdherence: 0,
        averageDuration: 0,
        aiGeneratedCount: 0,
        manualGeneratedCount: 0,
        doshaDistribution: {}
      }
    });
  } catch (error) {
    console.error('Get diet plan stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch diet plan statistics',
      error: error.message
    });
  }
};

// Get recipe suggestions for a patient
const getRecipeSuggestions = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { mealType, preferences } = req.query;

    const suggestions = await aiService.generateRecipeSuggestions(
      patientId,
      mealType,
      preferences ? JSON.parse(preferences) : {}
    );

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Get recipe suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recipe suggestions',
      error: error.message
    });
  }
};

// Regenerate diet plan (modify existing plan)
const regenerateDietPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const modifications = req.body;

    const existingPlan = await DietPlan.findById(planId);
    if (!existingPlan) {
      return res.status(404).json({
        success: false,
        message: 'Diet plan not found'
      });
    }

    // Generate new plan with modifications
    const newPlan = await aiService.generateDietPlan(existingPlan.patientId, {
      ...modifications,
      duration: existingPlan.duration,
      targetCalories: existingPlan.targetCalories
    });

    // Update the existing plan
    existingPlan.dailyPlans = newPlan.dailyPlans;
    existingPlan.modifications.push({
      date: new Date(),
      reason: modifications.reason || 'Plan regeneration',
      changes: JSON.stringify(modifications),
      modifiedBy: req.user ? req.user._id : null
    });

    await existingPlan.save();

    res.json({
      success: true,
      message: 'Diet plan regenerated successfully',
      data: existingPlan
    });
  } catch (error) {
    console.error('Regenerate diet plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to regenerate diet plan',
      error: error.message
    });
  }
};

module.exports = {
  generateDietPlan,
  getAllDietPlans,
  getDietPlanById,
  updateDietPlan,
  deleteDietPlan,
  markDayCompleted,
  getDietPlanStats,
  getRecipeSuggestions,
  regenerateDietPlan
};
