import { NavLink } from "react-router-dom"

const Navbar = () => {
    return (
        <>
            <div className="fixed left-0 top-0 z-25 bg-black text-white flex items-center justify-between w-full h-20 font-vcr px-12 h-15 ">
                <NavLink to='/' className={({ isActive }) => `font-vcr font-bold text-4xl p-12`}>Vastora</NavLink>
                <div className="flex gap-15 flex items-center justify-between ">
                    <NavLink to='/history' className={({ isActive }) => `${isActive ? "underline decoration-white decoration-4 underline-offset-4" : ""} hover:text-[#3f464d]`}>History</NavLink>
                    <NavLink to='/profile' className={({ isActive }) => `${isActive ? "underline decoration-white decoration-4 underline-offset-4" : ""} hover:text-[#3f464d]`}>Profile</NavLink>
                    <NavLink to='/watch' className={({ isActive }) => `${isActive ? "underline decoration-white decoration-4 underline-offset-4" : ""} hover:text-[#3f464d]`}>Watch</NavLink>
                    <NavLink to='/login' className={({ isActive }) => `transition-all 300ms  ease-in-out bg-[#1b1f22] p-4 rounded-4xl ${isActive ? "font-bold" : ""} hover:bg-[#3f464d]`} >Log in</NavLink>
                </div>
            </div >
        </>
    );
}

export { Navbar }