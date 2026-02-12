
import React, { useState, useEffect } from 'react';
import { generateChefRecipe, searchChefsRecipe, generateRecipeImage, adjustRecipe, generateRecipeVideo } from '../services/geminiService';
import { saveRecipeToBook, addToShoppingList, getUserProfile } from '../services/storageService';
import { LoadingState, RecipeMetrics } from '../types';
import { 
  ChevronLeft, 
  Target,
  Zap,
  RotateCcw,
  Minus,
  Plus,
  User,
  Leaf,
  Globe,
  Clock,
  Layers,
  Search,
  Check,
  ChevronDown,
  Sparkles,
  Book,
  GraduationCap,
  Award,
  Crown,
  ShoppingCart,
  Square,
  CheckSquare,
  ArrowRight,
  XCircle,
  Snowflake,
  Play,
  ArrowLeft,
  Share2,
  Wifi,
  Radio,
  Cast,
  Activity,
  Smile,
  Droplets,
  Wand2,
  ChevronRight,
  Heart,
  Moon,
  Wheat,
  Milk,
  Sun,
  Flame,
  Coffee,
  Utensils,
  Star,
  Video
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { 
  GourmetBook, 
  PremiumChefHat, 
  PremiumCake, 
  PremiumSearch, 
  PremiumCheck, 
  PremiumTimer, 
  PremiumSparkles, 
  PremiumEuro, 
  PremiumMedal, 
  PremiumUtensils,
  WickerBasket
} from './Icons';

interface RecipeCreatorProps {
    persistentState: {
        text: string;
        metrics: RecipeMetrics | null;
        utensils: string[];
        ingredients: string[];
        ingredientsWithQuantities?: string[];
        steps?: string[];
        image: string | null;
        storageAdvice?: string;
    } | null;
    setPersistentState: (data: any) => void;
}

const RecipeCreator: React.FC<RecipeCreatorProps> = ({ persistentState, setPersistentState }) => {
  const [mode, setMode] = useState<'create' | 'search'>('create');
  const [chefMode, setChefMode] = useState<'cuisine' | 'patisserie'>('cuisine');
  
  const [recipeCost, setRecipeCost] = useState<'authentic' | 'budget' | null>(null);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'expert' | null>(null); 
  
  const [ingredients, setIngredients] = useState('');
  const [dietary, setDietary] = useState('Classique (Aucun)');
  const [mealTime, setMealTime] = useState('Déjeuner / Dîner');
  const [cuisineStyle, setCuisineStyle] = useState('Tradition Française'); 
  const [isBatchCooking, setIsBatchCooking] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'economical' | 'authentic'>('economical');
  const [people, setPeople] = useState(2);
  
  // Local state only for temporary interactions (selection, loading, saving feedback)
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<LoadingState>('idle');
  const [loadingStep, setLoadingStep] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  
  // Smart Adjust State
  const [adjusting, setAdjusting] = useState<string | null>(null);

  // Video Generation State (Veo)
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [generatingVideo, setGeneratingVideo] = useState(false);

  // --- STATE POUR LE MODE CUISINE ---
  const [isCookingMode, setIsCookingMode] = useState(false);
  const [cookingSteps, setCookingSteps] = useState<string[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  