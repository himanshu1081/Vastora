import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../util/axiosIntance";
import TextType from "../components/TextType";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import Card2 from "../components/Card2";

function Watch() {
    const { videoId } = useParams();
    const [loading, setLoading] = useState(true)
    const [videos, setVideos] = useState([]);
    const [watch, setWatch] = useState();
    const navigate = useNavigate();
    const scrollRef = useRef();
    const [descriptionExpand, setDescriptionExpand] = useState(false)

    const handleClick = (videoId) => {
        navigate(`/watch/${videoId}`);
    }
    useEffect(() => {
        const watchVideo = async () => {
            try {
                const res1 = await axiosInstance.get(`video/watch/${videoId}`)
                setWatch(res1.data?.data[0]);
                console.log(res1.data?.data[0]);
                const res2 = await axiosInstance.get("/video");
                setVideos(res2?.data?.data);
                scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });

            } catch (error) {
                console.log(error.message)
            } finally {
                setTimeout(() => {
                    setLoading(false)
                }, 3000)
            }
        }
        watchVideo()
    }, [videoId])


    return (

        <>
            {
                loading ?
                    (
                        <div className="bg-black h-screen w-screen text-white font-figtree flex justify-center items-center">
                            <TextType
                                text={["Loading...", "What is study even about?", "Vast Aura"]}
                                typingSpeed={75}
                                pauseDuration={1800}
                                showCursor={true}
                                cursorCharacter="_"
                                className="font-extrabold text-4xl sm:text-5xl"
                            />
                        </div>
                    ) : (
                        <>
                            <Navbar />
                            <Sidebar />
                            < div ref={scrollRef} className="bg-black w-full h-full p-2 pt-10 md:pl-20 sm:pt-20 text-white flex flex-col justify-start items-center md:flex-row md:items-start overflow-y-hidden md:gap-1">
                                {/* Left Video */}
                                <div className="md:flex md:flex-col md:gap-2 md:w-3/4 ">
                                    <div className="aspect-video h-1/4">
                                        <video
                                            src={watch.videoFile}
                                            controls
                                            autoPlay
                                            className="w-full  h-12/12 object-contain rounded-xl border-1 border-white/20 bg-black "
                                        />
                                    </div>
                                    <div className="p-3 bg-[#0b0b0b] relative flex flex-col justify-start items-start gap-1 rounded-lg " onClick={() => setDescriptionExpand(!descriptionExpand)}>
                                        <span className="flex justify-end w-full fixed right-2">
                                            {descriptionExpand ?
                                                (
                                                    <IoIosArrowUp size={20} />
                                                )
                                                :
                                                (
                                                    <IoIosArrowDown size={20} />
                                                )
                                            }
                                        </span>
                                        <div className={`text-base font-bold w-full ${descriptionExpand ? "line-clamp-none" : "line-clamp-2"}`}>
                                            {watch.title}
                                        </div>
                                        <div>
                                            {watch.views} views
                                        </div>
                                        <div className={`transition-all duration-75 ease-in flex flex-col justify-start ${descriptionExpand ? "h-fit" : "line-clamp-2 h-1"}`}>
                                            <span>
                                                {watch.createdAt.split('T')[0]}
                                            </span>
                                            <span className="text-sm py-2">
                                                {watch.description}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* Right Suggestions */}
                                <div className="sm:grid sm:grid-cols-2 md:grid-cols-1 md:w-1/4 ">
                                    {videos.filter((video) => video._id != videoId).map((video) => (
                                        <div key={video._id} className="aspect-video p-1">
                                            <Card2
                                                channelName={video.ownerName}
                                                avatar={video.ownerAvatar} title={video.title}
                                                thumbnail={video.thumbnail} viewCount={video.views}

                                                onClick={() => { handleClick(video._id), setDescriptionExpand(false) }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div >
                        </>
                    )
            }
        </>
    )
}

export default Watch;