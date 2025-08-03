import Watch from "./pages/Watch.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import History from "./pages/History.jsx";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Navbar } from "./components/Navbar";
import Upload from "./pages/Upload.jsx";

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
  },
  {
    path: "/upload",
    element:
      <Upload />
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
