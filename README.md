### 🍸 Cocktail Challenge App

A small JavaScript web app that lets you search cocktails by ingredient, view details, and save favorites using the CocktailDB API.

### Features

- Search cocktails by ingredient (e.g., "vodka", "gin").

- Paginated results gallery with images, titles, and details.

- View details about each cocktail, including recipe and instructions.

- Add to Favorites with local storage persistence (favorites stay after reload).

- Remove favorites individually or clear all.

- Responsive layout with styled gallery and details view.

### ✅ Technical Requirements Mapping

- Fetch/Axios → API requests to CocktailDB + JSONPlaceholder.

- Promises / async/await → All API calls wrapped in async functions.

- Modules → Organized into api.js, ui.js, and script.js.

- Events → Submit form, pagination buttons, favorites toggle, clear favorites.

- Local storage → Saves user’s favorites.

- POST / DELETE → JSONPlaceholder used to simulate saving/removing favorites remotely.

- Error handling → User feedback via setStatus() when something fails.

- User experience → Styled UI, pagination, responsive cards.

### 📂 Structure
styles /
   └── style.cssscript.js
api.js
app.js
index.html
README.md
ui.js


### How to Run

Clone the repo or download ZIP.

Run locally with any static server (e.g., npx parcel index.html --open).

Search for an ingredient (like "vodka") and explore results.

💡 Ideas to Extend

Add category/filters (e.g., alcoholic, non-alcoholic).

Save favorites to a real backend.

Display random daily cocktail.

Add animations when adding/removing favorites.

📓 Reflection (SBA Questions)
1. What could you have done differently during the planning stages of your project to make the execution easier?

I could have spent more time sketching the UI and writing out the flow of search → results → details → favorites before coding. Having clear wireframes and a plan for state management (like how favorites are stored) would have saved me some back-and-forth.

2. Were there any requirements that were difficult to implement?

Yes, the Favorites with POST/DELETE requirement was tricky because CocktailDB doesn’t support it directly. I had to use JSONPlaceholder as a fake backend to simulate this. It was also challenging to make sure localStorage and the “remote” post stayed in sync.

3. What would make them easier to implement in future projects?

Using a backend that actually supports POST/DELETE for cocktails would have made it easier. Also, breaking down features into smaller commits and testing each piece before moving forward really helped, and I would do even more of that next time.

4. What would you add to, or change about your application if given more time?

I’d add categories, filters, and sorting so users could refine results better. I’d also polish the design, maybe using a more modern UI library or animations, and add error boundaries for edge cases (like when API images are missing).

5. Notes to my future self

Always test the API thoroughly before coding.

Commit often after each working feature.

Keep logic modular—splitting into api.js, ui.js, and script.js made debugging much easier.

Never ignore error handling; even simple try/catch blocks improve user experience a lot.