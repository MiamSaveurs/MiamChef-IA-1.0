
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { GeneratedContent, RecipeMetrics, WeeklyPlan, GroundingChunk } from "../types";
import { getUserProfile } from "./storageService";
import { getCurrentLanguage } from "./translationService";

// Instructions for MiamChef to avoid certain words
const BANNED_WORDS_INSTRUCTION = "IMPORTANT: N'utilisez jamais les mots 'délicieux', 'savoureux' ou 'incroyable'. Laissez la technique parler d'elle-même. NE DITES JAMAIS QUE VOUS ÊTES UNE IA. Dites 'Je suis MiamChef'.";

// Helper to retrieve and format User Profile for Prompts
const getUserProfileContext = (): string => {
    const profile = getUserProfile();
    let context = `=== CONTEXTE / PRÉFÉRENCES DE L'UTILISATEUR ===\n`;
    context += `NOM : ${profile.name}\n`;
    context += `NIVEAU CUISINE : ${profile.cookingLevel}\n`;
    
    // Allergies are CRITICAL
    if (profile.allergies.trim()) {
        context += `⚠️ EXCLUSIONS STRICTES (ALLERGIES) : ${profile.allergies} (Ne JAMAIS proposer ces ingrédients).\n`;
    }
    
    // Dislikes
    if (profile.dislikes.trim()) {
        context += `⛔ À ÉVITER : ${profile.dislikes}.\n`;
    }
    
    // Equipment
    if (profile.equipment.trim()) {
        context += `🛠️ MATÉRIEL DISPONIBLE : ${profile.equipment} (Adapter la recette à ce matériel).\n`;
    }

    // Global Diet
    context += `RÉGIME GLOBAL : ${profile.diet}\n`;
    
    return context;
};

// Helper to get Language Instruction
const getLanguageInstruction = (): string => {
    const lang = getCurrentLanguage();
    const map = {
        'fr': 'FRENCH (Français)',
        'en': 'ENGLISH (Anglais)',
        'es': 'SPANISH (Espagnol)',
        'it': 'ITALIAN (Italien)',
        'de': 'GERMAN (Allemand)'
    };
    return `IMPORTANT: YOU MUST ANSWER EXCLUSIVELY IN ${map[lang]}. TOUT LE CONTENU DOIT ÊTRE DANS CETTE LANGUE.`;
};

// RGPD & SAFETY PROTOCOL
const GDPR_COMPLIANCE_PROTOCOL = `
=== PROTOCOLE RGPD & SÉCURITÉ DES DONNÉES (NIVEAU CRITIQUE) ===
1. MINIMISATION DES DONNÉES : Ne demandez JAMAIS d'informations identifiantes.
2. TRAITEMENT ÉPHÉMÈRE : Considérez toutes les données fournies comme strictement confidentielles.
3. SANTÉ & SÉCURITÉ : Si l'utilisateur mentionne une pathologie grave, rappelez brièvement que vous êtes MiamChef, un expert culinaire virtuel.
`;

// Helper to get the current season based on the date
const getCurrentSeason = (date: Date): string => {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return "Printemps";
  if (month >= 5 && month <= 7) return "Été";
  if (month >= 8 && month <= 10) return "Automne";
  return "Hiver";
};

