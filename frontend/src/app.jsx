import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Dashboard from "./pages/Dashboard.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import CreationPage from "./pages/CreationPage.jsx";

import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import PersistLogin from "./components/auth/PersistLogin.jsx";
import RootLayout from "./RootLayout.jsx";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        element: <PersistLogin />,
        children: [
          {
            element: <ProtectedRoute />,
            children: [
              {
                path: "/dashboard",
                element: <Dashboard />,
              },
              {
                path: "/create",
                element: <CreationPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
