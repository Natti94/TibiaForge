import Login from "./handle-wrapper/login";
import Register from "./handle-wrapper/register";
import { useLocation, Link } from "react-router-dom";

function Handler() {
  const { pathname } = useLocation();
  const isRegister = pathname.startsWith("/register");
  const isLogin = pathname.startsWith("/login");

  return (
    <div className="auth__handler">
      {!isLogin && !isRegister && (
        <>
          <p className="auth__handler-text">
            Sign in or register to access your personalized{" "}
            <strong>Tibia Optimizer</strong> account.
          </p>
          <div className="auth__cta">
            <Link to="/login" className="auth__btn">
              Sign in
            </Link>
            <Link to="/register" className="auth__btn auth__btn--primary">
              Register
            </Link>
          </div>
        </>
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