// Helper to translate diet selection into strict AI instructions
// Updated to handle inputs from all languages by detecting keywords
const getDietaryConstraints = (diet: string): string => {
  const lowerDiet = diet.toLowerCase();
  
  if (lowerDiet.includes('végétarien') || lowerDiet.includes('vegetarian') || lowerDiet.includes('vegetariano') || lowerDiet.includes('vegetarisch')) {
      return "RÉGIME STRICTEMENT VÉGÉTARIEN : Aucune viande, aucun poisson, aucun fruit de mer. Oeufs, miel et produits laitiers sont autorisés.";
  }
  
  if (lowerDiet.includes('vegan') || lowerDiet.includes('végétalien') || lowerDiet.includes('vegano')) {
      return "RÉGIME STRICTEMENT VEGAN (VÉGÉTALIEN) : Aucun produit d'origine animale. Ni viande, ni poisson, ni oeuf, ni produit laitier, ni miel. Utilisez des alternatives végétales.";
  }
  
  if (lowerDiet.includes('halal')) {
      return "RÉGIME HALAL : Interdiction ABSOLUE de porc (et dérivés : lardons, gélatine de porc, saindoux). Interdiction ABSOLUE d'alcool (même cuit, pas de vin/bière dans les sauces). La viande doit être certifiée Halal.";
  }
  
  if (lowerDiet.includes('casher') || lowerDiet.includes('kosher') || lowerDiet.includes('koscher')) {
      return "RÉGIME CASHER : Interdiction ABSOLUE de porc, lapin, cheval. Pas de fruits de mer ni crustacés (seuls les poissons à écailles/nageoires sont ok). INTERDICTION FORMELLE DE MÉLANGER VIANDE ET PRODUITS LAITIERS dans la même recette ou le même menu (Respecter les temps de pause).";
  }
  
  if (lowerDiet.includes('gluten')) {
      return "RÉGIME SANS GLUTEN (Cœliaque) : Interdiction stricte de blé, orge, seigle, avoine, épeautre. Utilisez : Farine de riz, maïs, sarrasin, fécule, pois chiche. Attention aux sauces soja classiques (tamari ok).";
  }
  
  if (lowerDiet.includes('lactose') || lowerDiet.includes('lattosio') || lowerDiet.includes('lactosa') || lowerDiet.includes('laktose')) {
      return "RÉGIME SANS LACTOSE : Pas de lait de vache, crème, beurre ou fromages frais contenant du lactose. Privilégiez les produits délactosés ou les alternatives végétales (soja, amande).";
  }
  
  if (lowerDiet.includes('crétois') || lowerDiet.includes('keto') || lowerDiet.includes('cretan') || lowerDiet.includes('creto') || lowerDiet.includes('kreta')) {
      return "RÉGIME CRÉTOIS (MÉDITERRANÉEN STRICT) : La base de TOUS les repas doit être végétale (légumes, légumineuses, noix, céréales complètes). Huile d'olive comme source de graisse principale. VIANDE ROUGE : Maximum 1 à 2 fois par MOIS. VOLAILLE/OEUFS : Modéré (1-2 fois par semaine). POISSON : Modéré (2 fois par semaine). Les autres jours doivent être SANS protéine animale (protéines végétales uniquement).";
  }
  
  if (lowerDiet.includes('sport') || lowerDiet.includes('prot')) {
      return "NUTRITION SPORTIVE : Riche en protéines (20-30g min/repas). Glucides complexes à indice glycémique bas/moyen. Bonnes graisses (oméga-3). Focus sur la récupération et l'énergie.";
  }

  return "Régime classique équilibré (Omnivore).";
};

// Helper to clean and parse JSON strings returned by the model
const cleanAndParseJSON = (text: string) => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON", e);
    return {};
  }
};

// Helper to sanitize text
const sanitizeText = (text?: string) => text?.trim() || "";

