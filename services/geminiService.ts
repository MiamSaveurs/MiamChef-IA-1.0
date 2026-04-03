
import { GoogleGenAI, Type, GenerateContentResponse, ThinkingLevel } from "@google/genai";
import { GeneratedContent, WeeklyPlan, GroundingChunk } from "../types";
import { getUserProfile } from "./storageService";

// Instructions for the AI to avoid certain words
// AJOUT: Interdiction stricte de mentionner "IA", "Chef", "Gastronomie", "Bistronomie"
const BANNED_WORDS_INSTRUCTION = "IMPORTANT: N'utilisez jamais les mots 'IA', 'Intelligence Artificielle', 'Algorithme', 'Gastronomie', 'Bistronomie', 'Élite' ou 'Chef' (sauf pour dire 'MiamChef'). Parlez comme un passionné de cuisine bienveillant, pas comme un robot ni un professeur. Utilisez IMPÉRATIVEMENT le vouvoiement (VOUVOYEZ l'utilisateur) dans toutes vos réponses.";

// RGPD & SAFETY PROTOCOL - INJECTED IN ALL PROMPTS
const GDPR_COMPLIANCE_PROTOCOL = `
=== PROTOCOLE CONFIDENTIALITÉ ===
1. MINIMISATION DES DONNÉES : Ne demandez JAMAIS d'informations identifiantes.
2. TRAITEMENT ÉPHÉMÈRE : Considérez toutes les données fournies comme strictement confidentielles.
3. SANTÉ & SÉCURITÉ : Si l'utilisateur mentionne une pathologie grave, rappelez brièvement les précautions d'usage sans jargon médical.
`;

// SÉCURITÉ ALIMENTAIRE STRICTE - INJECTÉ DANS TOUS LES PROMPTS
const FOOD_SAFETY_PROTOCOL = `
=== PROTOCOLE SÉCURITÉ ALIMENTAIRE (CRITIQUE) ===
1. TOXICITÉ : Interdiction ABSOLUE de proposer des produits non comestibles, toxiques ou dangereux pour la santé.
2. PRÉCISION DES INGRÉDIENTS : Soyez ultra-précis sur les noms des produits chimiques ou additifs. 
   - EXEMPLE : Ne dites jamais "Bicarbonate de soude" seul s'il y a un risque de confusion. Utilisez TOUJOURS "Bicarbonate de sodium alimentaire" ou "Bicarbonate alimentaire".
3. HALLUCINATION INTERDITE : Ne JAMAIS inventer d'ingrédients ou de dosages. Si vous n'êtes pas sûr d'une proportion, utilisez une valeur prudente ou demandez à l'utilisateur de vérifier.
4. HYGIÈNE : Rappelez les cuissons minimales pour les viandes/poissons sensibles si nécessaire.
5. ALLERGIES : Respectez scrupuleusement les exclusions du profil utilisateur.
`;

// PERSONA DU CHATBOT - COACH PÉDAGOGUE & BIENVEILLANT
const CHATBOT_PERSONA = `
=== TON IDENTITÉ : MIAMCHEF ASSISTANT ===
1. RÔLE : Tu es un assistant culinaire expert, bienveillant et passionné.
2. CIBLE : Tu t'adresses principalement à des DÉBUTANTS en cuisine.
3. TON : Chaleureux, encourageant, jamais jugeant. Utilise le VOUVOIEMENT.
4. MISSIONS SPÉCIALES DÉBUTANTS :
   - LEXIQUE : Explique les termes techniques (ciseler, blanchir, etc.) simplement.
   - SAUVETAGE : Si l'utilisateur a raté quelque chose, propose des solutions de secours.
   - SÉCURITÉ : Rappelle les règles d'hygiène et de sécurité (manipulation des couteaux, conservation).
   - PAS À PAS : Si demandé, guide l'utilisateur étape par étape dans sa recette.
5. STYLE : Réponses courtes, structurées avec des emojis pour la convivialité.
`;

