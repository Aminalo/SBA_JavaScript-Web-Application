export function setStatus(el, text, tone = "") {
  el.textContent = text || "";
  el.className = "status";
  if (tone) el.classList.add(tone);
}

export function buildGalleryCard(tpl, drink, { onDetails, onFavorite }) {
  const node = tpl.content.firstElementChild.cloneNode(true);
  const img = node.querySelector(".thumb");
  const title = node.querySelector(".title");
  const btnDet = node.querySelector(".detail");
  const btnFav = node.querySelector(".fav");

  img.src = drink.strDrinkThumb;
  img.alt = drink.strDrink;
  title.textContent = drink.strDrink;

  btnDet.addEventListener("click", () => onDetails(drink));
  btnFav.addEventListener("click", () => onFavorite(drink));

  return node;
}

export function buildFavoriteCard(tpl, fav, onRemove) {
  const node = tpl.content.firstElementChild.cloneNode(true);
  node.querySelector(".thumb").src = fav.strDrinkThumb;
  node.querySelector(".thumb").alt = fav.strDrink;
  node.querySelector(".title").textContent = fav.strDrink;
  node.querySelector(".remove").addEventListener("click", () => onRemove(fav));
  return node;
}

export function renderList(container, nodes) {
  container.innerHTML = "";
  const frag = document.createDocumentFragment();
  nodes.forEach(n => frag.appendChild(n));
  container.appendChild(frag);
}

export function renderDetails(tpl, container, drinkFull) {
  container.innerHTML = "";
  if (!drinkFull) {
    container.innerHTML = `<p class="muted">No details available.</p>`;
  } else {
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.querySelector(".hero").src = drinkFull.strDrinkThumb;
    node.querySelector(".hero").alt = drinkFull.strDrink;
    node.querySelector(".name").textContent = drinkFull.strDrink;

    const metaParts = [];
    if (drinkFull.strCategory) metaParts.push(drinkFull.strCategory);
    if (drinkFull.strAlcoholic) metaParts.push(drinkFull.strAlcoholic);
    if (drinkFull.strGlass) metaParts.push(`Glass: ${drinkFull.strGlass}`);
    node.querySelector(".meta").textContent = metaParts.join(" • ");

    const ul = node.querySelector(".ing");
    for (let i = 1; i <= 15; i++) {
      const ing = drinkFull[`strIngredient${i}`];
      const meas = drinkFull[`strMeasure${i}`];
      if (!ing) break;
      const li = document.createElement("li");
      li.textContent = `${ing}${meas ? ` — ${meas.trim()}` : ""}`;
      ul.appendChild(li);
    }

    node.querySelector(".instr").textContent = drinkFull.strInstructions || "—";
    container.appendChild(node);
  }
}