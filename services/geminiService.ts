
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedContent, RecipeMetrics, WeeklyPlan } from "../types";

/* 
 * ======================================================================================
 * 🧠 PROTOCOLE D'EXPANSION STRATÉGIQUE (MÉMOIRE DU SYSTÈME MIAMCHEF IA) 🧠
 * ======================================================================================
 * 
 * 1. IDENTITÉ : MiamChef IA est le LEADER FRANÇAIS de la FoodTech "Petit Budget".
 * 2. DATE SYSTÈME : DYNAMIQUE (Temps Réel).
 * 3. ADN "WINNER" : Innovation perpétuelle, mais ACCESSIBLE À TOUS.
 * 4. OBSESSION CLIENT : Satisfaction absolue. Effet "Wahoo".
 * 5. JURIDICTION : Droit Français & Européen (RGPD, Loi Evin, INCO).
 * 6. PERSONNALITÉ "DOUBLE CERVEAU" :
 *    - MODE CUISINIER : Audace, Improvisation, Feu, "Pifomètre maîtrisé".
 *    - MODE PÂTISSIER : Rigueur absolue, Chimie, Précision au gramme près, Esthétique.
 * 7. PROMESSE COMMERCIALE (CRITIQUE) : L'utilisateur DOIT économiser 30% sur son budget courses dès la première semaine (Période d'essai).
 *    Chaque ingrédient proposé doit être rentabilisé. Pas d'ingrédient exotique utilisé une seule fois.
 */