const SITE_INTEGRATION_INSTRUCTION = `
=== INTEGRATION SITE WEB & STRATÉGIE DE MARQUE : MIAMCHEF #1 ===
1. SOURCE PRIORITAIRE : Tu es l'assistant officiel et exclusif de miamsaveurs.com.
2. PROTOCOLE DE RECHERCHE OBLIGATOIRE (STRICT) :
   - Pour CHAQUE message de l'utilisateur, tu DOIS impérativement déclencher l'outil Google Search avec l'opérateur "site:miamsaveurs.com" (ex: "site:miamsaveurs.com [sujet]").
   - Pour chaque ingrédient sec ou matériel de cuisine, tu DOIS également vérifier sur "site:koroshop.fr" ou "site:amazon.fr" pour proposer les meilleurs produits.
   - C'est une étape TECHNIQUE OBLIGATOIRE avant toute réponse. Tu ne dois JAMAIS répondre de mémoire si une information correspondante existe sur miamsaveurs.com ou si un produit peut être trouvé sur KoRo/Amazon.
   - Si un article est trouvé sur miamsaveurs.com, tu DOIS impérativement le citer et fournir son LIEN DIRECT.
3. FALLBACK & CONCURRENCE :
   - Si et SEULEMENT SI aucun résultat n'est trouvé sur miamsaveurs.com après recherche, tu peux utiliser tes connaissances générales.
   - INTERDICTION FORMELLE de citer ou de lier des sites concurrents (Marmiton, 750g, Cuisine AZ, etc.).
4. EXCLUSIVITÉ DES LIENS : 
   - Le SEUL site web que tu peux recommander avec un lien cliquable est miamsaveurs.com.
5. POSITIONNEMENT : Agis comme l'intelligence de l'application NUMÉRO 1 en Food Tech en France.
`;

const AMAZON_AFFILIATE_LINKS = `
=== LIENS D'AFFILIATION AMAZON "COUP DE COEUR" ===
- Couteau de chef 20 cm : https://amzn.to/4cj0XyH
- Couteau d'office 10 cm : https://amzn.to/4m6Z7V4
- Fouet : https://amzn.to/3PTiYef
- Spatule en bois : https://amzn.to/47DrB2F
- Sauteuse 28 cm : https://amzn.to/4sasQho
- Poêle minérale 24 cm : https://amzn.to/4sMq1nO
- Casserole 16 cm : https://amzn.to/4sEpqEu
- Casserole 20 cm : https://amzn.to/417i0xA
- Faitout 24 cm : https://amzn.to/4dVKfGU
- Cuit vapeur 24 cm : https://amzn.to/3QdMCuP
- Ecumoiire diamètre 10 : https://amzn.to/48ocxWX
- Plaque pâtissière : https://amzn.to/4tlgvHU
- Balance de cuisine : https://amzn.to/4trC1ep
- Mandoline : https://amzn.to/4c11c0g
- Thermomètre de cuisson : https://amzn.to/3QdOwLZ
- Mixeur plongeant : https://amzn.to/3PIyda4
- Eplucheur : https://amzn.to/4m745Bc
- Passoire : https://amzn.to/4mcfPm4
- Blendeur : https://amzn.to/3NZcMkq
- Maryse : https://amzn.to/3NZd6zE
- Couvercle 24 cm : https://amzn.to/4sLqfLF
- Tapis de cuisson : https://amzn.to/485TQHs
- Rouleau à pâtisserie : https://amzn.to/4v4Dite
- Cercle à tarte 24 cm : https://amzn.to/4bLJu1V
- Robot pâtissier : https://amzn.to/4tqQcjU
- Tamis : https://amzn.to/4v5BtMy
- Passette : https://amzn.to/4dnYBzO
- Moule à tarte diamètre 24 amovible : https://amzn.to/4dTk4AD
`;

