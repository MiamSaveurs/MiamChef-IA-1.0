
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedContent, RecipeMetrics, WeeklyPlan } from "../types";

/* 
 * ======================================================================================
 * 🧠 PROTOCOLE D'EXPANSION STRATÉGIQUE (MÉMOIRE DU SYSTÈME MIAMCHEF IA) 🧠
 * ======================================================================================
 * 
 * 1. IDENTITÉ : MiamChef IA est le LEADER FRANÇAIS de la FoodTech "Cuisine Intelligente".
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

// --- INSTRUCTIONS DE SÉCURITÉ DE MARQUE (GLOBALES) ---
const BANNED_WORDS_INSTRUCTION = `
      🚨 RÈGLE D'OR (SÉCURITÉ DE MARQUE - APPLICATION STRICTE) 🚨
      Il est STRICTEMENT INTERDIT d'utiliser les mots suivants (et leurs variations) dans le texte généré :
      1. 🚫 "Bistrot" / "Bistronomique" -> Remplacer OBLIGATOIREMENT par : "Cuisine de Chef", "Raffiné", "Gourmand", "Authentique".
      2. 🚫 "Gastronomie" / "Gastronomique" -> Remplacer OBLIGATOIREMENT par : "Haute Cuisine", "Excellence", "Cuisine d'Exception", "Savoureux".
      3. 🚫 "Petit budget" -> Remplacer OBLIGATOIREMENT par : "Économique", "Abordable", "Malin", "Budget Maîtrisé", "Optimisé".
      
      Si tu es tenté d'utiliser un de ces mots interdits, tu DOIS utiliser le synonyme imposé.
`;

// --- FONCTION DE NETTOYAGE FORCE (FAIL-SAFE) ---
// Cette fonction repasse sur le texte généré par l'IA pour supprimer les mots interdits s'ils sont passés au travers.
const sanitizeText = (text: string | undefined): string => {
    if (!text) return "";
    let clean = text;

    // Remplacement brutal des mots interdits (Case insensitive)
    clean = clean.replace(/bistrot|bistronomique/gi, "Cuisine de Chef");
    clean = clean.replace(/gastronomie|gastronomique/gi, "Cuisine d'Exception");
    clean = clean.replace(/petit budget/gi, "Économique");
    
    return clean;
};

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
            required: ["name", "calories", "ingredients"],
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
            required: ["name", "calories", "ingredients"],
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
            required: ["name", "calories", "ingredients"],
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
            required: ["name", "calories", "ingredients"],
          },
        },
        // IMPORTANT: On ne rend obligatoire que le jour, le déjeuner et le dîner.
        // Si l'IA omet le petit-déj (ex: régime intermittent) ou plante, le JSON reste valide.
        required: ["day", "lunch", "dinner"],
      },
    },
  },
  required: ["days", "batchCookingTips"],
};

export const generateChefRecipe = async (
  userConfig: string, // Renamed from ingredients to userConfig to reflect mixed input
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
        : `MODE: GRAND CHEF CUISINIER D'EXCEPTION (Cerveau Salé).
           STYLE: Cuisine du marché, Improvisation géniale, Maîtrise du feu.
           PHILOSOPHIE: La cuisine vient du coeur. On goûte, on rectifie, on ose.
           VOCABULAIRE: Saisir, Déglacer, Suer, Mijoter, Dresser, Assaisonner.`;

    let dietaryInstruction = `RÉGIME : ${dietary}`;
    if (dietary === "Régime Méditerranéen") {
        dietaryInstruction += `
        ⚠️ INSTRUCTIONS SPÉCIALES RÉGIME MÉDITERRANÉEN :
        1. RATIO VITAL : 80% Végétal (Légumes, fruits, céréales, légumineuses) / 20% Animal (Privilégier poisson, volaille, œufs. Limiter viande rouge).
        2. GRAISSES : Utiliser EXCLUSIVEMENT l'huile d'olive (cuisson/froid) ou l'huile de colza (assaisonnement pour Oméga 3).
        3. SANTÉ : Recette équilibrée, riche en fibres et antioxydants.
        `;
    }

    const prompt = `
      CONTEXTE : Nous sommes le ${currentDate} (Saison: ${currentSeason}).
      IDENTITÉ : MiamChef IA.
      ${persona}
      
      MISSION : Créer une recette exceptionnelle sur-mesure.
      
      ANALYSE DE LA DEMANDE UTILISATEUR (LANGAGE NATUREL) :
      L'utilisateur fournit le texte suivant : "${userConfig}"
      
      TA MISSION D'ANALYSE SÉMANTIQUE :
      1. IDENTIFIE les ingrédients mentionnés dans ce texte.
      2. IDENTIFIE les intentions, envies, commentaires ou contraintes (ex: "je veux du croquant", "j'ai pas de four", "c'est pour un anniversaire").
      3. UTILISE ces intentions pour orienter la recette.
      
      PARAMÈTRES ADDITIONNELS :
      - STYLE CULTUREL : ${cuisineStyle}
      - PERSONNES : ${people}
      - ${dietaryInstruction}
      - MOMENT : ${mealTime}
      - BATCH COOKING : ${isBatchCooking && chefMode === 'cuisine' ? "OUI (Inclure étapes de conservation)" : "NON"}

      INSTRUCTIONS STRICTES DE GÉNÉRATION :
      1. VOUVOIEMENT obligatoire.
      2. INGRÉDIENTS & LISTE DE COURSES (CRITIQUE) :
         - Format : "- Produit (Quantité)". 
         - PRÉCISION DU CONDITIONNEMENT OBLIGATOIRE : Précisez l'état du produit pour le tri (ex: "Thon en boîte", "Haricots verts surgelés", "Pois chiches secs").
      3. Si Mode Pâtissier : SOYEZ INTRANSIGEANT SUR LES PESÉES.
      4. Si Mode Cuisinier : Encouragez l'instinct mais respectez les demandes de l'utilisateur.
      5. TITRE : Doit être vendeur, gourmand et refléter les ingrédients/envies de l'utilisateur.
      6. SAISONNALITÉ OBLIGATOIRE (${currentSeason}) : Si hors saison, imposez "surgelé" ou "conserve".
      7. OPTIMISATION DU PRIX : Privilégiez les produits bruts.

      ${BANNED_WORDS_INSTRUCTION}
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

export const searchChefsRecipe = async (query: string, people: number, searchType: 'economical' | 'authentic'): Promise<GeneratedContent> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const today = new Date();
    const currentDate = today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    const currentSeason = getCurrentSeason(today);

    // Définition de la stratégie selon le choix utilisateur
    const strategyInstruction = searchType === 'economical' 
        ? `- MODE ÉCONOMIQUE ACTIVÉ : Adaptez pour optimiser les coûts (Objectif 30% d'économie). Proposez des alternatives plus abordables.`
        : `- MODE AUTHENTIQUE ACTIVÉ : Respectez la tradition culinaire à la lettre. Utilisez les ingrédients nobles originaux (AOP, AOC, beurre, crème, vin, morceaux spécifiques).`;

    const prompt = `
      Tu es MiamChef IA. DATE : ${currentDate} (${currentSeason}).
      Recherchez et adaptez la recette : "${query}" pour ${people} personnes.
      
      INSTRUCTIONS STRATÉGIQUES :
      ${strategyInstruction}
      
      INSTRUCTIONS DE FORMATAGE (CRITIQUE) :
      - FORMAT INGRÉDIENTS : "- Nom Produit Précis (Quantité)".
      - CONDITIONNEMENT (TRI AUTO) : Précisez TOUJOURS si c'est "en boîte", "surgelé", "frais" ou "sec", MÊME EN MODE AUTHENTIQUE (ex: "Crème liquide entière fraîche", "Tomates San Marzano en conserve").
        Cela est nécessaire pour que l'application puisse trier la liste de courses.
      
      SAISONNALITÉ : 
      - En mode Économique : Si hors saison (${currentSeason}), imposez "surgelé" ou "conserve".
      - En mode Authentique : Si hors saison, suggérez l'alternative de qualité (ex: "Tomates en conserve de qualité supérieure" plutôt que des tomates fraîches insipides en hiver).
      
      ${BANNED_WORDS_INSTRUCTION}
      
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
      text: sanitizeText(data.markdownContent) || "Non trouvé.", 
      groundingChunks: groundingChunks,
      metrics: data.metrics,
      utensils: data.utensils,
      seoTitle: sanitizeText(data.seoTitle),
      seoDescription: sanitizeText(data.seoDescription) 
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
      RÔLE : Tu es MiamChef IA.
      DATE : ${currentDate} (Saison: ${currentSeason}).
      
      TÂCHE : RÉÉCRIRE ENTIÈREMENT la recette ci-dessous en appliquant STRICTEMENT la modification demandée (Twist).
      Ne te contente pas de commenter, tu dois générer une NOUVELLE recette complète.
      
      RECETTE ORIGINALE :
      """
      ${originalRecipe}
      """
      
      MODIFICATION DEMANDÉE (TWIST) : "${modification}"
      
      INSTRUCTIONS :
      1. MODIFICATION TITRE : Change le "seoTitle" pour refléter le twist (ex: "Blanquette de Veau" devient "Blanquette Végétale").
      2. MODIFICATION CONTENU : Adapte les ingrédients, les étapes et les métriques (calories, etc.).
      3. LISTE DE COURSES : Comme toujours, précise le conditionnement des ingrédients (ex: "en boîte", "surgelé", "frais") pour le tri automatique.
      4. TON : Garde le ton ludique et professionnel de MiamChef.
      
      ${BANNED_WORDS_INSTRUCTION}
      
      FORMAT DE SORTIE ATTENDU : JSON complet (Markdown, Metrics, Ustensiles, SEO).
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
      text: sanitizeText(data.markdownContent) || "Erreur modification.", 
      metrics: data.metrics,
      utensils: data.utensils,
      seoTitle: sanitizeText(data.seoTitle),
      seoDescription: sanitizeText(data.seoDescription) 
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

        let specialInstructions = "";
        
        if (dietary === "Régime Méditerranéen") {
            specialInstructions = `
            🚨 PROTOCOLE RÉGIME MÉDITERRANÉEN STRICT (Crétois) :
            1. STRUCTURE : Tu DOIS générer 4 REPAS par jour (Petit-déjeuner, Déjeuner, En-cas, Dîner).
            2. CIBLE CALORIQUE : Viser une moyenne de 2000 Kcal / jour au total.
            3. RATIO D'OR (80/20) : 
               - 80% d'ingrédients VÉGÉTAUX (Fruits, légumes, légumineuses, céréales complètes, noix).
               - 20% d'ingrédients ANIMAUX (Privilégier Poisson, Volaille, Œufs. Viande rouge très occasionnelle).
            4. LIPIDES : Utiliser EXCLUSIVEMENT l'huile d'olive et occasionnellement l'huile de colza (Oméga 3).
            5. STYLE : Cuisine saine, fraîche, colorée, herbes aromatiques.
            `;
        } else {
            specialInstructions = `
            STRUCTURE : Générer les repas principaux (Petit-déjeuner, Déjeuner, En-cas, Dîner) adaptés au régime ${dietary}.
            Tente de fournir 4 repas si pertinent, sinon reste sur le standard Déjeuner/Dîner.
            `;
        }

        const prompt = `
            PLANNING HEBDOMADAIRE (MiamChef IA).
            Date : ${currentDate} (${currentSeason}).
            Pour ${people} personnes. Régime : ${dietary}.
            
            ${specialInstructions}
            
            MISSION : Optimiser les coûts (Objectif 30% d'économie) tout en respectant scrupuleusement le régime.
            
            🚨 DISTRIBUTION CALORIQUE STRICTE (CHRONONUTRITION) :
            1. DÉJEUNER (MIDI) : C'est le repas principal. Il DOIT être le plus calorique de la journée (environ 35-40% du total). Viser 700-850 Kcal.
            2. DÎNER (SOIR) : Il DOIT être plus LÉGER que le déjeuner pour le sommeil (environ 25-30% du total). Viser 450-600 Kcal.
            3. RÈGLE ABSOLUE : Calories Déjeuner > Calories Dîner. Ne faites JAMAIS l'inverse.

            🚨 INSTRUCTIONS IMPORTANTES SUR LES TITRES ET LE CONTENU :
            1. TITRES DES REPAS ("name") : Ils doivent être DESCRIPTIFS et explicites sur le contenu de l'assiette.
               - INTERDIT : "Bol Zen", "Pause Croquante", "Délice du Jardin", "Saveurs du Sud". (Noms marketing abstraits).
               - OBLIGATOIRE : "Salade de Pois Chiches, Feta et Tomates", "Poulet Rôti aux Herbes et Pommes de Terre", "Yaourt Grec et Noix".
               - L'utilisateur doit savoir ce qu'il mange juste en lisant le titre.
            
            2. INGRÉDIENTS DANS LE JSON :
               - Fournissez la liste des ingrédients principaux pour chaque repas.
               - Dans la mesure du possible, listez simplement les noms des ingrédients sans les quantités dans l'array "ingredients" pour l'affichage carte, OU mettez les quantités si nécessaire pour la liste de courses (l'app nettoiera l'affichage).
            
            INSTRUCTIONS LISTE DE COURSES (TRI AUTOMATIQUE) :
            Dans les listes d'ingrédients, soyez EXPLICITE sur le conditionnement :
            - "Thon en boîte" (pas juste Thon)
            - "Épinards surgelés" (si hors saison)
            - "Haricots rouges en conserve"
            - "Saumon frais"
            
            STRATÉGIE "CROSS-UTILISATION" :
            1. Réutilisez les légumes non finis d'un repas à l'autre.
            2. Privilégiez les produits de saison (${currentSeason}).
            
            ${BANNED_WORDS_INSTRUCTION}
            
            Respecte le schéma JSON (Inclure Petit-déjeuner et En-cas SI POSSIBLE).
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
    const prompt = `Professional ultra-realistic 4k food photography of the final dish "${title}". Ingredients visible: ${ingredientsContext}. Professional plating, elegant presentation, highly detailed, cinematic lighting, depth of field, 8k resolution. Style: Haute Cuisine meets Home Cooking. Season: ${currentSeason}. NO TEXT, NO LOGOS.`;
    
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
          OBJECTIF : Dépense 0€. Maximisez l'utilisation des restes visibles sur la photo pour créer une recette.
          Si vous devez ajouter des ingrédients, précisez leur conditionnement (ex: "en boîte", "sec", "frais") pour la liste de courses.
          Utilisez le VOUVOIEMENT ("Vous"). Soyez ludique ! Format Markdown.
          
          ${BANNED_WORDS_INSTRUCTION}` },
        ],
      },
    });
    return sanitizeText(response.text) || "Erreur scan."; 
  } catch (error) { throw error; }
};

export const getSommelierAdvice = async (request: string, audience: 'b2c' | 'b2b' = 'b2c'): Promise<GeneratedContent> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const today = new Date();
    const currentDate = today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    
    const prompt = audience === 'b2b' 
        ? `Sommelier Pro pour "${request}". Date : ${currentDate}. Pitch commercial, stratégie marge. (Ton Pro & Sérieux)` 
        : `Sommelier Conseil pour "${request}". Date : ${currentDate}. Trouvez 3 vins avec un excellent rapport qualité/prix (disponibles en supermarché ou caviste de quartier). Privilégiez les pépites abordables aux grands crus hors de prix. Utilisez le VOUVOIEMENT ("Vous"). Soyez ludique et pédagogue. 
        ${BANNED_WORDS_INSTRUCTION}`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({ web: c.web })).filter((c: any) => c.web);
    return { 
        text: sanitizeText(response.text) || "Erreur sommelier.", 
        groundingChunks 
    };
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
