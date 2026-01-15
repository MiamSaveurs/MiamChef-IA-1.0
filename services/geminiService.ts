
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedContent, RecipeMetrics, WeeklyPlan } from "../types";

/* 
 * ======================================================================================
 * 🧠 PROTOCOLE D'EXPANSION STRATÉGIQUE (MÉMOIRE DU SYSTÈME MIAMCHEF IA) 🧠
 * ======================================================================================
 * 
 * 1. IDENTITÉ : MiamChef IA est le LEADER FRANÇAIS de la FoodTech "Petit Budget".
 * 2. DATE SYSTÈME : 15 JANVIER 2026 (Temps Réel).
 * 3. ADN "WINNER" : Innovation perpétuelle, mais ACCESSIBLE À TOUS.
 * 4. OBSESSION CLIENT : Satisfaction absolue. Effet "Wahoo".
 * 5. JURIDICTION : Droit Français & Européen (RGPD, Loi Evin, INCO).
 * 6. PERSONNALITÉ "DOUBLE CERVEAU" :
 *    - MODE CUISINIER : Audace, Improvisation, Feu, "Pifomètre maîtrisé".
 *    - MODE PÂTISSIER : Rigueur absolue, Chimie, Précision au gramme près, Esthétique.
 */

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
  isBatchCooking: boolean,
  chefMode: 'cuisine' | 'patisserie'
): Promise<GeneratedContent> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const currentDate = "15 Janvier 2026";
    
    // PERSONA SELECTOR
    const persona = chefMode === 'patisserie' 
        ? `MODE: GRAND CHEF PÂTISSIER HAUTE COUTURE (Cerveau Sucré).
           STYLE: Précision chimique, Esthétique parfaite, Gourmandise absolue.
           PHILOSOPHIE: La pâtisserie est une science exacte. Pas d'improvisation sur les pesées.
           VOCABULAIRE: Chemiser, Foisonner, Macaronner, Fleurer, Napper, Pocher.`
        : `MODE: GRAND CHEF CUISINIER BISTRONOMIQUE (Cerveau Salé).
           STYLE: Cuisine du marché, Improvisation géniale, Maîtrise du feu.
           PHILOSOPHIE: La cuisine vient du coeur. On goûte, on rectifie, on ose.
           VOCABULAIRE: Saisir, Déglacer, Suer, Mijoter, Dresser, Assaisonner.`;

    const prompt = `
      CONTEXTE : Nous sommes le ${currentDate}.
      IDENTITÉ : MiamChef IA.
      ${persona}
      
      MISSION : Créer une recette exceptionnelle mais accessible (Produits Supermarché).
      
      PARAMÈTRES :
      - INGRÉDIENTS DISPOS : ${ingredients}
      - STYLE CULTUREL : ${cuisineStyle}
      - PERSONNES : ${people}
      - RÉGIME : ${dietary}
      - MOMENT : ${mealTime}
      - BATCH COOKING : ${isBatchCooking && chefMode === 'cuisine' ? "OUI (Inclure étapes de conservation)" : "NON"}

      INSTRUCTIONS STRICTES DE GÉNÉRATION :
      1. VOUVOIEMENT obligatoire.
      2. INGRÉDIENTS : Format "- Produit (Quantité)". Ex: "- Farine T55 (250g)".
      3. Si Mode Pâtissier : SOYEZ INTRANSIGEANT SUR LES PESÉES ET LES TEMPÉRATURES. Donnez des astuces de montage précises.
      4. Si Mode Cuisinier : Encouragez l'instinct ("Goûtez et rectifiez l'assaisonnement").
      5. TITRE : Doit être vendeur et gourmand (Ex: "Le Paris-Brest Revisité à la Pistache" ou "Risotto Crémeux aux Asperges").
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
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const currentDate = "15 Janvier 2026";

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
      model: "gemini-3-flash-preview",
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
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const currentDate = "15 Janvier 2026";

    const prompt = `
      MODIFICATION DE RECETTE (MiamChef IA). DATE : ${currentDate}.
      Recette : ${originalRecipe}
      Mission (Twist) : "${modification}"
      
      Consigne : Gardez le ton ludique et le VOUVOIEMENT. Gardez le format ingrédients "- Produit (Quantité)".
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const currentDate = "15 Janvier 2026";

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
            model: "gemini-3-flash-preview",
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
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) { return null; }
};

export const scanFridgeAndSuggest = async (imageBase64: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const currentDate = "15 Janvier 2026";
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const currentDate = "15 Janvier 2026";
    
    const prompt = audience === 'b2b' 
        ? `Sommelier Pro pour "${request}". Date : ${currentDate}. Pitch commercial, stratégie marge. (Ton Pro & Sérieux)` 
        : `Sommelier Conseil pour "${request}". Date : ${currentDate}. Trouvez 3 vins avec un excellent rapport qualité/prix (disponibles en supermarché ou caviste de quartier). Utilisez le VOUVOIEMENT ("Vous"). Soyez ludique et pédagogue.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({ web: c.web })).filter((c: any) => c.web);
    return { text: response.text || "Erreur sommelier.", groundingChunks };
  } catch (error) { throw error; }
};

export const editDishPhoto = async (imageBase64: string, prompt: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
