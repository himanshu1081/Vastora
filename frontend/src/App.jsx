import Watch from "./pages/watch";
import Register from "./pages/register";
import Profile from "./pages/profile";
import Login from "./pages/login";
import Home from "./pages/home";
import History from "./pages/history";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Navbar } from "./components/Navbar";

const router = createBrowserRouter([
  {
    path: "/",
    element:
      <Home />

  },
  {
    path: "/register",
    element:
      <Register />

  },
  {
    path: "/login",
    element: 
      <Login />
  },
  {
    path: "/profile",
    element:
      <Profile />
  },
  {
    path: "/watch",
    element:
      <Watch />
  },
  {
    path: "/history",
    element:
      <History />
  }
])

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
