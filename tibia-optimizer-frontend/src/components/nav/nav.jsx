import { Routes, Route } from "react-router-dom";
import Pages from "./pages/pages";
import Auth from "../auth/auth";
import Optimizer from "../optimizer/optimizer";
import Media from "../media/media";
import "./nav.css";

function Nav() {
  return (
    <div className="nav">
      <Pages />
      </div>
  );
}

export default Nav;
