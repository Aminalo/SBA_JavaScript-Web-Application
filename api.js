const COCKTAIL_BASE = "https://www.thecocktaildb.com/api/json/v1/1";

export async function searchByIngredient(ingredient) {
  const url = `${COCKTAIL_BASE}/filter.php?i=${encodeURIComponent(ingredient)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} on filter`);
  const data = await res.json();
  return Array.isArray(data.drinks) ? data.drinks : [];
}

export async function getDetails(idDrink) {
  const url = `${COCKTAIL_BASE}/lookup.php?i=${encodeURIComponent(idDrink)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} on lookup`);
  const data = await res.json();
  return Array.isArray(data.drinks) ? data.drinks[0] : null;
}