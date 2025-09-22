import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "./pages/not-found";
import HomePage from "./pages/home";
import App from "./App";
import HistoryPage from "./pages/history";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "history",
        element: <HistoryPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
