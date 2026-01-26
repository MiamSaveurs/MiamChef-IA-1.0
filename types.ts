

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
  TIMER = 'TIMER'
}

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
  difficulty: 'Facile' | 'Moyen' | 'Chef';
}

export interface GeneratedContent {
  text: string;
  groundingChunks?: GroundingChunk[];
  image?: string;
  metrics?: RecipeMetrics;
  utensils?: string[];
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
