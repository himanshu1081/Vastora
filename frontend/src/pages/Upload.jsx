import { useState } from "react";
import { Navbar } from "../components/Navbar";
import TextType from "../components/TextType";
import Toggle from "../components/Toggle";
//icons
import { IoMdClose } from "react-icons/io";
import { LiaCloudUploadAltSolid } from "react-icons/lia";

function Upload() {

    const handleSubmit = () => {
        const formData = new FormData();
        if (videoInfo.title === '') {
            toast("Title can't be empty")
            return;
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

    const [file, setFile] = useState({
        thumbnail: null,
        video: null
    })

    const handleFile = (e, filename) => {
        const files = e.target.files[0]
        if (!files) return;
        const previewUrl = URL.createObjectURL(files)
        if (filename === "thumbnail") {
            setFile(prev => ({ ...prev, filename: files }));
            setPreview(prev => ({ ...prev, filename: previewUrl }))
        } else if (filename === "video") {
            setFile(prev => ({ ...prev, filename: files }));
            setPreview(prev => ({ ...prev, filename: previewUrl }))
        } else {
            console.warn("Unknown filename key:", filename);
        }
    }

    return (
        <>
            <Navbar />
            <div className="bg-black h-screen text-lg text-white w-screen font-figtree pt-15 pb-5 sm:pt-25 overflow-x-hidden hide-scrollbar flex justify-center items-center">
                <div
                    className="bg-[#8200db]/10 w-3/4 h-full border-2 border-white/30 flex flex-col rounded-lg  items-center p-2 gap-3 overflow-hidden">
                    <div >
                        <TextType
                            text={["Upload your video", "Grow your channel", "Vast Aura"]}
                            typingSpeed={75}
                            pauseDuration={1500}
                            showCursor={true}
                            cursorCharacter="_"
                            className="font-extrabold"
                        />
                    </div>
                    <div className="h-fit w-full flex justify-center items-center flex-col text-base gap-2 ">
                        <div className="max-w-[1280px] w-full h-fit flex justify-center">
                            {
                                preview.video ?
                                    <div className="relative aspect-video">
                                        <IoMdClose className="top-1 right-1 absolute z-10"
                                            onClick={() => { setPreview(prev => ({ ...prev, video: null })) }} />
                                        <video src={previewVideo} controls className="w-full h-full object-contain rounded-lg " />
                                    </div>
                                    :
                                    <label className="flex w-full h-fit justify-center items-center  rounded-lg">
                                        <span className="rounded  bg-purple-500 flex p-2 w-4/4 justify-center items-center gap-2 font-bold">
                                            <LiaCloudUploadAltSolid />
                                            Upload Video
                                        </span>
                                        <input type="file" accept="video/*" onChange={(e) => handleFile(e, "video")}
                                            className="hidden"
                                        />
                                    </label>
                            }


                        </div>
                        <div className="max-w-[1280px] w-full h-fit flex justify-center">
                            {
                                preview.thumbnail ?
                                    <div className="relative aspect-video">
                                        <IoMdClose className="top-1 right-1 absolute z-10"
                                            onClick={() => { setPreview(prev => ({ ...prev, thumbnail: null })) }} />
                                        <img src={preview.thumbnail} alt="Thumbnail" className="object-cover rounded-lg w-full h-full" />
                                    </div>
                                    :
                                    <label className="flex justify-center items-center rounded-lg w-4/4 h-fit">
                                        <span className="rounded w-full bg-purple-500 flex p-2 justify-center items-center gap-2 font-bold">
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
                    <div className="flex justify-center items-center gap-2 flex-col w-full">
                        <div className="flex flex-col justify-center items-start w-full gap-1 relative">
                            <span className="text-xs">Title</span>
                            <textarea
                                type="text"
                                name="title"
                                placeholder="Title"
                                value={videoInfo.title}
                                maxLength={limit.titleLimit}
                                onChange={handleVideoInfo}
                                className="border-1 rounded focus:outline-none p-1 w-full h-fit text-base overflow-hidden"
                            />
                            <span
                                className="absolute z-2 text-xs bottom-1 right-1"
                            >{letterCount.titleCount}/{limit.titleLimit}</span>
                        </div>
                        <div className="flex flex-col justify-center items-start w-full gap-1 relative">
                            <span className="text-xs">Description</span>
                            <textarea
                                name="description"
                                value={videoInfo.description}
                                placeholder="Description"
                                onChange={handleVideoInfo}
                                maxLength={limit.descriptionLimit}
                                className="border-1 rounded focus:outline-none p-1 relative w-4/4 h-50 text-base"
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
                        className="bg-purple-500 w-2/4 h-1/4 rounded-md flex justify-center items-center"
                        onClick={handleSubmit}
                    >
                        Submit
                    </div>

                </div>
            </div>
        </>
    )
}

export default Upload;