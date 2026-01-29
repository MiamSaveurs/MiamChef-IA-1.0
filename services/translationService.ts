
import { Language } from '../types';

const TRANSLATIONS = {
  fr: {
    home_title: "Une cuisine unique,",
    home_subtitle: "qui vous ressemble.",
    date_locale: "fr-FR",
    btn_premium: "Premium",
    card_creator_title: "Cuisine du Chef",
    card_creator_sub: "Création sur-mesure",
    card_planning_title: "Semainier",
    card_planning_sub: "Menus & Organisation",
    card_scan_title: "Scan Frigo",
    card_scan_sub: "Zéro Gaspillage",
    card_sommelier_title: "Sommelier",
    card_sommelier_sub: "Accords Vins",
    card_book_title: "Mon Carnet",
    card_book_sub: "Recettes Sauvegardées",
    card_list_title: "Ma Liste",
    card_list_sub: "Courses Intelligentes",
    profile_title: "Mon Profil Gourmand",
    profile_sub: "Configurez vos goûts pour du sur-mesure.",
    concept_title: "Découvrez le concept",
    concept_sub: "SANTÉ • ÉCONOMIE • SUR-MESURE",
    concept_btn: "VOIR",
    promo_title: "Passez à la vitesse supérieure",
    promo_sub: "Débloquez la création illimitée et toutes les fonctionnalités exclusives.",
    promo_btn: "Voir les offres Premium",
    footer: "MiamChef by MiamSaveurs"
  },
  en: {
    home_title: "Unique cooking,",
    home_subtitle: "just like you.",
    date_locale: "en-US",
    btn_premium: "Premium",
    card_creator_title: "Chef's Kitchen",
    card_creator_sub: "Tailor-made creation",
    card_planning_title: "Weekly Planner",
    card_planning_sub: "Menus & Organization",
    card_scan_title: "Fridge Scan",
    card_scan_sub: "Zero Waste",
    card_sommelier_title: "Sommelier",
    card_sommelier_sub: "Wine Pairing",
    card_book_title: "My Cookbook",
    card_book_sub: "Saved Recipes",
    card_list_title: "Shopping List",
    card_list_sub: "Smart Groceries",
    profile_title: "My Flavor Profile",
    profile_sub: "Setup your tastes for custom results.",
    concept_title: "Discover the concept",
    concept_sub: "HEALTH • SAVINGS • CUSTOM",
    concept_btn: "VIEW",
    promo_title: "Shift to higher gear",
    promo_sub: "Unlock unlimited creation and exclusive features.",
    promo_btn: "View Premium Offers",
    footer: "MiamChef by MiamSaveurs"
  },
  es: {
    home_title: "Cocina única,",
    home_subtitle: "como tú.",
    date_locale: "es-ES",
    btn_premium: "Premium",
    card_creator_title: "Cocina del Chef",
    card_creator_sub: "Creación a medida",
    card_planning_title: "Planificador",
    card_planning_sub: "Menús y Organización",
    card_scan_title: "Escanear Nevera",
    card_scan_sub: "Cero Desperdicio",
    card_sommelier_title: "Sumiller",
    card_sommelier_sub: "Maridaje de Vinos",
    card_book_title: "Mi Recetario",
    card_book_sub: "Recetas Guardadas",
    card_list_title: "Lista de Compras",
    card_list_sub: "Compras Inteligentes",
    profile_title: "Mi Perfil Gourmet",
    profile_sub: "Configura tus gustos a medida.",
    concept_title: "Descubre el concepto",
    concept_sub: "SALUD • AHORRO • A MEDIDA",
    concept_btn: "VER",
    promo_title: "Sube de nivel",
    promo_sub: "Desbloquea la creación ilimitada y funciones exclusivas.",
    promo_btn: "Ver ofertas Premium",
    footer: "MiamChef por MiamSaveurs"
  },
  it: {
    home_title: "Cucina unica,",
    home_subtitle: "proprio come te.",
    date_locale: "it-IT",
    btn_premium: "Premium",
    card_creator_title: "Cucina dello Chef",
    card_creator_sub: "Creazione su misura",
    card_planning_title: "Pianificatore",
    card_planning_sub: "Menu & Organizzazione",
    card_scan_title: "Scan Frigo",
    card_scan_sub: "Zero Sprechi",
    card_sommelier_title: "Sommelier",
    card_sommelier_sub: "Abbinamento Vini",
    card_book_title: "Il Mio Ricettario",
    card_book_sub: "Ricette Salvate",
    card_list_title: "Lista Spesa",
    card_list_sub: "Spesa Intelligente",
    profile_title: "Il Mio Profilo",
    profile_sub: "Configura i tuoi gusti.",
    concept_title: "Scopri il concetto",
    concept_sub: "SALUTE • RISPARMIO • SU MISURA",
    concept_btn: "VEDI",
    promo_title: "Passa al livello successivo",
    promo_sub: "Sblocca la creazione illimitata e funzioni esclusive.",
    promo_btn: "Vedi offerte Premium",
    footer: "MiamChef di MiamSaveurs"
  },
  de: {
    home_title: "Einzigartige Küche,",
    home_subtitle: "genau wie du.",
    date_locale: "de-DE",
    btn_premium: "Premium",
    card_creator_title: "Chefküche",
    card_creator_sub: "Maßgeschneidert",
    card_planning_title: "Wochenplaner",
    card_planning_sub: "Menüs & Organisation",
    card_scan_title: "Kühlschrank-Scan",
    card_scan_sub: "Null Abfall",
    card_sommelier_title: "Sommelier",
    card_sommelier_sub: "Weinbegleitung",
    card_book_title: "Mein Kochbuch",
    card_book_sub: "Gespeicherte Rezepte",
    card_list_title: "Einkaufsliste",
    card_list_sub: "Intelligentes Einkaufen",
    profile_title: "Mein Profil",
    profile_sub: "Konfiguriere deinen Geschmack.",
    concept_title: "Entdecke das Konzept",
    concept_sub: "GESUNDHEIT • SPAREN • INDIVIDUELL",
    concept_btn: "ANSEHEN",
    promo_title: "Wechsle auf die Überholspur",
    promo_sub: "Schalte unbegrenzte Erstellung und exklusive Funktionen frei.",
    promo_btn: "Premium-Angebote ansehen",
    footer: "MiamChef von MiamSaveurs"
  }
};

const LANG_KEY = 'miamchef_language';

export const getCurrentLanguage = (): Language => {
  const stored = localStorage.getItem(LANG_KEY);
  if (stored && ['fr', 'en', 'es', 'it', 'de'].includes(stored)) {
    return stored as Language;
  }
  return 'fr'; // Default
};

export const setLanguage = (lang: Language) => {
  localStorage.setItem(LANG_KEY, lang);
  // Force reload to apply changes globally simply
  window.location.reload();
};

export const t = (key: keyof typeof TRANSLATIONS['fr']): string => {
  const lang = getCurrentLanguage();
  return TRANSLATIONS[lang][key] || TRANSLATIONS['fr'][key];
};

export const getDateLocale = (): string => {
    const lang = getCurrentLanguage();
    return TRANSLATIONS[lang].date_locale;
}
