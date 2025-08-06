import { NavLink } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { showSidebar } from "../features/sidebarSlice.js";
import { login, logout } from "../features/authSlice.js";
import { AnimatePresence, motion } from "framer-motion";

// Icons
import { IoMdSettings } from "react-icons/io";
import { HiDotsVertical } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import { FaPlus } from "react-icons/fa6";
import { FiSidebar } from "react-icons/fi";
import axiosInstance from "../util/axiosIntance.js";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [dropdown, setDropdown] = useState(null);

  const sidebar = useSelector((state) => state.sidebar.showSidebar);
  const dispatch = useDispatch();
  const { userData, isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axiosInstance.get("/user/get-user", {
          withCredentials: true,
        });
        const user = res.data.data;
        if (user) {
          const { fullName, email, username, avatar } = user;
          dispatch(login({ fullName, email, username, avatar }));
        }
      } catch (err) {
        if (err?.response?.status === 401) {
          console.log("User not logged in.");
        } else {
          console.error("Something went wrong:", err);
        }
      }
    };
    checkUser();
  }, []);

  const handleChange = (e) => setSearch(e.target.value);

  const handleKey = (e) => {
    if (e.key === "Enter" && search.trim() !== "") {
      // handleSearch() if needed
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/user/logout", {}, { withCredentials: true });
      dispatch(logout());
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const Settings = () => {
    return (
      <AnimatePresence>
        {(dropdown === "profile" || dropdown === "dots") && (
          <>
            <div
              className="fixed z-24 inset-0"
              onClick={() => setDropdown(null)}
            />
            <motion.div
              initial={{ opacity: 0, x: 10, y: 0, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, y: 10, scale: 1 }}
              exit={{ opacity: 0, x: 10, y: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="absolute top-5 md:top-10 right-2 z-25 h-fit 
                w-25 sm:w-35 py-1 sm:py-3 bg-[#3f464d] rounded-md shadow-[0_0_10px_black] 
                text-white text-xs sm:text-base flex justify-start flex-col"
            >
              <div className="flex justify-start items-center gap-2 p-2 md:py-3 w-full hover:bg-[#1b1f22] cursor-pointer">
                <IoMdSettings className="size-5 md:size-6" />
                <span>Settings</span>
              </div>
              {isLoggedIn && (
                <>
                  <NavLink
                    to="/profile"
                    className="flex justify-start items-center gap-2 p-2 w-full hover:bg-[#1b1f22]"
                  >
                    <CgProfile className="size-5 md:size-6" />
                    <span>Profile</span>
                  </NavLink>
                  <NavLink
                    to="/"
                    onClick={() => {
                      handleLogout();
                      setDropdown(null);
                    }}
                    className="flex justify-start items-center gap-2 p-2 w-full hover:bg-[#1b1f22] cursor-pointer"
                  >
                    <CgProfile className="size-5 md:size-6" />
                    <span>Log out</span>
                  </NavLink>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div
      className={`fixed left-0 top-0 ${sidebar ? "z-25" : "z-50"
        } bg-black text-white flex items-center justify-around sm:justify-between 
        w-full h-10 sm:h-20 font-figtree md:px-12 `}
    >
      <div className="flex justify-around items-center ">
        <div className="p-2 md:hidden h-10 w-10 flex justify-center items-center">
          <FiSidebar
            className="size-3 sm:size-5"
            onClick={() => dispatch(showSidebar())}
          />
        </div>
        <NavLink
          to="/"
          className="font-vcr font-bold text-xl sm:text-3xl md:text-4xl px-2"
        >
          VASTORA
        </NavLink>
      </div>

      <div
        className="transition-all duration-300 ease-in-out flex justify-start items-center
         bg-[#8200db]/30 h-6 w-50 sm:w-70 sm:h-10 md:w-100 rounded-4xl p-1 sm:p-2 md:p-4 border
        border-gray-400 hover:bg-[#8200db]/20"
      >
        <input
          type="text"
          className="focus:outline-none w-3/4 sm:w-full h-7 text-xs sm:text-base"
          placeholder="Search"
          onKeyDown={handleKey}
          onChange={handleChange}
        />
        <IoIosSearch
          color="white"
          className="transition-all duration-100 hover:bg-zinc-800 rounded-full size-6 sm:size-9 p-1 cursor-pointer"
        />
      </div>

      <div className="flex justify-end items-center gap-2">
        {isLoggedIn ? (
          <div className="relative flex justify-center items-center gap-3 md:gap-5 px-2">
            <NavLink
              to="/upload"
              className="flex justify-center items-center transition-all duration-200 ease-in-out h-5 sm:h-10 w-15 sm:w-25 gap-1 text-sm md:text-lg rounded-4xl hover:bg-[#3f464d]"
            >
              <FaPlus className="size-2 sm:size-5" />
              <span className="text-xs sm:text-base font-bold">Create</span>
            </NavLink>
            <img
              src={userData.avatar || "/assets/default-avatar.png"}
              className="rounded-full w-5 sm:w-10 h-5 sm:h-10 cursor-pointer aspect-square object-cover"
              alt="your-avatar"
              onClick={() => setDropdown("profile")}
            />
            {dropdown === "profile" && <Settings />}
          </div>
        ) : (
          <div className="flex gap-1 md:gap-4 items-center justify-center md:justify-between pr-3">
            <div className="relative">
              <HiDotsVertical
                className="size-3 sm:size-5 cursor-pointer rounded-full"
                onClick={() => setDropdown("dots")}
              />
              {dropdown === "dots" && <Settings />}
            </div>
            <NavLink
              to="/login"
              className="flex justify-center items-center transition-all duration-200 ease-in-out 
              h-5 sm:h-10 w-10 sm:w-20 text-xs sm:text-base md:text-xl p-2 rounded-4xl font-extrabold bg-[#8200db]/30 hover:bg-[#8200db]/50"
            >
              Login
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export { Navbar };
