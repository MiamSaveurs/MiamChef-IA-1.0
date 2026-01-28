
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { GeneratedContent, RecipeMetrics, WeeklyPlan, GroundingChunk } from "../types";

// Instructions for the AI to avoid certain words
const BANNED_WORDS_INSTRUCTION = "IMPORTANT: N'utilisez jamais les mots 'délicieux', 'savoureux' ou 'incroyable'. Laissez la technique parler d'elle-même.";

// RGPD & SAFETY PROTOCOL - INJECTED IN ALL PROMPTS
const GDPR_COMPLIANCE_PROTOCOL = `
=== PROTOCOLE RGPD & SÉCURITÉ DES DONNÉES (NIVEAU CRITIQUE) ===
1. MINIMISATION DES DONNÉES : Vous n'avez besoin QUE des préférences culinaires. Ne demandez JAMAIS d'informations identifiantes (Nom, Email, Adresse, Localisation précise).
2. TRAITEMENT ÉPHÉMÈRE : Considérez toutes les données fournies (ingrédients, photos du frigo) comme strictement confidentielles et transitoires.
3. SANTÉ & SÉCURITÉ : Si l'utilisateur mentionne une pathologie grave, rappelez brièvement que vous êtes une IA culinaire et non un médecin, tout en adaptant la recette (ex: sans sucre pour diabétique).
4. PAS DE STOCKAGE : N'invitez jamais l'utilisateur à enregistrer des données personnelles dans le prompt.
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
    ingredients: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "LISTE PANIER : Liste STRICTE des NOMS d'ingrédients SEULS. INTERDICTION FORMELLE de mettre des quantités ou des unités. Exemple CORRECT : ['Carottes', 'Oignons', 'Riz']. Exemple INCORRECT : ['300g de Carottes', '2 Oignons']." 
    },
    seoTitle: { type: Type.STRING },
    seoDescription: { type: Type.STRING },
  },
  required: ['markdownContent', 'metrics', 'ingredients'],
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
  recipeCost: 'authentic' | 'budget' = 'authentic',
  difficultyLevel: 'beginner' | 'intermediate' | 'expert' = 'intermediate'
): Promise<GeneratedContent> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const today = new Date();
    const currentDate = today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    const currentSeason = getCurrentSeason(today);
    
    // 1. DYNAMIC PERSONA MATRIX (LOGIQUE EXPERTE)
    let personaPrompt = "";
    
    if (chefMode === 'patisserie') {
        if (difficultyLevel === 'beginner') {
             // FACILE : Pâtisserie Maison
             personaPrompt = `
             IDENTITÉ : Grand-Mère Pâtissière ou Pâtissier Amateur Passionné.
             TON : Bienveillant, rassurant, ultra-clair. 
             MISSION : Démystifier la pâtisserie. Rendre l'impossible accessible.
             INTERDIT : Techniques de laboratoire (glucose atomisé, pectine NH, tempérage sur marbre).
             VOCABULAIRE : Simple ("Mélanger vigoureusement" au lieu de "Emulsionner").
             `;
        } else if (difficultyLevel === 'intermediate') {
             // MOYEN : Artisan de Quartier
             personaPrompt = `
             IDENTITÉ : Artisan Boulanger-Pâtissier de quartier.
             TON : Professionnel, efficace, précis sans être pédant.
             MISSION : Garantir un résultat "boutique" à la maison.
             TECHNIQUE : Pâtes maison, crèmes maîtrisées, pochage soigné.
             `;
        } else {
             // EXPERT : MOF (Haute Couture)
             personaPrompt = `
             IDENTITÉ : Meilleur Ouvrier de France (MOF) Pâtissier (Style Pierre Hermé / Cédric Grolet).
             TON : Chirurgical, scientifique, obsessionnel sur les textures et températures.
             MISSION : L'excellence absolue. La pâtisserie est une chimie exacte.
             EXIGENCE : Précision au gramme. Temps de repos respectés à la minute.
             STRUCTURE : Inserts, Croustillants, Mousses, Glaçages.
             `;
        }
    } else {
        // MODE CUISINE
        if (difficultyLevel === 'beginner') {
             // FACILE : Cuisine du Quotidien
             personaPrompt = `
             IDENTITÉ : Chef TV Pédagogue (Style Cyril Lignac / Jamie Oliver).
             TON : Enthousiaste, décomplexé, encourageant. "C'est gourmand, c'est malin".
             MISSION : Faire cuisiner les gens pressés sans les décourager.
             INTERDIT : Termes comme "Singer", "Suer", "Déglacer" SANS explication immédiate entre parenthèses.
             MATÉRIEL : Standard (Poêle, Casserole). Pas de sous-vide ni de siphon.
             `;
        } else if (difficultyLevel === 'intermediate') {
             // MOYEN : Bistronomie
             personaPrompt = `
             IDENTITÉ : Chef de Bistrot Gourmand.
             TON : Franc, généreux, amoureux du produit brut.
             MISSION : La "Cuisine de Marché". On respecte le produit, on soigne les cuissons.
             TECHNIQUE : Vrais jus, sauces montées, découpes régulières.
             `;
        } else {
             // EXPERT : Haute Gastronomie
             personaPrompt = `
             IDENTITÉ : Grand Chef 3 Étoiles (Style Robuchon / Ducasse).
             TON : Autoritaire, technique, perfectionniste.
             MISSION : La quintessence du goût. Aucune approximation tolérée.
             EXIGENCE : Maîtrise absolue du feu. Assaisonnement millimétré à chaque étape.
             VOCABULAIRE : Technique pure (Mirepoix, Concassée, Sucs, Réduction à glace).
             `;
        }
    }

    // 2. NIVEAU DE DIFFICULTÉ (CONTRAINTES DE RÉALISATION)
    let difficultyPrompt = "";
    switch (difficultyLevel) {
        case 'beginner':
            difficultyPrompt = `
            NIVEAU : DÉBUTANT.
            OBJECTIF : Zéro stress. Résultat garanti.
            COMPLEXITÉ : Minimale. Étapes courtes.
            `;
            break;
        case 'expert':
            difficultyPrompt = `
            NIVEAU : EXPERT.
            OBJECTIF : Épater visuellement et gustativement.
            COMPLEXITÉ : Élevée. Plusieurs préparations simultanées. Dressage minute.
            `;
            break;
        default: // intermediate
            difficultyPrompt = `
            NIVEAU : INTERMÉDIAIRE.
            OBJECTIF : Bon équilibre temps/résultat. Fait maison prioritaire.
            `;
            break;
    }

    // 3. BUDGET (CONTRAINTES ÉCONOMIQUES)
    let costPrompt = "";
    if (recipeCost === 'budget') {
        costPrompt = `
        BUDGET : ÉCONOMIQUE / ÉTUDIANT.
        INTERDICTION : Produits de luxe (Truffe, Foie gras, Boeuf de Kobe, Lotte).
        SUBSTITUTIONS : Proposer des alternatives malines pour les ingrédients coûteux.
        PHILOSOPHIE : "L'art d'accommoder les restes" ou "Manger royal pour pas un rond".
        `;
    } else {
        costPrompt = `
        BUDGET : NO LIMIT / AUTHENTIQUE.
        PRIORITÉ : Qualité du produit (AOP, Label Rouge, Bio, Terroir).
        PHILOSOPHIE : "Le produit se suffit à lui-même s'il est exceptionnel".
        `;
    }

    // 4. GOLDEN RULES (LOIS PHYSIQUES INVIOLABLES)
    const technicalRules = `
    ⚠️ RÈGLES CULINAIRES ABSOLUES (A RESPECTER SOUS PEINE DE DISQUALIFICATION) :
    
    1. LOI DE LA PÂTISSERIE ET DES FRUITS :
       - INTERDICTION FORMELLE de cuire des fraises ou framboises fraîches sur une tarte. 
       - PROCÉDURE : Fond de tarte cuit à blanc > Refroidissement > Crème > Fruits frais posés crus à la fin.
       
    2. RÉACTION DE MAILLARD & REPOS (INDISPENSABLE) :
       - Sauf pour le "bouilli" ou "blanquette", une viande doit subir une RÉACTION DE MAILLARD (saisie/coloration) à feu vif pour développer les sucs.
       - REPOS OBLIGATOIRE après cuisson (sous papier alu) pour détendre les fibres (5 à 10 min).
       
    3. LOI DES PÂTES :
       - Cuisson Al Dente.
       - Ne JAMAIS rincer les pâtes après cuisson (sauf salade de pâtes).
       - Toujours utiliser un peu d'eau de cuisson pour lier la sauce (Mantecatura).
       
    4. LOI DES LÉGUMES VERTS :
       - Cuisson à l'anglaise (eau bouillante très salée).
       - Refroidissement immédiat dans l'eau glacée (fixer la chlorophylle) pour garder le vert.
    `;

    // Récupération des contraintes strictes
    const strictDietaryRules = getDietaryConstraints(dietary);

    // CONSTRUCTION DU PROMPT FINAL
    const prompt = `
      CONTEXTE TEMPOREL : Nous sommes le ${currentDate} (Saison: ${currentSeason}).
      
      === VOTRE PERSONA ===
      ${personaPrompt}

      === LA MISSION ===
      Créer une recette pour la demande : "${userConfig}"
      
      === PARAMÈTRES OBLIGATOIRES ===
      - STYLE : ${cuisineStyle}
      - COUVERTS : ${people} personnes
      - TYPE DE REPAS : ${mealTime}
      - RÉGIME (CRITIQUE) : ${strictDietaryRules}

      === CONTRAINTES STRICTES ===
      1. ${costPrompt}
      2. ${difficultyPrompt}
      3. ${technicalRules}
      4. ${GDPR_COMPLIANCE_PROTOCOL}
      
      === FORMAT DE SORTIE ATTENDU (JSON) ===
      Vous devez répondre UNIQUEMENT en JSON valide respectant ce schéma :
      {
        "markdownContent": "La recette complète formatée en Markdown élégant. Utilisez des titres, du gras pour les ingrédients clés.",
        "metrics": {
          "nutriScore": "A/B/C/D/E",
          "caloriesPerPerson": Nombre entier,
          "caloriesPer100g": Nombre entier,
          "pricePerPerson": Nombre (Estimez selon le marché actuel),
          "carbohydrates": Nombre,
          "proteins": Nombre,
          "fats": Nombre,
          "difficulty": "Facile/Moyen/Expert" (Doit correspondre au niveau demandé)
        },
        "utensils": ["Liste", "Des", "Ustensiles"],
        "ingredients": ["Carottes", "Oignons", "Boeuf"] (ATTENTION: Noms des produits SEULEMENT pour la liste de courses. PAS de quantité ici.),
        "seoTitle": "Titre court et accrocheur pour le référencement",
        "seoDescription": "Description courte (meta description) qui donne faim."
      }
      
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
  Répondez au format JSON selon le schéma.
  
  ${GDPR_COMPLIANCE_PROTOCOL}

  IMPORTANT POUR LA LISTE D'INGRÉDIENTS (CHAMP 'ingredients') :
  - Fournissez UNIQUEMENT les noms des produits pour une recherche Drive.
  - PAS de quantités, PAS de poids. (Ex: "Tomates", "Riz", "Boeuf").`;

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
    ingredients: data.ingredients, // Liste nettoyée (noms seuls)
    seoTitle: sanitizeText(data.seoTitle),
    seoDescription: sanitizeText(data.seoDescription)
  };
};

// Generates a high-quality food image
// MODIFIED: Accepts ingredients context for realism
export const generateRecipeImage = async (title: string, context: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // PROMPT HYPER-RÉALISTE AMÉLIORÉ
  // On force le modèle à prendre en compte les ingrédients et à éviter le texte.
  const gdprSafePrompt = `
  Hyper-realistic professional food photography of: ${title}.
  
  CRITICAL DETAILS FOR COHERENCE:
  - Context/Style: ${context} (Ensure plating matches this style, e.g., Rustic for family meals, Minimalist for gourmet).
  - Visible Ingredients: Ensure the main ingredients mentioned in the title are visibly present and appetizing.
  
  TECHNICAL SPECS:
  - 8k resolution, highly detailed textures.
  - Macro photography or 50mm lens.
  - Lighting: Soft natural window light or professional studio food lighting.
  - Effect: Steam rising (if hot dish), condensation droplets (if cold drink/dessert).
  - Depth of field: Shallow (bokeh background).
  
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