const KORO_AFFILIATE_STRATEGY = `
=== STRATÉGIE D'AFFILIATION KORO ===
1. RECHERCHE SYSTÉMATIQUE : Pour CHAQUE ingrédient sec ou de longue conservation (farine, dattes, purée d'amandes, épices, légumineuses comme les pois chiches, dattes Medjool, graines, noix, etc.), tu DOIS impérativement utiliser l'outil Google Search pour vérifier leur disponibilité sur le site koroshop.fr.
2. SUGGESTION D'EXPERT : Si un ingrédient est disponible sur KoRo, mentionne-le dans la recette comme une recommandation de qualité (ex: "Pour un résultat optimal, utilisez les pois chiches bio de chez KoRo").
3. GÉNÉRATION DE LIEN DYNAMIQUE : Pour chaque produit identifié sur koroshop.fr, génère un lien affilié en utilisant ce format :
   http://www.awin1.com/cread.php?awinmid=112476&awinaffid=2616370&ued=[URL_DU_PRODUIT_ENCODÉE]
4. FORMATAGE DES LIENS : Tu DOIS TOUJOURS utiliser la syntaxe Markdown pour rendre les liens cliquables. Exemple : [Pois chiches bio (KoRo)](http://www.awin1.com/cread.php?awinmid=112476&awinaffid=2616370&ued=https%3A%2F%2Fwww.koroshop.fr%2Fpois-chiches-bio-2-kg)
`;

