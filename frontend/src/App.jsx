import LandingPage from "./pages/LandingPage";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

const myRouter = createBrowserRouter(
  createRoutesFromElements(<Route index element={<LandingPage />} />),
);

function App() {
  // console.log(web3FormsApiKey);
  console.log("✅ Vite app is running!");
  return <RouterProvider router={myRouter} />;
}

export default App;
