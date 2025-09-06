import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../util/axiosIntance";
import TextType from "../components/TextType";
import { IoIosArrowDown } from "react-icons/io";
import Card2 from "../components/Card2";
import { BiLike, BiDislike } from "react-icons/bi";
import { useSelector } from "react-redux";
import toast from "react-hot-toast"
import Comment from "../components/Comment";

function Watch() {
    const { videoId } = useParams();
    const contentRef = useRef();
    const [loginPopup, setLoginPopup] = useState(false);
    const [loading, setLoading] = useState(true)
    const [videos, setVideos] = useState([]);
    const [videoInfo, setVideoInfo] = useState({
        subscribers: 0,
        likes: 0,
        dislikes: 0,
        isSubscribed: false,
        isLiked: false,
        isDisliked: false
    })
    const [comment, setComment] = useState("");
    const [commentPreview, setCommentPreview] = useState([]);
    const [showPreview, setShowPreview] = useState(true);
    const [watch, setWatch] = useState();
    const navigate = useNavigate();
    const [descriptionExpand, setDescriptionExpand] = useState(false)
    const { isLoggedIn, userData } = useSelector((state) => state.auth);


    const handleClick = (videoId) => {
        navigate(`/watch/${videoId}`);
    }
    useEffect(() => {
        const watchVideo = async () => {
            try {
                window.scrollTo({ top: 0, behavior: "smooth" });
                // getVideo
                const video = await axiosInstance.get(`video/watch/${videoId}`)
                setWatch({
                    ...video.data?.data[0],
                    videoFile: video.data?.data[0].videoFile.replace("/upload/", "/upload/f_mp4/")
                });

                // suggestions of other videos
                const suggestions = await axiosInstance.get("/video", { params: { limit: 10 } })
                setVideos(suggestions?.data?.data);

                window.scrollTo({ top: 0, behavior: "smooth" });

                // get video information
                const videoImpressions = await axiosInstance.get(`like/get-vlikes/${videoId}`)

                // get subscribers
                const subscribers = await axiosInstance.get(`subscriber/${videoId}`)

                //setting every Infomation inside videoInfo
                setVideoInfo((prev) => ({ ...prev, subscribers: subscribers.data?.data.count, isSubscribed: subscribers.data?.data.isSubscribed, likes: videoImpressions?.data?.data.likes, dislikes: videoImpressions?.data?.data.dislikes, isLiked: videoImpressions?.data?.data.isLiked, isDisliked: videoImpressions?.data?.data.isDisliked }));

                //get comments
                const commentRes = await axiosInstance.get(`comment/get-comments/${videoId}`)
                setCommentPreview(commentRes?.data?.data);

            } catch (error) {
                console.log(error.message)
            } finally {
                setLoading(false)
            }
        }
        watchVideo()
    }, [videoId, userData?._id, isLoggedIn])

    const handleCommentChange = (e) => {
        setComment(e.target.innerText);
    }

    const handleCommentDelete = (commentId) => {
        setCommentPreview(prev => prev.filter(c => c._id !== commentId))
    }

    const handleComment = async (e) => {
        if (comment !== '') {

            const commentResponse = await axiosInstance.post(`comment/add-comment/${videoId}`, { content: comment });
            const newComment = commentResponse.data?.data;
            contentRef.current.innerText = ""
            toast('Comment Posted', {
                icon: '✅',
            });
            setComment("")
            setCommentPreview(prev => [
                {
                    _id: newComment._id,
                    content: newComment.content,
                    isMine: true,
                    owner: {
                        _id: userData?._id, fullName: userData?.fullName, avatar: userData?.avatar
                    }
                }
                , ...prev]);
        } else {
            toast.error("Comment can't be empty")
        }
    }

    const handleSubscription = async (action) => {
        if (!isLoggedIn) {
            setLoginPopup(true)
            return
        }
        if (action === "subscribe") {
            await axiosInstance.post(`subscriber/subscribe/${watch.ownerId}`);
            toast('Subscribed', {
                icon: '🔔',
            });
            setVideoInfo((prev) => ({ ...prev, subscribers: videoInfo.subscribers + 1, isSubscribed: true }));


        } else if (action === "unsubscribe") {
            await axiosInstance.delete(`subscriber/unsubscribe/${watch.ownerId}`);
            toast('Unsubscribed', {
                icon: '🤨',
            });
            setVideoInfo((prev) => ({ ...prev, subscribers: videoInfo.subscribers - 1, isSubscribed: false }));

        }
    }

    const handleLike = async (type) => {
        if (!isLoggedIn) {
            setLoginPopup(true)
            return
        }

        if (type === "like") {
            if (videoInfo.isDisliked) {
                setVideoInfo((prev) => ({ ...prev, dislikes: videoInfo.dislikes - 1, isDisliked: false }));
            }
            setVideoInfo((prev) => ({ ...prev, likes: videoInfo.likes + 1, isLiked: true }));
            await axiosInstance.patch(`like/like-video/${videoId}?type=${type}`);
        } else if (type === "dislike") {
            if (videoInfo.isLiked) {
                setVideoInfo((prev) => ({ ...prev, likes: videoInfo.likes - 1, isLiked: false }));
            }
            setVideoInfo((prev) => ({ ...prev, dislikes: videoInfo.dislikes + 1, isDisliked: true }));
            await axiosInstance.patch(`like/like-video/${videoId}?type=${type}`);
        } else if (type === "unlike") {
            setVideoInfo((prev) => ({ ...prev, likes: videoInfo.likes - 1, isLiked: false }));
            await axiosInstance.patch(`like/like-video/${videoId}?type=neutral`);
        } else if (type === "undislike") {
            setVideoInfo((prev) => ({ ...prev, dislikes: videoInfo.dislikes - 1, isDisliked: false }));
            await axiosInstance.patch(`like/like-video/${videoId}?type=neutral`);
        }
    }

    return (

        <>
            {
                loading ?
                    (
                        <div className="bg-black h-screen w-screen text-white font-figtree flex justify-center items-center">
                            <TextType
                                text={["Loading...", "Vast Aura"]}
                                typingSpeed={75}
                                pauseDuration={1800}
                                showCursor={true}
                                cursorCharacter="_"
                                className="font-extrabold text-xl md:text-4xl sm:text-5xl"
                            />
                        </div>
                    ) : (
                        <>
                            <Navbar />
                            <Sidebar />
                            {
                                loginPopup &&
                                <>
                                    <div className="w-screen h-screen bg-black/80 fixed z-100 flex justify-center items-center"
                                        onClick={() => setLoginPopup(false)}>
                                        <div className="h-1/4 w-11/12 sm:h-1/4 sm:w-2/4 md:w-1/4 text-white font-figtree font-extrabold rounded-lg flex flex-col justify-center items-center backdrop-blur-sm bg-white/30 border-1 border-white/20 gap-4"
                                            onClick={(e) => e.stopPropagation()}>
                                            <span className="text-xl cursor-default">Log in to continue</span>
                                            <span className="p-2 bg-purple-800 rounded-lg cursor-pointer  border-2 border-black/10"
                                                onClick={() => navigate('/login')}>
                                                Log in</span>
                                        </div>
                                    </div>
                                </>
                            }
                            < div className="bg-black w-full h-full p-2 pt-10 md:pl-20 lg:pl-50 sm:pt-20 text-white flex flex-col justify-start items-center md:flex-row md:items-start overflow-y-auto">

                                {/* Left Video */}
                                <div className="md:flex md:flex-col md:gap-2 md:w-8/12" >
                                    <div className="aspect-video h-1/4 pb-2 md:pb-0">
                                        <video
                                            src={watch?.videoFile}
                                            controls
                                            autoPlay

                                            className="w-full h-full object-contain rounded-xl bg-black outline-0 "
                                        />
                                    </div>
                                    <div className="p-3 bg-[#0b0b0b] relative flex flex-col justify-start items-start gap-1 rounded-lg " >
                                        <IoIosArrowDown size={20} className={`transition-all duration-200 ease-in-out absolute right-2 top-3 
                                            ${descriptionExpand ? "rotate-180" : "rotate-0"}`} />

                                        <div className={`text-base font-bold w-full relative ${descriptionExpand ? "h-fit line-clamp-none" : "line-clamp-2"}`}
                                            onClick={() => setDescriptionExpand(!descriptionExpand)}>
                                            <div className="w-11/12 text-sm sm:text-base md:text-lg">
                                                {watch?.title}
                                            </div>
                                        </div>
                                        <div
                                            className="flex flex-col sm:flex-row w-full justify-between sm:items-center gap-1 sm:gap-3">
                                            <div
                                                className="flex w-full justify-between items-center gap-1 sm:gap-3">
                                                <div
                                                    className="flex justify-between items-center gap-2 bg-[#171717] rounded-md p-1 px-2">
                                                    <img src={watch?.ownerAvatar.replace(/^http:/, "https:")}
                                                        alt="avatar"
                                                        className="rounded-full w-8 h-8 md:w-10 lg:w-10 md:h-10 object-cover cursor-pointer"
                                                        onClick={() => navigate(`/profile/${watch?.ownerUsername}`)} />
                                                    <div
                                                        className="flex flex-col text-base line-clamp-1 items-start justify-center w-fit max-w-40 lg:max-w-50 xl:max-w-60">
                                                        <div
                                                            className="line-clamp-1  font-semibold cursor-pointer"
                                                            onClick={() => navigate(`/profile/${watch?.ownerUsername}`)}>
                                                            {watch?.ownerName}
                                                        </div>
                                                        <span
                                                            className="text-xs text-gray-400">
                                                            {videoInfo?.subscribers} subscribers
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="transition-all duration-150 ease-in-out bg-purple-800 p-2 px-4 md:px-3 w-fit flex justify-center text-sm items-center rounded-4xl hover:bg-purple-900 cursor-pointer font-figtree font-bold "
                                                    onClick={() => videoInfo?.isSubscribed ? (handleSubscription("unsubscribe")) : handleSubscription("subscribe")}
                                                >
                                                    {videoInfo?.isSubscribed ? ("Unsubscribe") : ("Subscribe")}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-center items-center w-full text-sm md:text-base text-gray-500 " onClick={() => setDescriptionExpand(!descriptionExpand)}>
                                            <span className="w-full">
                                                {watch?.views} views
                                            </span>
                                            <div className="flex justify-end w-full md:w-0"
                                                onClick={(e) => e.stopPropagation()}>
                                                <div className="flex w-fit rounded-4xl h-fit gap-2 md:gap-4 bg-purple-800 p-2">
                                                    <span className={`transition-all duration-150 ease-in-out w-fit flex items-center gap-1 cursor-pointer hover:text-white ${videoInfo?.isLiked ? "text-white" : ""}`}>
                                                        <BiLike className="h-5 sm:h-6 w-fit "
                                                            onClick={() => videoInfo?.isLiked ? (handleLike("unlike")) : handleLike("like")} />
                                                        {videoInfo?.likes}
                                                    </span>
                                                    <span className={`transition-all duration-150 ease-in-out w-fit flex items-center gap-1 cursor-pointer hover:text-white ${videoInfo?.isDisliked ? "text-white" : ""}`}>
                                                        <BiDislike className="h-5 sm:h-6 w-fit "
                                                            onClick={() => videoInfo?.isDisliked ? (handleLike("undislike")) : handleLike("dislike")} />
                                                        {videoInfo?.dislikes}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`flex flex-col justify-start line-clamp-2 ${descriptionExpand ? "max-h-fit" : "max-h-0"}`}>
                                            <span className="text-gray-500 text-sm font-bold">
                                                Uploaded on {watch?.createdAt.split('T')[0].split('-').reverse().join('-')}
                                            </span>
                                            <span className="text-sm py-2 whitespace-pre-line">
                                                {watch?.description}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-[#0b0b0b] flex flex-col justify-start items-start gap-1 rounded-lg my-2 text-sm md:text-base " >
                                        <span>Comments</span>
                                        <div className="flex gap-2 justify-start items-center h-fit w-full p-1 md:p-2">
                                            <div>
                                                <img src={isLoggedIn ? `${userData.avatar.replace(/^http:/, "https:")}` : "/assets/default-avatar.png"} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                                            </div>
                                            <div>
                                                <div ref={contentRef} contentEditable="true" placeholder="Add a comment..."
                                                    className="border-b-2 w-50 sm:w-90 md:w-100 lg:w-110 xl:w-160 2xl:w-180 outline-none "
                                                    onInput={handleCommentChange}>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="  flex justify-end w-full">
                                            <span
                                                className=" rounded-4xl border-1 border-white/20 flex justify-end bg-purple-800 p-2 px-6 hover:bg-purple-900 cursor-pointer font-figtree font-bold"
                                                onClick={isLoggedIn ? handleComment : () => setLoginPopup(true)}>
                                                Post
                                            </span>
                                        </div>

                                        <div className="flex w-full justify-center items-center text-gray-400 hover:text-white cursor-pointer" onClick={() => setShowPreview(!showPreview)}>
                                            {showPreview ? <div>Hide Comments</div> : <div>Show Comments</div>}
                                        </div>

                                        <div className={`transition-all duration-200 ease-in-out w-full flex justify-start items-center overflow-hidden ${showPreview ? "max-h-fit" : "max-h-0"}`}>
                                            {commentPreview.length > 0 ?
                                                (
                                                    < div >
                                                        {
                                                            commentPreview.map((comment) => (
                                                                <Comment
                                                                    key={comment._id}
                                                                    avatar={comment.owner.avatar}
                                                                    fullName={comment.owner.fullName}
                                                                    createdAt={comment.createdAt}
                                                                    content={comment.content}
                                                                    isMine={comment.isMine}
                                                                    isVideoOwner={watch.ownerId == userData?._id}
                                                                    commentId={comment._id}
                                                                    onDelete={handleCommentDelete}
                                                                    username={comment.owner.username}
                                                                />
                                                            ))
                                                        }
                                                    </div>
                                                )
                                                :
                                                (
                                                    <div className="w-full flex justify-center items-center font-black text-xl md:text-3xl">
                                                        <img src="/assets/no-comments.png" alt="no-comments" className="w-50 h-70 sm:h-90 sm:w-65 md:h-110 md:w-80" />
                                                    </div>
                                                )
                                            }
                                        </div>

                                    </div>
                                </div>
                                {/* Right Suggestions */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 md:w-3/12 mx-auto">
                                    {videos.filter((video) => video._id != videoId).map((video) => (
                                        <div key={video._id} className="aspect-video p-1">
                                            <Card2
                                                channelName={video.ownerName}
                                                avatar={video.ownerAvatar} title={video.title}
                                                thumbnail={video.thumbnail} viewCount={video.views}
                                                date={video.createdAt.split('T')[0].split('-').reverse().join('-')}
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