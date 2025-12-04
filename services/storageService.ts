
import { SavedRecipe, ShoppingItem, WeeklyPlan } from '../types';

const DB_NAME = 'MiamChefDB';
const DB_VERSION = 3; // Version stable. NE PAS CHANGER sans stratégie de migration.
const RECIPE_STORE = 'recipes';
const SHOPPING_STORE = 'shoppingList';
const PLANNING_STORE = 'planning';

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

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("Failed to save recipe to DB", e);
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
  } catch (e) {
    console.error("Failed to get shopping list", e);
    return [];
  }
};

export const addToShoppingList = async (itemsText: string[]): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(SHOPPING_STORE, 'readwrite');
      const store = transaction.objectStore(SHOPPING_STORE);
      
      itemsText.forEach(text => {
        store.add({
          text,
          checked: false,
          addedAt: new Date().toISOString()
        } as Omit<ShoppingItem, 'id'>);
      });

      transaction.oncomplete = () => {
          window.dispatchEvent(new Event('shopping-list-updated'));
          resolve();
      };
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (e) {
    console.error("Failed to add to shopping list", e);
    throw e;
  }
};

export const toggleShoppingItem = async (item: ShoppingItem): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(SHOPPING_STORE, 'readwrite');
      const store = transaction.objectStore(SHOPPING_STORE);
      const request = store.put({ ...item, checked: !item.checked });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("Failed to toggle item", e);
    throw e;
  }
};

export const deleteShoppingItem = async (id: number): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(SHOPPING_STORE, 'readwrite');
      const store = transaction.objectStore(SHOPPING_STORE);
      const request = store.delete(id);

      request.onsuccess = () => {
          window.dispatchEvent(new Event('shopping-list-updated'));
          resolve();
      };
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("Failed to delete item", e);
    throw e;
  }
};

export const clearShoppingList = async (): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(SHOPPING_STORE, 'readwrite');
      const store = transaction.objectStore(SHOPPING_STORE);
      const request = store.clear();

      request.onsuccess = () => {
          window.dispatchEvent(new Event('shopping-list-updated'));
          resolve();
      };
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("Failed to clear list", e);
    throw e;
  }
};

/* --- WEEKLY PLANNING OPERATIONS --- */

export const saveWeeklyPlan = async (plan: WeeklyPlan): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(PLANNING_STORE, 'readwrite');
      const store = transaction.objectStore(PLANNING_STORE);
      const request = store.put(plan); // Always overwrite 'current'

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("Failed to save plan", e);
    throw e;
  }
};

export const getWeeklyPlan = async (): Promise<WeeklyPlan | null> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(PLANNING_STORE, 'readonly');
      const store = transaction.objectStore(PLANNING_STORE);
      const request = store.get('current');

      request.onsuccess = () => resolve(request.result as WeeklyPlan || null);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("Failed to get plan", e);
    return null;
  }
};

export const deleteWeeklyPlan = async (): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(PLANNING_STORE, 'readwrite');
      const store = transaction.objectStore(PLANNING_STORE);
      const request = store.delete('current');

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("Failed to delete plan", e);
    throw e;
  }
};
