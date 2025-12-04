
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedContent, RecipeMetrics, WeeklyPlan } from "../types";

/* 
 * ======================================================================================
 * 🧠 PROTOCOLE D'EXPANSION STRATÉGIQUE (MÉMOIRE DU SYSTÈME MIAMCHEF IA) 🧠
 * ======================================================================================
 * 
 * 1. IDENTITÉ : MiamChef IA est le LEADER FRANÇAIS de la FoodTech "Petit Budget".
 * 2. DATE SYSTÈME : 3 DÉCEMBRE 2025 (Temps Réel).
 * 3. ADN "WINNER" : Innovation perpétuelle, mais ACCESSIBLE À TOUS.
 * 4. OBSESSION CLIENT : Satisfaction absolue. Effet "Wahoo".
 * 5. JURIDICTION : Droit Français & Européen (RGPD, Loi Evin, INCO).
 * 6. PERSONNALITÉ : 
 *    - TON : VOUVOIEMENT ("Vous"), Ludique, Pédagogique, Bienveillant.
 *    - CIBLE : Familles, Étudiants, Cuisine du quotidien.
 *    - CONTRAINTE : Ingrédients 100% Supermarché France (Leclerc, Carrefour, Inter...).
 *    - STYLE : "Fait Maison", Simple, Economique. PAS de Gastro/Bistrot complexe.
 */

// Helper: Safe API Key Access to prevent crashes (White Screen fix)
const getApiKey = (): string => {
  try {
    // 1. Try VITE prefix (Standard for Vercel/Vite apps)
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY;
    }
    // 2. Fallback to other variable names
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.API_KEY) {
      // @ts-ignore
      return import.meta.env.API_KEY;
    }
    // 3. Last resort
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    console.warn("API Key check warning");
  }
  return ""; 
};

// Helper to encode file to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Helper: Robust JSON Parser
const cleanAndParseJSON = (text: string): any => {
  try {
    return JSON.parse(text);
  } catch (e) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch (e2) {}
    try {
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanText);
    } catch (e3) {
      console.error("Critical JSON Parse Error:", text);
      throw new Error("Impossible de lire la réponse de l'IA.");
    }
  }
};

const recipeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    markdownContent: { type: Type.STRING },
    seoTitle: { type: Type.STRING },
    seoDescription: { type: Type.STRING },
    utensils: { type: Type.ARRAY, items: { type: Type.STRING } },
    metrics: {
      type: Type.OBJECT,
      properties: {
        nutriScore: { type: Type.STRING, enum: ["A", "B", "C", "D", "E"] },
        difficulty: { type: Type.STRING, enum: ["Facile", "Moyen", "Chef"] },
        caloriesPerPerson: { type: Type.NUMBER },
        caloriesPer100g: { type: Type.NUMBER },
        pricePerPerson: { type: Type.NUMBER },
        carbohydrates: { type: Type.NUMBER },
        proteins: { type: Type.NUMBER },
        fats: { type: Type.NUMBER },
      },
      required: ["nutriScore", "difficulty", "caloriesPerPerson", "caloriesPer100g", "pricePerPerson", "carbohydrates", "proteins", "fats"],
    },
  },
  required: ["markdownContent", "metrics", "utensils", "seoTitle", "seoDescription"],
};

const weeklyPlanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    startDate: { type: Type.STRING },
    batchCookingTips: { type: Type.ARRAY, items: { type: Type.STRING } },
    days: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING },
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
            required: ["name", "calories", "ingredients", "proteins", "carbs", "fats"],
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
            required: ["name", "calories", "ingredients", "proteins", "carbs", "fats"],
          },
        },
        required: ["day", "lunch", "dinner"],
      },
    },
  },
  required: ["days", "batchCookingTips"],
};

