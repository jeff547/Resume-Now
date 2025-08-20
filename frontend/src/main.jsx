import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import { AuthProvider } from "./contexts/AuthProvider.js";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./app.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="1039820836568-ro6b59f93l79fju6p0qvfmctejqu07lr.apps.googleusercontent.com">
      {/* <AuthProvider> */}
      <App />
      {/* </AuthProvider> */}
    </GoogleOAuthProvider>
  </StrictMode>
);
