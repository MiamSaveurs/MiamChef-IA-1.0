
import { SavedRecipe, ShoppingItem, WeeklyPlan, UserProfile } from '../types';

const DB_NAME = 'MiamChefDB';
const DB_VERSION = 3; // Version stable. NE PAS CHANGER sans stratégie de migration.
const RECIPE_STORE = 'recipes';
const SHOPPING_STORE = 'shoppingList';
const PLANNING_STORE = 'planning';
const PROFILE_KEY = 'miamchef_user_profile';

/*
 * 🛡️ PROTOCOLE DE SÉCURITÉ DES DONNÉES UTILISATEUR 🛡️
 * 
 * RÈGLE D'OR : Les recettes de l'utilisateur ("Mon Carnet") sont SACRÉES.
 * Elles ne doivent JAMAIS être effacées lors d'une mise à jour de l'application, d'un redéploiement ou d'une correction de bug.
 * La base de données IndexedDB est persistante.
 * 
 * Si une modification de structure est nécessaire, utiliser une migration de version (onupgradeneeded) qui PRÉSERVE les données existantes.
 */

// Subscription / Trial Logic Storage (using LocalStorage for simplicity as per requirements)
export const getTrialStatus = (): { startDate: number, isSubscribed: boolean, subscriptionTier: 'free' | 'monthly' | 'annual' | 'lifetime' } => {
    const storedDate = localStorage.getItem('miamchef_trial_start');
    const storedSub = localStorage.getItem('miamchef_subscription');
    
    let startDate = storedDate ? parseInt(storedDate) : Date.now();
    
    // Initialize if not present
    if (!storedDate) {
        localStorage.setItem('miamchef_trial_start', startDate.toString());
    }

    return {
        startDate,
        isSubscribed: !!storedSub,
        subscriptionTier: (storedSub as any) || 'free'
    };
};

export const startSubscription = (tier: 'monthly' | 'annual' | 'lifetime') => {
    localStorage.setItem('miamchef_subscription', tier);
};

// In-App Messaging Status
export const getInAppMessageSeen = (messageId: string): boolean => {
    return !!localStorage.getItem(`miamchef_msg_seen_${messageId}`);
};

export const setInAppMessageSeen = (messageId: string): void => {
    localStorage.setItem(`miamchef_msg_seen_${messageId}`, 'true');
};

// Helper to generate random referral code
const generateReferralCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, O, 1, 0 to avoid confusion
    let result = 'CHEF-';
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Profile Operations (LocalStorage)
export const getUserProfile = (): UserProfile => {
  const stored = localStorage.getItem(PROFILE_KEY);
  if (stored) {
    try {
      const profile = JSON.parse(stored);
      // Migration : Add referral code if missing
      if (!profile.referralCode) {
          profile.referralCode = generateReferralCode();
          profile.referralsCount = 0;
          saveUserProfile(profile);
      }
      // Migration : Add streaks if missing
      if (profile.currentStreak === undefined) {
          profile.currentStreak = 0;
          profile.lastLoginDate = '';
          profile.totalRecipesCreated = 0;
          saveUserProfile(profile);
      }
      return profile;
    } catch (e) {
      console.error("Failed to parse profile", e);
    }
  }
  return {
    name: '',
    diet: 'Classique (Aucun)',
    allergies: '',
    dislikes: '',
    equipment: '',
    householdSize: 2,
    cookingLevel: 'Intermédiaire',
    smartDevices: [],
    referralCode: generateReferralCode(),
    referralsCount: 0,
    currentStreak: 0,
    lastLoginDate: '',
    totalRecipesCreated: 0
  };
};

export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

// --- NOUVEAU : GESTION DES STREAKS (Gamification) ---
export const updateDailyStreak = (): number => {
    const profile = getUserProfile();
    
    // FIX BUG: Utiliser la date locale pour éviter les problèmes de fuseau horaire (UTC vs Local)
    // 'fr-CA' donne le format YYYY-MM-DD qui est parfait pour les comparaisons lexicographiques
    const todayStr = new Date().toLocaleDateString('fr-CA'); 
    
    const lastLoginStr = profile.lastLoginDate;

    // Si c'est le même jour local, on ne touche à rien
    if (lastLoginStr === todayStr) {
        return profile.currentStreak || 0;
    }

    let newStreak = profile.currentStreak || 0;

    if (lastLoginStr) {
        // Pour comparer, on force le temps à midi (12:00) UTC pour éviter tout problème de DST
        const last = new Date(lastLoginStr + 'T12:00:00Z');
        const current = new Date(todayStr + 'T12:00:00Z');
        
        const diffTime = current.getTime() - last.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // Connexion le jour suivant exact : +1
            newStreak += 1;
        } else if (diffDays > 1) {
            // Plus d'un jour d'écart : Série brisée, retour à 1
            newStreak = 1;
        }
        // Si diffDays < 1 (ex: retour en arrière), on ne fait rien pour protéger le streak
    } else {
        // Première connexion
        newStreak = 1;
    }

    profile.currentStreak = newStreak;
    profile.lastLoginDate = todayStr;
    saveUserProfile(profile);
    
    return newStreak;
};