// Schema for recipe generation
const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    markdownContent: { 
        type: Type.STRING,
        description: "LA RECETTE COMPLÈTE ET RÉDIGÉE. Titre, Intro, Liste ingrédients, Instructions, Conclusion. Dans la langue demandée."
    },
    metrics: {
      type: Type.OBJECT,
      properties: {
        nutriScore: { type: Type.STRING },
        caloriesPerPerson: { type: Type.NUMBER },
        caloriesPer100g: { type: Type.NUMBER },
        pricePerPerson: { type: Type.NUMBER },
        carbohydrates: { type: Type.NUMBER },
        proteins: { type: Type.NUMBER },
        fats: { type: Type.NUMBER },
        difficulty: { type: Type.STRING },
      },
      required: ['nutriScore', 'caloriesPerPerson', 'difficulty'],
    },
    utensils: { type: Type.ARRAY, items: { type: Type.STRING } },
    ingredients: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "LISTE PANIER : Noms des produits SEULS pour la liste de courses (ex: 'Riz'). DANS LA LANGUE DEMANDÉE." 
    },
    ingredientsWithQuantities: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "LISTE CUISINE : Ingrédients détaillés avec quantités (ex: '300g de Riz'). DANS LA LANGUE DEMANDÉE."
    },
    steps: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "MODE CUISINE INTERACTIF : Une liste technique d'instructions courtes et claires. PAS de Markdown ici. DANS LA LANGUE DEMANDÉE."
    },
    storageAdvice: { type: Type.STRING },
    seoTitle: { type: Type.STRING },
    seoDescription: { type: Type.STRING },
  },
  required: ['markdownContent', 'metrics', 'ingredients', 'ingredientsWithQuantities', 'steps', 'storageAdvice'],
};

// Schema for weekly plan generation
const weeklyPlanSchema = {
  type: Type.OBJECT,
  properties: {
    startDate: { type: Type.STRING },
    days: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING },
          breakfast: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              calories: { type: Type.NUMBER },
              proteins: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fats: { type: Type.NUMBER },
              ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['name', 'calories', 'ingredients'],
          },
          lunch: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              calories: { type: Type.NUMBER },
              proteins: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fats: { type: Type.NUMBER },
              ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['name', 'calories', 'ingredients'],
          },
          snack: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              calories: { type: Type.NUMBER },
              proteins: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fats: { type: Type.NUMBER },
              ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['name', 'calories', 'ingredients'],
          },
          dinner: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              calories: { type: Type.NUMBER },
              proteins: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fats: { type: Type.NUMBER },
              ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['name', 'calories', 'ingredients'],
          },
        },
        required: ['day', 'lunch', 'dinner'],
      },
    },
    batchCookingTips: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ['days', 'batchCookingTips'],
};

