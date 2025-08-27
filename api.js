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

import axios from "https://cdn.jsdelivr.net/npm/axios@1.6.8/+esm";

const WRITE_BASE = "https://jsonplaceholder.typicode.com";
const write = axios.create({
  baseURL: WRITE_BASE,
  headers: { "Content-Type": "application/json; charset=UTF-8" }
});

export async function postFavorite(fav) {
  const { data } = await write.post("/posts", fav);
  return data; // { id: newId, ...echo }
}

export async function deleteFavoriteRemote(remoteId) {
  await write.delete(`/posts/${remoteId}`);
  return true;
}

