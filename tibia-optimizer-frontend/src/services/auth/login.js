import { handleError, handleSuccess } from "./http";
import { generateCsrf } from "./csrf";

export async function loginUser(username, password) {
  let csrfToken = localStorage.getItem("csrfToken");
  if (!csrfToken) {
    csrfToken = await generateCsrf();
  }
  const res = await fetch("https://chatify-api.up.railway.app/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      username,
      password,
      csrfToken,
    }),
  });

  if (res.ok) {
    const data = await handleSuccess(
      res,
      "Login successful, redirecting to chat..."
    );
    if (data?.token) {
      sessionStorage.setItem("jwtToken", data.token);

      const payload = parseJwt(data.token);
      if (payload?.userId) {
        try {
          const userData = await getUserById(payload.userId);
          if (userData?.avatar) {
            sessionStorage.setItem("avatar", userData.avatar);
          }
        } catch {
          if (payload?.avatar) {
            sessionStorage.setItem("avatar", payload.avatar);
          }
        }
      } else if (payload?.avatar) {
        sessionStorage.setItem("avatar", payload.avatar);
      }

      return data.token;
    } else {
      console.warn("No JWT-token received in login response.");
      return null;
    }
  }

  await handleError(
    res,
    "Login failed. Please check your username and password."
  );
}
