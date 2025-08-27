import { searchByIngredient, getDetails, postFavorite, deleteFavoriteRemote } from "./api.js";
import {
  setStatus,
  buildGalleryCard,
  buildFavoriteCard,
  renderList,
  renderDetails
} from "./ui.js";

// ----- Cache DOM -----
const form = document.getElementById("search-form");
const ingInput = document.getElementById("ingredient");
const statusEl = document.getElementById("status");

const gallery = document.getElementById("gallery");
const details = document.getElementById("details");

const pageLabel = document.getElementById("page-label");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const favorites = document.getElementById("favorites");
const clearFavsBtn = document.getElementById("clear-favs");

const cardTpl = document.getElementById("card-tpl");
const favTpl = document.getElementById("fav-tpl");
const detailsTpl = document.getElementById("details-tpl");

// ----- App state -----
let results = [];
let page = 1;
const pageSize = 9;

// Favorites state (localStorage)
let favs = loadFavs();

function loadFavs() {
  try {
    return JSON.parse(localStorage.getItem("cocktail:favs") || "[]");
  } catch {
    return [];
  }
}
function saveFavs() {
  localStorage.setItem("cocktail:favs", JSON.stringify(favs));
}

// ----- Pagination helpers -----
function totalPages() {
  return Math.max(1, Math.ceil(results.length / pageSize));
}
function paged() {
  const start = (page - 1) * pageSize;
  return results.slice(start, start + pageSize);
}
function updatePager() {
  pageLabel.textContent = `Page ${page}/${totalPages()}`;
  prevBtn.disabled = page <= 1;
  nextBtn.disabled = page >= totalPages();
}

// ----- Favorites render -----
function renderFavorites() {
  const nodes = favs.map((fav) =>
    buildFavoriteCard(favTpl, fav, async (toRemove) => {
      // Try to delete remote record if we have a remoteId (best-effort)
      try {
        if (toRemove.remoteId) await deleteFavoriteRemote(toRemove.remoteId);
      } catch {
        // ignore remote errors (it’s just a demo endpoint)
      } finally {
        // Remove locally no matter what
        favs = favs.filter((f) => f.idDrink !== toRemove.idDrink);
        saveFavs();
        renderFavorites();
      }
    })
  );
  renderList(favorites, nodes);
}

// ----- Results render (wires Favorite correctly) -----
function renderResults() {
  const nodes = paged().map((drink) =>
    buildGalleryCard(cardTpl, drink, {
      onDetails: async (d) => {
        setStatus(statusEl, "Loading details…");
        try {
          const full = await getDetails(d.idDrink);
          renderDetails(detailsTpl, details, full);
          setStatus(statusEl, "");
        } catch (err) {
          setStatus(statusEl, `Failed details: ${err.message}`, "error");
        }
      },
      onFavorite: async (d) => {
        try {
          // avoid duplicates
          if (favs.some((f) => f.idDrink === d.idDrink)) {
            setStatus(statusEl, "Already in favorites.", "error");
            return;
          }

          // POST to demo API (JSONPlaceholder)
          const posted = await postFavorite({
            idDrink: d.idDrink,
            strDrink: d.strDrink,
            strDrinkThumb: d.strDrinkThumb
          });

          // Save locally
          favs.unshift({
            idDrink: d.idDrink,
            strDrink: d.strDrink,
            strDrinkThumb: d.strDrinkThumb,
            remoteId: posted?.id 
          });
          saveFavs();
          renderFavorites();
          setStatus(statusEl, `Added "${d.strDrink}" to favorites ⭐`, "ok");
        } catch (err) {
          setStatus(statusEl, `Favorite failed: ${err.message}`, "error");
        }
      }
    })
  );

  renderList(gallery, nodes);
  updatePager();
}

// ----- Events -----
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const q = ingInput.value.trim();

  if (q.length < 2) {
    ingInput.setCustomValidity("Enter at least 2 characters.");
    ingInput.reportValidity();
    return;
  }
  ingInput.setCustomValidity("");

  setStatus(statusEl, "Searching…");
  page = 1;
  details.innerHTML = "";

  try {
    results = await searchByIngredient(q);
    if (results.length) {
      setStatus(statusEl, `Found ${results.length} drinks for "${q}".`, "ok");
    } else {
      setStatus(statusEl, `No cocktails found for "${q}".`, "error");
    }
    renderResults();
  } catch (err) {
    setStatus(statusEl, `Search failed: ${err.message}`, "error");
  }
});

prevBtn.addEventListener("click", () => {
  if (page > 1) {
    page--;
    renderResults();
  }
});
nextBtn.addEventListener("click", () => {
  if (page < totalPages()) {
    page++;
    renderResults();
  }
});

clearFavsBtn.addEventListener("click", () => {
  if (!confirm("Clear ALL favorites locally?")) return;
  favs = [];
  saveFavs();
  renderFavorites();
});

// ----- Init -----
(function init() {
  // Render any saved favorites on load
  renderFavorites();

  // Do a default search so UI isn’t empty
  ingInput.value = "vodka";
  form.dispatchEvent(new Event("submit"));
})();