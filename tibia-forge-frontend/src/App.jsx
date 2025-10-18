import { Routes, Route } from "react-router-dom";
import Optimizer from "./components/optimizer/optimizer";
import Handler from "./components/auth/handler/handler";
import Auth from "./components/auth/auth";
import Nav from "./components/side/nav/nav";
import Statistics from "./components/side/statistics/statistics";
import Media from "./components/side/media/media";
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
      <Statistics />
      <Media />
      <Routes>
        <Route path="/" element={<Optimizer />} />
        <Route path="/" element={<Handler />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
      </Routes>
    </>
  );
}

export default App;
