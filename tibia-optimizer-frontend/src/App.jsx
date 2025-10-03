import { Routes, Route } from "react-router-dom";
import Optimizer from "./components/optimizer/optimizer";
import Auth from "./components/auth/auth";
import Nav from "./components/nav/nav";
import Media from "./components/media/media";
import "./index.css";

function App() {
  const isProd = import.meta.env.PROD;

  const assets = {
    background: isProd
      ? `/api/getAsset?assets=background`
      : import.meta.env.VITE_CLOUDINARY_BACKGROUND,
  };

  return (
    <>
      <img className="background" src={assets.background} alt="Background" />
      <Auth />
      <Nav />
      <Media />
      <Routes>
        <Route path="/" element={<Optimizer />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
      </Routes>
    </>
  );
}

export default App;
