import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { GeneratedContent, RecipeMetrics, WeeklyPlan, GroundingChunk } from "../types";

// Instructions for the AI to avoid certain words
const BANNED_WORDS_INSTRUCTION = "IMPORTANT: N'utilisez jamais les mots 'délicieux', 'savoureux' ou 'incroyable'. Laissez la technique parler d'elle-même.";

// Helper to get the current season based on the date
const getCurrentSeason = (date: Date): string => {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return "Printemps";
  if (month >= 5 && month <= 7) return "Été";
  if (month >= 8 && month <= 10) return "Automne";
  return "Hiver";
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
    markdownContent: { type: Type.STRING },
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
    seoTitle: { type: Type.STRING },
    seoDescription: { type: Type.STRING },
  },
  required: ['markdownContent', 'metrics'],
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

// Main function to generate a recipe from user inputs
export const generateChefRecipe = async (
  userConfig: string,
  people: number,
  dietary: string,
  mealTime: string,
  cuisineStyle: string,
  isBatchCooking: boolean,
  chefMode: 'cuisine' | 'patisserie',
  complexity: 'authentic' | 'fast' = 'authentic'
): Promise<GeneratedContent> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const today = new Date();
    const currentDate = today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    const currentSeason = getCurrentSeason(today);
    
    // PERSONA SELECTOR
    const basePersona = chefMode === 'patisserie' 
        ? `MODE: GRAND CHEF PÂTISSIER.`
        : `MODE: GRAND CHEF CUISINIER D'EXCEPTION.`;

    const complexityPersona = complexity === 'authentic'
        ? `SIGNATURE: AUTHENTIQUE. Privilégiez les techniques traditionnelles, les temps de cuisson lents, les marinades et le respect des étapes classiques. Pas de raccourcis industriels.`
        : `SIGNATURE: RAPIDE. Optimisez chaque étape. Temps total < 30 min. Utilisez des astuces de Chef pour gagner du temps sans perdre en saveur (ex: cuissons vives, ingrédients pré-préparés malins).`;

    let dietaryInstruction = `RÉGIME : ${dietary}`;
    if (dietary === "Régime Méditerranéen") {
        dietaryInstruction += `
        ⚠️ RÉGIME MÉDITERRANÉEN STRICT (80% Végétal / 20% Animal).
        Si c'est un plat principal quotidien : Privilégier une base Végétarienne (Légumineuses).
        Si c'est un plat "plaisir" (2-3 fois/semaine) : Poisson ou Volaille.
        `;
    }

    const prompt = `
      CONTEXTE : Nous sommes le ${currentDate} (Saison: ${currentSeason}).
      IDENTITÉ : MiamChef IA.
      ${basePersona}
      ${complexityPersona}
      
      MISSION : Créer une recette exceptionnelle sur-mesure basée sur les ingrédients de l'utilisateur.
      
      ANALYSE DE LA DEMANDE UTILISATEUR :
      L'utilisateur fournit : "${userConfig}"
      
      PARAMÈTRES :
      - STYLE : ${cuisineStyle}
      - PERSONNES : ${people}
      - ${dietaryInstruction}
      - MOMENT : ${mealTime}
      - BATCH COOKING : ${isBatchCooking && chefMode === 'cuisine' ? "OUI" : "NON"}

      INSTRUCTIONS STRICTES :
      1. VOUVOIEMENT obligatoire.
      2. INGRÉDIENTS & LISTE DE COURSES : Format "- Produit (Quantité)". Précisez le conditionnement (ex: frais, surgelé, boîte).
      3. Si Mode Rapide : Les étapes doivent être directes et chronométrées.
      4. Si Mode Authentique : Expliquez le "pourquoi" technique des étapes cruciales.
      5. TITRE : Gourmand et reflétant le style ${complexity === 'authentic' ? 'Traditionnel' : 'Express'}.
      6. SAISONNALITÉ : Respectez ${currentSeason}.

      ${BANNED_WORDS_INSTRUCTION}
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });

    const data = cleanAndParseJSON(response.text || "{}");
    return {
      text: sanitizeText(data.markdownContent) || "Erreur de contenu recette.", 
      metrics: data.metrics,
      utensils: data.utensils,
      seoTitle: sanitizeText(data.seoTitle),
      seoDescription: sanitizeText(data.seoDescription) 
    };
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw error;
  }
};

// Searches for a chef's recipe based on query
export const searchChefsRecipe = async (query: string, people: number, type: 'economical' | 'authentic'): Promise<GeneratedContent> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Trouvez une recette de Chef ${type === 'authentic' ? 'authentique et gastronomique' : 'économique et maligne'} pour "${query}" pour ${people} personnes.
  Répondez au format JSON selon le schéma de recette.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
      responseMimeType: "application/json",
      responseSchema: recipeSchema,
    },
  });

  const data = cleanAndParseJSON(response.text || "{}");
  return {
    text: sanitizeText(data.markdownContent) || "Erreur de recherche.",
    metrics: data.metrics,
    utensils: data.utensils,
    seoTitle: sanitizeText(data.seoTitle),
    seoDescription: sanitizeText(data.seoDescription)
  };
};

// Generates a high-quality food image
export const generateRecipeImage = async (title: string, context: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `A high-quality, professional food photography of ${title}. ${context}. 
          Styled as a gourmet meal in a luxury restaurant setting. 
          Shot with a 50mm lens, soft natural lighting, shallow depth of field.`,
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

// Scans fridge image and suggests a recipe
export const scanFridgeAndSuggest = async (base64Image: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };
  const textPart = {
    text: `Analysez cette photo de frigo ou d'ingrédients. 
    Proposez une recette créative anti-gaspillage en utilisant ces ingrédients.
    Répondez en Markdown, commencez par un titre avec #.`,
  };

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [imagePart, textPart] },
  });

  return response.text || "Je n'ai pas pu analyser l'image.";
};

// Converts a browser File to base64 string
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

// Gets sommelier advice with search grounding
export const getSommelierAdvice = async (query: string, target: 'b2b' | 'b2c'): Promise<{ text: string, groundingChunks?: GroundingChunk[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Vous êtes un Sommelier Expert. ${target === 'b2b' ? 'Conseillez un professionnel de la restauration.' : 'Conseillez un particulier.'} 
  Demande : "${query}". Utilisez vos connaissances et Google Search pour des recommandations à jour.`;

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

// Edits a dish photo based on a prompt
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
          Maintenez le réalisme et la qualité photographique.`,
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

// Generates a full weekly menu
export const generateWeeklyMenu = async (dietary: string, people: number): Promise<WeeklyPlan> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Créez un planning de repas hebdomadaire pour ${people} personnes avec un régime ${dietary}.
  Incluez des conseils de batch cooking pour le dimanche.
  Répondez au format JSON strict.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
      responseMimeType: "application/json",
      responseSchema: weeklyPlanSchema,
    },
  });

  const data = cleanAndParseJSON(response.text || "{}");
  return data as WeeklyPlan;
};
