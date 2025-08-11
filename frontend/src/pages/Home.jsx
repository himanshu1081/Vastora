import { useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import { Navbar } from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import axiosInstance from "../util/axiosIntance.js";
import { useNavigate } from "react-router-dom";

function Home() {
    const [videos, setVideos] = useState([])
    const navigate = useNavigate();

    const handleClick = (videoId) => {
        navigate(`/watch/${videoId}`);
    }
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await axiosInstance.get("/video");
                setVideos(res?.data?.data);
            } catch (err) {
                console.error(err.response?.data?.message);
                console.log("Error: ", err.message);
            }
        };
        fetchVideos();
    }, []);


    return (
        <>
            <Sidebar />
            <Navbar />
            <div className="bg-black h-screen text-lg text-black w-screen font-figtree pt-15 pb-5 sm:pt-25 overflow-x-hidden hide-scrollbar ">
                <div className="w-full grid grid-cols-1 gap-2 md:gap-4 place-items-center sm:grid-cols-3 lg:grid-cols-4 sm:px-5 md:pl-20">
                    {videos.map((video) => (
                        <Card
                            key={video._id}
                            channelName={video.ownerName}
                            avatar={video.ownerAvatar} title={video.title}
                            thumbnail={video.thumbnail} viewCount={video.views}
                            date={video.createdAt.split('T')[0]}
                            onClick={() => handleClick(video._id)} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default Home;