import { useState, useEffect } from "react";
import { fetchNews } from "../../../../services";

function News() {
  const [slide, setSlide] = useState(0);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const isProd = import.meta.env.PROD;

  const assets = {
    news_banner: isProd
      ? `/api/getAsset?asset=news_banner`
      : import.meta.env.VITE_CLOUDINARY_NEWS_BANNER,
  };

  useEffect(() => {
    const getNews = async () => {
      try {
        setLoading(true);
        const data = await fetchNews(3);
        setItems(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load news");
      } finally {
        setLoading(false);
      }
    };
    getNews();
  }, []);

  useEffect(() => {
    if (!items.length) return;
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % items.length);
    }, 10000);
    return () => clearInterval(id);
  }, [items.length]);

  const prev = () => setSlide((s) => (s - 1 + items.length) % items.length);
  const next = () => setSlide((s) => (s + 1) % items.length);

  return (
    <div className="media__news-card">
      <img
        className="media__news-banner"
        src={assets.news_banner}
        alt="News Banner"
      />
      {loading && <div className="media__news">Loading news…</div>}
      {!loading && error && <div className="media__news">{error}</div>}
      {!loading && !error && items.length > 0 && (
        <div className="media__news">
          {items[slide]?.excerpt && (
            <p className="media__news-excerpt">{items[slide].excerpt}</p>
          )}
          {items[slide]?.image && (
            <img
              className="media__news-image"
              src={items[slide].image}
              alt={items[slide]?.title || `News ${slide + 1}`}
            />
          )}
          <div className="media__news-footer">
            <a
              className="media__news-link"
              href={items[slide]?.url}
              target="_blank"
              rel="noreferrer"
            >
              READ ON: tibia.com
            </a>
            <div className="media__nav">
              <div className="media__nav-buttons">
                <button
                  className="media__nav-btn"
                  onClick={prev}
                  aria-label="Previous"
                >
                  ‹
                </button>
                <button
                  className="media__nav-btn"
                  onClick={next}
                  aria-label="Next"
                >
                  ›
                </button>
              </div>
              <span className="media__news-indicator" aria-live="polite">
                {slide + 1}/{items.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default News;
