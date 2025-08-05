import { Navbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Toggle from "../components/Toggle";

function History() {
    return (
        <>
            <Navbar />
            <Sidebar />
            <div className="bg-[#1a1e21] min-h-screen text-lg text-black w-full flex items-center justify-center font-vcr">
                <Toggle color={"purple"}/>
            </div>
        </>
    )
}

export default History;