export const generateChefRecipe = async (
  userConfig: string,
  people: number,
  dietary: string,
  mealTime: string,
  cuisineStyle: string,
  isBatchCooking: boolean,
  chefMode: 'cuisine' | 'patisserie', 
  recipeCost: 'authentic' | 'budget' = 'authentic',
  difficultyLevel: 'beginner' | 'intermediate' | 'expert' = 'intermediate'
): Promise<GeneratedContent> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const today = new Date();
    const currentDate = today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    const currentSeason = getCurrentSeason(today);
    
    const userProfileContext = getUserProfileContext();
    const langInstruction = getLanguageInstruction();

    // 1. DYNAMIC PERSONA MATRIX
    let personaPrompt = "";
    
    if (chefMode === 'patisserie') {
        if (difficultyLevel === 'beginner') {
             personaPrompt = `CERVEAU ACTIF : PÂTISSERIE MAISON. IDENTITÉ : Grand-Mère Pâtissière pédagogue.`;
        } else if (difficultyLevel === 'intermediate') {
             personaPrompt = `CERVEAU ACTIF : PÂTISSIER BOUTIQUE. IDENTITÉ : Chef de laboratoire.`;
        } else {
             personaPrompt = `CERVEAU ACTIF : MAÎTRE PÂTISSIER HAUTE COUTURE.`;
        }
    } else {
        if (difficultyLevel === 'beginner') {
             personaPrompt = `CERVEAU ACTIF : CUISINE DU QUOTIDIEN. IDENTITÉ : Chef de famille astucieux.`;
        } else if (difficultyLevel === 'intermediate') {
             personaPrompt = `CERVEAU ACTIF : BISTRONOMIE. IDENTITÉ : Chef de Bistrot.`;
        } else {
             personaPrompt = `CERVEAU ACTIF : GASTRONOMIE ÉTOILÉE.`;
        }
    }

    // 2. DIFFICULTY & COST
    let difficultyPrompt = `NIVEAU : ${difficultyLevel.toUpperCase()}`;
    let costPrompt = `BUDGET : ${recipeCost === 'budget' ? 'ECONOMIQUE' : 'AUTHENTIQUE'}`;

    // 3. GOLDEN RULES
    const technicalRules = `
    ⚠️ RÈGLES CULINAIRES ABSOLUES :
    1. Respecter la chimie des aliments.
    2. Réaction de Maillard pour les viandes.
    3. Repos des viandes après cuisson.
    `;

    const strictDietaryRules = getDietaryConstraints(dietary);

    const prompt = `
      CONTEXTE TEMPOREL : ${currentDate} (Saison: ${currentSeason}).
      
      ${userProfileContext}
      ${langInstruction}

      === VOTRE PERSONA ===
      ${personaPrompt}

      === LA MISSION ===
      Créer une recette pour la demande : "${userConfig}"
      
      === PARAMÈTRES OBLIGATOIRES ===
      - STYLE : ${cuisineStyle}
      - COUVERTS : ${people} personnes
      - TYPE DE REPAS : ${mealTime}
      - RÉGIME (CRITIQUE) : ${strictDietaryRules}

      === CONTRAINTES ===
      1. ${costPrompt}
      2. ${difficultyPrompt}
      3. ${technicalRules}
      4. ${GDPR_COMPLIANCE_PROTOCOL}
      
      Réponse UNIQUEMENT en JSON valide respectant le schéma recipeSchema.
      ${BANNED_WORDS_INSTRUCTION}
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });

    const data = cleanAndParseJSON(response.text || "{}");
    return {
      text: sanitizeText(data.markdownContent) || "Erreur de contenu recette.", 
      metrics: data.metrics,
      utensils: data.utensils,
      ingredients: data.ingredients,
      ingredientsWithQuantities: data.ingredientsWithQuantities, 
      steps: data.steps, 
      storageAdvice: sanitizeText(data.storageAdvice),
      seoTitle: sanitizeText(data.seoTitle),
      seoDescription: sanitizeText(data.seoDescription) 
    };
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw error;
  }
};

export const searchChefsRecipe = async (query: string, people: number, type: 'economical' | 'authentic'): Promise<GeneratedContent> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const userProfileContext = getUserProfileContext();
  const langInstruction = getLanguageInstruction();
  
  const prompt = `Trouvez une recette de Chef ${type === 'authentic' ? 'authentique' : 'économique'} pour "${query}" pour ${people} personnes.
  
  ${userProfileContext}
  ${langInstruction}
  ${GDPR_COMPLIANCE_PROTOCOL}

  IMPORTANT : JSON format selon recipeSchema.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 0 },
      responseMimeType: "application/json",
      responseSchema: recipeSchema,
    },
  });

  const data = cleanAndParseJSON(response.text || "{}");
  return {
    text: sanitizeText(data.markdownContent) || "Erreur de recherche.",
    metrics: data.metrics,
    utensils: data.utensils,
    ingredients: data.ingredients, 
    ingredientsWithQuantities: data.ingredientsWithQuantities,
    steps: data.steps, 
    storageAdvice: sanitizeText(data.storageAdvice),
    seoTitle: sanitizeText(data.seoTitle),
    seoDescription: sanitizeText(data.seoDescription)
  };
};

export const generateRecipeImage = async (title: string, context: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const gdprSafePrompt = `
  Hyper-realistic professional food photography of: ${title}.
  CRITICAL DETAILS FOR COHERENCE:
  - Context/Style: ${context}
  TECHNICAL SPECS:
  - 8k resolution, highly detailed textures.
  - Macro photography or 50mm lens.
  - Lighting: Soft natural window light.
  RESTRICTIONS:
  - NO TEXT overlay.
  - NO HUMANS/FACES/HANDS.
  - NO CARTOON/3D RENDER STYLE. MUST LOOK LIKE A REAL PHOTO.
  `;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: gdprSafePrompt,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Failed to generate image");
};