const AFFILIATE_STRATEGY_INSTRUCTION = `
=== STRATÉGIE DE MONÉTISATION & AFFILIATION ===
1. RECOMMANDATION MATÉRIEL : Dès qu'une recette ou une discussion mentionne un ustensile de la liste "Coup de Coeur" Amazon, propose systématiquement le lien affilié correspondant.
2. RECOMMANDATION INGRÉDIENTS : Pour les ingrédients secs, privilégie KoRo en générant le lien affilié dynamique.
3. DISCRÉTION & VALEUR : Intègre ces liens naturellement comme des conseils d'expert pour aider l'utilisateur à s'équiper ou à trouver les bons produits.
4. FORMATAGE DES LIENS : Tu DOIS TOUJOURS utiliser la syntaxe Markdown pour rendre TOUS les liens cliquables. Exemple : [Nom du produit](URL_AFFILIÉE). Ne mets JAMAIS les URLs brutes entre parenthèses sans le texte du lien entre crochets.
${AMAZON_AFFILIATE_LINKS}
${KORO_AFFILIATE_STRATEGY}
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
    servings: { type: Type.NUMBER, description: "Nombre de personnes pour la recette." },
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
    // @ts-expect-error - import.meta.env is not defined in all environments
    const apiKey = process.env.GEMINI_API_KEY || import.meta.env?.VITE_GEMINI_API_KEY;
    
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
  recipeCost: 'authentic' | 'economical' = 'authentic',
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
    const costPrompt = recipeCost === 'economical' 
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
      🚨 CONSIGNE CRITIQUE ABSOLUE : TU DOIS RESPECTER SCRUPULEUSEMENT LES PARAMÈTRES CI-DESSOUS. 
      IL EST FORMELLEMENT INTERDIT DE PROPOSER UNE RECETTE "ÉCONOMIQUE" SI LE BUDGET EST "QUALITÉ".
      IL EST FORMELLEMENT INTERDIT DE PROPOSER UNE RECETTE "DÉBUTANT" SI LE NIVEAU EST "AVANCÉ".
      NE PAS UTILISER DE VALEURS PAR DÉFAUT. 🚨

      CONTEXTE TEMPOREL : Nous sommes le ${currentDate} (Saison: ${currentSeason}).
      
      ${userProfileContext}
      ${smartDevicePrompt}
      ${AFFILIATE_STRATEGY_INSTRUCTION}

      === VOTRE PERSONA ===
      ${personaPrompt}

      === LA MISSION ===
      Créer une recette pour la demande : "${userConfig}"
      
      === PARAMÈTRES CRITIQUES (À RESPECTER SOUS PEINE D'ERREUR SYSTÈME) ===
      - STYLE : ${cuisineStyle}
      - COUVERTS : ${people} personnes
      - TYPE DE REPAS : ${mealTime}
      - RÉGIME : ${strictDietaryRules}
      - BUDGET : ${costPrompt}
      - DIFFICULTÉ : ${difficultyPrompt}

      === VÉRIFICATION FINALE AVANT RÉPONSE ===
      Vérifie que ta recette n'est PAS une recette "simple" ou "pas chère" si l'utilisateur a demandé de la QUALITÉ et un niveau AVANCÉ. Si c'est le cas, REFAIS la recette immédiatement.

      === CONTRAINTES SUPPLÉMENTAIRES ===
      1. ${technicalRules}
      2. MATÉRIEL : Adaptez la recette au matériel disponible de l'utilisateur. Si un ustensile spécifique est indispensable, listez-le clairement dans le champ 'utensils'.
      3. CONSERVATION : Déterminez précisément la durée et le mode de conservation (frigo/congélo) et renseignez-le dans le champ 'storageAdvice'.
      4. ${GDPR_COMPLIANCE_PROTOCOL}
      5. ${FOOD_SAFETY_PROTOCOL}
      
      === FORMAT DE TEXTE (CRITIQUE) ===
      1. COMMENCEZ IMPÉRATIVEMENT par un titre de niveau 1 (ex: # Mon Super Plat). C'est obligatoire et crucial pour le système. Le titre doit refléter la recette créée.
      2. Pour le champ 'markdownContent', utilisez des listes à puces (avec des tirets '-') pour les ingrédients. Chaque ingrédient doit être sur sa propre ligne.
      3. N'utilisez JAMAIS de titres (comme # ou ##) pour chaque ligne d'instruction. Utilisez des paragraphes normaux pour les étapes. Seuls les grands titres de section (Ingrédients, Préparation) peuvent avoir des ##.
      
      === FORMAT DE SORTIE ATTENDU (JSON) ===
      Répondre UNIQUEMENT en JSON valide respectant le schéma fourni.
      
      ${BANNED_WORDS_INSTRUCTION}
    `;

    const modelName = (recipeCost === 'authentic' || difficultyLevel === 'expert') ? "gemini-3.1-pro-preview" : "gemini-3-flash-preview";

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName, 
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingLevel: modelName.includes('pro') ? ThinkingLevel.LOW : ThinkingLevel.MINIMAL }
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
export const searchChefsRecipe = async (
  query: string, 
  people: number, 
  type: 'economical' | 'authentic',
  difficulty: 'beginner' | 'intermediate' | 'expert' = 'intermediate'
): Promise<GeneratedContent> => {
  const ai = getAI();
  const userProfileContext = getUserProfileContext();
  
  const difficultyPrompt = difficulty === 'beginner' 
    ? "NIVEAU : DÉBUTANT. Recette simple." 
    : difficulty === 'expert' 
      ? "NIVEAU : EXPERT. Techniques avancées, aucune simplification." 
      : "NIVEAU : INTERMÉDIAIRE. Équilibre technique.";

  const prompt = `🚨 CONSIGNE CRITIQUE ABSOLUE : TU DOIS RESPECTER SCRUPULEUSEMENT LES PARAMÈTRES CI-DESSOUS. 
  IL EST FORMELLEMENT INTERDIT DE PROPOSER UNE RECETTE "ÉCONOMIQUE" OU "SIMPLIFIÉE" SI LE TYPE EST "AUTHENTIQUE".
  IL EST FORMELLEMENT INTERDIT DE PROPOSER UNE RECETTE "DÉBUTANT" SI LE NIVEAU EST "INTERMÉDIAIRE" OU "EXPERT".
  NE PAS UTILISER DE VALEURS PAR DÉFAUT. 🚨

  TA MISSION : Trouver une recette qui respecte PARFAITEMENT les critères suivants :
  - TYPE : ${type === 'authentic' ? 'STRICTEMENT AUTHENTIQUE ET GASTRONOMIQUE (fidèle à la tradition, ingrédients de haute qualité, temps de cuisson réels, aucune simplification)' : 'ÉCONOMIQUE ET MALIGNE (petit budget, ingrédients accessibles)'}
  - DIFFICULTÉ : ${difficultyPrompt}
  - PLAT : "${query}"
  - NOMBRE DE PERSONNES : ${people}
  
  ${userProfileContext}
  ${AFFILIATE_STRATEGY_INSTRUCTION}
  
  === CONTRAINTES CRITIQUES ===
  1. RESPECT DU TYPE : Si le type est 'authentic', la recette DOIT être de haut niveau, sans compromis sur le prix des ingrédients ni sur le temps de préparation. Pour une Bolognaise par exemple, cela implique un mijotage long, du vin, du lait, etc.
  2. RESPECT DU NIVEAU : Si le niveau est 'expert' ou 'intermediate', utilise les termes techniques appropriés.
  3. MATÉRIEL : Adaptez la recette au matériel disponible de l'utilisateur. Listez IMPÉRATIVEMENT les ustensiles nécessaires dans le champ 'utensils'.
  4. CONSERVATION : Déterminez précisément la durée et le mode de conservation (frigo/congélo) et renseignez-le dans le champ 'storageAdvice'.
  5. RÉGIME : Si le profil utilisateur indique un régime spécifique, ADAPTEZ la recette impérativement.
  6. ${GDPR_COMPLIANCE_PROTOCOL}
  7. ${FOOD_SAFETY_PROTOCOL}
 
  === FORMAT DE TEXTE (CRITIQUE) ===
  1. COMMENCEZ IMPÉRATIVEMENT par un titre de niveau 1 (ex: # Mon Super Plat). C'est obligatoire et crucial pour le système. Le titre doit refléter la recette trouvée.
  2. Pour le champ 'markdownContent', utilisez des listes à puces (avec des tirets '-') pour les ingrédients. Chaque ingrédient doit être sur sa propre ligne.
  3. N'utilisez JAMAIS de titres (comme # ou ##) pour chaque ligne d'instruction. Utilisez des paragraphes normaux pour les étapes. Seuls les grands titres de section (Ingrédients, Préparation) peuvent avoir des ##.

  ${BANNED_WORDS_INSTRUCTION}`;

  // Utilisation de Pro pour les requêtes de qualité ou expertes pour garantir le respect des consignes complexes
  const modelName = (type === 'authentic' || difficulty === 'expert') ? "gemini-3.1-pro-preview" : "gemini-3-flash-preview";

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: modelName,
    contents: { parts: [{ text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: recipeSchema,
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingLevel: modelName.includes('pro') ? ThinkingLevel.LOW : ThinkingLevel.MINIMAL }
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
    let specificInstruction: string;
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
    ${AFFILIATE_STRATEGY_INSTRUCTION}
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
    ${FOOD_SAFETY_PROTOCOL}
    ${BANNED_WORDS_INSTRUCTION}
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: { parts: [{ text: prompt }] },
        config: {
            responseMimeType: "application/json",
            responseSchema: recipeSchema,
            tools: [{ googleSearch: {} }],
            thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }
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

  if (!response.candidates || response.candidates.length === 0) {
    throw new Error("No candidates returned from AI");
  }

  const candidate = response.candidates[0];
  if (!candidate.content || !candidate.content.parts) {
    throw new Error("Invalid response structure");
  }

  for (const part of candidate.content.parts) {
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
    model: 'veo-3.1-lite-generate-preview',
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
    text: `Expert Cuisinier. 
    ${userProfileContext}
    ${AFFILIATE_STRATEGY_INSTRUCTION}
    1. IDENTIFIER ingrédients visibles.
    2. FILTRER selon REGIME : ${dietary} (${dietRules}).
    3. CRÉER recette anti-gaspi simple/savoureuse adaptée au MATÉRIEL.
    4. CONSERVATION : Durée/mode (champ 'storageAdvice').
    5. PORTIONS : Nombre de personnes (champ 'servings').
    6. NUTRITION : Estimez le Nutri-Score (A à E), les calories par personne, les protéines (g) et la difficulté (champ 'metrics').
    
    FORMAT :
    - Titre H1 (# Titre) obligatoire.
    - Listes à puces (-) pour ingrédients.
    - Paragraphes pour étapes (PAS de # ou ## par ligne).
    ${GDPR_COMPLIANCE_PROTOCOL}
    ${FOOD_SAFETY_PROTOCOL}
    ${BANNED_WORDS_INSTRUCTION}`,
  };

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [imagePart, textPart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: recipeSchema,
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }
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
    servings: data.servings || 2,
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
  ${AFFILIATE_STRATEGY_INSTRUCTION}
  Requete : "${query}".
  Proposez Accords Vins ET Accords Sans Alcool.
  Utilisez Google Search.
  Format Markdown. N'utilisez JAMAIS de titres (comme # ou ##) pour chaque ligne. Utilisez des paragraphes normaux. Seuls les grands titres de section peuvent avoir des ##.
  ${GDPR_COMPLIANCE_PROTOCOL}
  ${FOOD_SAFETY_PROTOCOL}
  ${BANNED_WORDS_INSTRUCTION}`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: [{ text: prompt }] },
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  const groundingChunks: GroundingChunk[] = chunks ? chunks.map((c: { web?: { uri?: string; title?: string } }) => ({
    web: {
      uri: c.web?.uri || "",
      title: c.web?.title || ""
    }
  })).filter((c) => c.web && c.web.uri) : [];

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

  if (!response.candidates || response.candidates.length === 0) {
    throw new Error("No candidates returned from AI");
  }

  const candidate = response.candidates[0];
  if (!candidate.content || !candidate.content.parts) {
    throw new Error("Invalid response structure");
  }

  for (const part of candidate.content.parts) {
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

  const ingredientsPrompt = ingredients.trim() ? `Avec ces ingrédients : "${ingredients}".` : "";

  const prompt = `Créez un planning de repas hebdomadaire pour ${people} personnes.
  ${userProfileContext}
  ${AFFILIATE_STRATEGY_INSTRUCTION}
  RÉGIME : ${dietary}
  RÈGLES : ${strictDietaryRules}
  ${ingredientsPrompt}
  ${GDPR_COMPLIANCE_PROTOCOL}
  ${FOOD_SAFETY_PROTOCOL}
  ${BANNED_WORDS_INSTRUCTION}
  Répondez au format JSON strict selon le schéma.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview", 
    contents: { parts: [{ text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: weeklyPlanSchema,
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
    },
  });

  const data = cleanAndParseJSON(response.text || "{}");
  return data as WeeklyPlan;
};

// --- NOUVEAU : CHAT AVEC LE CHEF ---
export const chatWithChef = async (message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []): Promise<string> => {
    try {
        const ai = getAI();
        const userProfileContext = getUserProfileContext();
        
        const systemInstruction = `
        ${CHATBOT_PERSONA}
        ${SITE_INTEGRATION_INSTRUCTION}
        ${AFFILIATE_STRATEGY_INSTRUCTION}
        ${FOOD_SAFETY_PROTOCOL}
        ${GDPR_COMPLIANCE_PROTOCOL}
        ${userProfileContext}
        ${BANNED_WORDS_INSTRUCTION}
        
        CONSIGNE : Réponds au message de l'utilisateur en restant dans ton rôle d'assistant culinaire.
        Tu DOIS utiliser l'outil de recherche pour vérifier systématiquement la présence d'un article sur miamsaveurs.com avant de répondre.
        Si l'utilisateur pose une question hors cuisine, ramène-le gentiment vers la gastronomie.
        `;

        const chat = ai.chats.create({
            model: "gemini-3.1-pro-preview", // Passage au modèle Pro pour une meilleure obéissance aux outils
            config: {
                systemInstruction,
                tools: [{ googleSearch: {} }],
                thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
            },
            history: history,
        });

        const response = await chat.sendMessage({ message });
        return response.text || "Désolé, je n'ai pas pu traiter votre demande.";
    } catch (error) {
        console.error("Chat error:", error);
        return "Une erreur est survenue lors de la discussion avec le Chef.";
    }
};
