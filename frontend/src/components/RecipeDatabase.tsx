import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  ChefHat,
  Leaf,
  Plus,
  Flame,
  Sparkles,
  Droplet,
  Sun,
  Wind,
  Cloud,
  Dna,
  HeartHandshake,
  Utensils,
  Thermometer,
  Carrot,
  LeafyGreen,
  Dumbbell,
  Search,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

// Define the Recipe type for type-safety
export interface Recipe {
    id: number;
    name: string;
    type: string;
    cuisine: string;
    ingredients: { name: string; quantity: string; note: string }[];
    instructions: string[];
    ayurvedic_properties: {
        rasa: string[];
        virya: string;
        vipaka: string;
        prabhava: string | null;
        dosha_effect: {
            Vata: string;
            Pitta: string;
            Kapha: string;
        };
        guna: string[];
        guna_properties: string;
    };
    health_benefits: string[];
    nutrition_profile: {
        calories: number;
        protein_g: number;
        carbs_g: number;
        fat_g: number;
        fiber_g: number;
        vitamins: string[];
        minerals: {
            Iron?: string;
            Calcium?: string;
            Magnesium?: string;
        };
        glycemic_index: number;
        nutrient_density_score: number;
    };
}

// Sample recipe data as fallback
const SAMPLE_RECIPES: Recipe[] = [
  {
    id: 1,
    name: "Khichdi",
    type: "Main Course",
    cuisine: "Indian",
    ingredients: [
      { name: "Rice", quantity: "1/2 cup", note: "Cooling, easy to digest" },
      { name: "Moong dal", quantity: "1/2 cup", note: "Light, balances all doshas" },
      { name: "Ghee", quantity: "1 tbsp", note: "Grounding, improves digestion" },
      { name: "Cumin seeds", quantity: "1 tsp", note: "Stimulates agni" },
      { name: "Turmeric", quantity: "1/2 tsp", note: "Anti-inflammatory" }
    ],
    instructions: [
      "Wash rice and dal.",
      "Pressure cook with 3 cups water, turmeric, and salt.",
      "Prepare tadka with ghee and cumin, add to khichdi."
    ],
    ayurvedic_properties: {
      rasa: ["Madhura", "Tikta"],
      virya: "Ushna (Heating)",
      vipaka: "Madhura (Sweet)",
      prabhava: "Balancing for all doshas",
      dosha_effect: {
        Vata: "↓",
        Pitta: "↓",
        Kapha: "↓"
      },
      guna: ["Light (Laghu)", "Oily (Snigdha)"],
      guna_properties: "Easily digestible, grounding yet light, perfect for detoxification"
    },
    health_benefits: [
      "Detoxifying",
      "Light on digestion",
      "Balances gut flora",
      "Supports recovery from illness"
    ],
    nutrition_profile: {
      calories: 320,
      protein_g: 12,
      carbs_g: 55,
      fat_g: 8,
      fiber_g: 6,
      vitamins: ["Vitamin A", "Vitamin C", "B-complex"],
      minerals: { Iron: "10%", Calcium: "4%", Magnesium: "15%" },
      glycemic_index: 55,
      nutrient_density_score: 7.5
    }
  },
  {
    id: 2,
    name: "Oats Porridge with Fruits",
    type: "Breakfast",
    cuisine: "Global",
    ingredients: [
      { name: "Rolled oats", quantity: "1/2 cup", note: "Warm, grounding" },
      { name: "Milk (or almond milk)", quantity: "1 cup", note: "Cooling or neutral" },
      { name: "Banana", quantity: "1 small", note: "Sweet, heavy" },
      { name: "Apple", quantity: "1/2 sliced", note: "Balances Pitta" },
      { name: "Cinnamon", quantity: "1/2 tsp", note: "Improves digestion" }
    ],
    instructions: [
      "Boil oats in milk until soft.",
      "Top with chopped fruits and cinnamon.",
      "Serve warm."
    ],
    ayurvedic_properties: {
      rasa: ["Madhura", "Kashaya"],
      virya: "Shita (Cooling)",
      vipaka: "Madhura (Sweet)",
      prabhava: "Strength-giving",
      dosha_effect: {
        Vata: "↓",
        Pitta: "↓",
        Kapha: "↑"
      },
      guna: ["Heavy (Guru)", "Oily (Snigdha)"],
      guna_properties: "Nourishing and grounding, provides sustained energy"
    },
    health_benefits: [
      "Sustained energy",
      "Rich in fiber",
      "Improves satiety",
      "Heart-healthy"
    ],
    nutrition_profile: {
      calories: 280,
      protein_g: 8,
      carbs_g: 52,
      fat_g: 5,
      fiber_g: 7,
      vitamins: ["Vitamin B1", "Vitamin C", "Vitamin D"],
      minerals: { Iron: "12%", Magnesium: "20%" },
      glycemic_index: 50,
      nutrient_density_score: 8.2
    }
  },
  {
    id: 3,
    name: "Turmeric Golden Milk",
    type: "Beverage",
    cuisine: "Indian",
    ingredients: [
      { name: "Milk (or plant milk)", quantity: "1 cup", note: "Nourishing base" },
      { name: "Turmeric powder", quantity: "1/2 tsp", note: "Anti-inflammatory" },
      { name: "Ginger powder", quantity: "1/4 tsp", note: "Digestive" },
      { name: "Cinnamon", quantity: "pinch", note: "Warming spice" },
      { name: "Honey", quantity: "1 tsp", note: "Natural sweetener" }
    ],
    instructions: [
      "Heat milk gently in a pan.",
      "Add turmeric, ginger, and cinnamon.",
      "Simmer for 2-3 minutes.",
      "Add honey before serving."
    ],
    ayurvedic_properties: {
      rasa: ["Madhura", "Tikta", "Katu"],
      virya: "Ushna (Heating)",
      vipaka: "Madhura (Sweet)",
      prabhava: "Anti-inflammatory and immune-boosting",
      dosha_effect: {
        Vata: "↓",
        Pitta: "neutral",
        Kapha: "↓"
      },
      guna: ["Light (Laghu)", "Dry (Ruksha)"],
      guna_properties: "Warming, anti-inflammatory, and immunity-boosting properties"
    },
    health_benefits: [
      "Boosts immunity",
      "Anti-inflammatory",
      "Improves digestion",
      "Calming before sleep"
    ],
    nutrition_profile: {
      calories: 150,
      protein_g: 8,
      carbs_g: 12,
      fat_g: 8,
      fiber_g: 1,
      vitamins: ["Vitamin D", "Vitamin B12", "Vitamin C"],
      minerals: { Calcium: "30%", Iron: "2%", Magnesium: "8%" },
      glycemic_index: 30,
      nutrient_density_score: 7.8
    }
  }
];