export const generateChefRecipe = async (
  ingredients: string,
  people: number,
  dietary: string,
  mealTime: string,
  cuisineStyle: string,
  isBatchCooking: boolean
): Promise<GeneratedContent> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Clé API manquante. Veuillez configurer VITE_API_KEY.");
    
    const ai = new GoogleGenAI({ apiKey });
    const currentDate = "Mercredi 3 Décembre 2025";
    
    const prompt = `
      Tu es MiamChef IA, le coach culinaire expert en PETIT BUDGET.
      DATE : ${currentDate}.
      JURIDICTION : FRANCE.
      
      MISSION : Créer une recette économique, familiale et délicieuse.
      
      PARAMÈTRES :
      - INGRÉDIENTS DISPOS : ${ingredients}
      - STYLE : ${cuisineStyle} (Reste simple et accessible)
      - BATCH COOKING : ${isBatchCooking ? "OUI (Donnez des astuces pour gagner du temps)" : "NON"}
      - PERSONNES : ${people}
      - RÉGIME : ${dietary}
      - MOMENT : ${mealTime}

      INSTRUCTIONS STRICTES :
      1. TON : VOUVOIEMENT ("Vous"), ludique, bienveillant.
      2. INGRÉDIENTS : Utilisez UNIQUEMENT des produits de supermarché français. Priorité Petit Budget.
      3. FORMAT INGRÉDIENTS : IMPORTANT POUR LE DRIVE. Mets le nom du produit d'abord, et la quantité entre parenthèses à la fin.
         Exemple correct : "- Lardons fumés (200g)"
         Exemple incorrect : "- 200g de lardons fumés"
      4. Format : Markdown détaillé.
    `;

    const response = await ai.models.generateContent({
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
      text: data.markdownContent || "Erreur de contenu recette.",
      metrics: data.metrics,
      utensils: data.utensils,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription
    };
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw error;
  }
};

export const searchChefsRecipe = async (query: string, people: number): Promise<GeneratedContent> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Clé API manquante.");
    const ai = new GoogleGenAI({ apiKey });
    const currentDate = "Mercredi 3 Décembre 2025";

    const prompt = `
      Tu es MiamChef IA. DATE : ${currentDate}.
      Recherchez et adaptez la recette : "${query}" pour ${people} personnes.
      
      INSTRUCTIONS :
      - Adaptez pour "Petit Budget".
      - Utilisez le VOUVOIEMENT.
      - FORMAT INGRÉDIENTS : "- Nom Produit (Quantité)". La quantité DOIT être à la fin entre parenthèses pour le Drive.
      
      FORMAT JSON STRICT :
      {
        "markdownContent": "Texte de la recette...",
        "seoTitle": "Titre...",
        "seoDescription": "Description...",
        "utensils": ["..."],
        "metrics": { "nutriScore": "A", "difficulty": "Facile", "caloriesPerPerson": 0, "caloriesPer100g": 0, "pricePerPerson": 0, "carbohydrates": 0, "proteins": 0, "fats": 0 }
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const data = cleanAndParseJSON(response.text || "{}");
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(
      (chunk: any) => ({ web: chunk.web })
    ).filter((c: any) => c.web);

    return {
      text: data.markdownContent || "Non trouvé.",
      groundingChunks: groundingChunks,
      metrics: data.metrics,
      utensils: data.utensils,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription
    };
  } catch (error) {
    throw error;
  }
};

export const modifyChefRecipe = async (originalRecipe: string, modification: string): Promise<GeneratedContent> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Clé API manquante.");
    const ai = new GoogleGenAI({ apiKey });
    const currentDate = "Mercredi 3 Décembre 2025";

    const prompt = `
      MODIFICATION DE RECETTE (MiamChef IA). DATE : ${currentDate}.
      Recette : ${originalRecipe}
      Mission (Twist) : "${modification}"
      
      Consigne : Gardez le ton ludique et le VOUVOIEMENT. Gardez le format ingrédients "- Produit (Quantité)".
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });

    const data = cleanAndParseJSON(response.text || "{}");
    return {
      text: data.markdownContent || "Erreur modification.",
      metrics: data.metrics,
      utensils: data.utensils,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription
    };
  } catch (error) {
    throw error;
  }
};

