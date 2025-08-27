import { searchByIngredient, getDetails } from "./api.js";
import { setStatus, buildGalleryCard, renderList, renderDetails } from "./ui.js";

const form = document.getElementById("search-form");
const ingInput = document.getElementById("ingredient");
const statusEl = document.getElementById("status");
const gallery = document.getElementById("gallery");
const details = document.getElementById("details");
const pageLabel = document.getElementById("page-label");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const cardTpl = document.getElementById("card-tpl");
const detailsTpl = document.getElementById("details-tpl");

let results = [];
let page = 1;
const pageSize = 9;

function totalPages(){ return Math.max(1, Math.ceil(results.length / pageSize)); }
function paged(){ const s=(page-1)*pageSize; return results.slice(s, s+pageSize); }
function updatePager(){
  pageLabel.textContent = `Page ${page}/${totalPages()}`;
  prevBtn.disabled = page<=1; nextBtn.disabled = page>=totalPages();
}

function renderResults(){
  const nodes = paged().map(d => buildGalleryCard(cardTpl, d, {
    onDetails: async (drink) => {
      setStatus(statusEl, "Loading details…");
      try {
        const full = await getDetails(drink.idDrink);
        renderDetails(detailsTpl, details, full);
        setStatus(statusEl, "");
      } catch (err) {
        setStatus(statusEl, `Failed details: ${err.message}`, "error");
      }
    },
    onFavorite: () => { /* will add later */ }
  }));
  renderList(gallery, nodes);
  updatePager();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const q = ingInput.value.trim();
  if (q.length < 2) { ingInput.setCustomValidity("Enter at least 2 characters."); ingInput.reportValidity(); return; }
  ingInput.setCustomValidity("");

  setStatus(statusEl, "Searching…");
  page = 1; details.innerHTML = "";
  try {
    results = await searchByIngredient(q);
    setStatus(statusEl, results.length ? `Found ${results.length} drinks for "${q}".` : `No cocktails found for "${q}".`, results.length ? "ok" : "error");
    renderResults();
  } catch (err) {
    setStatus(statusEl, `Search failed: ${err.message}`, "error");
  }
});

prevBtn.addEventListener("click", ()=>{ if(page>1){ page--; renderResults(); } });
nextBtn.addEventListener("click", ()=>{ if(page<totalPages()){ page++; renderResults(); } });

(function init(){
  ingInput.value = "vodka";
  form.dispatchEvent(new Event("submit"));
})();