const Recipe = require('../models/Recipe');
const nutritionService = require('../services/nutritionService');

// Get all recipes with filtering and pagination
const getAllRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isActive: true };

    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    if (req.query.type) {
      filter.type = req.query.type;
    }

    if (req.query.cuisine) {
      filter.cuisine = req.query.cuisine;
    }

    if (req.query.difficulty) {
      filter.difficulty = req.query.difficulty;
    }

    if (req.query.dosha) {
      const doshaEffect = req.query.doshaEffect || '↓';
      filter[`ayurvedic_properties.dosha_effect.${req.query.dosha}`] = doshaEffect;
    }

    // Calorie range filtering
    if (req.query.minCalories || req.query.maxCalories) {
      filter['nutrition_profile.calories'] = {};
      if (req.query.minCalories) {
        filter['nutrition_profile.calories'].$gte = parseInt(req.query.minCalories);
      }
      if (req.query.maxCalories) {
        filter['nutrition_profile.calories'].$lte = parseInt(req.query.maxCalories);
      }
    }

    // Sort options
    let sort = { createdAt: -1 };
    if (req.query.sortBy) {
      switch (req.query.sortBy) {
        case 'calories':
          sort = { 'nutrition_profile.calories': 1 };
          break;
        case 'protein':
          sort = { 'nutrition_profile.protein_g': -1 };
          break;
        case 'name':
          sort = { name: 1 };
          break;
        case 'popularity':
          sort = { usageCount: -1 };
          break;
      }
    }

    const recipes = await Recipe.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Recipe.countDocuments(filter);

    res.json({
      success: true,
      data: {
        recipes,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalRecipes: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get all recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recipes',
      error: error.message
    });
  }
};

// Get single recipe by ID
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).lean();

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Update usage count
    await Recipe.findByIdAndUpdate(req.params.id, {
      $inc: { usageCount: 1 },
      lastUsed: new Date()
    });

    res.json({
      success: true,
      data: recipe
    });
  } catch (error) {
    console.error('Get recipe by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recipe',
      error: error.message
    });
  }
};

// Create new recipe
const createRecipe = async (req, res) => {
  try {
    const recipeData = req.body;
    
    // Add metadata
    recipeData.createdBy = req.user ? req.user._id : null;
    recipeData.isActive = true;

    const recipe = new Recipe(recipeData);
    await recipe.save();

    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      data: recipe
    });
  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create recipe',
      error: error.message
    });
  }
};

// Update recipe
const updateRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const updateData = req.body;

    const recipe = await Recipe.findByIdAndUpdate(
      recipeId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    res.json({
      success: true,
      message: 'Recipe updated successfully',
      data: recipe
    });
  } catch (error) {
    console.error('Update recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update recipe',
      error: error.message
    });
  }
};

// Delete recipe (soft delete)
const deleteRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;

    const recipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { isActive: false },
      { new: true }
    );

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    res.json({
      success: true,
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete recipe',
      error: error.message
    });
  }
};

