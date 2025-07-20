import { Navbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function History() {
    return (
        <>
            <Navbar/>
            <Sidebar />
            <div className="bg-[#1a1e21] min-h-screen text-lg text-black w-full flex items-center justify-center font-vcr">
                history
            </div>
        </>
    )
}

export default History;