
import { GoogleGenAI, Type, GenerateContentResponse, ThinkingLevel } from "@google/genai";
import { GeneratedContent, RecipeMetrics, WeeklyPlan, GroundingChunk } from "../types";
import { getUserProfile } from "./storageService";

// Instructions for the AI to avoid certain words
// AJOUT: Interdiction stricte de mentionner "IA", "Chef", "Gastronomie", "Bistronomie"
const BANNED_WORDS_INSTRUCTION = "IMPORTANT: N'utilisez jamais les mots 'IA', 'Intelligence Artificielle', 'Algorithme', 'Gastronomie', 'Bistronomie', 'Élite' ou 'Chef' (sauf pour dire 'MiamChef'). Parlez comme un passionné de cuisine bienveillant, pas comme un robot ni un professeur.";

// RGPD & SAFETY PROTOCOL - INJECTED IN ALL PROMPTS
const GDPR_COMPLIANCE_PROTOCOL = `
=== PROTOCOLE CONFIDENTIALITÉ ===
1. MINIMISATION DES DONNÉES : Ne demandez JAMAIS d'informations identifiantes.
2. TRAITEMENT ÉPHÉMÈRE : Considérez toutes les données fournies comme strictement confidentielles.
3. SANTÉ & SÉCURITÉ : Si l'utilisateur mentionne une pathologie grave, rappelez brièvement les précautions d'usage sans jargon médical.
`;

// Helper to retrieve and format User Profile for Prompts
const getUserProfileContext = (): string => {
    const profile = getUserProfile();
    // On garde la structure pour l'IA, mais le nom est juste "Contexte Utilisateur"
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
        context += `MATÉRIEL DISPONIBLE : ${profile.equipment}\n`;
    }
    
    // Global Diet (Combined with input diet usually, but good to have as fallback)
    context += `RÉGIME GLOBAL : ${profile.diet}\n`;
    
    return context;
};

// Helper to get the current season based on the date
const getCurrentSeason = (date: Date): string => {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return "Printemps";
  if (month >= 5 && month <= 7) return "Été";
  if (month >= 8 && month <= 10) return "Automne";
  return "Hiver";
};

// Helper to translate diet selection into strict AI instructions
const getDietaryConstraints = (diet: string): string => {
  switch (diet) {
    case 'Végétarien': 
        return "RÉGIME STRICTEMENT VÉGÉTARIEN : Aucune viande, aucun poisson, aucun fruit de mer. Oeufs, miel et produits laitiers sont autorisés.";
    case 'Vegan': 
        return "RÉGIME STRICTEMENT VEGAN (VÉGÉTALIEN) : Aucun produit d'origine animale. Ni viande, ni poisson, ni oeuf, ni produit laitier, ni miel. Utilisez des alternatives végétales.";
    case 'Halal': 
        return "RÉGIME HALAL : Interdiction ABSOLUE de porc (et dérivés : lardons, gélatine de porc, saindoux). Interdiction ABSOLUE d'alcool (même cuit, pas de vin/bière dans les sauces). La viande doit être certifiée Halal.";
    case 'Casher': 
        return "RÉGIME CASHER : Interdiction ABSOLUE de porc, lapin, cheval. Pas de fruits de mer ni crustacés (seuls les poissons à écailles/nageoires sont ok). INTERDICTION FORMELLE DE MÉLANGER VIANDE ET PRODUITS LAITIERS dans la même recette ou le même menu (Respecter les temps de pause).";
    case 'Sans Gluten': 
        return "RÉGIME SANS GLUTEN (Cœliaque) : Interdiction stricte de blé, orge, seigle, avoine, épeautre. Utilisez : Farine de riz, maïs, sarrasin, fécule, pois chiche. Attention aux sauces soja classiques (tamari ok).";
    case 'Sans Lactose': 
        return "RÉGIME SANS LACTOSE : Pas de lait de vache, crème, beurre ou fromages frais contenant du lactose. Privilégiez les produits délactosés ou les alternatives végétales (soja, amande).";
    case 'Régime Crétois': 
        return "RÉGIME CRÉTOIS (MÉDITERRANÉEN STRICT) : La base de TOUS les repas doit être végétale (légumes, légumineuses, noix, céréales complètes). Huile d'olive comme source de graisse principale. VIANDE ROUGE : Maximum 1 à 2 fois par MOIS. VOLAILLE/OEUFS : Modéré (1-2 fois par semaine). POISSON : Modéré (2 fois par semaine). Les autres jours doivent être SANS protéine animale (protéines végétales uniquement).";
    case 'Sportif (Protéiné)': 
        return "NUTRITION SPORTIVE : Riche en protéines (20-30g min/repas). Glucides complexes à indice glycémique bas/moyen. Bonnes graisses (oméga-3). Focus sur la récupération et l'énergie.";
    default: 
        return "Régime classique équilibré (Omnivore).";
  }
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
        description: "LA RECETTE COMPLÈTE ET RÉDIGÉE : Titre, Intro, Liste des ingrédients (avec quantités), Instructions détaillées, Conclusion. C'est ce texte qui s'affiche à l'utilisateur."
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
        description: "LISTE PANIER : Noms des produits SEULS pour la liste de courses (ex: 'Riz')." 
    },
    ingredientsWithQuantities: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "LISTE CUISINE : Ingrédients détaillés avec quantités (ex: '300g de Riz')."
    },
    steps: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "MODE CUISINE INTERACTIF : Une liste technique d'instructions courtes et claires. Si un appareil est utilisé, commence l'étape par [APPAREIL] en majuscules."
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