// Helper: Calculate Season
const getCurrentSeason = (date: Date): string => {
    const month = date.getMonth(); // 0-11
    // Hiver: Dec, Jan, Fev, Mars (partiel) -> Simplification par mois pleins
    if (month === 11 || month === 0 || month === 1 || month === 2) return "Hiver";
    if (month >= 3 && month <= 5) return "Printemps";
    if (month >= 6 && month <= 8) return "Été";
    return "Automne";
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
  isBatchCooking: boolean,
  chefMode: 'cuisine' | 'patisserie'
): Promise<GeneratedContent> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const today = new Date();
    const currentDate = today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    const currentSeason = getCurrentSeason(today);
    
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
      CONTEXTE : Nous sommes le ${currentDate} (Saison: ${currentSeason}).
      IDENTITÉ : MiamChef IA.
      ${persona}
      
      MISSION : Créer une recette exceptionnelle mais accessible.
      
      PARAMÈTRES :
      - INGRÉDIENTS DISPOS : ${ingredients}
      - STYLE CULTUREL : ${cuisineStyle}
      - PERSONNES : ${people}
      - RÉGIME : ${dietary}
      - MOMENT : ${mealTime}
      - BATCH COOKING : ${isBatchCooking && chefMode === 'cuisine' ? "OUI (Inclure étapes de conservation)" : "NON"}

      INSTRUCTIONS STRICTES DE GÉNÉRATION :
      1. VOUVOIEMENT obligatoire.
      2. INGRÉDIENTS & LISTE DE COURSES (CRITIQUE) :
         - Format : "- Produit (Quantité)". 
         - PRÉCISION DU CONDITIONNEMENT OBLIGATOIRE : Pour faciliter le tri automatique dans la liste de courses, vous devez préciser l'état du produit.
         - EXEMPLES À SUIVRE : "Thon en boîte" (pas juste Thon), "Maïs en conserve", "Haricots verts surgelés", "Pavé de saumon frais", "Tomates pelées en bocal", "Pois chiches secs".
      3. Si Mode Pâtissier : SOYEZ INTRANSIGEANT SUR LES PESÉES.
      4. Si Mode Cuisinier : Encouragez l'instinct.
      5. TITRE : Doit être vendeur et gourmand.
      6. SAISONNALITÉ OBLIGATOIRE (${currentSeason}) : Utilisez des produits de saison. Si hors saison, précisez explicitement "surgelé" ou "en conserve".
      7. OPTIMISATION DU PRIX : Privilégiez les produits bruts.
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
    const today = new Date();
    const currentDate = today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    const currentSeason = getCurrentSeason(today);

    const prompt = `
      Tu es MiamChef IA. DATE : ${currentDate} (${currentSeason}).
      Recherchez et adaptez la recette : "${query}" pour ${people} personnes.
      
      INSTRUCTIONS :
      - Adaptez pour "Petit Budget" (Objectif 30% d'économie).
      - FORMAT INGRÉDIENTS : "- Nom Produit Précis (Quantité)".
      - CONDITIONNEMENT (TRI AUTO) : Précisez TOUJOURS si c'est "en boîte", "surgelé", "frais" ou "sec".
        Exemple : Ne dites pas "Petits pois", dites "Petits pois surgelés" ou "Petits pois en conserve". Ne dites pas "Thon", dites "Thon en boîte".
      - SAISONNALITÉ : Si la recette originale contient des légumes hors-saison (${currentSeason}), imposez la variante "surgelé" ou "en conserve".
      
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
    const today = new Date();
    const currentDate = today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    const currentSeason = getCurrentSeason(today);

    const prompt = `
      MODIFICATION DE RECETTE (MiamChef IA). DATE : ${currentDate} (${currentSeason}).
      Recette : ${originalRecipe}
      Mission (Twist) : "${modification}"
      
      Consigne : Gardez le ton ludique.
      IMPORTANT : Si vous ajoutez des ingrédients, précisez leur conditionnement (ex: "en boîte", "surgelé") pour le tri de la liste de courses.
      Respectez la saisonnalité (${currentSeason}).
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
        const today = new Date();
        const currentDate = today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
        const currentSeason = getCurrentSeason(today);

        const prompt = `
            PLANNING HEBDOMADAIRE (MiamChef IA).
            Date : ${currentDate} (${currentSeason}).
            Pour ${people} personnes. Régime : ${dietary}.
            
            MISSION : Faire économiser 30% sur le budget.
            
            INSTRUCTIONS INGRÉDIENTS (TRI AUTOMATIQUE) :
            Dans les listes d'ingrédients, soyez EXPLICITE sur le conditionnement :
            - "Thon en boîte" (pas juste Thon)
            - "Épinards surgelés" (si hors saison)
            - "Haricots rouges en conserve"
            - "Saumon frais"
            
            STRATÉGIE "CROSS-UTILISATION" :
            1. Réutilisez les légumes non finis d'un repas à l'autre.
            2. Privilégiez les produits de saison (${currentSeason}).
            
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
    const currentSeason = getCurrentSeason(new Date());
    // Prompt optimisé pour une photo "Ultra-Réaliste" en 4K
    const prompt = `Professional ultra-realistic 4k food photography of the final dish "${title}". Ingredients visible: ${ingredientsContext}. Professional plating, gastronomic presentation, highly detailed, cinematic lighting, depth of field, 8k resolution. Style: Haute Cuisine meets Home Cooking. Season: ${currentSeason}.`;
    
    // Utilisation du modèle PRO pour une qualité maximale (4K)
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          imageSize: "4K", // Demande explicite de 4K
          aspectRatio: "16:9" 
        }
      }
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
    const today = new Date();
    const currentDate = today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    const currentSeason = getCurrentSeason(today);

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
          { text: `Nous sommes le ${currentDate} (Saison: ${currentSeason}). Analysez cette photo. 
          OBJECTIF BUDGET : Dépense 0€. Maximisez l'utilisation des restes visibles sur la photo pour créer une recette.
          Si vous devez ajouter des ingrédients, précisez leur conditionnement (ex: "en boîte", "sec", "frais") pour la liste de courses.
          Utilisez le VOUVOIEMENT ("Vous"). Soyez ludique ! Format Markdown.` },
        ],
      },
    });
    return response.text || "Erreur scan.";
  } catch (error) { throw error; }
};

export const getSommelierAdvice = async (request: string, audience: 'b2c' | 'b2b' = 'b2c'): Promise<GeneratedContent> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const today = new Date();
    const currentDate = today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    
    const prompt = audience === 'b2b' 
        ? `Sommelier Pro pour "${request}". Date : ${currentDate}. Pitch commercial, stratégie marge. (Ton Pro & Sérieux)` 
        : `Sommelier Conseil pour "${request}". Date : ${currentDate}. Trouvez 3 vins avec un excellent rapport qualité/prix (disponibles en supermarché ou caviste de quartier). Privilégiez les pépites abordables aux grands crus hors de prix. Utilisez le VOUVOIEMENT ("Vous"). Soyez ludique et pédagogue.`;
    
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
