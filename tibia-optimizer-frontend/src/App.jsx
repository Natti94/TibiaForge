import Nav from "./components/nav/nav";
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
      <Nav />
    </>
  );
}

export default App;
