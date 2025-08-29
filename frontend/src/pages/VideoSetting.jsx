import { useEffect, useState, useRef } from "react";
import { Navbar } from "../components/Navbar";
import Toggle from "../components/Toggle";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

//icons
import axiosInstance from "../util/axiosIntance";
import { RiPencilFill } from "react-icons/ri";
import { MdDeleteForever } from "react-icons/md";



function VideoSetting() {
    const navigate = useNavigate();
    const { videoId } = useParams();
    const thumbnailRef = useRef();
    const { userData } = useSelector((state) => state.auth);
    const [deletePopup, setDeletePopup] = useState(false)

    const [letterCount, setLetterCount] = useState({
        titleCount: 0,
        descriptionCount: 0
    })

    const limit = {
        titleLimit: 400,
        descriptionLimit: 5000
    }
    const [originalVideoInfo, setOriginalVideoInfo] = useState({});

    const [videoInfo, setVideoInfo] = useState({
        title: "",
        description: "",
        isPublished: null,
        videoFile: null,
        thumbnail: null
    })

    useEffect(() => {
        const videoCall = async () => {
            const videoDetails = await axiosInstance.get(`/video/video-info/${videoId}`)
            setVideoInfo({
                title: videoDetails?.data?.data?.title,
                description: videoDetails?.data?.data?.description,
                isPublished: videoDetails?.data?.data?.isPublished,
                videoFile: videoDetails?.data?.data?.videoFile,
                thumbnail: videoDetails?.data?.data?.thumbnail
            })
            setOriginalVideoInfo({
                title: videoDetails?.data?.data?.title,
                description: videoDetails?.data?.data?.description,
                isPublished: videoDetails?.data?.data?.isPublished,
                videoFile: videoDetails?.data?.data?.videoFile,
                thumbnail: videoDetails?.data?.data?.thumbnail
            })
            setLetterCount({
                titleCount: videoDetails?.data?.data?.title.length,
                descriptionCount: videoDetails?.data?.data?.description.length
            })
        }
        videoCall();
    }, [videoId])



    const handleVideoInfo = (e) => {

        if (e.target.name == "title") {
            if (e.target.value.length <= limit.titleLimit) {
                setVideoInfo(prev => ({
                    ...prev,
                    [e.target.name]: e.target.value
                }));
            }
        } else if (e.target.name == "description") {
            if (e.target.value.length <= limit.descriptionLimit) {
                setVideoInfo(prev => ({
                    ...prev,
                    [e.target.name]: e.target.value
                }));
            }
        }
        handleWordChange(e, e.target.name)
    }
    const handleWordChange = (e, name) => {
        const text = e.target.value;
        const letter = text.length
        if (name === 'title') {
            setLetterCount(prev => ({ ...prev, titleCount: letter }))
        } else if (name == 'description') {
            setLetterCount(prev => ({ ...prev, descriptionCount: letter }))
        }
    }
    const handleToggle = () => {
        setVideoInfo(prev => ({ ...prev, isPublished: !prev.isPublished }))
    };

    const [thumbnailFile, setThumbnialFile] = useState(null)

    const handleFile = (e, filetype) => {
        const file = e.target.files[0]
        const filename = file.name.toLowerCase();
        if (!file) return;
        const previewUrl = URL.createObjectURL(file)
        if (filetype === "thumbnail") {
            if (file.type === "image/heic" || filename.endsWith(".heic")) {
                toast.error("HEIC images are not supported. Please upload JPG/PNG.");
                return;
            }
            setThumbnialFile(file)
            setVideoInfo(prev => ({ ...prev, thumbnail: previewUrl }));
        } else {
            console.warn("Could not upload the file");
        }
    }

    const handleDeleteVideo = async () => {
        const toastID = toast.loading('Deleting');
        try {
            const res = await axiosInstance.delete(`/video/del-video/${videoId}`)
            toast.success('Video Deleted Successfully!', { id: toastID });
            navigate(`/profile/${userData.username}`)
        } catch (err) {
            console.log("Message : ", err)
            console.log(err.response?.data)
            if (err) {
                toast.error("Something went wrong", { id: toastID })
            }
        }
    }

    const handleSubmit = async () => {
        if (JSON.stringify(videoInfo) === JSON.stringify(originalVideoInfo)) {
            navigate(`/profile/${userData.username}`);
            return;
        }
        if (letterCount.titleCount === 0) {
            toast.error("Title can't be empty")
            return;
        }
        const formData = new FormData();
        if (originalVideoInfo.thumbnail !== videoInfo.thumbnail) {
            formData.append("thumbnail", thumbnailFile)
        }
        formData.append("title", videoInfo.title)
        formData.append("description", videoInfo.description)
        formData.append("isPublished", videoInfo.isPublished ? "true" : "false");

        const toastID = toast.loading('Saving Changes');
        try {
            await axiosInstance.patch(`/video/update-video/${videoId}`, formData)
            toast.success('Video Updated Successfully!', { id: toastID });
            navigate(`/profile/${userData.username}`)
        } catch (err) {
            console.log("Message : ", err)
            console.log(err.response?.data)
            if (err) {
                toast.error("Something went wrong", { id: toastID })
            }
        }
    }
    return (
        <>
            {
                deletePopup &&
                <>
                    <div className="w-screen h-screen bg-black/80 fixed z-100 flex justify-center items-center"
                        onClick={() => setDeletePopup(false)}>
                        <div className="h-1/4 w-11/12 sm:h-1/4 sm:w-2/4 md:w-1/4 text-white font-figtree font-extrabold rounded-lg flex flex-col justify-center items-center backdrop-blur-sm bg-white/30 border-1 border-white/20 gap-4"
                            onClick={(e) => e.stopPropagation()}>
                            <span className="text-xl cursor-default">
                                Are you sure?
                            </span>
                            <div className="flex gap-2">
                                <span className="p-2 bg-purple-800 rounded-lg cursor-pointer border-2 border-black/10"
                                    onClick={() => setDeletePopup(false)}>
                                    Cancel
                                </span>
                                <span className="p-2 bg-red-800 rounded-lg cursor-pointer border-2 border-black/10"
                                    onClick={handleDeleteVideo}>
                                    Delete
                                </span>
                            </div>
                        </div>

                    </div>
                </>
            }
            <Navbar />
            <div className="bg-black h-screen text-lg text-white w-screen font-figtree pt-15 pb-5 md:pb-2 sm:pt-25 sm:p-4 overflow-scroll hide-scrollbar flex justify-center items-center">
                <div
                    className="bg-[#8200db]/10 w-10/12 h-11/12 border-2 border-white/30 flex flex-col rounded-lg items-center p-2 md:p-4 gap-3 sm:gap-4 overflow-scroll hide-scrollbar">
                    <div className="font-extrabold sm:text-4xl">
                        Video Settings
                    </div>
                    <div className="w-full h-full flex flex-col sm:flex-row p-2 gap-2">
                        <div className="h-fit w-full md:max-w-100 flex justify-center items-center flex-col sm:flex text-base ">
                            <span>Video</span>
                            <div className="max-w-[1280px] w-full md:w-3/4 h-fit flex justify-center">
                                <div className="relative aspect-video">
                                    <video src={videoInfo.videoFile} controls className="w-full h-full object-contain rounded-lg bg-black" />
                                </div>
                            </div>
                            <div className="max-w-[1280px] w-full  md:w-3/4 h-fit flex flex-col items-center justify-center pb-2">
                                <span>Thumbnail</span>
                                <div className="relative w-full h-full aspect-video overflow-hidden">
                                    <RiPencilFill className="top-1 right-1 absolute z-10 bg-black/80 hover:bg-black cursor-pointer text-white text-base sm:text-lg md:text-2xl rounded w-fit h-fit p-1"
                                        onClick={() => { thumbnailRef.current.click() }} />
                                    <input ref={thumbnailRef} type="file" className="hidden" onChange={(e) => handleFile(e, "thumbnail")} />
                                    <img src={videoInfo.thumbnail} alt="Thumbnail" className="object-cover rounded-lg w-full h-full" />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center items-center gap-2 sm:gap-4 flex-col w-full">
                            <div className="border-1 rounded flex flex-col justify-center items-start w-full gap-1 relative p-1 pb-5">
                                <span className="text-xs">Title</span>
                                <textarea
                                    type="text"
                                    wrap="hard"
                                    name="title"
                                    placeholder="Title of your video"
                                    value={videoInfo.title}
                                    maxLength={limit.titleLimit}
                                    onChange={handleVideoInfo}
                                    className="focus:outline-none w-full h-fit text-base overflow-hidden hide-scrollbar resize-none"
                                />
                                <span
                                    className="absolute z-2 text-xs bottom-1 right-1"
                                >{letterCount.titleCount}/{limit.titleLimit}</span>
                            </div>
                            <div className="border-1 rounded flex flex-col justify-center items-start w-full gap-1 relative p-1 pb-5">
                                <span className="text-xs">Description</span>
                                <textarea
                                    name="description"
                                    wrap="hard"
                                    value={videoInfo.description}
                                    placeholder="Description your video"
                                    onChange={handleVideoInfo}
                                    maxLength={limit.descriptionLimit}
                                    className="focus:outline-none p-1 relative w-4/4 h-50 text-base hide-scrollbar resize-none"
                                />
                                <span
                                    className="absolute z-2 text-xs bottom-1 right-1"
                                >{letterCount.descriptionCount}/{limit.descriptionLimit}</span>
                            </div>
                            <div className="flex flex-row justify-between gap-2 w-full">
                                <div className="flex justify-start text-xs items-center w-full gap-2 pb-2">
                                    <span>Private</span>
                                    {videoInfo.isPublished !== null && (
                                        <Toggle
                                            color="purple"
                                            onToggle={handleToggle}
                                            toggle={videoInfo.isPublished}
                                        />
                                    )}
                                    <span>Public</span>
                                </div>
                                <div className="transition-all duration-100 ease-in bg-red-700 w-fit h-fit rounded-md flex justify-center items-center p-2 sm:p-1 px-2 font-bold hover:bg-red-600 cursor-pointer"
                                    onClick={() => setDeletePopup(true)}>
                                    <MdDeleteForever />
                                    {
                                        window.innerWidth > 600 &&
                                        <span>Delete</span>
                                    }
                                </div>
                            </div>
                            <div
                                className="transition-all duration-100 ease-in bg-purple-700 w-fit h-fit rounded-md flex justify-center items-center p-2 font-extrabold hover:bg-purple-600 cursor-pointer"
                                onClick={handleSubmit}>
                                Save Changes
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default VideoSetting;