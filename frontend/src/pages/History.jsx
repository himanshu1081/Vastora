import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axiosInstance from "../util/axiosIntance";
import Card3 from "../components/Card3.jsx"
import { useNavigate } from "react-router-dom";


function History() {

    const [history, setHistory] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const getHistory = async () => {
            const history = await axiosInstance.get('user/history');
            setHistory(history?.data?.data)
        }
        getHistory();
    }, [])

    const handleClick = (videoId) => {
        navigate(`/watch/${videoId}`);
    }

    return (
        <>
            <Navbar />
            <Sidebar />
            <div className="bg-black h-screen text-lg text-white w-screen font-figtree pt-15 pb-5 sm:pt-25 overflow-x-hidden hide-scrollbar ">
                {
                    history?.watchHistory?.length > 0 ?
                        (
                            <div className="flex flex-col justify-center items-start md:w-screen sm:px-5 md:pl-20 gap-4">
                                <span className="flex justify-center items-center md:justify-start w-full md:text-4xl font-extrabold">History</span>
                                {[...(history?.watchHistory)].reverse().map((video) => (
                                    <Card3
                                        key={video._id}
                                        channelName={video.ownerFullname}
                                        avatar={video.ownerAvatar} title={video.title}
                                        thumbnail={video.thumbnail} viewCount={video.views}
                                        username={video.ownerUsername}
                                        date={video.createdAt.split('T')[0].split('-').reverse().join('-')}
                                        onClick={() => handleClick(video._id)} />
                                ))}
                            </div>

                        ) : (
                            <div className=" flex justify-center items-center w-screen h-screen">
                                <img src="/assets/no-history.png" alt="no-history" className="w-50 h-70 sm:h-90 sm:w-65 md:h-110 md:w-80" />
                            </div>
                        )
                }
            </div>
        </>
    )
}

export default History;

// // {{
//     "_id": "6893b5de4511013061758b44",
//     "thumbnail": "https://res.cloudinary.com/dkusz3kdi/image/upload/v1754510813/gqv1rvsftjwyasfgphpd.jpg",
//     "title": "This is the first video on vastora.",
//     "duration": 0.3272330666666667,
//     "views": 14949,
//     "createdAt": "2025-08-06T20:06:54.148Z",
//     "ownerId": "68895e66ae26c583f039cdd0",
//     "ownerUsername": "riyalhim",
//     "ownerAvatar": "http://res.cloudinary.com/dkusz3kdi/image/upload/v1751246579/qj2dmteyhaooqduqc11k.jpg",
//     "ownerFullname": "Himanshu Chaudhary"
// }