// Scans fridge image and suggests a recipe
export const scanFridgeAndSuggest = async (base64Image: string, dietary: string = 'Classique (Aucun)'): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };
  
  const dietRules = getDietaryConstraints(dietary);

  // Prompt amélioré pour forcer l'identification visuelle explicite
  const textPart = {
    text: `ROLE : Tu es un Chef Cuisinier expert en vision par ordinateur.
    
    ${GDPR_COMPLIANCE_PROTOCOL}

    ETAPE 1 : IDENTIFICATION
    Analyse visuellement cette photo avec une extrême précision. Liste TOUS les ingrédients comestibles que tu vois.
    ATTENTION RGPD : Ignore tout texte visible sur des courriers, des photos de personnes ou tout objet personnel non culinaire. Concentre-toi UNIQUEMENT sur la nourriture.
    
    ETAPE 2 : FILTRAGE
    REGIME IMPOSÉ PAR L'UTILISATEUR : ${dietary}
    RÈGLES STRICTES : ${dietRules}
    
    Si tu as identifié des ingrédients sur la photo qui sont INTERDITS par ce régime, TU DOIS LES IGNORER TOTALEMENT pour la recette.
    
    ETAPE 3 : CRÉATION
    En utilisant PRINCIPALEMENT les ingrédients identifiés, crée une recette gastronomique et anti-gaspillage.
    
    FORMAT DE RÉPONSE (Markdown) :
    1. Commence par : "**Ingrédients identifiés :** [Liste des ingrédients vus]"
    2. Titre de la recette (avec #)
    3. Ingrédients complets (avec quantités estimées)
    4. Instructions étape par étape.
    
    Ton ton doit être encourageant, professionnel et créatif.`,
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
  Demande : "${query}". Utilisez vos connaissances et Google Search pour des recommandations à jour.
  
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

// Generates a full weekly menu
export const generateWeeklyMenu = async (dietary: string, people: number, ingredients: string = ''): Promise<WeeklyPlan> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Récupération des contraintes strictes pour le semainier
  const strictDietaryRules = getDietaryConstraints(dietary);

  let ingredientsPrompt = "";
  if (ingredients.trim()) {
      ingredientsPrompt = `
      CONTEXTE SPÉCIAL ANTI-GASPI :
      L'utilisateur dispose de ces ingrédients : "${ingredients}".
      MISSION : Intégrez intelligemment ces ingrédients dans les repas de la semaine (Lunch ou Dîner).
      Complétez avec d'autres produits pour équilibrer.`;
  }

  const prompt = `Créez un planning de repas hebdomadaire complet (Petit-déj, Midi, Collation, Soir) pour ${people} personnes.
  
  CONTRAINTES ALIMENTAIRES STRICTES À RESPECTER : 
  ${strictDietaryRules}

  ${ingredientsPrompt}
  
  ${GDPR_COMPLIANCE_PROTOCOL}
  
  IMPORTANT POUR LA GÉNÉRATION :
  - Respectez SCUPULEUSEMENT le régime indiqué. Si c'est Régime Crétois, limitez drastiquement la viande/poisson comme indiqué dans les règles.
  - Soyez varié et équilibré.
  - Incluez des conseils de Batch Cooking pour le dimanche.
  
  Répondez au format JSON strict selon le schéma.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      // Pour le menu hebdo (plus complexe), 4096 est un bon compromis Vitesse/Qualité.
      thinkingConfig: { thinkingBudget: 4096 },
      responseMimeType: "application/json",
      responseSchema: weeklyPlanSchema,
    },
  });

  const data = cleanAndParseJSON(response.text || "{}");
  return data as WeeklyPlan;
};