// Helper to get the AI instance with the current API key
const getAI = () => {
    // Dans AI Studio, on utilise process.env.GEMINI_API_KEY
    // Sur Vercel/Vite, on peut avoir besoin de import.meta.env.VITE_GEMINI_API_KEY
    const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
        console.error("ERREUR : La clé API Gemini est manquante.");
        throw new Error("Clé API manquante. Veuillez configurer GEMINI_API_KEY dans les Secrets (AI Studio) ou VITE_GEMINI_API_KEY (Vercel).");
    }
    return new GoogleGenAI({ apiKey });
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
  recipeCost: 'authentic' | 'budget' = 'authentic',
  difficultyLevel: 'beginner' | 'intermediate' | 'expert' = 'intermediate',
  smartDevices: string[] = []
): Promise<GeneratedContent> => {
  try {
    const ai = getAI();
    const today = new Date();
    const currentDate = today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    const currentSeason = getCurrentSeason(today);
    
    // Inject User Profile (Mes Préférences)
    const userProfileContext = getUserProfileContext();
    
    // Integration Smart Devices - PROMPT RENFORCÉ "DOUBLE CERVEAU"
    const smartDevicePrompt = smartDevices.length > 0 
        ? `
        🚨 MODE APPAREIL ACTIVÉ : ${smartDevices.join(', ').toUpperCase()} DÉTECTÉ(S) 🚨
        
        Tu maîtrises parfaitement ces machines.
        Tes instructions doivent être précises.
        
        RÈGLES IMPÉRATIVES POUR LA LISTE DES ÉTAPES (steps) et le texte (markdownContent) :
        1. Utilise le VOCABULAIRE EXACT de l'interface de la machine.
        2. SI COOKEO : Utilise "Mode Doré", "Cuisson sous pression" (ou Rapide), "Maintien au chaud".
        3. SI THERMOMIX / MONSIEUR CUISINE : Utilise le format "Vitesse X / Température Y / Durée Z". Mentionne "Sens Inverse" ou "Varoma" si nécessaire.
        4. SI AIRFRYER : Précise "Mode Airfry", "180°C", "Secouer le panier".
        `
        : "";

    // 1. DYNAMIC PERSONA MATRIX (LOGIQUE EXPERTE)
    let personaPrompt = "";
    
    if (chefMode === 'patisserie') {
        if (difficultyLevel === 'beginner') {
             personaPrompt = `
             IDENTITÉ : Grand-Mère Pâtissière ou Ami Passionné.
             TON : Bienveillant, rassurant, ultra-clair. 
             MISSION : Rendre la pâtisserie simple et amusante.
             `;
        } else if (difficultyLevel === 'intermediate') {
             personaPrompt = `
             IDENTITÉ : Artisan Boulanger de quartier.
             TON : Professionnel, efficace, précis.
             MISSION : Garantir un résultat "comme à la boulangerie" à la maison.
             `;
        } else {
             personaPrompt = `
             IDENTITÉ : Expert Pâtissier Créatif.
             TON : Précis, pointu sur les textures et températures.
             MISSION : L'excellence du goût et du visuel.
             `;
        }
    } else {
        // MODE CUISINE
        if (difficultyLevel === 'beginner') {
             personaPrompt = `
             IDENTITÉ : Cuisinier Pédagogue.
             TON : Enthousiaste, décomplexé, encourageant. "C'est bon, c'est malin".
             MISSION : Faire cuisiner les gens pressés sans les décourager.
             `;
        } else if (difficultyLevel === 'intermediate') {
             personaPrompt = `
             IDENTITÉ : Cuisinier Passionné du Quotidien.
             TON : Franc, généreux, amoureux du produit.
             MISSION : La cuisine de tous les jours, mais en mieux.
             `;
        } else {
             personaPrompt = `
             IDENTITÉ : Expert Culinaire.
             TON : Technique, perfectionniste mais accessible.
             MISSION : Sublimer les produits, maîtriser les cuissons.
             `;
        }
    }

    // 2. NIVEAU DE DIFFICULTÉ
    let difficultyPrompt = "";
    switch (difficultyLevel) {
        case 'beginner':
            difficultyPrompt = `NIVEAU DE DIFFICULTÉ : FACILE / DÉBUTANT. 
            INSTRUCTION : Utilisez un vocabulaire simple, des techniques de base, et assurez-vous que la recette soit réalisable sans stress.`;
            break;
        case 'expert':
            difficultyPrompt = `NIVEAU DE DIFFICULTÉ : AVANCÉ / EXPERT. 
            INSTRUCTION : Vous pouvez utiliser des techniques plus complexes, des cuissons précises et un dressage soigné. Ne simplifiez pas à l'excès.`;
            break;
        default:
            difficultyPrompt = `NIVEAU DE DIFFICULTÉ : MOYEN / INTERMÉDIAIRE. 
            INSTRUCTION : Un bon équilibre entre technique et simplicité.`;
            break;
    }

    // 3. BUDGET
    let costPrompt = recipeCost === 'budget' 
        ? "BUDGET : ÉCONOMIQUE. INSTRUCTION : Priorité absolue aux ingrédients à bas prix, astuces anti-gaspi, et produits de saison accessibles. Évitez les produits de luxe." 
        : "BUDGET : QUALITÉ / GASTRONOMIQUE. INSTRUCTION : Priorité aux produits d'exception, à la fraîcheur et à l'authenticité des saveurs. Ne cherchez pas à faire des économies au détriment du goût.";

    // 4. GOLDEN RULES
    const technicalRules = `
    ⚠️ RÈGLES TECHNIQUES :
    1. Cuisson juste.
    2. Goût équilibré.
    3. Respect des saisons.
    `;

    // Récupération des contraintes strictes
    const strictDietaryRules = getDietaryConstraints(dietary);

    // CONSTRUCTION DU PROMPT FINAL
    const prompt = `
      🚨 CONSIGNE CRITIQUE : TU DOIS RESPECTER SCRUPULEUSEMENT LES PARAMÈTRES CI-DESSOUS. NE PAS UTILISER DE VALEURS PAR DÉFAUT. 🚨

      CONTEXTE TEMPOREL : Nous sommes le ${currentDate} (Saison: ${currentSeason}).
      
      ${userProfileContext}
      ${smartDevicePrompt}

      === VOTRE PERSONA ===
      ${personaPrompt}

      === LA MISSION ===
      Créer une recette pour la demande : "${userConfig}"
      
      === PARAMÈTRES CRITIQUES (À RESPECTER SCRUPULEUSEMENT) ===
      - STYLE : ${cuisineStyle} (L'esprit du plat doit être 100% fidèle à ce style)
      - COUVERTS : ${people} personnes (Les quantités doivent être exactes pour ce nombre)
      - TYPE DE REPAS : ${mealTime}
      - RÉGIME : ${strictDietaryRules} (AUCUNE déviation autorisée)
      - BUDGET : ${costPrompt}
      - DIFFICULTÉ : ${difficultyPrompt}

      === CONTRAINTES SUPPLÉMENTAIRES ===
      1. ${technicalRules}
      2. MATÉRIEL : Adaptez la recette au matériel disponible de l'utilisateur. Si un ustensile spécifique est indispensable, listez-le clairement dans le champ 'utensils'.
      3. CONSERVATION : Déterminez précisément la durée et le mode de conservation (frigo/congélo) et renseignez-le dans le champ 'storageAdvice'.
      4. ${GDPR_COMPLIANCE_PROTOCOL}
      
      === FORMAT DE TEXTE (CRITIQUE) ===
      1. COMMENCEZ IMPÉRATIVEMENT par un titre de niveau 1 (ex: # Mon Super Plat). C'est obligatoire et crucial pour le système. Le titre doit refléter la recette créée.
      2. Pour le champ 'markdownContent', utilisez des listes à puces (avec des tirets '-') pour les ingrédients. Chaque ingrédient doit être sur sa propre ligne.
      3. N'utilisez JAMAIS de titres (comme # ou ##) pour chaque ligne d'instruction. Utilisez des paragraphes normaux pour les étapes. Seuls les grands titres de section (Ingrédients, Préparation) peuvent avoir des ##.
      
      === FORMAT DE SORTIE ATTENDU (JSON) ===
      Répondre UNIQUEMENT en JSON valide respectant le schéma fourni.
      
      ${BANNED_WORDS_INSTRUCTION}
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
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

// Searches for a chef's recipe based on query
export const searchChefsRecipe = async (query: string, people: number, type: 'economical' | 'authentic'): Promise<GeneratedContent> => {
  const ai = getAI();
  const userProfileContext = getUserProfileContext();
  
  const prompt = `🚨 CONSIGNE CRITIQUE : TU DOIS RESPECTER SCRUPULEUSEMENT LES PARAMÈTRES CI-DESSOUS. NE PAS UTILISER DE VALEURS PAR DÉFAUT. 🚨

  TA MISSION : Trouver une recette qui respecte PARFAITEMENT les critères suivants :
  - TYPE : ${type === 'authentic' ? 'STRICTEMENT AUTHENTIQUE (fidèle à la tradition, sans raccourcis)' : 'ÉCONOMIQUE ET MALIGNE (petit budget, ingrédients accessibles)'}
  - PLAT : "${query}"
  - NOMBRE DE PERSONNES : ${people}
  
  ${userProfileContext}
  
  === CONTRAINTES CRITIQUES ===
  1. RESPECT DU TYPE : Si le type est 'authentic', ne proposez aucune variante moderne. Si le type est 'economical', proposez des astuces pour réduire le coût.
  2. MATÉRIEL : Adaptez la recette au matériel disponible de l'utilisateur. Listez IMPÉRATIVEMENT les ustensiles nécessaires dans le champ 'utensils'.
  3. CONSERVATION : Déterminez précisément la durée et le mode de conservation (frigo/congélo) et renseignez-le dans le champ 'storageAdvice'.
  4. RÉGIME : Si le profil utilisateur indique un régime spécifique, ADAPTEZ la recette impérativement.
  5. ${GDPR_COMPLIANCE_PROTOCOL}
 
  === FORMAT DE TEXTE (CRITIQUE) ===
  1. COMMENCEZ IMPÉRATIVEMENT par un titre de niveau 1 (ex: # Mon Super Plat). C'est obligatoire et crucial pour le système. Le titre doit refléter la recette trouvée.
  2. Pour le champ 'markdownContent', utilisez des listes à puces (avec des tirets '-') pour les ingrédients. Chaque ingrédient doit être sur sa propre ligne.
  3. N'utilisez JAMAIS de titres (comme # ou ##) pour chaque ligne d'instruction. Utilisez des paragraphes normaux pour les étapes. Seuls les grands titres de section (Ingrédients, Préparation) peuvent avoir des ##.

  ${BANNED_WORDS_INSTRUCTION}`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: [{ text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: recipeSchema,
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
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

// --- NOUVEAU : AJUSTEMENT INTELLIGENT DE RECETTE ---
export const adjustRecipe = async (originalRecipeText: string, adjustmentType: string): Promise<GeneratedContent> => {
    const ai = getAI();
    const userProfileContext = getUserProfileContext();
    
    // Définition de la stratégie d'ajustement
    let specificInstruction = "";
    switch (adjustmentType) {
        case "Réduire le sel":
            specificInstruction = "OBJECTIF : Réduire le sodium. Compenser par épices/herbes.";
            break;
        case "Augmenter les protéines":
            specificInstruction = "OBJECTIF : Booster l'apport en protéines.";
            break;
        case "Passer au végétal":
            specificInstruction = "OBJECTIF : Végétaliser la recette (Végétarien/Vegan).";
            break;
        case "Adapter aux enfants":
            specificInstruction = "OBJECTIF : Rendre le plat adapté aux enfants (goûts simples, ludique).";
            break;
        default:
            specificInstruction = `OBJECTIF : ${adjustmentType}`;
    }

    const prompt = `
    🚨 CONSIGNE CRITIQUE : TU DOIS RESPECTER SCRUPULEUSEMENT L'AJUSTEMENT DEMANDÉ. NE PAS IGNORER L'OBJECTIF. 🚨

    TU ES UN EXPERT EN REVISITE CULINAIRE.
    ${userProfileContext}
    TA MISSION : Réécrire la recette ci-dessous en appliquant l'ajustement demandé et en l'adaptant au MATÉRIEL DISPONIBLE de l'utilisateur.
    
    === RECETTE D'ORIGINE ===
    ${originalRecipeText}
    
    === AJUSTEMENT ===
    ${adjustmentType}
    
    === INSTRUCTION ===
    ${specificInstruction}
    CONSERVATION : Déterminez précisément la durée et le mode de conservation (frigo/congélo) et renseignez-le dans le champ 'storageAdvice'.
    
    === FORMAT DE TEXTE (CRITIQUE) ===
    1. COMMENCEZ IMPÉRATIVEMENT par un titre de niveau 1 (ex: # Mon Super Plat Revisité). C'est obligatoire et crucial pour le système. Le titre doit refléter l'ajustement effectué.
    2. Pour le champ 'markdownContent', utilisez des listes à puces (avec des tirets '-') pour les ingrédients. Chaque ingrédient doit être sur sa propre ligne.
    3. N'utilisez JAMAIS de titres (comme # ou ##) pour chaque ligne d'instruction. Utilisez des paragraphes normaux pour les étapes. Seuls les grands titres de section (Ingrédients, Préparation) peuvent avoir des ##.
    
    ${GDPR_COMPLIANCE_PROTOCOL}
    ${BANNED_WORDS_INSTRUCTION}
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: { parts: [{ text: prompt }] },
        config: {
            responseMimeType: "application/json",
            responseSchema: recipeSchema,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
        },
    });

    const data = cleanAndParseJSON(response.text || "{}");
    return {
        text: sanitizeText(data.markdownContent) || "Erreur d'ajustement.",
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

// Generates a high-quality food image
export const generateRecipeImage = async (title: string, context: string): Promise<string> => {
  const ai = getAI();
  
  const gdprSafePrompt = `
  Ultra-realistic 1K professional food photography of: ${title}.
  Context/Style: ${context}.
  High resolution, professional studio lighting, macro shot, appetizing, 1K quality.
  No text. No faces.
  `;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3.1-flash-image-preview',
    contents: { parts: [{ text: gdprSafePrompt }] },
    config: { 
      imageConfig: { 
        aspectRatio: "1:1",
        imageSize: "1K"
      } 
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Failed to generate image");
};

// --- NOUVEAU : GENERATE VEO VIDEO (Social Media Asset) ---
export const generateRecipeVideo = async (title: string, style: string): Promise<string> => {
  const ai = getAI();

  const videoPrompt = `
  Cinematic professional food b-roll video of: ${title}.
  Style: ${style}.
  Slow motion, steam rising, highly detailed texture, professional studio lighting, 4k.
  No text, no faces.
  `;

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: videoPrompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p', // Fast preview resolution
      aspectRatio: '9:16' // Vertical for TikTok/Reels
    }
  });

  // Polling loop to wait for video generation
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Check every 5 seconds
    operation = await ai.operations.getVideosOperation({operation: operation});
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed");

  // Fetch the actual video bytes using the API Key in headers as per documentation
  const response = await fetch(downloadLink, {
    method: 'GET',
    headers: {
      'x-goog-api-key': process.env.GEMINI_API_KEY || '',
    },
  });
  const blob = await response.blob();
  
  return URL.createObjectURL(blob);
};

// Scans fridge image and suggests a recipe
export const scanFridgeAndSuggest = async (base64Image: string, dietary: string = 'Classique (Aucun)'): Promise<GeneratedContent> => {
  const ai = getAI();
  const userProfileContext = getUserProfileContext();
  
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };
  
  const dietRules = getDietaryConstraints(dietary);

  const textPart = {
    text: `ROLE : Expert Cuisinier en vision par ordinateur.
    
    ${GDPR_COMPLIANCE_PROTOCOL}
    ${userProfileContext}

    ETAPE 1 : IDENTIFICATION
    Liste les ingrédients visibles.
    
    ETAPE 2 : FILTRAGE
    REGIME : ${dietary}
    RÈGLES : ${dietRules}
    Ignorer les ingrédients interdits.
    
    ETAPE 3 : CRÉATION
    Crée une recette anti-gaspillage simple et savoureuse adaptée au régime demandé et au MATÉRIEL DISPONIBLE de l'utilisateur. 
    CONSERVATION : Déterminez précisément la durée et le mode de conservation (frigo/congélo) et renseignez-le dans le champ 'storageAdvice'.
    Format Markdown. 
    1. COMMENCEZ IMPÉRATIVEMENT par un titre de niveau 1 (ex: # Mon Super Plat Anti-Gaspi). C'est obligatoire et crucial pour le système.
    2. Utilisez des listes à puces (avec des tirets '-') pour les ingrédients. Chaque ingrédient doit être sur sa propre ligne.
    3. N'utilisez JAMAIS de titres (comme # ou ##) pour chaque ligne d'instruction. Utilisez des paragraphes normaux pour les étapes. Seuls les grands titres de section peuvent avoir des ##.
    ${BANNED_WORDS_INSTRUCTION}`,
  };

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [imagePart, textPart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: recipeSchema,
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
    }
  });

  const data = cleanAndParseJSON(response.text || "{}");
  return {
    text: sanitizeText(data.markdownContent) || "Je n'ai pas pu analyser l'image.",
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
  const ai = getAI();
  const userProfileContext = getUserProfileContext();

  const prompt = `Sommelier Expert. ${target === 'b2b' ? 'Conseil Pro.' : 'Conseil Particulier.'} 
  ${userProfileContext}
  Requete : "${query}".
  Proposez Accords Vins ET Accords Sans Alcool.
  Utilisez Google Search.
  Format Markdown. N'utilisez JAMAIS de titres (comme # ou ##) pour chaque ligne. Utilisez des paragraphes normaux. Seuls les grands titres de section peuvent avoir des ##.
  ${GDPR_COMPLIANCE_PROTOCOL}
  ${BANNED_WORDS_INSTRUCTION}`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3.1-flash-preview",
    contents: { parts: [{ text: prompt }] },
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
  const ai = getAI();
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
        { text: `Retouche photo culinaire : ${prompt}. Pas de visages.` },
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
export const generateWeeklyMenu = async (dietary: string, people: number, ingredients: string = ''): Promise<WeeklyPlan> => {
  const ai = getAI();
  const userProfileContext = getUserProfileContext();
  const strictDietaryRules = getDietaryConstraints(dietary);

  let ingredientsPrompt = ingredients.trim() ? `Avec ces ingrédients : "${ingredients}".` : "";

  const prompt = `Créez un planning de repas hebdomadaire pour ${people} personnes.
  ${userProfileContext}
  RÉGIME : ${dietary}
  RÈGLES : ${strictDietaryRules}
  ${ingredientsPrompt}
  ${GDPR_COMPLIANCE_PROTOCOL}
  ${BANNED_WORDS_INSTRUCTION}
  Répondez au format JSON strict selon le schéma.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview", 
    contents: { parts: [{ text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: weeklyPlanSchema,
    },
  });

  const data = cleanAndParseJSON(response.text || "{}");
  return data as WeeklyPlan;
};
