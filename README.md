# Tibia Optimizer

React app to help Tibia players make smarter choices about their character’s stats, equipment, and strategy. Built with Vite + React, ships static, and deploys easily to Netlify.

Live: https://tibiaoptimizer.netlify.app

## Repo layout (current)

The application lives in the `tibia-optimizer-app/` folder:

```
tibia-optimizer-app/
	.env                      # local env (VITE_*)
	eslint.config.js
	index.html
	package.json
	vite.config.js
	netlify/
		functions/
			getAssets.js       # Netlify function for prod asset URLs
	public/
		_redirects           # SPA routing for Netlify
		favicon.ico
	src/
		App.jsx
		main.jsx
		index.css
		components/
			nav/
				nav.css
				nav.jsx
				pages/
					pages.jsx
					pages-wrapper/
						about.jsx
						contact.jsx
						cooperation.jsx
						donate.jsx
						support.jsx
			optimizer/
				optimizer.jsx
				optimizer.css
				form/
					form.jsx
					form-wrapper/
						character/
							skills.jsx
							items/
								equipments.jsx
								weapons.jsx
						encounters/
							creatures.jsx
							players.jsx
							character/
								runes/
									damageRunes.jsx
									healingSpells.jsx
								spells/
									damageSpells.jsx
									healingSpells.jsx
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
				creatures.js
				players.js
		services/
			index.js
			auth/
				csrf.js
				http.js
				login.js
				register.js
			media/
				news.js
				statistics.js
				worlds.js
```

## Features

- Optimizer UI: CSGO-inspired circular (radial) menu for section navigation
  - After clicking **BEGIN**, a circular menu appears, letting you choose between Equipment, Weapon, Skills, Creature, and Runes/Spells
  - Only one section is visible at a time, making the UI cleaner and more interactive
  - Styled to match the CSGO buy menu (dark, radial, highlight on hover/click)
- Encounter helpers: damage/healing Runes and Spells, Creatures, Players
- Navigation with info pages (About, Contact, Cooperation, Donate, Support)
- Media area: News, Video, Images, and Highscores Statistics
  - News: simple carousel with prev/next and readable page indicator
  - Statistics: TibiaData v4 highscores with World/Category/Vocation selects and an "ALL worlds" aggregate view
- Auth scaffolding: Login/Register views with refined layout
- Live summary in the Optimizer: armor, resistances, skill totals, attack/damage, effective magic level
- Cloudinary-hosted assets via `.env` (development) and Netlify Function in production
- React + Vite + React Router; SPA-friendly `_redirects` for Netlify

## Local development

From `tibia-optimizer-app/`:

```powershell
cd tibia-optimizer-app
npm install
npm run dev
```

- App runs at http://localhost:5173/
- Uses Vite; hot reload is on by default

## Optimizer Circular Menu Usage

- Click **BEGIN** to open the optimizer's main interface.
- The menu will appear, letting you select:
  - **Equipment**: Manage and optimize your character's gear
  - **Weapon**: Choose and configure weapons and ammunition
  - **Skills**: Set and review skill levels
  - **Creature**: Access the creature search and info panel
  - **Runes/Spells**: View and optimize runes and spell options
- Only one section is visible at a time for a focused experience.
- The menu is fully keyboard and mouse accessible, with visual feedback on hover and selection.

## Environment variables

Create `tibia-optimizer-app/.env` with the assets you use in the UI (examples):

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
cd tibia-optimizer-app
npm run build
```

- Publish directory: `dist`
- Ensure `public/_redirects` is included (Vite copies it to `dist/`)
- Optional: configure a Netlify Function for asset indirection (see `netlify/functions/getAssets.js`)

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
