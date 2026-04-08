
export const AMAZON_AFFILIATE_LINKS = [
    { name: "Couteau de chef 20 cm", url: "https://amzn.to/4cj0XyH", keywords: ["couteau", "chef", "émincer", "couper"] },
    { name: "Couteau d'office 10 cm", url: "https://amzn.to/4m6Z7V4", keywords: ["couteau", "office", "éplucher", "petit"] },
    { name: "Fouet", url: "https://amzn.to/3PTiYef", keywords: ["fouet", "mélanger", "battre", "oeufs"] },
    { name: "Spatule en bois", url: "https://amzn.to/47DrB2F", keywords: ["spatule", "bois", "mélanger", "poêle"] },
    { name: "Sauteuse 28 cm", url: "https://amzn.to/4sasQho", keywords: ["sauteuse", "poêle", "cuire", "saisir"] },
    { name: "Poêle minérale 24 cm", url: "https://amzn.to/4sMq1nO", keywords: ["poêle", "cuire", "oeufs", "viande"] },
    { name: "Casserole 16 cm", url: "https://amzn.to/4sEpqEu", keywords: ["casserole", "bouillir", "sauce"] },
    { name: "Casserole 20 cm", url: "https://amzn.to/417i0xA", keywords: ["casserole", "pâtes", "riz"] },
    { name: "Faitout 24 cm", url: "https://amzn.to/4dVKfGU", keywords: ["faitout", "mijoter", "soupe"] },
    { name: "Cuit vapeur 24 cm", url: "https://amzn.to/3QdMCuP", keywords: ["vapeur", "légumes", "sain"] },
    { name: "Ecumoiire diamètre 10", url: "https://amzn.to/48ocxWX", keywords: ["écumoire", "frire", "bouillon"] },
    { name: "Plaque pâtissière", url: "https://amzn.to/4tlgvHU", keywords: ["plaque", "four", "pâtisserie", "biscuits"] },
    { name: "Balance de cuisine", url: "https://amzn.to/4trC1ep", keywords: ["balance", "peser", "grammes"] },
    { name: "Mandoline", url: "https://amzn.to/4c11c0g", keywords: ["mandoline", "trancher", "fines"] },
    { name: "Thermomètre de cuisson", url: "https://amzn.to/3QdOwLZ", keywords: ["thermomètre", "température", "viande"] },
    { name: "Mixeur plongeant", url: "https://amzn.to/3PIyda4", keywords: ["mixeur", "soupe", "velouté"] },
    { name: "Eplucheur", url: "https://amzn.to/4m745Bc", keywords: ["éplucheur", "économe", "peler"] },
    { name: "Passoire", url: "https://amzn.to/4mcfPm4", keywords: ["passoire", "égoutter", "pâtes"] },
    { name: "Blendeur", url: "https://amzn.to/3NZcMkq", keywords: ["blendeur", "smoothie", "mixer"] },
    { name: "Maryse", url: "https://amzn.to/3NZd6zE", keywords: ["maryse", "racler", "pâtisserie"] },
    { name: "Couvercle 24 cm", url: "https://amzn.to/4sLqfLF", keywords: ["couvercle", "mijoter"] },
    { name: "Tapis de cuisson", url: "https://amzn.to/485TQHs", keywords: ["tapis", "silicone", "four", "pâtisserie"] },
    { name: "Poche à douille", url: "https://amzn.to/4sLqfLF", keywords: ["poche", "douille", "décorer", "pâtisserie"] },
    { name: "Rouleau à pâtisserie", url: "https://amzn.to/4v4Dite", keywords: ["rouleau", "pâtisserie", "étaler", "pâte"] },
    { name: "Cercle à tarte 24 cm", url: "https://amzn.to/4bLJu1V", keywords: ["cercle", "tarte", "foncer"] },
    { name: "Robot pâtissier", url: "https://amzn.to/4tqQcjU", keywords: ["robot", "pâtissier", "pétrir", "monter"] },
    { name: "Tamis", url: "https://amzn.to/4v5BtMy", keywords: ["tamis", "tamiser", "farine"] },
    { name: "Passette", url: "https://amzn.to/4dnYBzO", keywords: ["passette", "filtrer", "sauce"] },
    { name: "Moule à tarte diamètre 24 amovible", url: "https://amzn.to/4dTk4AD", keywords: ["moule", "tarte", "amovible"] }
];

export const KORO_AFFILIATE_BASE_URL = "https://www.awin1.com/cread.php?awinmid=112476&awinaffid=2616370&ued=";
export const KORO_SHOP_URL = "https://www.koro.fr/search?sSearch=";

export const getKoRoAffiliateLink = (searchTerm: string) => {
    const searchUrl = `${KORO_SHOP_URL}${searchTerm.replace(/\s+/g, '+')}`;
    return `${KORO_AFFILIATE_BASE_URL}${encodeURIComponent(searchUrl)}`;
};

export const KORO_DRY_INGREDIENTS_KEYWORDS = [
    "farine", "sucre", "noix", "amandes", "noisettes", "pâte", "riz", "lentilles", 
    "pois chiches", "quinoa", "avoine", "muesli", "fruits secs", "baies", "graines", 
    "épices", "chocolat", "cacao", "beurre de cacahuète", "purée d'amande", "sirop d'érable",
    "huile de coco", "lait de coco", "protéine", "spiruline", "chia", "noix de cajou",
    "noix de pécan", "pistaches", "pignons de pin", "dattes", "figues", "abricots secs",
    "cranberries", "baies de goji", "chips de banane", "purée de noisette", "tahin",
    "couscous", "boulgour", "lentilles corail", "haricots", "pois cassés", "sucre de coco",
    "pépites de chocolat", "levure nutritionnelle", "bouillon", "sauce soja"
];

export const processAffiliateLink = (href?: string) => {
    if (!href) return href;
    try {
        if (href.includes('koro.fr') || href.includes('koroshop.fr')) {
            if (href.includes('awin1.com')) {
                // Fix old links that used &p= instead of &ued= and koroshop.fr
                return href.replace('&p=', '&ued=').replace('http://', 'https://').replace('koroshop.fr', 'koro.fr');
            }
            const cleanHref = href.replace('koroshop.fr', 'koro.fr');
            return `${KORO_AFFILIATE_BASE_URL}${encodeURIComponent(cleanHref)}`;
        }
    } catch {
        return href;
    }
    return href;
};
