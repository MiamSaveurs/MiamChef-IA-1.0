
export enum AppView {
  HOME = 'HOME',
  RECIPE_CREATOR = 'RECIPE_CREATOR',
  SCAN_FRIDGE = 'SCAN_FRIDGE',
  SOMMELIER = 'SOMMELIER',
  DISH_EDITOR = 'DISH_EDITOR',
  RECIPE_BOOK = 'RECIPE_BOOK',
  SUBSCRIPTION = 'SUBSCRIPTION',
  SHOPPING_LIST = 'SHOPPING_LIST',
  VALUE_PROPOSITION = 'VALUE_PROPOSITION',
  LEGAL = 'LEGAL',
  PLANNING = 'PLANNING',
  TIMER = 'TIMER',
  PROFILE = 'PROFILE'
}

export type Language = 'fr' | 'en' | 'es' | 'it' | 'de';

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface RecipeMetrics {
  nutriScore: 'A' | 'B' | 'C' | 'D' | 'E';
  caloriesPerPerson: number;
  caloriesPer100g: number;
  pricePerPerson: number;
  carbohydrates: number; // g
  proteins: number; // g
  fats: number; // g
  difficulty: 'Facile' | 'Moyen' | 'Expert';
}

export interface GeneratedContent {
  text: string;
  groundingChunks?: GroundingChunk[];
  image?: string;
  metrics?: RecipeMetrics;
  utensils?: string[];
  ingredients?: string[]; // Liste brute des produits (Ex: "Carottes", "Riz") SANS quantité (POUR SHOPPING)
  ingredientsWithQuantities?: string[]; // Liste complète avec quantités (Ex: "300g de Carottes") (POUR CUISINE)
  steps?: string[]; // NOUVEAU : Étapes structurées pour le mode cuisine
  storageAdvice?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface SavedRecipe {
  id: string;
  title: string;
  markdownContent: string;
  date: string;
  metrics?: RecipeMetrics;
  image?: string; // Base64 image data
  utensils?: string[];
  ingredients?: string[]; // Liste brute des produits
  ingredientsWithQuantities?: string[];
  steps?: string[]; // NOUVEAU
  storageAdvice?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface ShoppingItem {
  id: number;
  text: string;
  checked: boolean;
  addedAt: string;
}

// MEAL PLANNER INTERFACES
export interface Meal {
  name: string;
  calories: number;
  proteins: number; // New
  carbs: number;    // New
  fats: number;     // New
  ingredients: string[];
}

export interface DayPlan {
  day: string; // Lundi, Mardi...
  breakfast?: Meal; // Optionnel car les anciens plans n'en ont pas
  lunch: Meal;
  snack?: Meal;    // Optionnel car les anciens plans n'en ont pas
  dinner: Meal;
}

export interface WeeklyPlan {
  id: string; // 'current' usually
  startDate: string;
  days: DayPlan[];
  batchCookingTips: string[]; // NEW: Conseils d'organisation
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface UserProfile {
  name: string;
  diet: string;
  allergies: string;
  dislikes: string;
  equipment: string;
  householdSize: number;
  cookingLevel: string;
}
