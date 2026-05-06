import { useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import { Navbar } from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import axiosInstance from "../util/axiosIntance.js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { storedVideos } from "../features/videoSlice.js";
import "../index.css"
import VideoCardSkeleton from "../components/VideoCardSkeleton.jsx";

function Home() {
    const [videos, setVideos] = useState([])
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [renderPopup, setRenderPopup] = useState(false)

    const handleClick = (videoId) => {
        navigate(`/watch/${videoId}`);
    }

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get("/video");
                setVideos(res?.data?.data);
                dispatch(storedVideos(res?.data?.data));
            } catch (err) {
                console.error("Error fetching videos:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);


    return (
        <>
            <>
                <Sidebar />
                <Navbar />

                <div className="bg-black min-h-screen max-w-screen font-figtree pt-15 pb-5 sm:pt-25 overflow-x-hidden hide-scrollbar">
                    <div className="w-full grid grid-cols-1 gap-1 sm:gap-2 md:gap-4 place-items-center xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 sm:px-5 md:pl-20">

                        {loading
                            ? Array(10).fill(0).map((_, i) => (
                                <div key={i} className="w-full max-w-sm">
                                    <VideoCardSkeleton />
                                </div>
                            ))
                            : videos?.map((video) => (
                                <Card
                                    key={video._id}
                                    channelName={video.ownerName}
                                    avatar={video.ownerAvatar}
                                    title={video.title}
                                    thumbnail={video.thumbnail}
                                    viewCount={video.views}
                                    username={video.ownerUsername}
                                    date={video.createdAt.split('T')[0].split('-').reverse().join('-')}
                                    onClick={() => handleClick(video._id)}
                                />
                            ))
                        }

                    </div>
                </div>
            </>
        </>
    )
}

export default Home;