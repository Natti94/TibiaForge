import { handleError, handleSuccess } from "./http";
import { generateCsrf } from "./csrf";

export async function registerUser(
  username,
  password,
  email,
  avatar,
  csrfToken
) {
  if (!csrfToken) {
    csrfToken = await generateCsrf();
  }
  const res = await fetch("https://chatify-api.up.railway.app/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      username,
      password,
      email,
      avatar,
      csrfToken,
    }),
  });
  if (res.ok) {
    const data = await handleSuccess(
      res,
      "Registration successful, redirecting to login..."
    );

    if (data?.registerUser?.avatar) {
      sessionStorage.setItem("avatar", data.registerUser.avatar);
    }

    return data?.registerUser;
  }
  await handleError(
    res,
    "Registration failed. The username or email may already be in use, or the input is invalid."
  );
}