// Open Database Connection
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create Recipes Store if not exists
      if (!db.objectStoreNames.contains(RECIPE_STORE)) {
        db.createObjectStore(RECIPE_STORE, { keyPath: 'id' });
      }

      // Create Shopping List Store if not exists
      if (!db.objectStoreNames.contains(SHOPPING_STORE)) {
        db.createObjectStore(SHOPPING_STORE, { keyPath: 'id', autoIncrement: true });
      }

      // Create Planning Store if not exists
      if (!db.objectStoreNames.contains(PLANNING_STORE)) {
        db.createObjectStore(PLANNING_STORE, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

// Compress Image to JPEG to save space
export const compressImage = async (base64Str: string, maxWidth = 1024, quality = 0.8): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ratio = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * ratio;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => resolve(base64Str);
  });
};

/* --- RECIPES OPERATIONS --- */

export const getSavedRecipes = async (): Promise<SavedRecipe[]> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(RECIPE_STORE, 'readonly');
      const store = transaction.objectStore(RECIPE_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        // Sort by date descending (newest first)
        const recipes = request.result as SavedRecipe[];
        resolve(recipes.reverse());
      };
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("Failed to load recipes from DB", e);
    return [];
  }
};

export const saveRecipeToBook = async (recipe: SavedRecipe): Promise<void> => {
  try {
    const db = await openDB();
    
    // Compress image if present
    if (recipe.image) {
      recipe.image = await compressImage(recipe.image);
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(RECIPE_STORE, 'readwrite');
      const store = transaction.objectStore(RECIPE_STORE);
      const request = store.put(recipe);

      request.onsuccess = () => {
          // Increment total recipes created in profile
          const profile = getUserProfile();
          profile.totalRecipesCreated = (profile.totalRecipesCreated || 0) + 1;
          saveUserProfile(profile);
          resolve();
      };
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("Failed to save recipe", e);
    throw e;
  }
};

export const deleteRecipeFromBook = async (id: string): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(RECIPE_STORE, 'readwrite');
      const store = transaction.objectStore(RECIPE_STORE);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("Failed to delete recipe", e);
    throw e;
  }
};

/* --- SHOPPING LIST OPERATIONS --- */

export const getShoppingList = async (): Promise<ShoppingItem[]> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(SHOPPING_STORE, 'readonly');
      const store = transaction.objectStore(SHOPPING_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result as ShoppingItem[]);
      request.onerror = () => reject(request.error);
    });
  } catch (e) { return []; }
};

export const addToShoppingList = async (items: string[]): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(SHOPPING_STORE, 'readwrite');
    const store = transaction.objectStore(SHOPPING_STORE);

    items.forEach(text => {
      store.put({ text, checked: false, addedAt: new Date().toISOString() });
    });

    return new Promise((resolve) => {
        transaction.oncomplete = () => resolve();
    });
  } catch (e) { console.error(e); }
};

export const toggleShoppingItem = async (item: ShoppingItem): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(SHOPPING_STORE, 'readwrite');
    const store = transaction.objectStore(SHOPPING_STORE);
    store.put({ ...item, checked: !item.checked });
  } catch (e) { console.error(e); }
};

export const deleteShoppingItem = async (id: number): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(SHOPPING_STORE, 'readwrite');
    const store = transaction.objectStore(SHOPPING_STORE);
    store.delete(id);
  } catch (e) { console.error(e); }
};

export const clearShoppingList = async (): Promise<void> => {
    try {
        const db = await openDB();
        const transaction = db.transaction(SHOPPING_STORE, 'readwrite');
        const store = transaction.objectStore(SHOPPING_STORE);
        store.clear();
    } catch (e) { console.error(e); }
};

/* --- MEAL PLANNER OPERATIONS --- */

export const saveWeeklyPlan = async (plan: WeeklyPlan): Promise<void> => {
    try {
        const db = await openDB();
        const transaction = db.transaction(PLANNING_STORE, 'readwrite');
        const store = transaction.objectStore(PLANNING_STORE);
        // Use a fixed ID 'current' for now to have one plan at a time
        store.put({ ...plan, id: 'current' });
    } catch (e) { console.error(e); }
};

export const getWeeklyPlan = async (): Promise<WeeklyPlan | null> => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(PLANNING_STORE, 'readonly');
            const store = transaction.objectStore(PLANNING_STORE);
            const request = store.get('current');
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    } catch (e) { return null; }
};

export const deleteWeeklyPlan = async (): Promise<void> => {
    try {
        const db = await openDB();
        const transaction = db.transaction(PLANNING_STORE, 'readwrite');
        const store = transaction.objectStore(PLANNING_STORE);
        store.delete('current');
    } catch (e) { console.error(e); }
};
