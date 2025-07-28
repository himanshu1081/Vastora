import { Navbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";


function Home() {
    return (
        <>
            <Sidebar />
            <Navbar/>
            <div className="bg-[#1a1e21] min-h-screen text-lg text-black w-full flex items-center justify-center font-vcr">
                Home
            </div>
        </>
    )
}

export default Home;