import { useState } from "react";
import { FaYoutube } from "react-icons/fa";
import { PiSidebarFill } from "react-icons/pi";
import { TiHome } from "react-icons/ti";
import { NavLink } from "react-router-dom";

function Sidebar() {
    const [sidebar, setSidebar] = useState(false);
    const ShowLable = ({ icon, lable, sidebar, link }) => {
        return (
            <NavLink to={link} className={({ isActive }) => `text-white rounded-lg flex justify-center items-center gap-12 p-4 w-[90%] h-10  ${isActive ? "bg-zinc-800" : "hover:bg-zinc-700"}`}>
                {icon}
                {sidebar && <span>{lable} </span>}

            </NavLink>
        );
    }
    return (
        <>
            {sidebar && <span className="h-screen w-screen bg-black/20 fixed"></span>}
            <div className="h-screen fixed z-50 ">
                <div className={`transition-all duration-300 ease-in-out flex flex-col items-center h-full bg-black w-3/4 font-vcr ${sidebar ? "w-64" : "w-16"}`} onMouseEnter={() => setSidebar(true)} onMouseLeave={() => setSidebar(false)}>
                    <NavLink to='/' className={({ isActive }) => `transition-all duration-300 ease-in-out font-vcr text-white font-bold text-4xl h-20 w-full px-12 flex items-center ${isActive ? "font-bold" : ""} ${sidebar ? "opacity-100" : "opacity-0 pointer-events-none"} `}>Vastora</NavLink>
                    <ShowLable lable="Home" sidebar={sidebar} link="/" icon={<TiHome size={25} color="white" />} />
                    <ShowLable lable="History" sidebar={sidebar} link="/history" icon={<TiHome size={25} color="white" />} />
                    <ShowLable lable="Profile" sidebar={sidebar} link="/profile" icon={<TiHome size={25} color="white" />} />
                    <ShowLable lable="Home" sidebar={sidebar} link="/liked-videos" icon={<TiHome size={25} color="white" />} />
                    <ShowLable lable="Home" sidebar={sidebar} link="/subscription" icon={<TiHome size={25} color="white" />} />
                </div>
            </div>
        </>
    )
}

export default Sidebar;