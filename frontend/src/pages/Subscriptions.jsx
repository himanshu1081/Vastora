import { Navbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";


function Subscription() {

    return (
        <>
            <Navbar />
            <Sidebar />
            <div className="bg-black h-screen text-lg flex justify-center items-center text-white w-screen font-figtree pt-15 pb-5 sm:pt-25 overflow-x-hidden hide-scrollbar ">
                <span className="text-3xl font-inter md:text-6xl font-bold">Coming Soon</span>
            </div>
        </>
    )
}

export default Subscription;

