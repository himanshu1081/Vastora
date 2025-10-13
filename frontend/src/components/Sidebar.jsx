import { TiHome } from "react-icons/ti";
import { NavLink } from "react-router-dom";
import { RiChatHistoryFill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { showSidebar, hideSidebar } from "../features/sidebarSlice.js";
import { FiSidebar } from "react-icons/fi";
import { MdSubscriptions } from "react-icons/md";
import { FaHeart } from "react-icons/fa";

function Sidebar() {
    const sidebar = useSelector((state) => state.sidebar.showSidebar);
    const { userData } = useSelector((state) => state.auth)

    const dispatch = useDispatch();

    const ShowLabel = ({ icon, label, link, onClick }) => {

        const handleReload = () => {
            window.location.reload();
        }
        return (
            <NavLink
                to={link}
                className={({ isActive }) =>
                    ` text-white text-base border-gray-700 flex items-center gap-2 p-4 h-10 w-full font-figtree
                    ${sidebar ? "opacity-100 md:opacity-100" : "opacity-0 md:opacity-100"} 
                    ${isActive ? "bg-[#8200db]/30" : ""} hover:bg-[#8200db]/20`
                }
                onClick={onClick}
            >
                <div>{icon}</div>
                {sidebar && <span className="whitespace-nowrap">{label}</span>}
            </NavLink>
        );
    };

    return (
        <>
            {sidebar && <span className="h-screen w-screen bg-black/20 fixed z-40 md:hidden"></span>}

            <div className="fixed z-50 md:z-30 h-screen left-0 top-0">
                <div
                    className={`transition-all duration-300 ease-in-out flex flex-col items-center  h-full bg-black font-vcr
                    ${sidebar ? "md:w-64 w-44" : "md:w-16 w-0"}`}
                    onMouseEnter={() => {
                        if (window.innerWidth >= 768) dispatch(showSidebar());
                    }}
                    onMouseLeave={() => {
                        if (window.innerWidth >= 768) dispatch(hideSidebar());
                    }}
                >
                    <div
                        className={`flex justify-center items-center w-full px-4 py-5 
                        ${sidebar ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                    >
                        <NavLink
                            to="/"
                            className="text-white font-bold text-2xl md:text-4xl w-fit"
                        >
                            VASTORA
                        </NavLink>
                        <div className="p-2 md:hidden h-10 w-10 flex justify-center items-center text-white">
                            <FiSidebar onClick={() => dispatch(hideSidebar())} />
                        </div>
                    </div>

                    <ShowLabel label="Home" link="/" icon={<TiHome className="text-white size-5 md:size-6" />} />
                    <ShowLabel label="History" link="/history" icon={<RiChatHistoryFill className="text-white size-5 md:size-6" />} />
                    {userData && (
                        <ShowLabel label="Profile" link={`/profile/${userData?.username}`} icon={<CgProfile className="text-white size-5 md:size-6" />} onClick={()=>handleReload()} />
                    )}
                    <ShowLabel label="Liked Videos" link="/liked-videos" icon={<FaHeart className="text-white size-5 md:size-6" />} />
                    <ShowLabel label="Subscription" link="/subscription" icon={<MdSubscriptions className="text-white size-5 md:size-6" />} />
                </div>
            </div>
        </>
    );
}

export default Sidebar;
