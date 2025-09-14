import { useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import { Navbar } from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import axiosInstance from "../util/axiosIntance.js";
import { useNavigate } from "react-router-dom";
import "../index.css"

function Home() {
    const [videos, setVideos] = useState([])
    const navigate = useNavigate();
    const [renderPopup,setRenderPopup] = useState(true)

    const handleClick = (videoId) => {
        navigate(`/watch/${videoId}`);
    }
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await axiosInstance.get("/video");
                setVideos(res?.data?.data);
                setRenderPopup(false)
            } catch (err) {
                console.error(err.response?.data?.message);
                console.log("Error: ", err.message);
            }
        };
        fetchVideos();
    }, []);


    return (
        <>
            {
                renderPopup ?
                    (
                        <>
                            <div className="meshdark h-screen w-screen flex justify-center items-center">
                                <div className="h-2/4 w-80 sm:w-100 border-2 border-white/20 backdrop-blur-3xl rounded-2xl bg-white/20 flex justify-center items-center flex-col p-2 font-figtree text-white">
                                    <div className="text-3xl font-bold">Notice</div>
                                    <p className="text-center">
                                        Backend is hosted on render. Server will take upto 50 seconds before it starts working normally.
                                    </p>
                                </div>
                            </div>
                        </>
                    )
                    :
                    (
                        <>
                            <Sidebar />
                            <Navbar />
                            <div className="bg-black h-screen text-lg text-black w-screen font-figtree pt-15 pb-5 sm:pt-25 overflow-x-hidden hide-scrollbar ">
                                <div className="w-full grid grid-cols-1 gap-1 sm:gap-2 md:gap-4 place-items-center xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 sm:px-5 md:pl-20">
                                    {videos.map((video) => (
                                        <Card
                                            key={video._id}
                                            channelName={video.ownerName}
                                            avatar={video.ownerAvatar} title={video.title}
                                            thumbnail={video.thumbnail} viewCount={video.views}
                                            username={video.ownerUsername}
                                            date={video.createdAt.split('T')[0].split('-').reverse().join('-')}
                                            onClick={() => handleClick(video._id)} />
                                    ))}
                                </div>
                            </div>
                        </>
                    )
            }
        </>
    )
}

export default Home;