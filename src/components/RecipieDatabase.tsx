
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Search,
  Filter,
  Clock,
  Users,
  ChefHat,
  Leaf,
  Star,
  Heart,
  Bookmark,
  Eye,
  Plus
} from 'lucide-react';

export interface Ingredient {
  name: string;
  quantity: string;
  note: string;
}

export interface Nutrition {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  vitamins: { [key: string]: string };
  minerals: { [key: string]: string };
  glycemic_index: number;
  nutrient_density_score: number;
}

export interface AyurvedicProperties {
  rasa: string[];
  virya: string;
  vipaka: string;
  prabhava: string;
  dosha_effect: { [key: string]: string };
  effects_on_doshas: string;
}

export interface Recipe {
  id: number;
  name: string;
  type: string;
  cuisine: string;
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: Nutrition;
  ayurvedic_properties: AyurvedicProperties;
  health_benefits: string[];
}

export const recipes: Recipe[] = 
[
  {
    "id": 1,
    "name": "Khichdi",
    "type": "Main Course",
    "cuisine": "Indian",
    "ingredients": [
      {
        "name": "Rice",
        "quantity": "1/2 cup",
        "note": "Cooling, easy to digest"
      },
      {
        "name": "Moong dal",
        "quantity": "1/2 cup",
        "note": "Light, balances all doshas"
      },
      {
        "name": "Ghee",
        "quantity": "1 tbsp",
        "note": "Grounding, improves digestion"
      },
      {
        "name": "Cumin seeds",
        "quantity": "1 tsp",
        "note": "Stimulates agni"
      },
      {
        "name": "Turmeric",
        "quantity": "1/2 tsp",
        "note": "Anti-inflammatory"
      }
    ],
    "instructions": [
      "Wash rice and dal.",
      "Pressure cook with 3 cups water, turmeric, and salt.",
      "Prepare tadka with ghee and cumin, add to khichdi."
    ],
    "nutrition": {
      "calories": 320,
      "protein_g": 12,
      "carbs_g": 55,
      "fat_g": 8,
      "fiber_g": 6,
      "vitamins": {
        "Vitamin A": "2%",
        "Vitamin C": "4%"
      },
      "minerals": {
        "Iron": "10%",
        "Calcium": "4%"
      },
      "glycemic_index": 55,
      "nutrient_density_score": 7.5
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Tikta"
      ],
      "virya": "Ushna",
      "vipaka": "Madhura",
      "prabhava": "Balancing for all doshas",
      "dosha_effect": {
        "Vata": "\u2193",
        "Pitta": "\u2193",
        "Kapha": "\u2193"
      },
      "effects_on_doshas": "Balances all three doshas, especially good for detox."
    },
    "health_benefits": [
      "Detoxifying",
      "Light on digestion",
      "Balances gut flora"
    ]
  },
  {
    "id": 2,
    "name": "Oats Porridge with Fruits",
    "type": "Breakfast",
    "cuisine": "Global/Indian",
    "ingredients": [
      {
        "name": "Rolled oats",
        "quantity": "1/2 cup",
        "note": "Warm, grounding"
      },
      {
        "name": "Milk (or almond milk)",
        "quantity": "1 cup",
        "note": "Cooling or neutral depending on type"
      },
      {
        "name": "Banana",
        "quantity": "1 small",
        "note": "Sweet, heavy"
      },
      {
        "name": "Apple",
        "quantity": "1/2 sliced",
        "note": "Balances Pitta"
      },
      {
        "name": "Cinnamon",
        "quantity": "1/2 tsp",
        "note": "Improves digestion"
      }
    ],
    "instructions": [
      "Boil oats in milk until soft.",
      "Top with chopped fruits and cinnamon.",
      "Serve warm."
    ],
    "nutrition": {
      "calories": 280,
      "protein_g": 8,
      "carbs_g": 52,
      "fat_g": 5,
      "fiber_g": 7,
      "vitamins": {
        "Vitamin B1": "15%",
        "Vitamin C": "6%"
      },
      "minerals": {
        "Iron": "12%",
        "Magnesium": "20%"
      },
      "glycemic_index": 50,
      "nutrient_density_score": 8.2
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Kashaya"
      ],
      "virya": "Shita",
      "vipaka": "Madhura",
      "prabhava": "Strength-giving",
      "dosha_effect": {
        "Vata": "\u2193",
        "Pitta": "\u2193",
        "Kapha": "\u2191"
      },
      "effects_on_doshas": "Good for Vata and Pitta, can increase Kapha if taken in excess."
    },
    "health_benefits": [
      "Sustained energy",
      "Rich in fiber",
      "Improves satiety"
    ]
  },
  {
    "id": 3,
    "name": "Vegetable Upma",
    "type": "Breakfast",
    "cuisine": "Indian",
    "ingredients": [
      {
        "name": "Semolina (rava)",
        "quantity": "1/2 cup",
        "note": "Light, grounding"
      },
      {
        "name": "Carrot",
        "quantity": "1/4 cup chopped",
        "note": "Sweet, cooling"
      },
      {
        "name": "Beans",
        "quantity": "1/4 cup chopped",
        "note": "Balances Pitta"
      },
      {
        "name": "Green peas",
        "quantity": "2 tbsp",
        "note": "Slightly heavy"
      },
      {
        "name": "Ghee",
        "quantity": "1 tbsp",
        "note": "Digestive, grounding"
      }
    ],
    "instructions": [
      "Roast semolina until light golden.",
      "Cook vegetables in water with salt.",
      "Add semolina slowly, stir until thickened.",
      "Top with ghee."
    ],
    "nutrition": {
      "calories": 260,
      "protein_g": 7,
      "carbs_g": 45,
      "fat_g": 7,
      "fiber_g": 5,
      "vitamins": {
        "Vitamin A": "10%",
        "Folate": "12%"
      },
      "minerals": {
        "Iron": "8%",
        "Calcium": "4%"
      },
      "glycemic_index": 65,
      "nutrient_density_score": 6.8
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Tikta"
      ],
      "virya": "Ushna",
      "vipaka": "Madhura",
      "prabhava": "Quick energy provider",
      "dosha_effect": {
        "Vata": "\u2193",
        "Pitta": "neutral",
        "Kapha": "\u2191"
      },
      "effects_on_doshas": "Balances Vata, neutral for Pitta, can increase Kapha."
    },
    "health_benefits": [
      "Easily digestible",
      "Energy-giving",
      "Customizable with veggies"
    ]
  },
  {
    "id": 4,
    "name": "Mung Bean Soup",
    "type": "Soup",
    "cuisine": "Indian",
    "ingredients": [
      {
        "name": "Mung beans (whole green)",
        "quantity": "1/2 cup",
        "note": "Light, tridoshic"
      },
      {
        "name": "Cumin",
        "quantity": "1 tsp",
        "note": "Agni stimulant"
      },
      {
        "name": "Turmeric",
        "quantity": "1/2 tsp",
        "note": "Anti-inflammatory"
      },
      {
        "name": "Ginger",
        "quantity": "1 inch",
        "note": "Improves digestion"
      }
    ],
    "instructions": [
      "Soak mung beans for 4 hours.",
      "Cook until soft with turmeric and salt.",
      "Prepare tadka with cumin and ginger, add to soup."
    ],
    "nutrition": {
      "calories": 210,
      "protein_g": 14,
      "carbs_g": 36,
      "fat_g": 2,
      "fiber_g": 8,
      "vitamins": {
        "Vitamin C": "5%",
        "Folate": "25%"
      },
      "minerals": {
        "Iron": "16%",
        "Potassium": "20%"
      },
      "glycemic_index": 30,
      "nutrient_density_score": 9.1
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Kashaya"
      ],
      "virya": "Shita",
      "vipaka": "Madhura",
      "prabhava": "Detoxifying",
      "dosha_effect": {
        "Vata": "\u2193",
        "Pitta": "\u2193",
        "Kapha": "\u2193"
      },
      "effects_on_doshas": "Balances all doshas, especially good for Pitta and Kapha."
    },
    "health_benefits": [
      "Detoxifying",
      "High in protein",
      "Improves digestion"
    ]
  },
  {
    "id": 5,
    "name": "Vegetable Stir-Fry",
    "type": "Side Dish",
    "cuisine": "Global",
    "ingredients": [
      {
        "name": "Broccoli",
        "quantity": "1/2 cup",
        "note": "Bitter, balances Kapha"
      },
      {
        "name": "Carrot",
        "quantity": "1/4 cup",
        "note": "Sweet, cooling"
      },
      {
        "name": "Bell peppers",
        "quantity": "1/4 cup",
        "note": "Pitta balancing"
      },
      {
        "name": "Sesame oil",
        "quantity": "1 tsp",
        "note": "Heating, grounding"
      },
      {
        "name": "Soy sauce",
        "quantity": "1 tsp",
        "note": "Adds umami flavor"
      }
    ],
    "instructions": [
      "Heat oil in a pan.",
      "Add vegetables and stir-fry quickly.",
      "Season with soy sauce and serve warm."
    ],
    "nutrition": {
      "calories": 150,
      "protein_g": 5,
      "carbs_g": 18,
      "fat_g": 6,
      "fiber_g": 5,
      "vitamins": {
        "Vitamin C": "60%",
        "Vitamin A": "20%"
      },
      "minerals": {
        "Iron": "6%",
        "Calcium": "8%"
      },
      "glycemic_index": 30,
      "nutrient_density_score": 8.5
    },
    "ayurvedic_properties": {
      "rasa": [
        "Tikta",
        "Kashaya"
      ],
      "virya": "Ushna",
      "vipaka": "Katu",
      "prabhava": "Light and digestible",
      "dosha_effect": {
        "Vata": "neutral",
        "Pitta": "\u2193",
        "Kapha": "\u2193"
      },
      "effects_on_doshas": "Pacifies Kapha, neutral for Vata, good for Pitta in moderation."
    },
    "health_benefits": [
      "Rich in antioxidants",
      "Low calorie",
      "Supports metabolism"
    ]
  },
  {
    "id": 6,
    "name": "Masoor Dal (Red Lentil Curry)",
    "type": "Main Course",
    "cuisine": "Indian",
    "ingredients": [
      {
        "name": "Red lentils",
        "quantity": "1/2 cup",
        "note": "Light, sweet post-digestive"
      },
      {
        "name": "Onion",
        "quantity": "1 small",
        "note": "Warming, can aggravate Pitta"
      },
      {
        "name": "Tomato",
        "quantity": "1 medium",
        "note": "Sour, increases Pitta"
      },
      {
        "name": "Turmeric",
        "quantity": "1/2 tsp",
        "note": "Balances all doshas"
      },
      {
        "name": "Cumin seeds",
        "quantity": "1 tsp",
        "note": "Agni stimulant"
      }
    ],
    "instructions": [
      "Wash and cook lentils with turmeric until soft.",
      "Prepare tadka with onion, tomato, cumin.",
      "Mix into dal and simmer 5 minutes."
    ],
    "nutrition": {
      "calories": 230,
      "protein_g": 15,
      "carbs_g": 35,
      "fat_g": 3,
      "fiber_g": 8,
      "vitamins": {
        "Vitamin C": "8%",
        "Folate": "40%"
      },
      "minerals": {
        "Iron": "20%",
        "Potassium": "15%"
      },
      "glycemic_index": 35,
      "nutrient_density_score": 8.9
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Kashaya"
      ],
      "virya": "Ushna",
      "vipaka": "Madhura",
      "prabhava": "Strength-building",
      "dosha_effect": {
        "Vata": "\u2193",
        "Pitta": "\u2191",
        "Kapha": "\u2193"
      },
      "effects_on_doshas": "Good for Vata and Kapha, may increase Pitta if consumed excessively."
    },
    "health_benefits": [
      "High protein",
      "Improves hemoglobin",
      "Easily digestible"
    ]
  },
  {
    "id": 7,
    "name": "Lassi (Sweet Yogurt Drink)",
    "type": "Beverage",
    "cuisine": "Indian",
    "ingredients": [
      {
        "name": "Yogurt",
        "quantity": "1 cup",
        "note": "Cooling, heavy"
      },
      {
        "name": "Water",
        "quantity": "1/2 cup",
        "note": "Neutral"
      },
      {
        "name": "Sugar",
        "quantity": "2 tsp",
        "note": "Cooling, heavy"
      },
      {
        "name": "Cardamom powder",
        "quantity": "1/4 tsp",
        "note": "Digestive aid"
      }
    ],
    "instructions": [
      "Blend yogurt with water until smooth.",
      "Add sugar and cardamom powder.",
      "Serve chilled (not ice-cold)."
    ],
    "nutrition": {
      "calories": 180,
      "protein_g": 6,
      "carbs_g": 28,
      "fat_g": 4,
      "fiber_g": 0,
      "vitamins": {
        "Vitamin B12": "8%",
        "Vitamin D": "4%"
      },
      "minerals": {
        "Calcium": "18%",
        "Phosphorus": "12%"
      },
      "glycemic_index": 45,
      "nutrient_density_score": 7.0
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura"
      ],
      "virya": "Shita",
      "vipaka": "Madhura",
      "prabhava": "Cooling tonic",
      "dosha_effect": {
        "Vata": "\u2193",
        "Pitta": "\u2193",
        "Kapha": "\u2191"
      },
      "effects_on_doshas": "Excellent for Pitta, pacifies Vata mildly, increases Kapha."
    },
    "health_benefits": [
      "Aids digestion",
      "Cooling effect",
      "Probiotic benefits"
    ]
  },
  {
    "id": 8,
    "name": "Vegetable Pulao",
    "type": "Main Course",
    "cuisine": "Indian",
    "ingredients": [
      {
        "name": "Basmati rice",
        "quantity": "1 cup",
        "note": "Cooling, sweet"
      },
      {
        "name": "Carrot",
        "quantity": "1/4 cup chopped",
        "note": "Sweet, light"
      },
      {
        "name": "Beans",
        "quantity": "1/4 cup chopped",
        "note": "Balances Pitta"
      },
      {
        "name": "Green peas",
        "quantity": "2 tbsp",
        "note": "Heavy"
      },
      {
        "name": "Cloves and cardamom",
        "quantity": "2 each",
        "note": "Digestive, aromatic"
      }
    ],
    "instructions": [
      "Soak rice for 20 minutes.",
      "Saut\u00e9 spices and vegetables in ghee.",
      "Add rice and water, cook until fluffy."
    ],
    "nutrition": {
      "calories": 340,
      "protein_g": 8,
      "carbs_g": 65,
      "fat_g": 7,
      "fiber_g": 6,
      "vitamins": {
        "Vitamin A": "15%",
        "Folate": "18%"
      },
      "minerals": {
        "Iron": "10%",
        "Magnesium": "12%"
      },
      "glycemic_index": 60,
      "nutrient_density_score": 7.2
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Tikta"
      ],
      "virya": "Ushna",
      "vipaka": "Madhura",
      "prabhava": "Sattvic meal",
      "dosha_effect": {
        "Vata": "\u2193",
        "Pitta": "neutral",
        "Kapha": "\u2191"
      },
      "effects_on_doshas": "Balances Vata, neutral for Pitta, can increase Kapha."
    },
    "health_benefits": [
      "Provides energy",
      "Rich in fiber",
      "Sattvic and wholesome"
    ]
  },
  {
    "id": 9,
    "name": "Lentil Salad with Lemon Dressing",
    "type": "Salad",
    "cuisine": "Global",
    "ingredients": [
      {
        "name": "Brown lentils",
        "quantity": "1/2 cup cooked",
        "note": "Grounding, tridoshic"
      },
      {
        "name": "Cucumber",
        "quantity": "1/4 cup chopped",
        "note": "Cooling"
      },
      {
        "name": "Tomato",
        "quantity": "1/4 cup chopped",
        "note": "Sour, Pitta aggravating"
      },
      {
        "name": "Lemon juice",
        "quantity": "1 tbsp",
        "note": "Sour, stimulates digestion"
      },
      {
        "name": "Olive oil",
        "quantity": "1 tsp",
        "note": "Neutral, nourishing"
      }
    ],
    "instructions": [
      "Cook lentils until soft but not mushy.",
      "Mix with chopped vegetables.",
      "Add lemon juice, olive oil, and salt."
    ],
    "nutrition": {
      "calories": 200,
      "protein_g": 11,
      "carbs_g": 32,
      "fat_g": 4,
      "fiber_g": 9,
      "vitamins": {
        "Vitamin C": "20%",
        "Folate": "22%"
      },
      "minerals": {
        "Iron": "15%",
        "Magnesium": "14%"
      },
      "glycemic_index": 25,
      "nutrient_density_score": 9.0
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Amla"
      ],
      "virya": "Shita",
      "vipaka": "Madhura",
      "prabhava": "Refreshing",
      "dosha_effect": {
        "Vata": "\u2193",
        "Pitta": "\u2191",
        "Kapha": "\u2193"
      },
      "effects_on_doshas": "Balances Kapha and Vata, but lemon and tomato may aggravate Pitta."
    },
    "health_benefits": [
      "High in fiber",
      "Rich in plant protein",
      "Cooling and refreshing"
    ]
  },
  {
    "id": 10,
    "name": "Kheer (Rice Pudding)",
    "type": "Dessert",
    "cuisine": "Indian",
    "ingredients": [
      {
        "name": "Rice",
        "quantity": "1/4 cup",
        "note": "Sweet, cooling"
      },
      {
        "name": "Milk",
        "quantity": "2 cups",
        "note": "Nourishing, heavy"
      },
      {
        "name": "Sugar",
        "quantity": "3 tbsp",
        "note": "Sweet, heavy"
      },
      {
        "name": "Cardamom",
        "quantity": "1/4 tsp",
        "note": "Digestive"
      },
      {
        "name": "Cashews and raisins",
        "quantity": "2 tbsp",
        "note": "Strength-giving"
      }
    ],
    "instructions": [
      "Cook rice in milk until soft.",
      "Add sugar, cardamom, and nuts.",
      "Simmer until creamy."
    ],
    "nutrition": {
      "calories": 320,
      "protein_g": 9,
      "carbs_g": 52,
      "fat_g": 10,
      "fiber_g": 1,
      "vitamins": {
        "Vitamin B2": "6%",
        "Vitamin D": "4%"
      },
      "minerals": {
        "Calcium": "20%",
        "Iron": "6%"
      },
      "glycemic_index": 65,
      "nutrient_density_score": 6.5
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura"
      ],
      "virya": "Shita",
      "vipaka": "Madhura",
      "prabhava": "Nourishing dessert",
      "dosha_effect": {
        "Vata": "\u2193",
        "Pitta": "\u2193",
        "Kapha": "\u2191"
      },
      "effects_on_doshas": "Pacifies Vata and Pitta, increases Kapha."
    },
    "health_benefits": [
      "Nourishing",
      "Strength-giving",
      "Comfort food"
    ]
  },
  {
    "id": 11,
    "name": "Vegetable Upma",
    "cuisine": "South Indian",
    "ingredients": [
      {
        "item": "Rava (semolina)",
        "quantity": "1 cup",
        "ayurvedic_note": "Light, warming, balances Vata"
      },
      {
        "item": "Mixed vegetables",
        "quantity": "1 cup",
        "ayurvedic_note": "Adds vitamins, balances Tridosha"
      },
      {
        "item": "Ghee",
        "quantity": "1 tbsp",
        "ayurvedic_note": "Enhances digestion, grounding"
      },
      {
        "item": "Mustard seeds & curry leaves",
        "quantity": "1 tsp",
        "ayurvedic_note": "Improves Agni, clears Kapha"
      }
    ],
    "instructions": [
      "Dry roast semolina until lightly golden.",
      "In ghee, temper mustard seeds, curry leaves, and add chopped vegetables.",
      "Add water, salt, and simmer until vegetables soften.",
      "Add semolina slowly, stirring to avoid lumps.",
      "Cook until fluffy, garnish with coriander."
    ],
    "nutritional_profile": {
      "calories": 280,
      "protein_g": 7,
      "carbs_g": 45,
      "fats_g": 8,
      "fiber_g": 6,
      "vitamins": [
        "Vitamin A",
        "Vitamin C",
        "B-complex"
      ],
      "minerals": [
        "Iron",
        "Magnesium"
      ],
      "glycemic_index": 62,
      "nutrient_density_score": 6.5
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Kashaya"
      ],
      "virya": "Ushna",
      "vipaka": "Madhura",
      "prabhava": "Easily digestible breakfast",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "neutral",
        "kapha": "\u2191"
      },
      "guna": [
        "Laghu",
        "Snigdha"
      ]
    },
    "health_benefits": [
      "Provides sustained energy in the morning",
      "Balances Vata with warmth",
      "Improves digestion when taken with ghee"
    ]
  },
  {
    "id": 12,
    "name": "Palak Paneer",
    "cuisine": "North Indian",
    "ingredients": [
      {
        "item": "Spinach (Palak)",
        "quantity": "2 cups",
        "ayurvedic_note": "Cooling, balances Pitta, rich in iron"
      },
      {
        "item": "Paneer",
        "quantity": "150g",
        "ayurvedic_note": "Heavy, nourishing, Kapha increasing"
      },
      {
        "item": "Ghee",
        "quantity": "1 tbsp",
        "ayurvedic_note": "Aids digestion, grounding"
      },
      {
        "item": "Spices (cumin, ginger, garlic)",
        "quantity": "1 tsp each",
        "ayurvedic_note": "Enhances Agni, balances Kapha"
      }
    ],
    "instructions": [
      "Blanch spinach and puree.",
      "Saut\u00e9 cumin, ginger, and garlic in ghee.",
      "Add paneer cubes and cook lightly.",
      "Mix spinach puree, add salt and spices.",
      "Simmer until creamy and serve hot."
    ],
    "nutritional_profile": {
      "calories": 320,
      "protein_g": 16,
      "carbs_g": 12,
      "fats_g": 24,
      "fiber_g": 4,
      "vitamins": [
        "Vitamin A",
        "Vitamin K",
        "Folate"
      ],
      "minerals": [
        "Calcium",
        "Iron"
      ],
      "glycemic_index": 40,
      "nutrient_density_score": 8.2
    },
    "ayurvedic_properties": {
      "rasa": [
        "Tikta",
        "Madhura"
      ],
      "virya": "Sheeta",
      "vipaka": "Madhura",
      "prabhava": "Balances Pitta heat",
      "dosha_effect": {
        "vata": "neutral",
        "pitta": "\u2193",
        "kapha": "\u2191"
      },
      "guna": [
        "Guru",
        "Snigdha"
      ]
    },
    "health_benefits": [
      "Rich source of calcium and iron",
      "Balances excess Pitta",
      "Supports bone strength and immunity"
    ]
  },
  {
    "id": 13,
    "name": "Khichdi",
    "cuisine": "Pan-Indian",
    "ingredients": [
      {
        "item": "Rice",
        "quantity": "1 cup",
        "ayurvedic_note": "Light, cooling, balances Pitta"
      },
      {
        "item": "Moong dal",
        "quantity": "1/2 cup",
        "ayurvedic_note": "Laghu, easy to digest, balances Tridosha"
      },
      {
        "item": "Ghee",
        "quantity": "1 tbsp",
        "ayurvedic_note": "Improves Agni, grounding"
      },
      {
        "item": "Cumin, turmeric, ginger",
        "quantity": "1 tsp each",
        "ayurvedic_note": "Boosts immunity, clears Kapha"
      }
    ],
    "instructions": [
      "Wash rice and dal thoroughly.",
      "In a pot, heat ghee, add cumin, ginger, and turmeric.",
      "Add rice and dal, stir for a minute.",
      "Add 4 cups water and simmer until soft.",
      "Serve warm with ghee."
    ],
    "nutritional_profile": {
      "calories": 280,
      "protein_g": 11,
      "carbs_g": 46,
      "fats_g": 8,
      "fiber_g": 7,
      "vitamins": [
        "Vitamin B1",
        "Vitamin C"
      ],
      "minerals": [
        "Magnesium",
        "Potassium"
      ],
      "glycemic_index": 55,
      "nutrient_density_score": 8.0
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura"
      ],
      "virya": "Ushna",
      "vipaka": "Madhura",
      "prabhava": "Tridosha balancing food",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "\u2193",
        "kapha": "\u2193"
      },
      "guna": [
        "Laghu",
        "Snigdha"
      ]
    },
    "health_benefits": [
      "Excellent detox food in Ayurveda",
      "Balances all three doshas",
      "Improves digestion and boosts immunity"
    ]
  },
  {
    "id": 14,
    "name": "Masoor Dal Curry",
    "cuisine": "Indian",
    "ingredients": [
      {
        "item": "Masoor dal (red lentils)",
        "quantity": "1 cup",
        "ayurvedic_note": "Laghu, balances Vata & Pitta"
      },
      {
        "item": "Tomatoes",
        "quantity": "2",
        "ayurvedic_note": "Cooling, balances Pitta"
      },
      {
        "item": "Ghee",
        "quantity": "1 tbsp",
        "ayurvedic_note": "Grounding, aids digestion"
      },
      {
        "item": "Spices (turmeric, cumin)",
        "quantity": "1 tsp each",
        "ayurvedic_note": "Boosts Agni, reduces Kapha"
      }
    ],
    "instructions": [
      "Wash and pressure cook lentils until soft.",
      "In ghee, saut\u00e9 cumin, turmeric, and chopped tomatoes.",
      "Add cooked lentils, salt, and simmer for 10 minutes.",
      "Garnish with coriander leaves."
    ],
    "nutritional_profile": {
      "calories": 240,
      "protein_g": 15,
      "carbs_g": 35,
      "fats_g": 6,
      "fiber_g": 8,
      "vitamins": [
        "Folate",
        "Vitamin B6"
      ],
      "minerals": [
        "Iron",
        "Potassium"
      ],
      "glycemic_index": 30,
      "nutrient_density_score": 9.0
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Tikta"
      ],
      "virya": "Ushna",
      "vipaka": "Madhura",
      "prabhava": "Balances Vata-related weakness",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "\u2193",
        "kapha": "\u2191"
      },
      "guna": [
        "Laghu"
      ]
    },
    "health_benefits": [
      "Rich in protein and iron",
      "Improves digestion and gut health",
      "Strengthens immunity"
    ]
  },
  {
    "id": 15,
    "name": "Curd Rice",
    "cuisine": "South Indian",
    "ingredients": [
      {
        "item": "Cooked rice",
        "quantity": "1 cup",
        "ayurvedic_note": "Cooling, balances Pitta"
      },
      {
        "item": "Curd (yogurt)",
        "quantity": "1/2 cup",
        "ayurvedic_note": "Sheeta virya, Pitta pacifying"
      },
      {
        "item": "Ghee",
        "quantity": "1 tsp",
        "ayurvedic_note": "Improves digestion"
      },
      {
        "item": "Mustard seeds, curry leaves",
        "quantity": "1 tsp",
        "ayurvedic_note": "Enhances Agni, balances Kapha"
      }
    ],
    "instructions": [
      "Mix cooled cooked rice with curd.",
      "In ghee, temper mustard seeds and curry leaves.",
      "Pour seasoning over rice-curd mixture.",
      "Serve with pickle or papad."
    ],
    "nutritional_profile": {
      "calories": 210,
      "protein_g": 6,
      "carbs_g": 36,
      "fats_g": 6,
      "fiber_g": 2,
      "vitamins": [
        "Vitamin B12",
        "Vitamin D"
      ],
      "minerals": [
        "Calcium",
        "Phosphorus"
      ],
      "glycemic_index": 58,
      "nutrient_density_score": 6.8
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Amla"
      ],
      "virya": "Sheeta",
      "vipaka": "Amla",
      "prabhava": "Cooling for digestion",
      "dosha_effect": {
        "vata": "\u2191",
        "pitta": "\u2193",
        "kapha": "\u2191"
      },
      "guna": [
        "Guru",
        "Snigdha"
      ]
    },
    "health_benefits": [
      "Excellent cooling dish in summer",
      "Balances Pitta heat",
      "Supports gut microbiome with probiotics"
    ]
  },
  {
    "id": 16,
    "name": "Vegetable Daliya (Broken Wheat Porridge)",
    "cuisine": "Indian",
    "ingredients": [
      {
        "item": "Broken wheat (daliya)",
        "quantity": "1 cup",
        "ayurvedic_note": "High fiber, balances Kapha"
      },
      {
        "item": "Mixed vegetables",
        "quantity": "1 cup",
        "ayurvedic_note": "Tridosha balancing, rich in vitamins"
      },
      {
        "item": "Ghee",
        "quantity": "1 tbsp",
        "ayurvedic_note": "Grounding and nourishing"
      },
      {
        "item": "Spices (cumin, ginger)",
        "quantity": "1 tsp each",
        "ayurvedic_note": "Stimulates Agni"
      }
    ],
    "instructions": [
      "Roast daliya lightly in ghee.",
      "Add vegetables, water, and spices.",
      "Pressure cook until soft.",
      "Serve warm with fresh coriander."
    ],
    "nutritional_profile": {
      "calories": 250,
      "protein_g": 9,
      "carbs_g": 45,
      "fats_g": 6,
      "fiber_g": 7,
      "vitamins": [
        "Vitamin B1",
        "Vitamin C"
      ],
      "minerals": [
        "Iron",
        "Zinc"
      ],
      "glycemic_index": 48,
      "nutrient_density_score": 7.5
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Kashaya"
      ],
      "virya": "Ushna",
      "vipaka": "Madhura",
      "prabhava": "Light yet nourishing",
      "dosha_effect": {
        "vata": "neutral",
        "pitta": "neutral",
        "kapha": "\u2193"
      },
      "guna": [
        "Laghu"
      ]
    },
    "health_benefits": [
      "Rich in fiber for digestion",
      "Balances Kapha and supports weight management",
      "Provides slow-release energy"
    ]
  },
  {
    "id": 17,
    "name": "Tomato Rasam",
    "cuisine": "South Indian",
    "ingredients": [
      {
        "item": "Tomatoes",
        "quantity": "3",
        "ayurvedic_note": "Cooling, balances Pitta"
      },
      {
        "item": "Tamarind pulp",
        "quantity": "2 tbsp",
        "ayurvedic_note": "Amla rasa, digestive stimulant"
      },
      {
        "item": "Black pepper & cumin",
        "quantity": "1 tsp each",
        "ayurvedic_note": "Deepana (enhances digestion)"
      },
      {
        "item": "Curry leaves",
        "quantity": "6-8",
        "ayurvedic_note": "Improves Agni"
      }
    ],
    "instructions": [
      "Boil tomatoes and tamarind pulp in water.",
      "Add spices (pepper, cumin) and curry leaves.",
      "Simmer for 10 minutes.",
      "Serve hot as soup or with rice."
    ],
    "nutritional_profile": {
      "calories": 70,
      "protein_g": 2,
      "carbs_g": 12,
      "fats_g": 2,
      "fiber_g": 3,
      "vitamins": [
        "Vitamin C",
        "Vitamin A"
      ],
      "minerals": [
        "Potassium",
        "Manganese"
      ],
      "glycemic_index": 30,
      "nutrient_density_score": 7.0
    },
    "ayurvedic_properties": {
      "rasa": [
        "Amla",
        "Katu"
      ],
      "virya": "Ushna",
      "vipaka": "Katu",
      "prabhava": "Stimulates appetite and digestion",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "neutral",
        "kapha": "\u2193"
      },
      "guna": [
        "Laghu",
        "Tikshna"
      ]
    },
    "health_benefits": [
      "Improves digestion and appetite",
      "Clears Kapha congestion",
      "Rich in antioxidants like lycopene"
    ]
  },
  {
    "id": 18,
    "name": "Lemon Rice",
    "cuisine": "South Indian",
    "ingredients": [
      {
        "item": "Cooked rice",
        "quantity": "1 cup",
        "ayurvedic_note": "Cooling, Pitta pacifying"
      },
      {
        "item": "Lemon juice",
        "quantity": "2 tbsp",
        "ayurvedic_note": "Amla rasa, stimulates Agni"
      },
      {
        "item": "Mustard seeds, curry leaves",
        "quantity": "1 tsp",
        "ayurvedic_note": "Clears Kapha, enhances digestion"
      },
      {
        "item": "Green chilies",
        "quantity": "1-2",
        "ayurvedic_note": "Ushna, stimulates digestion"
      }
    ],
    "instructions": [
      "Mix cooled cooked rice with lemon juice and salt.",
      "In ghee, temper mustard seeds, curry leaves, and chilies.",
      "Mix seasoning into rice and serve."
    ],
    "nutritional_profile": {
      "calories": 210,
      "protein_g": 4,
      "carbs_g": 40,
      "fats_g": 5,
      "fiber_g": 2,
      "vitamins": [
        "Vitamin C",
        "Vitamin B1"
      ],
      "minerals": [
        "Iron",
        "Magnesium"
      ],
      "glycemic_index": 58,
      "nutrient_density_score": 6.2
    },
    "ayurvedic_properties": {
      "rasa": [
        "Amla",
        "Madhura"
      ],
      "virya": "Ushna",
      "vipaka": "Amla",
      "prabhava": "Light and appetite-enhancing",
      "dosha_effect": {
        "vata": "neutral",
        "pitta": "\u2193",
        "kapha": "\u2191"
      },
      "guna": [
        "Laghu"
      ]
    },
    "health_benefits": [
      "Excellent summer meal",
      "Balances Pitta and refreshes mind",
      "Improves digestion with lemon"
    ]
  },
  {
    "id": 19,
    "name": "Oats Vegetable Chilla",
    "cuisine": "Modern Indian",
    "ingredients": [
      {
        "item": "Oats flour",
        "quantity": "1 cup",
        "ayurvedic_note": "Laghu, balances Kapha"
      },
      {
        "item": "Grated carrots & spinach",
        "quantity": "1 cup",
        "ayurvedic_note": "Adds vitamins, Tridosha balancing"
      },
      {
        "item": "Spices (ginger, cumin)",
        "quantity": "1 tsp each",
        "ayurvedic_note": "Stimulates Agni"
      },
      {
        "item": "Oil",
        "quantity": "1 tbsp",
        "ayurvedic_note": "Neutral, balancing"
      }
    ],
    "instructions": [
      "Mix oats flour with water and spices into a batter.",
      "Add grated vegetables.",
      "Pour onto a hot pan, cook both sides like a pancake.",
      "Serve with chutney."
    ],
    "nutritional_profile": {
      "calories": 200,
      "protein_g": 8,
      "carbs_g": 30,
      "fats_g": 6,
      "fiber_g": 6,
      "vitamins": [
        "Vitamin A",
        "Vitamin C"
      ],
      "minerals": [
        "Iron",
        "Zinc"
      ],
      "glycemic_index": 45,
      "nutrient_density_score": 7.8
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Kashaya"
      ],
      "virya": "Ushna",
      "vipaka": "Madhura",
      "prabhava": "Healthy alternative to fried snacks",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "neutral",
        "kapha": "\u2193"
      },
      "guna": [
        "Laghu"
      ]
    },
    "health_benefits": [
      "High in fiber, good for digestion",
      "Balances Kapha, supports weight management",
      "Provides satiety with fewer calories"
    ]
  },
  {
    "id": 20,
    "name": "Moong Dal Chilla",
    "cuisine": "Indian",
    "ingredients": [
      {
        "item": "Moong dal (soaked & ground)",
        "quantity": "1 cup",
        "ayurvedic_note": "Laghu, balances all doshas"
      },
      {
        "item": "Onion & coriander",
        "quantity": "1/2 cup",
        "ayurvedic_note": "Adds flavor, cooling"
      },
      {
        "item": "Green chili & ginger",
        "quantity": "1 tsp each",
        "ayurvedic_note": "Stimulates Agni"
      },
      {
        "item": "Oil",
        "quantity": "1 tbsp",
        "ayurvedic_note": "Neutral, grounding"
      }
    ],
    "instructions": [
      "Soak moong dal for 4 hours, grind into a batter.",
      "Mix with onion, coriander, chili, and ginger.",
      "Cook on a hot pan until golden on both sides.",
      "Serve hot with chutney."
    ],
    "nutritional_profile": {
      "calories": 220,
      "protein_g": 12,
      "carbs_g": 28,
      "fats_g": 6,
      "fiber_g": 7,
      "vitamins": [
        "Vitamin B6",
        "Vitamin C"
      ],
      "minerals": [
        "Iron",
        "Potassium"
      ],
      "glycemic_index": 35,
      "nutrient_density_score": 8.5
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Katu"
      ],
      "virya": "Ushna",
      "vipaka": "Madhura",
      "prabhava": "Light, protein-rich breakfast",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "neutral",
        "kapha": "\u2193"
      },
      "guna": [
        "Laghu"
      ]
    },
    "health_benefits": [
      "Rich in plant protein",
      "Balances Vata and Kapha",
      "Supports weight management and muscle repair"
    ]
  },
  {
    "id": 21,
    "name": "Quinoa Vegetable Bowl",
    "cuisine": "Global Fusion",
    "ingredients": [
      {
        "item": "Quinoa",
        "quantity": "1 cup",
        "ayurvedic_note": "Laghu, high protein, balances Kapha"
      },
      {
        "item": "Mixed vegetables (broccoli, carrot, beans)",
        "quantity": "1 cup",
        "ayurvedic_note": "Tridosha balancing"
      },
      {
        "item": "Olive oil",
        "quantity": "1 tbsp",
        "ayurvedic_note": "Snigdha, Pitta friendly"
      },
      {
        "item": "Lemon juice",
        "quantity": "1 tbsp",
        "ayurvedic_note": "Amla rasa, digestive stimulant"
      }
    ],
    "instructions": [
      "Cook quinoa until fluffy.",
      "Saut\u00e9 vegetables lightly in olive oil.",
      "Mix with quinoa, season with lemon and herbs.",
      "Serve warm as a balanced lunch/dinner."
    ],
    "nutritional_profile": {
      "calories": 280,
      "protein_g": 10,
      "carbs_g": 42,
      "fats_g": 9,
      "fiber_g": 6,
      "vitamins": [
        "Vitamin C",
        "Vitamin K",
        "Folate"
      ],
      "minerals": [
        "Magnesium",
        "Zinc"
      ],
      "glycemic_index": 53,
      "nutrient_density_score": 8.1
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Kashaya"
      ],
      "virya": "Ushna",
      "vipaka": "Madhura",
      "prabhava": "Light global alternative to rice",
      "dosha_effect": {
        "vata": "neutral",
        "pitta": "\u2193",
        "kapha": "\u2193"
      },
      "guna": [
        "Laghu"
      ]
    },
    "health_benefits": [
      "High protein, gluten-free option",
      "Balances Kapha, good for weight management",
      "Supports muscle repair and digestion"
    ]
  },
  {
    "id": 22,
    "name": "Avocado Toast with Seeds",
    "cuisine": "Western",
    "ingredients": [
      {
        "item": "Whole grain bread",
        "quantity": "2 slices",
        "ayurvedic_note": "Guru, nourishing, Kapha increasing"
      },
      {
        "item": "Avocado",
        "quantity": "1/2 fruit",
        "ayurvedic_note": "Snigdha, balances Vata, may increase Kapha"
      },
      {
        "item": "Pumpkin & sesame seeds",
        "quantity": "1 tbsp each",
        "ayurvedic_note": "Balancing, grounding, supports Ojas"
      },
      {
        "item": "Lemon juice",
        "quantity": "1 tsp",
        "ayurvedic_note": "Amla rasa, aids digestion"
      }
    ],
    "instructions": [
      "Toast bread slices.",
      "Mash avocado with lemon juice and seasonings.",
      "Spread on toast, sprinkle seeds.",
      "Serve as a quick breakfast/snack."
    ],
    "nutritional_profile": {
      "calories": 300,
      "protein_g": 8,
      "carbs_g": 34,
      "fats_g": 16,
      "fiber_g": 8,
      "vitamins": [
        "Vitamin E",
        "Vitamin C",
        "Folate"
      ],
      "minerals": [
        "Potassium",
        "Magnesium"
      ],
      "glycemic_index": 50,
      "nutrient_density_score": 8.4
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Amla"
      ],
      "virya": "Sheeta",
      "vipaka": "Madhura",
      "prabhava": "Grounding and nourishing breakfast",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "\u2193",
        "kapha": "\u2191"
      },
      "guna": [
        "Snigdha",
        "Guru"
      ]
    },
    "health_benefits": [
      "Rich in healthy fats and fiber",
      "Supports skin and immunity",
      "Good breakfast for Vata and Pitta"
    ]
  },
  {
    "id": 23,
    "name": "Greek Yogurt Parfait",
    "cuisine": "Mediterranean",
    "ingredients": [
      {
        "item": "Greek yogurt",
        "quantity": "1 cup",
        "ayurvedic_note": "Guru, cooling, Pitta pacifying"
      },
      {
        "item": "Fresh fruits (berries, banana)",
        "quantity": "1/2 cup",
        "ayurvedic_note": "Madhura rasa, energizing, balances Vata"
      },
      {
        "item": "Honey",
        "quantity": "1 tsp",
        "ayurvedic_note": "Madhura rasa, rejuvenating"
      },
      {
        "item": "Granola",
        "quantity": "2 tbsp",
        "ayurvedic_note": "Grounding, may increase Kapha"
      }
    ],
    "instructions": [
      "Layer yogurt, fruits, and granola in a glass.",
      "Drizzle with honey.",
      "Serve chilled as a breakfast or snack."
    ],
    "nutritional_profile": {
      "calories": 220,
      "protein_g": 12,
      "carbs_g": 32,
      "fats_g": 6,
      "fiber_g": 4,
      "vitamins": [
        "Vitamin C",
        "Vitamin B12"
      ],
      "minerals": [
        "Calcium",
        "Phosphorus"
      ],
      "glycemic_index": 40,
      "nutrient_density_score": 7.9
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Amla"
      ],
      "virya": "Sheeta",
      "vipaka": "Madhura",
      "prabhava": "Cooling and probiotic-rich",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "\u2193",
        "kapha": "\u2191"
      },
      "guna": [
        "Guru",
        "Snigdha"
      ]
    },
    "health_benefits": [
      "Rich in protein and probiotics",
      "Balances gut microbiome",
      "Excellent cooling snack for summer"
    ]
  },
  {
    "id": 24,
    "name": "Vegetable Sushi Rolls",
    "cuisine": "Japanese",
    "ingredients": [
      {
        "item": "Sushi rice",
        "quantity": "1 cup",
        "ayurvedic_note": "Guru, cooling, may increase Kapha"
      },
      {
        "item": "Seaweed (nori)",
        "quantity": "2 sheets",
        "ayurvedic_note": "Balances Pitta, rich in minerals"
      },
      {
        "item": "Vegetables (cucumber, carrot, avocado)",
        "quantity": "1/2 cup",
        "ayurvedic_note": "Light, refreshing, balances Pitta"
      },
      {
        "item": "Soy sauce (optional)",
        "quantity": "1 tsp",
        "ayurvedic_note": "Salty, Kapha increasing"
      }
    ],
    "instructions": [
      "Cook sushi rice and season lightly.",
      "Spread rice over nori, add vegetables.",
      "Roll tightly and slice into pieces.",
      "Serve with soy sauce if desired."
    ],
    "nutritional_profile": {
      "calories": 190,
      "protein_g": 5,
      "carbs_g": 36,
      "fats_g": 4,
      "fiber_g": 3,
      "vitamins": [
        "Vitamin A",
        "Vitamin C"
      ],
      "minerals": [
        "Iodine",
        "Magnesium"
      ],
      "glycemic_index": 55,
      "nutrient_density_score": 7.2
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Lavana"
      ],
      "virya": "Sheeta",
      "vipaka": "Madhura",
      "prabhava": "Refreshing, light meal",
      "dosha_effect": {
        "vata": "neutral",
        "pitta": "\u2193",
        "kapha": "\u2191"
      },
      "guna": [
        "Laghu"
      ]
    },
    "health_benefits": [
      "Light, mineral-rich lunch/dinner",
      "Cooling, good for summer",
      "Supports digestion and immunity"
    ]
  },
  {
    "id": 25,
    "name": "Lentil Soup",
    "cuisine": "Middle Eastern",
    "ingredients": [
      {
        "item": "Red lentils",
        "quantity": "1 cup",
        "ayurvedic_note": "Laghu, balances Vata & Pitta"
      },
      {
        "item": "Olive oil",
        "quantity": "1 tbsp",
        "ayurvedic_note": "Snigdha, Pitta pacifying"
      },
      {
        "item": "Onion, garlic, cumin",
        "quantity": "1 tsp each",
        "ayurvedic_note": "Agni deepana, clears Kapha"
      },
      {
        "item": "Lemon juice",
        "quantity": "1 tbsp",
        "ayurvedic_note": "Amla rasa, enhances digestion"
      }
    ],
    "instructions": [
      "Cook lentils until soft.",
      "Blend lightly for creaminess.",
      "Saut\u00e9 onion, garlic, cumin in olive oil, add to soup.",
      "Finish with lemon juice."
    ],
    "nutritional_profile": {
      "calories": 210,
      "protein_g": 14,
      "carbs_g": 32,
      "fats_g": 5,
      "fiber_g": 7,
      "vitamins": [
        "Folate",
        "Vitamin B6"
      ],
      "minerals": [
        "Iron",
        "Zinc"
      ],
      "glycemic_index": 32,
      "nutrient_density_score": 9.0
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Tikta"
      ],
      "virya": "Ushna",
      "vipaka": "Madhura",
      "prabhava": "Protein-rich light meal",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "neutral",
        "kapha": "\u2193"
      },
      "guna": [
        "Laghu"
      ]
    },
    "health_benefits": [
      "Excellent protein source",
      "Balances Vata and Kapha",
      "Improves digestion and immunity"
    ]
  },
  {
    "id": 26,
    "name": "Vegetable Stir-Fry with Tofu",
    "cuisine": "Asian Fusion",
    "ingredients": [
      {
        "item": "Tofu",
        "quantity": "1 cup",
        "ayurvedic_note": "Guru, nourishing, Kapha increasing"
      },
      {
        "item": "Mixed vegetables (broccoli, bell peppers, beans)",
        "quantity": "1 cup",
        "ayurvedic_note": "Tridosha balancing"
      },
      {
        "item": "Soy sauce & ginger",
        "quantity": "1 tbsp + 1 tsp",
        "ayurvedic_note": "Agni stimulating, Kapha balancing"
      },
      {
        "item": "Sesame oil",
        "quantity": "1 tbsp",
        "ayurvedic_note": "Snigdha, grounding"
      }
    ],
    "instructions": [
      "Saut\u00e9 tofu cubes until golden.",
      "Add vegetables and stir-fry with ginger.",
      "Add soy sauce and sesame oil, cook lightly.",
      "Serve hot with rice or quinoa."
    ],
    "nutritional_profile": {
      "calories": 280,
      "protein_g": 16,
      "carbs_g": 20,
      "fats_g": 16,
      "fiber_g": 5,
      "vitamins": [
        "Vitamin C",
        "Vitamin K"
      ],
      "minerals": [
        "Calcium",
        "Iron"
      ],
      "glycemic_index": 40,
      "nutrient_density_score": 8.3
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Lavana"
      ],
      "virya": "Sheeta",
      "vipaka": "Madhura",
      "prabhava": "Protein-rich dinner option",
      "dosha_effect": {
        "vata": "neutral",
        "pitta": "\u2193",
        "kapha": "\u2191"
      },
      "guna": [
        "Guru"
      ]
    },
    "health_benefits": [
      "Rich plant-based protein",
      "Balances Pitta heat",
      "Supports bone health and digestion"
    ]
  },
  {
    "id": 27,
    "name": "Vegetable Minestrone Soup",
    "cuisine": "Italian",
    "ingredients": [
      {
        "item": "Mixed vegetables",
        "quantity": "1 cup",
        "ayurvedic_note": "Tridosha balancing, light"
      },
      {
        "item": "Beans",
        "quantity": "1/2 cup",
        "ayurvedic_note": "Guru, nourishing, Kapha increasing"
      },
      {
        "item": "Pasta (whole wheat)",
        "quantity": "1/2 cup",
        "ayurvedic_note": "Grounding, Vata balancing"
      },
      {
        "item": "Olive oil & herbs",
        "quantity": "1 tbsp",
        "ayurvedic_note": "Snigdha, Pitta balancing"
      }
    ],
    "instructions": [
      "Cook beans and pasta until soft.",
      "Add vegetables and simmer in broth.",
      "Season with olive oil and herbs.",
      "Serve warm."
    ],
    "nutritional_profile": {
      "calories": 230,
      "protein_g": 10,
      "carbs_g": 38,
      "fats_g": 6,
      "fiber_g": 7,
      "vitamins": [
        "Vitamin A",
        "Vitamin C"
      ],
      "minerals": [
        "Iron",
        "Potassium"
      ],
      "glycemic_index": 55,
      "nutrient_density_score": 7.6
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Tikta"
      ],
      "virya": "Ushna",
      "vipaka": "Madhura",
      "prabhava": "Hearty and light dinner soup",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "neutral",
        "kapha": "\u2191"
      },
      "guna": [
        "Laghu"
      ]
    },
    "health_benefits": [
      "Rich in fiber and antioxidants",
      "Good evening meal for digestion",
      "Balances Vata with warmth"
    ]
  },
  {
    "id": 28,
    "name": "Vegetable Buddha Bowl",
    "cuisine": "Global Fusion",
    "ingredients": [
      {
        "item": "Brown rice",
        "quantity": "1 cup",
        "ayurvedic_note": "Guru, nourishing, Kapha increasing"
      },
      {
        "item": "Chickpeas",
        "quantity": "1/2 cup",
        "ayurvedic_note": "Guru, protein rich, Vata pacifying"
      },
      {
        "item": "Steamed greens",
        "quantity": "1 cup",
        "ayurvedic_note": "Pitta pacifying, cooling"
      },
      {
        "item": "Tahini dressing",
        "quantity": "2 tbsp",
        "ayurvedic_note": "Snigdha, grounding, nourishing"
      }
    ],
    "instructions": [
      "Cook brown rice until fluffy.",
      "Arrange rice, chickpeas, and greens in a bowl.",
      "Top with tahini dressing.",
      "Serve warm."
    ],
    "nutritional_profile": {
      "calories": 350,
      "protein_g": 14,
      "carbs_g": 50,
      "fats_g": 12,
      "fiber_g": 10,
      "vitamins": [
        "Vitamin B6",
        "Vitamin K"
      ],
      "minerals": [
        "Iron",
        "Magnesium"
      ],
      "glycemic_index": 45,
      "nutrient_density_score": 8.5
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Kashaya"
      ],
      "virya": "Sheeta",
      "vipaka": "Madhura",
      "prabhava": "Balanced one-bowl meal",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "\u2193",
        "kapha": "\u2191"
      },
      "guna": [
        "Guru",
        "Snigdha"
      ]
    },
    "health_benefits": [
      "Balanced macro- and micronutrients",
      "Supports gut health and satiety",
      "Good vegetarian meal for lunch/dinner"
    ]
  },
  {
    "id": 29,
    "name": "Vegetable Roti Wrap",
    "cuisine": "Indian Fusion",
    "ingredients": [
      {
        "item": "Whole wheat roti",
        "quantity": "2",
        "ayurvedic_note": "Guru, grounding, Kapha increasing"
      },
      {
        "item": "Paneer or tofu",
        "quantity": "100g",
        "ayurvedic_note": "Guru, nourishing, Kapha increasing"
      },
      {
        "item": "Vegetables (lettuce, cucumber, tomato)",
        "quantity": "1 cup",
        "ayurvedic_note": "Cooling, Pitta pacifying"
      },
      {
        "item": "Mint chutney",
        "quantity": "2 tbsp",
        "ayurvedic_note": "Ushna, stimulates digestion"
      }
    ],
    "instructions": [
      "Prepare whole wheat rotis.",
      "Stuff with paneer/tofu and vegetables.",
      "Add mint chutney.",
      "Roll and serve as lunch/dinner."
    ],
    "nutritional_profile": {
      "calories": 320,
      "protein_g": 14,
      "carbs_g": 40,
      "fats_g": 12,
      "fiber_g": 8,
      "vitamins": [
        "Vitamin C",
        "Vitamin A"
      ],
      "minerals": [
        "Calcium",
        "Iron"
      ],
      "glycemic_index": 50,
      "nutrient_density_score": 7.8
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Katu"
      ],
      "virya": "Ushna",
      "vipaka": "Madhura",
      "prabhava": "Portable meal",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "neutral",
        "kapha": "\u2191"
      },
      "guna": [
        "Guru"
      ]
    },
    "health_benefits": [
      "Good protein-carbohydrate balance",
      "Supports digestion with chutney",
      "Ideal lunchbox meal"
    ]
  },
  {
    "id": 30,
    "name": "Vegetable Oats Porridge",
    "cuisine": "Global Breakfast",
    "ingredients": [
      {
        "item": "Rolled oats",
        "quantity": "1 cup",
        "ayurvedic_note": "Laghu, Kapha increasing"
      },
      {
        "item": "Milk or almond milk",
        "quantity": "1 cup",
        "ayurvedic_note": "Guru, nourishing"
      },
      {
        "item": "Carrot, peas, beans",
        "quantity": "1/2 cup",
        "ayurvedic_note": "Tridosha balancing"
      },
      {
        "item": "Ghee",
        "quantity": "1 tsp",
        "ayurvedic_note": "Snigdha, Ojas building"
      }
    ],
    "instructions": [
      "Cook oats with milk until creamy.",
      "Add vegetables and cook until soft.",
      "Finish with ghee and mild spices.",
      "Serve warm as a breakfast."
    ],
    "nutritional_profile": {
      "calories": 250,
      "protein_g": 9,
      "carbs_g": 38,
      "fats_g": 7,
      "fiber_g": 5,
      "vitamins": [
        "Vitamin B1",
        "Vitamin D"
      ],
      "minerals": [
        "Iron",
        "Magnesium"
      ],
      "glycemic_index": 55,
      "nutrient_density_score": 7.7
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura"
      ],
      "virya": "Sheeta",
      "vipaka": "Madhura",
      "prabhava": "Energizing breakfast",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "\u2193",
        "kapha": "\u2191"
      },
      "guna": [
        "Guru"
      ]
    },
    "health_benefits": [
      "High-fiber wholesome breakfast",
      "Balances Vata and Pitta",
      "Keeps energy steady in morning"
    ]
  },
  {
    "id": 31,
    "name": "Upma",
    "cuisine": "South Indian",
    "ingredients": [
      {
        "item": "Semolina (rava)",
        "quantity": "1 cup",
        "ayurvedic_note": "Laghu, grounding, Kapha increasing"
      },
      {
        "item": "Onion, green chili, ginger",
        "quantity": "1 tbsp each",
        "ayurvedic_note": "Agni deepana, Kapha balancing"
      },
      {
        "item": "Mixed vegetables",
        "quantity": "1/2 cup",
        "ayurvedic_note": "Tridosha balancing"
      },
      {
        "item": "Ghee",
        "quantity": "1 tsp",
        "ayurvedic_note": "Snigdha, Ojas building"
      }
    ],
    "instructions": [
      "Roast semolina until golden.",
      "Saut\u00e9 onion, chili, ginger, add vegetables.",
      "Add water, cook semolina until fluffy.",
      "Finish with ghee."
    ],
    "nutritional_profile": {
      "calories": 240,
      "protein_g": 7,
      "carbs_g": 40,
      "fats_g": 6,
      "fiber_g": 5,
      "vitamins": [
        "Vitamin B1",
        "Vitamin C"
      ],
      "minerals": [
        "Iron",
        "Magnesium"
      ],
      "glycemic_index": 60,
      "nutrient_density_score": 7.2
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Katu"
      ],
      "virya": "Ushna",
      "vipaka": "Madhura",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "neutral",
        "kapha": "\u2191"
      },
      "guna": [
        "Laghu"
      ]
    },
    "health_benefits": [
      "Light breakfast option",
      "Balances Vata with warmth",
      "Energizing yet easy to digest"
    ]
  },
  {
    "id": 32,
    "name": "Poha",
    "cuisine": "Maharashtrian",
    "ingredients": [
      {
        "item": "Flattened rice (poha)",
        "quantity": "1 cup",
        "ayurvedic_note": "Laghu, Kapha balancing"
      },
      {
        "item": "Onion, curry leaves, green chili",
        "quantity": "1 tbsp each",
        "ayurvedic_note": "Agni stimulating"
      },
      {
        "item": "Peanuts",
        "quantity": "2 tbsp",
        "ayurvedic_note": "Snigdha, nourishing"
      },
      {
        "item": "Lemon juice",
        "quantity": "1 tsp",
        "ayurvedic_note": "Amla rasa, aids digestion"
      }
    ],
    "instructions": [
      "Wash poha and drain.",
      "Saut\u00e9 onion, curry leaves, chili.",
      "Add poha, peanuts, cook lightly.",
      "Finish with lemon juice."
    ],
    "nutritional_profile": {
      "calories": 220,
      "protein_g": 6,
      "carbs_g": 38,
      "fats_g": 6,
      "fiber_g": 4,
      "vitamins": [
        "Vitamin C",
        "Vitamin B6"
      ],
      "minerals": [
        "Iron",
        "Potassium"
      ],
      "glycemic_index": 55,
      "nutrient_density_score": 7.4
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Kashaya"
      ],
      "virya": "Ushna",
      "vipaka": "Madhura",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "neutral",
        "kapha": "\u2193"
      },
      "guna": [
        "Laghu"
      ]
    },
    "health_benefits": [
      "Quick, light breakfast",
      "Balances Kapha with spices",
      "Good energy booster in mornings"
    ]
  },
  {
    "id": 33,
    "name": "Vegetable Biryani",
    "cuisine": "Indian",
    "ingredients": [
      {
        "item": "Basmati rice",
        "quantity": "1 cup",
        "ayurvedic_note": "Guru, Kapha increasing"
      },
      {
        "item": "Mixed vegetables",
        "quantity": "1 cup",
        "ayurvedic_note": "Tridosha balancing"
      },
      {
        "item": "Spices (cloves, cardamom, cinnamon)",
        "quantity": "1 tsp mix",
        "ayurvedic_note": "Ushna, digestion enhancing"
      },
      {
        "item": "Ghee",
        "quantity": "1 tbsp",
        "ayurvedic_note": "Snigdha, Ojas building"
      }
    ],
    "instructions": [
      "Cook rice with whole spices.",
      "Layer with saut\u00e9ed vegetables and ghee.",
      "Steam until flavors combine.",
      "Serve with raita."
    ],
    "nutritional_profile": {
      "calories": 320,
      "protein_g": 8,
      "carbs_g": 55,
      "fats_g": 9,
      "fiber_g": 5,
      "vitamins": [
        "Vitamin A",
        "Vitamin C"
      ],
      "minerals": [
        "Iron",
        "Manganese"
      ],
      "glycemic_index": 58,
      "nutrient_density_score": 7.6
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Katu",
        "Tikta"
      ],
      "virya": "Ushna",
      "vipaka": "Madhura",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "neutral",
        "kapha": "\u2191"
      },
      "guna": [
        "Guru"
      ]
    },
    "health_benefits": [
      "Rich and flavorful meal",
      "Balances Vata with spices",
      "Provides satiety and nourishment"
    ]
  },
  {
    "id": 34,
    "name": "Vegetable Hakka Noodles",
    "cuisine": "Indo-Chinese",
    "ingredients": [
      {
        "item": "Noodles",
        "quantity": "1 cup",
        "ayurvedic_note": "Guru, Kapha increasing"
      },
      {
        "item": "Mixed vegetables",
        "quantity": "1 cup",
        "ayurvedic_note": "Tridosha balancing"
      },
      {
        "item": "Soy sauce & chili sauce",
        "quantity": "1 tbsp",
        "ayurvedic_note": "Ushna, Kapha reducing"
      },
      {
        "item": "Sesame oil",
        "quantity": "1 tbsp",
        "ayurvedic_note": "Snigdha, nourishing"
      }
    ],
    "instructions": [
      "Boil noodles until soft.",
      "Stir-fry vegetables with sauces.",
      "Toss noodles and sesame oil.",
      "Serve hot."
    ],
    "nutritional_profile": {
      "calories": 300,
      "protein_g": 9,
      "carbs_g": 52,
      "fats_g": 10,
      "fiber_g": 4,
      "vitamins": [
        "Vitamin C",
        "Vitamin B2"
      ],
      "minerals": [
        "Iron",
        "Selenium"
      ],
      "glycemic_index": 65,
      "nutrient_density_score": 7.0
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Amla",
        "Katu"
      ],
      "virya": "Ushna",
      "vipaka": "Madhura",
      "dosha_effect": {
        "vata": "neutral",
        "pitta": "\u2191",
        "kapha": "\u2191"
      },
      "guna": [
        "Guru"
      ]
    },
    "health_benefits": [
      "Quick satisfying dinner",
      "Provides energy and warmth",
      "Kapha heavy, best in moderation"
    ]
  },
  {
    "id": 35,
    "name": "Chickpea Salad",
    "cuisine": "Mediterranean",
    "ingredients": [
      {
        "item": "Boiled chickpeas",
        "quantity": "1 cup",
        "ayurvedic_note": "Guru, protein rich, Vata pacifying"
      },
      {
        "item": "Cucumber, tomato, onion",
        "quantity": "1 cup",
        "ayurvedic_note": "Cooling, Pitta pacifying"
      },
      {
        "item": "Olive oil & lemon juice",
        "quantity": "1 tbsp each",
        "ayurvedic_note": "Snigdha + Amla rasa, balancing"
      },
      {
        "item": "Parsley",
        "quantity": "1 tbsp",
        "ayurvedic_note": "Agni stimulating, Kapha reducing"
      }
    ],
    "instructions": [
      "Mix chickpeas with vegetables.",
      "Add olive oil, lemon juice, parsley.",
      "Toss and serve chilled."
    ],
    "nutritional_profile": {
      "calories": 260,
      "protein_g": 12,
      "carbs_g": 34,
      "fats_g": 9,
      "fiber_g": 9,
      "vitamins": [
        "Vitamin C",
        "Vitamin K"
      ],
      "minerals": [
        "Iron",
        "Magnesium"
      ],
      "glycemic_index": 35,
      "nutrient_density_score": 8.5
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Amla"
      ],
      "virya": "Sheeta",
      "vipaka": "Madhura",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "\u2193",
        "kapha": "\u2191"
      },
      "guna": [
        "Guru"
      ]
    },
    "health_benefits": [
      "Excellent plant protein",
      "Cooling, refreshing summer meal",
      "Supports digestion and immunity"
    ]
  },
  {
    "id": 36,
    "name": "Vegetable Clear Soup",
    "cuisine": "Asian",
    "ingredients": [
      {
        "item": "Mixed vegetables (carrot, beans, cabbage)",
        "quantity": "1 cup",
        "ayurvedic_note": "Light, Laghu, Tridosha balancing"
      },
      {
        "item": "Ginger & garlic",
        "quantity": "1 tsp each",
        "ayurvedic_note": "Agni deepana, Kapha pacifying"
      },
      {
        "item": "Soy sauce",
        "quantity": "1 tsp",
        "ayurvedic_note": "Salty, Kapha increasing"
      },
      {
        "item": "Olive oil",
        "quantity": "1 tsp",
        "ayurvedic_note": "Snigdha, nourishing"
      }
    ],
    "instructions": [
      "Boil vegetables until tender.",
      "Add ginger, garlic, soy sauce.",
      "Simmer briefly and serve hot."
    ],
    "nutritional_profile": {
      "calories": 120,
      "protein_g": 4,
      "carbs_g": 18,
      "fats_g": 4,
      "fiber_g": 3,
      "vitamins": [
        "Vitamin A",
        "Vitamin C"
      ],
      "minerals": [
        "Calcium",
        "Magnesium"
      ],
      "glycemic_index": 35,
      "nutrient_density_score": 7.8
    },
    "ayurvedic_properties": {
      "rasa": [
        "Tikta",
        "Katu"
      ],
      "virya": "Ushna",
      "vipaka": "Katu",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "neutral",
        "kapha": "\u2193"
      },
      "guna": [
        "Laghu"
      ]
    },
    "health_benefits": [
      "Light detox meal",
      "Supports digestion",
      "Good dinner for weight loss"
    ]
  },
  {
    "id": 37,
    "name": "Falafel Wrap",
    "cuisine": "Middle Eastern",
    "ingredients": [
      {
        "item": "Pita bread",
        "quantity": "1",
        "ayurvedic_note": "Guru, Kapha increasing"
      },
      {
        "item": "Falafel balls (chickpea)",
        "quantity": "3\u20134",
        "ayurvedic_note": "Guru, protein rich"
      },
      {
        "item": "Tahini sauce",
        "quantity": "2 tbsp",
        "ayurvedic_note": "Snigdha, nourishing"
      },
      {
        "item": "Vegetables (lettuce, tomato, cucumber)",
        "quantity": "1 cup",
        "ayurvedic_note": "Cooling, Pitta pacifying"
      }
    ],
    "instructions": [
      "Warm pita bread.",
      "Stuff with falafel, vegetables, tahini sauce.",
      "Roll into wrap and serve."
    ],
    "nutritional_profile": {
      "calories": 350,
      "protein_g": 14,
      "carbs_g": 46,
      "fats_g": 14,
      "fiber_g": 8,
      "vitamins": [
        "Vitamin B6",
        "Vitamin C"
      ],
      "minerals": [
        "Iron",
        "Magnesium"
      ],
      "glycemic_index": 45,
      "nutrient_density_score": 8.1
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Lavana"
      ],
      "virya": "Sheeta",
      "vipaka": "Madhura",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "\u2193",
        "kapha": "\u2191"
      },
      "guna": [
        "Guru",
        "Snigdha"
      ]
    },
    "health_benefits": [
      "Protein-rich meal",
      "Cooling and nourishing",
      "Good lunch or dinner wrap"
    ]
  },
  {
    "id": 38,
    "name": "Vegetable Omelette",
    "cuisine": "Global",
    "ingredients": [
      {
        "item": "Eggs",
        "quantity": "2",
        "ayurvedic_note": "Guru, nourishing, Kapha increasing"
      },
      {
        "item": "Onion, tomato, spinach",
        "quantity": "1/2 cup",
        "ayurvedic_note": "Tridosha balancing"
      },
      {
        "item": "Black pepper",
        "quantity": "1/4 tsp",
        "ayurvedic_note": "Agni stimulating, Kapha reducing"
      },
      {
        "item": "Ghee/oil",
        "quantity": "1 tsp",
        "ayurvedic_note": "Snigdha, Ojas building"
      }
    ],
    "instructions": [
      "Whisk eggs with salt and pepper.",
      "Add vegetables and cook in ghee/oil.",
      "Fold into omelette.",
      "Serve hot."
    ],
    "nutritional_profile": {
      "calories": 210,
      "protein_g": 14,
      "carbs_g": 4,
      "fats_g": 16,
      "fiber_g": 2,
      "vitamins": [
        "Vitamin A",
        "Vitamin D",
        "Vitamin B12"
      ],
      "minerals": [
        "Iron",
        "Zinc"
      ],
      "glycemic_index": 0,
      "nutrient_density_score": 8.7
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Katu"
      ],
      "virya": "Ushna",
      "vipaka": "Madhura",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "neutral",
        "kapha": "\u2191"
      },
      "guna": [
        "Guru"
      ]
    },
    "health_benefits": [
      "High protein breakfast",
      "Supports muscle health",
      "Balances Vata with warmth"
    ]
  },
  {
    "id": 39,
    "name": "Vegetable Khichdi",
    "cuisine": "Indian",
    "ingredients": [
      {
        "item": "Rice",
        "quantity": "1/2 cup",
        "ayurvedic_note": "Guru, Kapha increasing"
      },
      {
        "item": "Moong dal",
        "quantity": "1/2 cup",
        "ayurvedic_note": "Laghu, Vata pacifying"
      },
      {
        "item": "Ginger, cumin, turmeric",
        "quantity": "1 tsp mix",
        "ayurvedic_note": "Agni stimulating, Kapha balancing"
      },
      {
        "item": "Vegetables (carrot, beans)",
        "quantity": "1 cup",
        "ayurvedic_note": "Light, balancing"
      }
    ],
    "instructions": [
      "Cook rice and moong dal together.",
      "Add vegetables and spices.",
      "Simmer until porridge-like.",
      "Serve warm."
    ],
    "nutritional_profile": {
      "calories": 280,
      "protein_g": 12,
      "carbs_g": 46,
      "fats_g": 6,
      "fiber_g": 6,
      "vitamins": [
        "Vitamin A",
        "Vitamin C"
      ],
      "minerals": [
        "Iron",
        "Magnesium"
      ],
      "glycemic_index": 50,
      "nutrient_density_score": 8.3
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Tikta"
      ],
      "virya": "Ushna",
      "vipaka": "Madhura",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "neutral",
        "kapha": "\u2193"
      },
      "guna": [
        "Laghu"
      ]
    },
    "health_benefits": [
      "Detoxifying and light",
      "Balances all doshas, especially Vata",
      "Excellent for digestion"
    ]
  },
  {
    "id": 40,
    "name": "Vegetable Pasta in Tomato Sauce",
    "cuisine": "Italian",
    "ingredients": [
      {
        "item": "Whole wheat pasta",
        "quantity": "1 cup",
        "ayurvedic_note": "Guru, Vata balancing"
      },
      {
        "item": "Tomato sauce",
        "quantity": "1/2 cup",
        "ayurvedic_note": "Amla rasa, Pitta increasing"
      },
      {
        "item": "Mixed vegetables",
        "quantity": "1 cup",
        "ayurvedic_note": "Tridosha balancing"
      },
      {
        "item": "Olive oil",
        "quantity": "1 tbsp",
        "ayurvedic_note": "Snigdha, Pitta pacifying"
      }
    ],
    "instructions": [
      "Cook pasta until al dente.",
      "Prepare tomato sauce with vegetables.",
      "Mix pasta with sauce and olive oil.",
      "Serve warm."
    ],
    "nutritional_profile": {
      "calories": 310,
      "protein_g": 10,
      "carbs_g": 54,
      "fats_g": 9,
      "fiber_g": 7,
      "vitamins": [
        "Vitamin C",
        "Vitamin K"
      ],
      "minerals": [
        "Iron",
        "Potassium"
      ],
      "glycemic_index": 55,
      "nutrient_density_score": 7.9
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Amla"
      ],
      "virya": "Sheeta",
      "vipaka": "Amla",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "\u2191",
        "kapha": "\u2191"
      },
      "guna": [
        "Guru"
      ]
    },
    "health_benefits": [
      "Wholesome meal",
      "Rich in fiber and plant nutrients",
      "Energizing lunch or dinner"
    ]
  },
  {
    "recipe_name": "Vegetable Quinoa Upma",
    "meal_type": "Breakfast",
    "modern_nutrition": {
      "calories": 250,
      "protein": 8,
      "carbs": 42,
      "fats": 6,
      "vitamins": [
        "B-complex",
        "C"
      ],
      "minerals": [
        "Magnesium",
        "Iron"
      ]
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Tikta"
      ],
      "virya": "Ushna",
      "vipaka": "Madhura",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "\u2194",
        "kapha": "\u2194"
      },
      "guna": [
        "Laghu",
        "Snigdha"
      ]
    },
    "health_benefits": [
      "Protein-rich breakfast",
      "Improves digestion",
      "Satiating and wholesome"
    ]
  },
  {
    "recipe_name": "Lemon Coriander Soup",
    "meal_type": "Lunch",
    "modern_nutrition": {
      "calories": 90,
      "protein": 3,
      "carbs": 14,
      "fats": 2,
      "vitamins": [
        "C",
        "A"
      ],
      "minerals": [
        "Potassium",
        "Calcium"
      ]
    },
    "ayurvedic_properties": {
      "rasa": [
        "Amla",
        "Tikta"
      ],
      "virya": "Ushna",
      "vipaka": "Katu",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "\u2193",
        "kapha": "\u2191"
      },
      "guna": [
        "Laghu"
      ]
    },
    "health_benefits": [
      "Boosts immunity",
      "Light and detoxifying",
      "Good appetizer"
    ]
  },
  {
    "recipe_name": "Chickpea and Spinach Curry",
    "meal_type": "Lunch",
    "modern_nutrition": {
      "calories": 320,
      "protein": 12,
      "carbs": 45,
      "fats": 9,
      "vitamins": [
        "K",
        "B9"
      ],
      "minerals": [
        "Iron",
        "Magnesium"
      ]
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Tikta"
      ],
      "virya": "Ushna",
      "vipaka": "Madhura",
      "dosha_effect": {
        "vata": "\u2194",
        "pitta": "\u2191",
        "kapha": "\u2194"
      },
      "guna": [
        "Guru",
        "Snigdha"
      ]
    },
    "health_benefits": [
      "Rich in protein and fiber",
      "Supports bone health",
      "Balances digestion"
    ]
  },
  {
    "recipe_name": "Avocado Toast with Seeds",
    "meal_type": "Breakfast",
    "modern_nutrition": {
      "calories": 280,
      "protein": 7,
      "carbs": 30,
      "fats": 14,
      "vitamins": [
        "E",
        "K"
      ],
      "minerals": [
        "Magnesium",
        "Zinc"
      ]
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Kashaya"
      ],
      "virya": "Sheeta",
      "vipaka": "Madhura",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "\u2194",
        "kapha": "\u2191"
      },
      "guna": [
        "Snigdha",
        "Guru"
      ]
    },
    "health_benefits": [
      "Heart-healthy fats",
      "Satiety boosting",
      "Good for skin health"
    ]
  },
  {
    "recipe_name": "Moong Dal Cheela",
    "meal_type": "Breakfast/Dinner",
    "modern_nutrition": {
      "calories": 220,
      "protein": 11,
      "carbs": 28,
      "fats": 5,
      "vitamins": [
        "B-complex"
      ],
      "minerals": [
        "Iron",
        "Phosphorus"
      ]
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Kashaya"
      ],
      "virya": "Sheeta",
      "vipaka": "Madhura",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "\u2194",
        "kapha": "\u2193"
      },
      "guna": [
        "Laghu"
      ]
    },
    "health_benefits": [
      "Protein-rich",
      "Easy to digest",
      "Supports weight management"
    ]
  },
  {
    "recipe_name": "Paneer Tikka",
    "meal_type": "Dinner",
    "modern_nutrition": {
      "calories": 310,
      "protein": 18,
      "carbs": 15,
      "fats": 18,
      "vitamins": [
        "D",
        "B12"
      ],
      "minerals": [
        "Calcium",
        "Phosphorus"
      ]
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Amla"
      ],
      "virya": "Ushna",
      "vipaka": "Madhura",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "\u2191",
        "kapha": "\u2191"
      },
      "guna": [
        "Guru",
        "Snigdha"
      ]
    },
    "health_benefits": [
      "Good source of protein",
      "Bone strengthening",
      "Promotes satiety"
    ]
  },
  {
    "recipe_name": "Vegetable Barley Khichdi",
    "meal_type": "Lunch/Dinner",
    "modern_nutrition": {
      "calories": 240,
      "protein": 9,
      "carbs": 45,
      "fats": 4,
      "vitamins": [
        "B-complex"
      ],
      "minerals": [
        "Magnesium",
        "Selenium"
      ]
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura",
        "Kashaya"
      ],
      "virya": "Sheeta",
      "vipaka": "Madhura",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "\u2194",
        "kapha": "\u2193"
      },
      "guna": [
        "Laghu"
      ]
    },
    "health_benefits": [
      "Helps detoxify",
      "Light and easy to digest",
      "Supports gut health"
    ]
  },
  {
    "recipe_name": "Greek Yogurt with Honey and Nuts",
    "meal_type": "Snack",
    "modern_nutrition": {
      "calories": 190,
      "protein": 10,
      "carbs": 18,
      "fats": 8,
      "vitamins": [
        "B12",
        "D"
      ],
      "minerals": [
        "Calcium",
        "Zinc"
      ]
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura"
      ],
      "virya": "Sheeta",
      "vipaka": "Madhura",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "\u2193",
        "kapha": "\u2191"
      },
      "guna": [
        "Snigdha",
        "Guru"
      ]
    },
    "health_benefits": [
      "Probiotic rich",
      "Strengthens bones",
      "Good snack for energy"
    ]
  },
  {
    "recipe_name": "Vegetable Clear Soup",
    "meal_type": "Dinner",
    "modern_nutrition": {
      "calories": 70,
      "protein": 2,
      "carbs": 10,
      "fats": 2,
      "vitamins": [
        "C",
        "A"
      ],
      "minerals": [
        "Potassium",
        "Calcium"
      ]
    },
    "ayurvedic_properties": {
      "rasa": [
        "Tikta",
        "Kashaya"
      ],
      "virya": "Ushna",
      "vipaka": "Katu",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "\u2193",
        "kapha": "\u2191"
      },
      "guna": [
        "Laghu"
      ]
    },
    "health_benefits": [
      "Light dinner option",
      "Aids digestion",
      "Hydrating and detoxifying"
    ]
  },
  {
    "recipe_name": "Ragi Porridge with Jaggery",
    "meal_type": "Breakfast",
    "modern_nutrition": {
      "calories": 230,
      "protein": 5,
      "carbs": 48,
      "fats": 3,
      "vitamins": [
        "B-complex"
      ],
      "minerals": [
        "Calcium",
        "Iron"
      ]
    },
    "ayurvedic_properties": {
      "rasa": [
        "Madhura"
      ],
      "virya": "Sheeta",
      "vipaka": "Madhura",
      "dosha_effect": {
        "vata": "\u2193",
        "pitta": "\u2194",
        "kapha": "\u2191"
      },
      "guna": [
        "Guru"
      ]
    },
    "health_benefits": [
      "Strengthens bones",
      "Rich in fiber",
      "Natural energy booster"
    ]
  }
];