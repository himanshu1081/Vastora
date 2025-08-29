import Watch from "./pages/Watch.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import History from "./pages/History.jsx";
import VideoSetting from "./pages/VideoSetting.jsx";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Upload from "./pages/Upload.jsx";
import { Toaster } from 'react-hot-toast';
import 'video.js/dist/video-js.css'



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
    path: "/profile/:username",
    element: <Profile />
  },
  {
    path: "/profile/:username/vsettings/:videoId",
    element: <VideoSetting />
  },
  {
    path: "/watch/:videoId",
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
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
