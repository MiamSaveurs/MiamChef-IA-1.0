import https from 'https';

const ingredients = [
  "Vegetable Stock", "Chicken Stock", "Beef Stock", "Stock", "Bouillon", "Water",
  "Hazelnuts", "Hazelnut", "Almonds", "Almond", "Walnuts", "Walnut",
  "Salt", "Butter", "Sage", "White Wine", "Shallot", "Shallots", "Onion",
  "Pine Nuts", "Pumpkin Seeds", "Pecan Nuts", "Pecan", "Peanut Butter",
  "Olive Oil", "Soy Sauce", "Vinegar"
];

async function checkImage(name) {
  const url = `https://www.themealdb.com/images/ingredients/${name.replace(/ /g, '%20')}-Small.png`;
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ name, status: res.statusCode });
    }).on('error', () => resolve({ name, status: 'error' }));
  });
}

async function run() {
  for (const ing of ingredients) {
    const res = await checkImage(ing);
    console.log(`${res.name}: ${res.status}`);
  }
}

run();