export const generateWeeklyMenu = async (dietary: string, people: number): Promise<WeeklyPlan> => {
    try {
        const apiKey = getApiKey();
        if (!apiKey) throw new Error("Clé API manquante.");
        const ai = new GoogleGenAI({ apiKey });
        const currentDate = "Mercredi 3 Décembre 2025";

        const prompt = `
            PLANNING HEBDOMADAIRE (MiamChef IA).
            Date : ${currentDate}.
            Pour ${people} personnes. Régime : ${dietary}.
            
            MISSION :
            1. Générer 14 repas (Midi/Soir) simples, économiques.
            2. Ingrédients "Supermarché" uniquement.
            3. TON : Vouvoiement, ludique.
            
            Respecte le schéma JSON.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { 
                responseMimeType: "application/json",
                responseSchema: weeklyPlanSchema
            }
        });

        const plan = cleanAndParseJSON(response.text);
        if (!plan.days) throw new Error("Format de planning invalide.");
        return plan;
    } catch (e) {
        console.error("Weekly Planner Error:", e);
        throw e;
    }
}

export const generateRecipeImage = async (title: string, ingredientsContext: string): Promise<string | null> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) return null;
    const ai = new GoogleGenAI({ apiKey });
    // Prompt optimisé pour une photo réaliste style "Cuisine Maison"
    const prompt = `Delicious home-cooked meal photography of "${title}". Ingredients visible: ${ingredientsContext}. Natural lighting, cozy kitchen atmosphere, appetizing, high resolution, 4k. Style: Authentic Home Cooking.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) { return null; }
};

export const generateStepVideo = async (stepDescription: string): Promise<string | null> => {
    try {
        const apiKey = getApiKey();
        if (!apiKey) return null;
        const ai = new GoogleGenAI({ apiKey });
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: `Cooking step close-up: ${stepDescription}. Home kitchen setting.`,
            config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
        });
        let attempts = 0;
        while (!operation.done && attempts < 20) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            operation = await ai.operations.getVideosOperation({operation: operation});
            attempts++;
        }
        if (attempts >= 20) return null;
        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) return null;
        const response = await fetch(`${downloadLink}&key=${apiKey}`);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) { return null; }
};

export const scanFridgeAndSuggest = async (imageBase64: string): Promise<string> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Clé API manquante.");
    const ai = new GoogleGenAI({ apiKey });
    const currentDate = "Mercredi 3 Décembre 2025";
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
          { text: `Nous sommes le ${currentDate}. Analysez cette photo. Trouvez une recette "Anti-Gaspi" économique et simple avec ces restes. Utilisez le VOUVOIEMENT ("Vous"). Soyez ludique ! Format Markdown.` },
        ],
      },
    });
    return response.text || "Erreur scan.";
  } catch (error) { throw error; }
};

export const getSommelierAdvice = async (request: string, audience: 'b2c' | 'b2b' = 'b2c'): Promise<GeneratedContent> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Clé API manquante.");
    const ai = new GoogleGenAI({ apiKey });
    const currentDate = "Mercredi 3 Décembre 2025";
    
    const prompt = audience === 'b2b' 
        ? `Sommelier Pro pour "${request}". Date : ${currentDate}. Pitch commercial, stratégie marge. (Ton Pro & Sérieux)` 
        : `Sommelier Conseil pour "${request}". Date : ${currentDate}. Trouvez 3 vins avec un excellent rapport qualité/prix (disponibles en supermarché ou caviste de quartier). Utilisez le VOUVOIEMENT ("Vous"). Soyez ludique et pédagogue.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({ web: c.web })).filter((c: any) => c.web);
    return { text: response.text || "Erreur sommelier.", groundingChunks };
  } catch (error) { throw error; }
};

export const editDishPhoto = async (imageBase64: string, prompt: string): Promise<string> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Clé API manquante.");
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
          { text: prompt },
        ],
      },
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image.");
  } catch (error) { throw error; }
};
