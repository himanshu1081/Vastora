import { useEffect } from "react";
import Card from "../components/Card.jsx";
import { Navbar } from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { useNavigate, useParams } from "react-router-dom";
import "../index.css"
import { useSelector } from "react-redux";

function Searched() {
    const navigate = useNavigate();
    const videos = useSelector((state) => state.videos.videos);
    const { query } = useParams()
    console.log(query)
    console.log(videos)

    const handleClick = (videoId) => {
        navigate(`/watch/${videoId}`);
    }
    const filteredVideos = videos.filter(video => video.title.toLowerCase().includes(query.toLowerCase()));

    return (
        <>
            <Sidebar />
            <Navbar />{
                (filteredVideos?.length === 0)
                    ?
                    (
                        <>
                            <div className="text-white bg-black font-figtree font-bold w-screen h-screen md:text-3xl flex justify-center items-center">
                                No Video Found
                            </div>
                        </>
                    )
                    :
                    (
                        <>
                            <div className="bg-black h-screen text-lg text-black w-screen font-figtree pt-15 pb-5 sm:pt-25 overflow-x-hidden hide-scrollbar ">
                                <div className="w-full grid grid-cols-1 gap-1 sm:gap-2 md:gap-4 place-items-center xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 sm:px-5 md:pl-20">
                                    {filteredVideos?.map((video) => (
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

export default Searched;