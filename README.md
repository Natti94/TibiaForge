# Tibia Optimizer

React app to help Tibia players make smarter choices about their character’s stats, equipment, and strategy. Built with Vite + React. Ships static and deploys easily to Netlify.

Live: https://tibiaoptimizer.netlify.app

## Repository layout

Top-level folders:

```
LICENSE
README.md
package.json
.vscode/
	settings.json             # Prettier as default formatter + format-on-save
tibia-optimizer-backend/
	server.js
	src/
		db.js

tibia-optimizer-frontend/
	.env                      # local env (VITE_*)
	eslint.config.js
	index.html
	package.json
	vite.config.js
	scripts/
		removeComments.mjs    # strip comments across repo
		formatRepo.mjs        # Prettier format across repo
	netlify/
		functions/
			getAssets.js          # Netlify function for prod asset URLs
	public/
		_redirects              # SPA routing for Netlify
		favicon.ico
	src/
		App.jsx
		main.jsx
		index.css
		index.js
		components/
			nav/
				nav.css
				nav.jsx
				pages/
					pages.jsx
					pages-wrapper/
						about.jsx
						contact.jsx
						cooperations.jsx
						donate.jsx
						guides.jsx
			optimizer/
				optimizer.css
				optimizer.jsx
				form/
					form.jsx
					section/
						character.jsx
						encounter.jsx
						summary.jsx
					form-wrapper/
						character/
							abilities.jsx
							skills.jsx
							items/
								equipments.jsx
								weapons.jsx
						encounters/
							creatures.jsx
							players.jsx
			media/
				media.css
				media.jsx
				content/
					content.jsx
					content-wrapper/
						images.jsx
						news.jsx
						statistics.jsx
						video.jsx
			auth/
				auth.css
				auth.jsx
				handler/
					handler.jsx
					handle-wrapper/
						login.jsx
						register.jsx
		data/
			character/
				spells.js
				items/
					equipments.js
					runes.js
					weapons.js
			encounters/
				players.js
		services/
			auth/
				csrf.js
				http.js
				login.js
				register.js
			media/
				news.js
				statistics.js
			optimizer/
				creatures.js
```

Notes:

- Frontend is the primary app. The backend folder currently contains an Express server stub (default route, basic error handling). Asset URLs are resolved via a Netlify Function in production.

## Features

- Modern optimizer UI with two SVG circles (Character and Encounter) and a center summary
  - Both circles use a unified aqua/cyan color theme for visual consistency
  - Click BEGIN to open an overlay with three columns:
    - Left: Character circle (Skills → Equip → Weapons → Abilities). Center hub for vocation selection.
    - Center: Summary panel guides completion and shows status messaging.
    - Right: Encounter circle (Creatures → Players), gated until character is complete.
  - Each completed slice shows a ✓ indicator; only one section window is open at a time.
  - SVG wedges with crisp separators; hover fills the exact slice; separator lines don’t cross the center.
  - Abort and Restart controls appear in the overlay header; BEGIN remains visible in the title area.
- Encounter helpers:
  - Creatures: Fetches and merges static/elemental data from both DB and Wikia APIs; displays all static properties and elemental mods.
  - Players: UI stubbed for future expansion.
- Media area: News, Video, Images, and Highscores Statistics
  - Statistics: TibiaData v4 highscores with World/Category/Vocation filters and an "ALL worlds" aggregate
- Navigation with info pages (About, Contact, Cooperations, Donate, Guides)
- Auth scaffolding (Login/Register)
- Cloudinary-hosted assets via `.env` during dev and Netlify Function in production

## Routing and layout

- The app is wrapped once by a top-level `<BrowserRouter>` in `src/main.jsx`.
- `src/App.jsx` renders the background, `Nav`, and route outlet. The home route (`/`) shows the Optimizer and Media.
- `src/components/nav/nav.jsx` defines routes; on the `/` route it renders `<Optimizer />` and `<Media />` together.
- If you also render `<Media />` directly in `App.jsx`, you will see it twice on the home page—prefer keeping it in one place (usually within the `/` route in `Nav`).

## Local development

Frontend (Vite + React):

```powershell
cd tibia-optimizer-frontend
npm install
npm run dev
```

- App runs at http://localhost:5173/
- SPA redirects are handled by `public/_redirects` in production

Backend (optional, stub server):

```powershell
cd tibia-optimizer-backend
# ensure a package.json and dependencies if you plan to extend the server
# node server.js (PORT defaults to 3001)
```

## Environment variables

Create `tibia-optimizer-frontend/.env` with the assets you use in the UI (examples):

```
# Optional TibiaData base (defaults to https://api.tibiadata.com)
VITE_TIBIADATA_BASE=

# Cloudinary (dev only). In prod, assets are fetched via Netlify Function.
VITE_CLOUDINARY_NEWS_BANNER=
VITE_CLOUDINARY_STATISTICS_BANNER=
VITE_CLOUDINARY_BACKGROUND=
VITE_CLOUDINARY_TITLE=
VITE_CLOUDINARY_TITLE_EFFECT=
VITE_CLOUDINARY_BOOK_GIF=
VITE_CLOUDINARY_TITLE_SMALL=
VITE_CLOUDINARY_ABOUT_ICON=
VITE_CLOUDINARY_GUIDE_ICON=
VITE_CLOUDINARY_CONTACT_ICON=
VITE_CLOUDINARY_COOPERATION_ICON=
VITE_CLOUDINARY_DONATE_ICON=
```

In development the app reads directly from these URLs. In production (Netlify), assets are fetched via the Netlify Function (`netlify/functions/getAssets.js`).

## Build and deploy (Netlify)

```powershell
cd tibia-optimizer-frontend
npm run build
```

- Publish directory: `dist`
- Ensure `public/_redirects` is included (Vite copies it to `dist/`)
- Optional: configure/enable the Netlify Function for asset indirection (see `netlify/functions/getAssets.js`)

## Maintenance scripts

- Remove comments (JS/JSX/CSS/HTML) across the repo:

```powershell
cd tibia-optimizer-frontend
npm run strip:comments
```

This runs `scripts/removeComments.mjs` and modifies files in place (excluding node_modules, dist, etc.).

- Format the entire repo with Prettier:

```powershell
cd tibia-optimizer-frontend
npm run format:repo
```

- Strip comments and then format (recommended):

```powershell
cd tibia-optimizer-frontend
npm run sanitize
```

Editor tips:

- Alt+Shift+F formats the current file in VS Code.
- This workspace sets Prettier as the default formatter and enables format-on-save (see `.vscode/settings.json`).

## Troubleshooting

- Missing images or video: verify your `.env` values (Cloudinary URLs)
- SPA 404 on refresh: ensure `_redirects` is present in the built `dist/`
- Dev server port in use: change Vite port in `vite.config.js` or stop the other process
- Windows path casing: keep import paths consistent (e.g., `components/optimizer/...`) to avoid casing-only conflicts

## About

Tribute project to Tibia, made by a fan for the community. Integrates TibiaData v4 for highscores data.

## License

Proprietary — All Rights Reserved.

This codebase may not be copied, used, modified, or distributed without prior written permission from the owner. See `LICENSE` for the full text.
