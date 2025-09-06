import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import axiosInstance from "../util/axiosIntance";
import { useEffect, useState } from "react";
import { BiLike, BiDislike } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Comment = ({ avatar, content, fullName, createdAt, isMine = false, commentId, isVideoOwner = false, onDelete, username }) => {
    const [deletePopup, setDeletePopup] = useState(false)
    const { isLoggedIn } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const deleteComment = async () => {
        await axiosInstance.delete(`comment/del-comment/${commentId}`)
        setDeletePopup(false);
        onDelete?.(commentId)
    }
    const [commentInfo, setCommentInfo] = useState({
        likes: 0,
        dislikes: 0,
        isLiked: false,
        isDisliked: false
    });
    const secureAvatar = avatar
        ? avatar.replace(/^http:/, "https:")
        : "/default-avatar.png";
    const handleLike = async (type) => {
        if (!isLoggedIn) {
            setLoginPopup(true)
            return
        }

        if (type === "like") {
            setCommentInfo((prev) => ({ ...prev, likes: commentInfo.likes + 1, isLiked: true }));
            if (commentInfo.isDisliked) {
                setCommentInfo((prev) => ({ ...prev, dislikes: commentInfo.dislikes - 1, isDisliked: false }));
            }
            await axiosInstance.patch(`like/like-comment/${commentId}?type=${type}`);
        } else if (type === "dislike") {
            setCommentInfo((prev) => ({ ...prev, dislikes: commentInfo.dislikes + 1, isDisliked: true }));
            if (commentInfo.isLiked) {
                setCommentInfo((prev) => ({ ...prev, likes: commentInfo.likes - 1, isLiked: false }));
            }
            await axiosInstance.patch(`like/like-comment/${commentId}?type=${type}`);
        } else if (type === "unlike") {
            setCommentInfo((prev) => ({ ...prev, likes: commentInfo.likes - 1, isLiked: false }));
            await axiosInstance.patch(`like/like-comment/${commentId}?type=neutral`);
        } else if (type === "undislike") {
            setCommentInfo((prev) => ({ ...prev, dislikes: commentInfo.dislikes - 1, isDisliked: false }));
            await axiosInstance.patch(`like/like-comment/${commentId}?type=neutral`);
        }
    }
    useEffect(() => {
        const commentEffect = async () => {
            const commentLikes = await axiosInstance.get(`like/get-clikes/${commentId}`)
            setCommentInfo((prev) => ({ ...prev, likes: commentLikes?.data?.data.likes, dislikes: commentLikes?.data?.data.dislikes, isLiked: commentLikes?.data?.data.isLiked, isDisliked: commentLikes?.data?.data.isDisliked }));
        }

        commentEffect()
    }, [commentId])


    return (
        <>
            {
                deletePopup &&
                <>
                    <div className="w-screen h-screen bg-black/80 fixed z-100 flex justify-center items-center top-0 right-0"
                        onClick={() => setDeletePopup(false)}>
                        <div className="h-1/4 w-11/12 sm:h-1/4 sm:w-2/4 md:w-1/4 text-white font-figtree font-extrabold rounded-lg flex flex-col justify-center items-center backdrop-blur-sm bg-white/30 border-1 border-white/20 gap-4"
                            onClick={(e) => e.stopPropagation()}>
                            <span className="text-xl cursor-default">Delete this Comment?</span>
                            <div className="flex gap-2">
                                <span className="p-2 bg-purple-800 rounded-lg cursor-pointer border-2 border-black/10"
                                    onClick={() => setDeletePopup(false)}>
                                    Cancel
                                </span>
                                <span className="p-2 bg-purple-800 rounded-lg cursor-pointer  border-2 border-black/10"
                                    onClick={deleteComment}>
                                    Delete
                                </span>
                            </div>
                        </div>
                    </div>
                </>
            }
            <div className="flex gap-1 p-2 relative" >
                {
                    isLoggedIn && <>
                        {
                            (isMine || isVideoOwner) &&
                            <MdDelete className="absolute top-8 right-0 md:right-2 md:text-xl cursor-pointer" onClick={() => setDeletePopup(true)} />
                        }
                    </>
                }

                <div className="cursor-pointer" onClick={() => navigate(`/profile/${username}`)}>
                    <img src={secureAvatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                </div>
                <div>
                    <div className="flex gap-2 justify-start items-center">
                        <span className="cursor-pointer" onClick={() => navigate(`/profile/${username}`)}>
                            {fullName}
                        </span>
                        <span className="text-xs text-gray-500">
                            {createdAt?.split('T')[0].split("-").reverse().join('-') || "just now"}
                        </span>
                    </div>
                    <div
                        className="w-50 sm:w-90 md:w-100 lg:w-110 xl:w-160 2xl:w-180 outline-none ">
                        {content}
                    </div>
                    <div className="flex w-fit rounded-4xl h-fit gap-2 md:gap-6p-2 text-white/50 pt-2">
                        <span className={`transition-all duration-150 ease-in-out w-fit flex items-center gap-1 cursor-pointer hover:text-white ${commentInfo.isLiked ? "text-white" : ""}`}>
                            <BiLike className="h-4 md:h-5 w-fit "
                                onClick={() => commentInfo.isLiked ? (handleLike("unlike")) : handleLike("like")} />
                            {commentInfo?.likes}
                        </span>
                        <span className={`transition-all duration-150 ease-in-out w-fit flex items-center gap-1 cursor-pointer hover:text-white ${commentInfo.isDisliked ? "text-white" : ""}`}>
                            <BiDislike className="h-4 md:h-5 w-fit "
                                onClick={() => commentInfo.isDisliked ? (handleLike("undislike")) : handleLike("dislike")} />
                            {commentInfo?.dislikes}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Comment;

