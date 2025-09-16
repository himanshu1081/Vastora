import { useState } from "react";
import { Navbar } from "../components/Navbar";
import TextType from "../components/TextType";
import Toggle from "../components/Toggle";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

//icons
import { IoMdClose } from "react-icons/io";
import { LiaCloudUploadAltSolid } from "react-icons/lia";
import axiosInstance from "../util/axiosIntance";

function Upload() {
    const navigate = useNavigate();
    const {userData } = useSelector((state) => state.auth);

    const handleSubmit = async () => {
        const formData = new FormData();
        if (files.videoFile == null) {
            toast.error("Upload video first")
            return;
        }
        if (files.thumbnail == null) {
            toast.error("No thumbnail")
            return;
        }
        if (letterCount.titleCount === 0) {
            toast.error("Title can't be empty")
            return;
        }
        formData.append("videoFile", files.videoFile)
        formData.append("thumbnail", files.thumbnail)
        formData.append("title", videoInfo.title)
        formData.append("isPublished", videoInfo.isPublished)
        if (videoInfo.description != "") formData.append("description", videoInfo.description)
        const toastID = toast.loading('Uploading');
        try {
            await axiosInstance.post("/video/upload", formData)
            toast.success('Video Uploaded Successfully!', { id: toastID });
            navigate(`/profile/${userData.username}`)
        } catch (err) {
            console.log("Message : ", err)
            console.log(err.response?.data)
            if(err){
                toast.error("Something went wrong",{id:toastID})
            }
        }
    }

    const [videoInfo, setVideoInfo] = useState({
        title: "",
        description: "",
        isPublished: false
    })

    const [letterCount, setLetterCount] = useState({
        titleCount: 0,
        descriptionCount: 0
    })

    const limit = {
        titleLimit: 400,
        descriptionLimit: 5000
    }

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


    const [preview, setPreview] = useState({
        thumbnail: null,
        video: null
    })

    const [files, setFiles] = useState({
        thumbnail: null,
        videoFile: null
    })

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
            setFiles(prev => ({ ...prev, thumbnail: file }));
            setPreview(prev => ({ ...prev, thumbnail: previewUrl }))
        } else if (filetype === "video") {
            setFiles(prev => ({ ...prev, videoFile: file }));
            setPreview(prev => ({ ...prev, video: previewUrl }))
        } else {
            console.warn("Could not upload the file");
        }
    }

    return (
        <>
            <Navbar />
            <div className="bg-black h-screen text-lg text-white w-screen font-figtree pt-15 pb-5 md:pb-2 sm:pt-25 sm:p-4 overflow-scroll hide-scrollbar flex justify-center items-center">
                <div
                    className="bg-[#8200db]/10 w-3/4 sm:w-4/4 md:w-3/4 h-full border-2 border-white/30 flex flex-col rounded-lg  items-center p-2 md:p-4 gap-3 sm:gap-4 overflow-scroll hide-scrollbar">
                    <div >
                        <TextType
                            text={["Upload your video", "Grow your channel", "Vast Aura"]}
                            typingSpeed={75}
                            pauseDuration={1500}
                            showCursor={true}
                            cursorCharacter="_"
                            className="font-extrabold sm:text-5xl"
                        />
                        <p>Notice: Can't upload video of size 100MB and above</p>
                    </div>
                    <div className="h-fit w-full flex justify-center items-center flex-col sm:flex-row text-base gap-2 sm:gap-4 ">
                        <div className="max-w-[1280px] w-full md:w-3/4 h-fit flex justify-center">
                            {
                                preview.video ?
                                    <div className="relative aspect-video">
                                        <IoMdClose className="top-1 right-1 absolute z-10"
                                            onClick={() => { setPreview(prev => ({ ...prev, video: null })) }} />
                                        <video src={preview.video} controls className="w-full h-full object-contain rounded-lg " />
                                    </div>
                                    :
                                    <label className="flex w-full h-fit justify-center items-center  rounded-lg">
                                        <span className="rounded  bg-purple-700 flex p-2 w-4/4 md:w-3/4 lg:w-2/4 justify-center cursor-pointer  items-center gap-2 font-bold hover:bg-purple-500">
                                            <LiaCloudUploadAltSolid />
                                            Upload Video
                                        </span>
                                        <input type="file" accept="video/*" onChange={(e) => handleFile(e, "video")}
                                            className="hidden"
                                        />
                                    </label>
                            }
                        </div>
                        <div className="max-w-[1280px] w-full  md:w-3/4 h-fit flex justify-center">
                            {
                                preview.thumbnail ?
                                    <div className="relative w-full h-full aspect-video overflow-hidden">
                                        <IoMdClose className="top-1 right-1 absolute z-10"
                                            onClick={() => { setPreview(prev => ({ ...prev, thumbnail: null })) }} />
                                        <img src={preview.thumbnail} alt="Thumbnail" className="object-cover rounded-lg w-full h-full" />
                                    </div>
                                    :
                                    <label className="flex justify-center items-center rounded-lg w-4/4 md:w-3/4 lg:w-2/4 h-fit">
                                        <span className="rounded w-full bg-purple-700 flex p-2 justify-center items-center gap-2 font-bold cursor-pointer hover:bg-purple-500">
                                            <LiaCloudUploadAltSolid />
                                            Upload Thumbnail
                                        </span>
                                        <input type="file" accept="image/*" onChange={(e) => handleFile(e, "thumbnail")}
                                            className="hidden"
                                        />
                                    </label>
                            }
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
                        <div className="flex justify-start text-xs items-center w-full gap-2">
                            <span>Private</span>
                            <Toggle color="purple" onToggle={handleToggle} />
                            <span>Public</span>
                        </div>
                    </div>
                    <div
                        className="transition-all duration-100 ease-in bg-purple-700 w-30 h-fit rounded-md flex justify-center items-center p-2 font-extrabold hover:bg-purple-500 cursor-pointer"
                        onClick={handleSubmit}
                    >
                        Post
                    </div>
                </div>
            </div>
        </>
    )
}

export default Upload;