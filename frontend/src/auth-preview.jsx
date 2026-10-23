import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./middleware/AuthContext";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import ForgotPassword from "./pages/auth/forgot-password/ForgotPassword";
import VerifyResetCode from "./pages/auth/verify-reset-code/VerifyResetCode";
import ResetPassword from "./pages/auth/reset-password/ResetPassword";
import "./index.css";

const routes = {
  login: { pathname: "/login" },
  register: { pathname: "/register" },
  forgot: { pathname: "/forgot-password" },
  verify: {
    pathname: "/verify-reset-code",
    state: { email: "maria.santos@example.com" },
  },
  reset: { pathname: "/reset-password", state: { token: "A1B2C3" } },
};

const key = window.location.hash.replace("#", "") || "forgot";
const entry = routes[key] ?? routes.forgot;

function Preview() {
  return (
    <GoogleOAuthProvider clientId="preview-client-id">
      <AuthProvider>
        <MemoryRouter initialEntries={[entry]}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-reset-code" element={<VerifyResetCode />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

createRoot(document.getElementById("root")).render(<Preview />);