const RecipeDatabase = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedMealType, setSelectedMealType] = useState('All');
    const [selectedDosha, setSelectedDosha] = useState('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load recipes from local JSON file on component mount
    useEffect(() => {
        loadRecipes();
    }, []);

    const loadRecipes = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Try to load all 50 recipes from local JSON file using fetch
            try {
                const response = await fetch('/normalized_recipes_1_50.json');
                if (response.ok) {
                    const recipesData: Recipe[] = await response.json();
                    console.log('Successfully loaded recipes from JSON file:', recipesData.length, 'recipes found');
                    setRecipes(recipesData);
                    return;
                }
            } catch (fetchError) {
                console.log('Could not fetch from JSON file, using sample data:', fetchError);
            }
            
            // Fallback to sample recipes if JSON fetch fails
            console.log('Using sample recipe data:', SAMPLE_RECIPES.length, 'recipes available');
            setRecipes(SAMPLE_RECIPES);
            
        } catch (error) {
            console.error('Failed to load recipes:', error);
            setError('Failed to load recipes. Using sample data.');
            setRecipes(SAMPLE_RECIPES);
        } finally {
            setLoading(false);
        }
    };



    const filteredRecipes = useMemo(() => {
        return recipes.filter(recipe => {
            const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === "All" || recipe.cuisine === selectedCategory;
            const matchesMealType = selectedMealType === "All" || recipe.type === selectedMealType;
            const matchesDosha = selectedDosha === "All" || (recipe.ayurvedic_properties?.dosha_effect && Object.keys(recipe.ayurvedic_properties.dosha_effect).some(d => d.toLowerCase() === selectedDosha.toLowerCase()));
            const matchesDifficulty = selectedDifficulty === "All"; // Simplified since difficulty is optional

            return matchesSearch && matchesCategory && matchesMealType && matchesDosha && matchesDifficulty;
        });
    }, [recipes, searchTerm, selectedCategory, selectedMealType, selectedDosha, selectedDifficulty]);

    const getDoshaIcon = (dosha: string) => {
        switch (dosha.toLowerCase()) {
            case 'vata':
                return <Wind className="w-4 h-4 text-blue-500" />;
            case 'pitta':
                return <Sun className="w-4 h-4 text-orange-500" />;
            case 'kapha':
                return <Cloud className="w-4 h-4 text-gray-500" />;
            default:
                return null;
        }
    };

    const getDoshaEffectSymbol = (effect: string) => {
        switch (effect) {
            case '↓':
                return <span className="text-green-600">↓</span>;
            case '↑':
                return <span className="text-red-600">↑</span>;
            case 'neutral':
                return <span className="text-gray-500">Neutral</span>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-8 p-6 bg-[#FDF8E4] min-h-screen">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 rounded-xl bg-white shadow-lg animate-fade-in-up">
                <div>
                    <h1 className="text-3xl text-[#9E7E3D] font-bold">Ayurvedic Recipe Database</h1>
                    <p className="text-[#4C7A5A]/80 mt-1">
                        Discover recipes tailored to your Ayurvedic dosha, with detailed nutritional and wellness information.
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                        <Badge className="bg-[#F5C24D]/20 text-[#9E7E3D] border-[#9E7E3D]/20">
                            {loading ? 'Loading...' : `${recipes.length} recipes available`}
                        </Badge>
                        <Badge className="bg-[#4C7A5A]/20 text-[#9E7E3D] border-[#9E7E3D]/20">
                            {loading ? 'Filtering...' : `${filteredRecipes.length} showing`}
                        </Badge>
                    </div>
                </div>
                <Button className="btn-rustic bg-[#84A15D] text-white hover:bg-[#6a844a] transition-all duration-300 transform hover:scale-105">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Recipe
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 animate-fade-in-up">
                {error && (
                    <Alert className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search recipes by name..."
                                className="border-2 border-gray-300 rounded-md py-2 px-10 focus:outline-none focus:ring-2 focus:ring-[#84A15D] transition-all duration-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <Select onValueChange={setSelectedCategory} value={selectedCategory}>
                        <SelectTrigger className="w-full border-2 border-gray-300">
                            <SelectValue placeholder="Cuisine" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Cuisine</SelectItem>
                            <SelectItem value="Indian">Indian</SelectItem>
                            <SelectItem value="Global">Global</SelectItem>
                            <SelectItem value="Beverage">Beverage</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select onValueChange={setSelectedMealType} value={selectedMealType}>
                        <SelectTrigger className="w-full border-2 border-gray-300">
                            <SelectValue placeholder="Meal Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Meal Types</SelectItem>
                            <SelectItem value="Breakfast">Breakfast</SelectItem>
                            <SelectItem value="Main Course">Main Course</SelectItem>
                            <SelectItem value="Dessert">Dessert</SelectItem>
                            <SelectItem value="Side Dish">Side Dish</SelectItem>
                            <SelectItem value="Soup">Soup</SelectItem>
                            <SelectItem value="Salad">Salad</SelectItem>
                            <SelectItem value="Beverage">Beverage</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select onValueChange={setSelectedDosha} value={selectedDosha}>
                        <SelectTrigger className="w-full border-2 border-gray-300">
                            <SelectValue placeholder="Dosha" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Doshas</SelectItem>
                            <SelectItem value="Vata">Vata</SelectItem>
                            <SelectItem value="Pitta">Pitta</SelectItem>
                            <SelectItem value="Kapha">Kapha</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Recipe Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-[#84A15D] mr-3" />
                        <span className="text-lg text-gray-600">Loading recipes...</span>
                    </div>
                ) : filteredRecipes.length > 0 ? (
                    filteredRecipes.map((recipe: Recipe) => (
                        <Card key={recipe.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                            <CardHeader className="p-4 bg-[#F5F1E4]">
                                <CardTitle className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xl text-[#9E7E3D] font-bold">
                                    <span>{recipe.name}</span>
                                    <div className="flex flex-wrap gap-1 mt-2 sm:mt-0 max-w-[120px]">
                                        {recipe.ayurvedic_properties?.dosha_effect && Object.entries(recipe.ayurvedic_properties.dosha_effect).map(([dosha, effect]) => (
                                            <Badge key={dosha} variant="secondary" className="bg-[#D5D8AB] text-[#4C7A5A] text-xs font-semibold">
                                                {getDoshaIcon(dosha)}
                                                <span className="ml-1">{dosha} {getDoshaEffectSymbol(effect)}</span>
                                            </Badge>
                                        ))}
                                    </div>
                                </CardTitle>
                                <div className="text-sm text-gray-500 mt-1 flex items-center space-x-3">
                                    <span className="flex items-center"><ChefHat className="w-4 h-4 text-gray-400 mr-1" />{recipe.cuisine}</span>
                                    <span className="flex items-center"><Leaf className="w-4 h-4 text-green-600 mr-1" />{recipe.type}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4">
                                <p className="text-gray-600 line-clamp-3 mb-4">{recipe.ayurvedic_properties?.guna_properties}</p>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="btn-rustic w-full bg-[#84A15D] text-white hover:bg-[#6a844a]">
                                            View Full Recipe
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-lg p-8 bg-white rounded-2xl shadow-2xl animate-fade-in-up">
                                        <DialogHeader className="text-center">
                                            <DialogTitle className="text-3xl font-bold text-[#9E7E3D]">{recipe.name}</DialogTitle>
                                        </DialogHeader>

                                        {/* New Tabs Component */}
                                        <Tabs defaultValue="ayurvedic_properties" className="mt-6 w-full">
                                            <TabsList className="grid w-full grid-cols-4 bg-transparent p-1 rounded-full">
                                                <TabsTrigger
                                                    value="ayurvedic_properties"
                                                    className="bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-300 rounded-lg shadow-md
                                                               text-[#388E3C] font-semibold
                                                               data-[state=active]:from-white data-[state=active]:to-gray-100 data-[state=active]:shadow-lg data-[state=active]:-translate-y-0.5
                                                               hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                                                >
                                                    <HeartHandshake className="w-4 h-4 mr-2" /> Ayurvedic
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="nutritional_profile"
                                                    className="bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-300 rounded-lg shadow-md
                                                               text-[#388E3C] font-semibold
                                                               data-[state=active]:from-white data-[state=active]:to-gray-100 data-[state=active]:shadow-lg data-[state=active]:-translate-y-0.5
                                                               hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                                                >
                                                    <Dna className="w-4 h-4 mr-2" /> Nutrition
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="health_benefits"
                                                    className="bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-300 rounded-lg shadow-md
                                                               text-[#388E3C] font-semibold
                                                               data-[state=active]:from-white data-[state=active]:to-gray-100 data-[state=active]:shadow-lg data-[state=active]:-translate-y-0.5
                                                               hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                                                >
                                                    <Sparkles className="w-4 h-4 mr-2" /> Benefits
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="ingredients"
                                                    className="bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-300 rounded-lg shadow-md
                                                               text-[#388E3C] font-semibold
                                                               data-[state=active]:from-white data-[state=active]:to-gray-100 data-[state=active]:shadow-lg data-[state=active]:-translate-y-0.5
                                                               hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                                                >
                                                    <Utensils className="w-4 h-4 mr-2" /> Ingredients
                                                </TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="ayurvedic_properties" className="p-4 bg-[#F9F6ED] rounded-xl mt-4 space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-300 rounded-lg shadow-md p-4">
                                                        <p className="text-sm font-semibold text-gray-600">Taste (Rasa):</p>
                                                        <p className="text-lg font-medium text-[#9E7E3D]">{recipe.ayurvedic_properties.rasa.join(', ')}</p>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-300 rounded-lg shadow-md p-4">
                                                        <p className="text-sm font-semibold text-gray-600">Potency (Virya):</p>
                                                        <p className="text-lg font-medium text-[#9E7E3D]">{recipe.ayurvedic_properties.virya}</p>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-300 rounded-lg shadow-md p-4">
                                                        <p className="text-sm font-semibold text-gray-600">Post-Digestive Effect (Vipaka):</p>
                                                        <p className="text-lg font-medium text-[#9E7E3D]">{recipe.ayurvedic_properties.vipaka}</p>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-300 rounded-lg shadow-md p-4">
                                                        <p className="text-sm font-semibold text-gray-600">Special Effect (Prabhava):</p>
                                                        <p className="text-lg font-medium text-[#9E7E3D]">{recipe.ayurvedic_properties.prabhava}</p>
                                                    </div>
                                                </div>
                                                <div className="bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-300 rounded-lg shadow-md p-4">
                                                    <p className="text-sm font-semibold text-gray-600">Dosha Effect:</p>
                                                    <div className="flex justify-around mt-2">
                                                        {Object.entries(recipe.ayurvedic_properties.dosha_effect).map(([dosha, effect]: [string, string]) => (
                                                            <div key={dosha} className="text-center">
                                                                <div className="flex items-center justify-center gap-1">
                                                                    {getDoshaIcon(dosha)}
                                                                    <span className="font-semibold text-sm">{dosha} {getDoshaEffectSymbol(effect)}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 text-sm italic">{recipe.ayurvedic_properties.guna_properties}</p>
                                            </TabsContent>
                                            <TabsContent value="nutritional_profile" className="p-4 bg-[#F9F6ED] rounded-xl mt-4">
                                                {recipe.nutrition_profile && (
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                        <div className="bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-300 rounded-lg shadow-md p-4 text-center">
                                                            <Flame className="w-6 h-6 mx-auto text-orange-500" />
                                                            <p className="font-semibold text-lg mt-1">{recipe.nutrition_profile.calories} kcal</p>
                                                            <p className="text-xs text-gray-500">Calories</p>
                                                        </div>
                                                        <div className="bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-300 rounded-lg shadow-md p-4 text-center">
                                                            <Dumbbell className="w-6 h-6 mx-auto text-blue-500" />
                                                            <p className="font-semibold text-lg mt-1">{recipe.nutrition_profile.protein_g} g</p>
                                                            <p className="text-xs text-gray-500">Protein</p>
                                                        </div>
                                                        <div className="bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-300 rounded-lg shadow-md p-4 text-center">
                                                            <Carrot className="w-6 h-6 mx-auto text-orange-600" />
                                                            <p className="font-semibold text-lg mt-1">{recipe.nutrition_profile.carbs_g} g</p>
                                                            <p className="text-xs text-gray-500">Carbs</p>
                                                        </div>
                                                        <div className="bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-300 rounded-lg shadow-md p-4 text-center">
                                                            <Droplet className="w-6 h-6 mx-auto text-yellow-500" />
                                                            <p className="font-semibold text-lg mt-1">{recipe.nutrition_profile.fat_g} g</p>
                                                            <p className="text-xs text-gray-500">Fat</p>
                                                        </div>
                                                        <div className="bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-300 rounded-lg shadow-md p-4 text-center">
                                                            <LeafyGreen className="w-6 h-6 mx-auto text-green-600" />
                                                            <p className="font-semibold text-lg mt-1">{recipe.nutrition_profile.fiber_g} g</p>
                                                            <p className="text-xs text-gray-500">Fiber</p>
                                                        </div>
                                                        <div className="bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-300 rounded-lg shadow-md p-4 text-center">
                                                            <Thermometer className="w-6 h-6 mx-auto text-red-500" />
                                                            <p className="font-semibold text-lg mt-1">{recipe.nutrition_profile.glycemic_index}</p>
                                                            <p className="text-xs text-gray-500">Glycemic Index</p>
                                                        </div>
                                                        <div className="col-span-2 bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-300 rounded-lg shadow-md p-4">
                                                            <h4 className="font-semibold text-md text-[#4C7A5A]">Vitamins & Minerals</h4>
                                                            <p className="text-sm text-gray-700 mt-1">
                                                                Vitamins: {recipe.nutrition_profile.vitamins.join(', ')}
                                                            </p>
                                                            <p className="text-sm text-gray-700 mt-1">
                                                                Minerals: {Object.entries(recipe.nutrition_profile.minerals).map(([key, value]) => `${key} (${value})`).join(', ')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </TabsContent>
                                            <TabsContent value="health_benefits" className="p-4 bg-[#F9F6ED] rounded-xl mt-4">
                                                <div className="space-y-2">
                                                    {recipe.health_benefits.map((benefit: string, index: number) => (
                                                        <div key={index} className="flex items-start bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-300 rounded-lg shadow-md p-3">
                                                            <Sparkles className="w-5 h-5 text-purple-600 mt-1 mr-3 flex-shrink-0" />
                                                            <p className="text-md text-gray-700">{benefit}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </TabsContent>
                                            <TabsContent value="ingredients" className="p-4 bg-[#F9F6ED] rounded-xl mt-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-300 rounded-lg shadow-md p-4">
                                                        <h4 className="font-semibold text-md text-[#4C7A5A] mb-2">Ingredients</h4>
                                                        <ul className="list-none space-y-3 text-md text-gray-700">
                                                            {recipe.ingredients.map((item: { name: string; quantity: string; note: string }, index: number) => (
                                                                <li key={index} className="flex items-start">
                                                                    <span className="mr-2 text-[#9E7E3D]">•</span>
                                                                    <div>
                                                                        <b>{item.name}</b>: {item.quantity}
                                                                        <span className="text-gray-500 text-sm italic ml-2">({item.note})</span>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-300 rounded-lg shadow-md p-4">
                                                        <h4 className="font-semibold text-md text-[#4C7A5A] mb-2">Instructions</h4>
                                                        <ol className="list-decimal list-inside space-y-3 text-md text-gray-700 pl-4">
                                                            {recipe.instructions.map((instruction: string, index: number) => (
                                                                <li key={index}>
                                                                    {instruction}
                                                                </li>
                                                            ))}
                                                        </ol>
                                                    </div>
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full mt-8 text-xl font-semibold">No recipes found. Try adjusting your search or filters.</p>
                )}
            </div>
        </div>
    );
};

export { RecipeDatabase };