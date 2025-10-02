const assetPaths = {
  background: process.env.VITE_CLOUDINARY_BACKGROUND,
  book_gif: process.env.VITE_CLOUDINARY_BOOK_GIF,
  title: process.env.VITE_CLOUDINARY_TITLE,
  title_small: process.env.VITE_CLOUDINARY_TITLE_SMALL,
  title_effect: process.env.VITE_CLOUDINARY_TITLE_EFFECT,
  news_banner: process.env.VITE_CLOUDINARY_NEWS_BANNER,
  statistics_banner: process.env.VITE_CLOUDINARY_STATISTICS_BANNER,
  level_icon: process.env.VITE_CLOUDINARY_LEVEL_ICON,
  magicLevel_icon: process.env.VITE_CLOUDINARY_MAGIC_LEVEL_ICON,
  healthPoint_icon: process.env.VITE_CLOUDINARY_HEALTH_POINT_ICON,
  manaPoint_icon: process.env.VITE_CLOUDINARY_MANA_POINT_ICON,
  swordFighting_icon: process.env.VITE_CLOUDINARY_SWORD_FIGHTING_ICON,
  axeFighting_icon: process.env.VITE_CLOUDINARY_AXE_FIGHTING_ICON,
  clubFighting_icon: process.env.VITE_CLOUDINARY_CLUB_FIGHTING_ICON,
  distanceFighting_icon: process.env.VITE_CLOUDINARY_DISTANCE_FIGHTING_ICON,
  fistFighting_icon: process.env.VITE_CLOUDINARY_FIST_FIGHTING_ICON,
  shielding_icon: process.env.VITE_CLOUDINARY_SHIELDING_ICON,
  about_icon: process.env.VITE_CLOUDINARY_ABOUT_ICON,
  guide_icon: process.env.VITE_CLOUDINARY_GUIDE_ICON,
  contact_icon: process.env.VITE_CLOUDINARY_CONTACT_ICON,
  cooperation_icon: process.env.VITE_CLOUDINARY_COOPERATION_ICON,
  donate_icon: process.env.VITE_CLOUDINARY_DONATE_ICON,
  playback_video: process.env.VITE_CLOUDINARY_PLAYBACK_VIDEO,
};

export async function handler(event) {
  const { asset } = event.queryStringParameters;

  if (!asset) {
    console.error("No asset parameter provided");
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Asset parameter is required" }),
    };
  }

  const url = assetPaths[asset];
  if (!url) {
    console.error(
      `Asset '${asset}' not found or environment variable not set. Available assets: ${Object.keys(
        assetPaths
      ).join(", ")}`
    );
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: `Asset '${asset}' not found or environment variable not set. Available assets: ${Object.keys(
          assetPaths
        ).join(", ")}`,
      }),
    };
  }

  // Optional debug log (kept minimal). Uncomment if tracing redirects locally.
  // console.debug(`Redirecting to asset: ${asset}`);
  return {
    statusCode: 302,
    headers: {
      Location: url,
    },
    body: "",
  };
}
