import Login from "./handler-wrapper/login";
import Register from "./handler-wrapper/register";
import { useLocation, Link } from "react-router-dom";

function Handler() {
  const { pathname } = useLocation();
  const isRegister = pathname.startsWith("/register");
  const isLogin = pathname.startsWith("/login");

  return (
    <div className="auth__handler">
      {!isLogin && !isRegister && (
        <div className="auth__handler-text">
          <span>sign in or register to utilize additional features{"  "}</span>
          <div className="auth__handler-text-actions">
            <Link to="/login" className="auth__btn">
              Sign in
            </Link>
            <Link to="/register" className="auth__btn auth__btn--primary">
              Register
            </Link>
          </div>
        </div>
      )}
      {isLogin && (
        <div className="auth__handler-login">
          <Login />
        </div>
      )}
      {isRegister && (
        <div className="auth__handler-register">
          <Register />
        </div>
      )}
    </div>
  );
}

export default Handler;
