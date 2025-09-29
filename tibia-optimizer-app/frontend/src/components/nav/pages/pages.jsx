import { useState } from "react";
import { Link } from "react-router-dom";

function Pages() {
  const [collapsed, setCollapsed] = useState(false);

  const isProd = import.meta.env.PROD;

  const assets = {
    book_gif: isProd
      ? `/api/getAsset?asset=book_gif`
      : import.meta.env.VITE_CLOUDINARY_BOOK_GIF,
    title_small: isProd
      ? `/api/getAsset?asset=title_small`
      : import.meta.env.VITE_CLOUDINARY_TITLE_SMALL,
    about: isProd
      ? `/api/getAsset?asset=about_icon`
      : import.meta.env.VITE_CLOUDINARY_ABOUT_ICON,
    guide: isProd
      ? `/api/getAsset?asset=guide_icon`
      : import.meta.env.VITE_CLOUDINARY_GUIDE_ICON,
    contact: isProd
      ? `/api/getAsset?asset=contact_icon`
      : import.meta.env.VITE_CLOUDINARY_CONTACT_ICON,
    cooperation: isProd
      ? `/api/getAsset?asset=cooperation_icon`
      : import.meta.env.VITE_CLOUDINARY_COOPERATION_ICON,
    donate: isProd
      ? `/api/getAsset?asset=donate_icon`
      : import.meta.env.VITE_CLOUDINARY_DONATE_ICON,
  };

  return (
<div>
      <nav className={`pages__nav${collapsed ? " pages__nav--collapsed" : ""}`}>
        <img
          className="pages__nav-image-top"
          src={assets.book_gif}
          alt="Nav Image"
        />
        <button
          className="pages__nav-collapse-btn"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          type="button"
        >
          <span className="pages__nav-collapse-icon">
            {collapsed ? "»" : "«"}
          </span>
        </button>
        <div className="pages__nav-title">{!collapsed}</div>
        <ul className="pages__nav-list">
          {!collapsed && (
            <Link to="/" className="pages__nav-logo-link">
              <img
                className="pages__nav-logo"
                src={assets.title_small}
                alt="Title Small"
                height={90}
                width={120}
              />
            </Link>
          )}

          <li className="pages__nav-item">
            <Link to="/about" className="pages__nav-link">
              <img
                className="pages__nav-icon"
                src={assets.about}
                alt="About Icon"
              />
              <span>About</span>
            </Link>
          </li>

          <li className="pages__nav-item">
            <Link to="/guides" className="pages__nav-link">
              <img
                className="pages__nav-icon"
                src={assets.guide}
                alt="Guides Icon"
              />
              <span>Guides</span>
            </Link>
          </li>
          <li className="pages__nav-item">
            <Link to="/cooperations" className="pages__nav-link">
              <img
                className="pages__nav-icon"
                src={assets.cooperation}
                alt="Cooperations Icon"
              />
              <span>Cooperations</span>
            </Link>
          </li>

          <li className="pages__nav-item">
            <Link to="/contact" className="pages__nav-link">
              <img
                className="pages__nav-icon"
                src={assets.contact}
                alt="Contact Icon"
              />
              <span>Contact</span>
            </Link>
          </li>

          <li className="pages__nav-item">
            <Link to="/donate" className="pages__nav-link">
              <img
                className="pages__nav-icon"
                src={assets.donate}
                alt="Donate Icon"
              />
              <span>Donate</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Pages;