export const scanFridgeAndSuggest = async (base64Image: string, dietary: string = 'Classique (Aucun)'): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const userProfileContext = getUserProfileContext();
  const langInstruction = getLanguageInstruction();
  
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };
  
  const textPart = {
    text: `ROLE : Tu es MiamChef, expert en vision par ordinateur et cuisine.
    
    ${GDPR_COMPLIANCE_PROTOCOL}
    ${userProfileContext}
    ${langInstruction}

    ETAPE 1 : IDENTIFICATION
    Analyse visuellement cette photo. Liste TOUS les ingrédients comestibles.
    
    ETAPE 2 : FILTRAGE
    REGIME : ${dietary}
    
    ETAPE 3 : CRÉATION
    Crée une recette gastronomique avec les ingrédients identifiés.
    
    FORMAT DE RÉPONSE (Markdown) :
    1. Commence par : "**Ingrédients identifiés :** [Liste]"
    2. Titre de la recette (avec #)
    3. Ingrédients complets (avec quantités estimées)
    4. Instructions étape par étape.`,
  };

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [imagePart, textPart] },
  });

  return response.text || "Je n'ai pas pu analyser l'image.";
};

export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const getSommelierAdvice = async (query: string, target: 'b2b' | 'b2c'): Promise<{ text: string, groundingChunks?: GroundingChunk[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const userProfileContext = getUserProfileContext();
  const langInstruction = getLanguageInstruction();

  const prompt = `Vous êtes MiamChef Sommelier.
  
  ${userProfileContext}
  ${langInstruction}

  MISSION : Proposez des accords mets-boissons d'excellence pour : "${query}".

  VOTRE RÉPONSE DOIT CONTENIR :
  1. 🍷 ACCORDS VINS (TRADITION)
  2. 🍃 ACCORDS SANS ALCOOL (SOBRIÉTÉ HEUREUSE)
  
  ${GDPR_COMPLIANCE_PROTOCOL}`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  const groundingChunks: GroundingChunk[] = chunks ? chunks.map((c: any) => ({
    web: {
      uri: c.web?.uri || "",
      title: c.web?.title || ""
    }
  })).filter((c: any) => c.web && c.web.uri) : [];

  return {
    text: response.text || "Pas de conseil disponible.",
    groundingChunks
  };
};

export const editDishPhoto = async (base64Image: string, prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image,
            mimeType: 'image/jpeg',
          },
        },
        {
          text: `Retouchez cette photo de plat selon cette demande : ${prompt}. 
          Maintenez le réalisme et la qualité photographique.
          IMPORTANT : Ne générez jamais de visages humains.`,
        },
      ],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Failed to edit image");
};

export const generateWeeklyMenu = async (dietary: string, people: number, ingredients: string = ''): Promise<WeeklyPlan> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const userProfileContext = getUserProfileContext();
  const langInstruction = getLanguageInstruction();
  
  const strictDietaryRules = getDietaryConstraints(dietary);

  let ingredientsPrompt = "";
  if (ingredients.trim()) {
      ingredientsPrompt = `CONTEXTE SPÉCIAL ANTI-GASPI : L'utilisateur dispose de : "${ingredients}". Intégrez-les.`;
  }

  const prompt = `Créez un planning de repas hebdomadaire complet pour ${people} personnes.
  
  ${userProfileContext}
  ${langInstruction}

  CONTRAINTES : 
  ${strictDietaryRules}
  ${ingredientsPrompt}
  ${GDPR_COMPLIANCE_PROTOCOL}
  
  Répondez au format JSON strict selon le schéma weeklyPlanSchema.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 4096 },
      responseMimeType: "application/json",
      responseSchema: weeklyPlanSchema,
    },
  });

  const data = cleanAndParseJSON(response.text || "{}");
  return data as WeeklyPlan;
};