// Get recipe statistics
const getRecipeStats = async (req, res) => {
  try {
    const stats = await Recipe.aggregate([
      {
        $group: {
          _id: null,
          totalRecipes: { $sum: 1 },
          activeRecipes: {
            $sum: { $cond: ['$isActive', 1, 0] }
          },
          averageCalories: { $avg: '$nutrition_profile.calories' },
          averageProtein: { $avg: '$nutrition_profile.protein_g' },
          typeDistribution: {
            $push: '$type'
          },
          cuisineDistribution: {
            $push: '$cuisine'
          },
          difficultyDistribution: {
            $push: '$difficulty'
          },
          totalUsage: { $sum: '$usageCount' }
        }
      },
      {
        $project: {
          _id: 0,
          totalRecipes: 1,
          activeRecipes: 1,
          averageCalories: { $round: ['$averageCalories', 1] },
          averageProtein: { $round: ['$averageProtein', 1] },
          totalUsage: 1,
          typeDistribution: {
            $reduce: {
              input: '$typeDistribution',
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
          cuisineDistribution: {
            $reduce: {
              input: '$cuisineDistribution',
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
          difficultyDistribution: {
            $reduce: {
              input: '$difficultyDistribution',
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
        totalRecipes: 0,
        activeRecipes: 0,
        averageCalories: 0,
        averageProtein: 0,
        totalUsage: 0,
        typeDistribution: {},
        cuisineDistribution: {},
        difficultyDistribution: {}
      }
    });
  } catch (error) {
    console.error('Get recipe stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recipe statistics',
      error: error.message
    });
  }
};

// Get recipes suitable for a specific dosha
const getRecipesByDosha = async (req, res) => {
  try {
    const { dosha } = req.params;
    const { effect = '↓' } = req.query;

    const filter = {
      isActive: true,
      [`ayurvedic_properties.dosha_effect.${dosha}`]: effect
    };

    const recipes = await Recipe.find(filter)
      .select('name type cuisine nutrition_profile ayurvedic_properties')
      .sort({ 'nutrition_profile.calories': 1 })
      .lean();

    res.json({
      success: true,
      data: {
        dosha,
        effect,
        count: recipes.length,
        recipes
      }
    });
  } catch (error) {
    console.error('Get recipes by dosha error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recipes by dosha',
      error: error.message
    });
  }
};

// Analyze nutrition of multiple recipes
const analyzeRecipesNutrition = async (req, res) => {
  try {
    const { recipeIds, quantities = [] } = req.body;

    if (!recipeIds || !Array.isArray(recipeIds)) {
      return res.status(400).json({
        success: false,
        message: 'Recipe IDs array is required'
      });
    }

    const recipes = await Recipe.find({
      _id: { $in: recipeIds },
      isActive: true
    }).lean();

    if (recipes.length !== recipeIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Some recipes not found'
      });
    }

    // Calculate total nutrition
    let totalNutrition = {
      calories: 0,
      protein_g: 0,
      carbs_g: 0,
      fat_g: 0,
      fiber_g: 0,
      vitamins: {},
      minerals: {}
    };

    const recipeAnalysis = recipes.map((recipe, index) => {
      const quantity = quantities[index] || 1;
      const nutrition = recipe.nutrition_profile;

      const recipeNutrition = {
        recipeId: recipe._id,
        name: recipe.name,
        quantity,
        nutrition: {
          calories: nutrition.calories * quantity,
          protein_g: nutrition.protein_g * quantity,
          carbs_g: nutrition.carbs_g * quantity,
          fat_g: nutrition.fat_g * quantity,
          fiber_g: nutrition.fiber_g * quantity
        }
      };

      // Add to total
      totalNutrition.calories += recipeNutrition.nutrition.calories;
      totalNutrition.protein_g += recipeNutrition.nutrition.protein_g;
      totalNutrition.carbs_g += recipeNutrition.nutrition.carbs_g;
      totalNutrition.fat_g += recipeNutrition.nutrition.fat_g;
      totalNutrition.fiber_g += recipeNutrition.nutrition.fiber_g;

      return recipeNutrition;
    });

    res.json({
      success: true,
      data: {
        totalNutrition,
        recipeAnalysis,
        summary: {
          totalRecipes: recipes.length,
          totalCalories: Math.round(totalNutrition.calories),
          totalProtein: Math.round(totalNutrition.protein_g),
          totalCarbs: Math.round(totalNutrition.carbs_g),
          totalFat: Math.round(totalNutrition.fat_g),
          totalFiber: Math.round(totalNutrition.fiber_g)
        }
      }
    });
  } catch (error) {
    console.error('Analyze recipes nutrition error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze recipes nutrition',
      error: error.message
    });
  }
};

// Get popular recipes
const getPopularRecipes = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const recipes = await Recipe.find({ isActive: true })
      .sort({ usageCount: -1, lastUsed: -1 })
      .limit(limit)
      .select('name type cuisine nutrition_profile ayurvedic_properties usageCount')
      .lean();

    res.json({
      success: true,
      data: recipes
    });
  } catch (error) {
    console.error('Get popular recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular recipes',
      error: error.message
    });
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeStats,
  getRecipesByDosha,
  analyzeRecipesNutrition,
  getPopularRecipes
};
