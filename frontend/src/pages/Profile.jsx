import { useEffect, useState, useRef } from "react";
import { Navbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../util/axiosIntance";
import CardProfile from "../components/CardProfile";
import { useSelector } from "react-redux";
import toast from "react-hot-toast"
import { RiPencilFill } from "react-icons/ri";
import { Outlet } from "react-router-dom";
import { MdError } from "react-icons/md";


function Profile() {
    const [showAvatar, setShowAvatar] = useState(false)
    const [userProfile, setUserProfile] = useState({});
    const { username } = useParams();
    const [loginPopup, setLoginPopup] = useState(false);
    const [coverImagePopup, setCoverImagePopup] = useState(false);
    const [editProfilePopup, setEditProfilePopup] = useState(false);
    const avatarRef = useRef();
    const coverImageRef = useRef();

    const saveRef = useRef();
    const [error, setError] = useState(null)

    const [userUpdateDetails, setUserUpdateDetails] = useState({
        fullName: userProfile?.fullName || "",
        email: userProfile?.email || "",
        avatar: userProfile?.avatar || "",
        coverImage: userProfile?.coverImage || ""
    })

    const { isLoggedIn } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const joinedOn = userProfile?.createdAt?.split('T')[0].split("-").reverse().join("-")

    useEffect(() => {
        const userDetails = async () => {
            const userInfo = await axiosInstance.get(`user/profile/${username}`)
            setUserProfile(userInfo?.data?.data)
            setUserUpdateDetails({ fullName: userInfo?.data?.data?.fullName, email: userInfo?.data?.data?.email, avatar: userInfo?.data?.data?.avatar, coverImage: userInfo?.data?.data.coverImage })
        }
        userDetails()
    }, [])

    const handleClick = (videoId) => {
        navigate(`/watch/${videoId}`);
    }

    const handleSubscription = async (action) => {
        if (!isLoggedIn) {
            setLoginPopup(true)
            return
        }
        if (action === "subscribe") {
            await axiosInstance.post(`subscriber/subscribe/${userProfile._id}`);
            toast('Subscribed', {
                icon: '🔔',
            });
            setUserProfile((prev) => ({ ...prev, subscriberCount: userProfile.subscriberCount + 1, isSubscribed: true }));


        } else if (action === "unsubscribe") {
            await axiosInstance.delete(`subscriber/unsubscribe/${userProfile._id}`);
            toast('Unsubscribed', {
                icon: '🤨',
            });
            setUserProfile((prev) => ({ ...prev, subscriberCount: userProfile.subscriberCount - 1, isSubscribed: false }));

        }
    }

    const updateDetails = async () => {
        var res;
        try {
            if (userProfile.fullName !== userUpdateDetails.fullName || userProfile.email !== userUpdateDetails.email) {
                res = await axiosInstance.patch("/user/update-userdetails", {
                    fullName: userUpdateDetails?.fullName,
                    email: userUpdateDetails?.email
                })
            }
            else if (userProfile.avatar !== userUpdateDetails.avatar) {
                const formData = new FormData();
                formData.append("avatar", avatarRef.current.files[0]);
                res = await axiosInstance.patch("/user/update-avatar", formData)
            }
            else if (userProfile.coverImage !== userUpdateDetails.coverImage) {
                const formData = new FormData();
                formData.append("coverImage", coverImageRef.current.files[0]);
                res = await axiosInstance.patch("/user/update-coverImage", formData)
                toast.success("Cover Image updated!")
                setCoverImagePopup(false)
                window.location.reload();
                return 0;
            }
            toast.success("Details updated!")
            setEditProfilePopup(false)
            window.location.reload();
        }
        catch (err) {
            console.log(err)
            setError(res?.data?.data?.message)
        }
    }
    const handleDetailsChange = (e, filetype) => {
        saveRef.current.style.background = "#59168b";
        if (filetype === 'avatar') {
            const file = e.target.files[0];
            const tempUrl = URL.createObjectURL(file)
            setUserUpdateDetails(prev => ({ ...prev, avatar: tempUrl }))
            return 0;
        } else if (filetype === 'coverImage') {
            const file = e.target.files[0];
            const tempUrl = URL.createObjectURL(file)
            setUserUpdateDetails(prev => ({ ...prev, coverImage: tempUrl }))
            return 0;
        }
        setUserUpdateDetails(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const handleImage = (filetype) => {
        if (filetype === 'avatar') {
            avatarRef.current.click();
            return 0;
        } else if (filetype === 'coverImage') {
            coverImageRef.current.click();
            return 0;
        }

    }
    return (
        <>
            <Navbar />
            <Sidebar />
            {
                showAvatar &&
                <>
                    <div className="fixed w-screen h-screen z-100 bg-black/80 flex justify-center items-center" onClick={() => setShowAvatar(false)}>
                        <div className="w-1/4 h-1/4 flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}>
                            <img src={userProfile.avatar} alt="avatar" />
                        </div>
                    </div>
                </>
            }
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
            {
                editProfilePopup &&
                <>
                    <div className="w-screen h-screen bg-black/80 fixed z-100 flex justify-center items-center"
                        onClick={() => setEditProfilePopup(false)}>
                        <div className="h-fit w-11/12 sm:w-130 md:w-150 p-5 text-gray-200 font-figtree font-extrabold rounded-lg flex flex-col justify-center items-center backdrop-blur-sm bg-white/30 border-1 border-white/20 gap-4 hide-scrollbar overflow-x-scroll"
                            onClick={(e) => e.stopPropagation()}>
                            <span className="text-xl md:text-3xl cursor-default pt-4 text-white">
                                Update your profile
                            </span>
                            <div className="relative">
                                <img src={userUpdateDetails?.avatar} alt="avatar" className="rounded-full object-cover w-28 h-28 " />
                                <RiPencilFill
                                    className="absolute top-20 right-0 bg-black/50 rounded p-2 w-fit h-fit hover:bg-black"
                                    onClick={() => handleImage("avatar")}
                                />
                                <input type="file" accept=".jpg,.jpeg,.png"
                                    ref={avatarRef} className="hidden"
                                    onChange={(e) => handleDetailsChange(e, "avatar")} />
                            </div>
                            <div className="w-full flex justify-start gap-2 md:gap-4 flex-col text-sm sm:text-base p-3">
                                <span className="font-medium gap-1 flex flex-col justify-start items-start w-full">
                                    <span>Name</span>
                                    <input
                                        type="text"
                                        className="outline-none bg-white/10 border-white/10 border backdrop-blur-2xl  rounded p-1 flex justify-between w-full"
                                        value={userUpdateDetails.fullName} name="fullName"
                                        onChange={(e) => handleDetailsChange(e, null)} />
                                </span>
                                <span className="font-medium gap-1 flex flex-col justify-start items-start w-full">
                                    <span>Email</span>
                                    <input
                                        type="text"
                                        className="outline-none bg-white/10 border-white/10 border backdrop-blur-2xl  rounded p-1 flex justify-between w-full"
                                        value={userUpdateDetails.email}
                                        name="email"
                                        onChange={(e) => handleDetailsChange(e, null)} />
                                </span>
                                {
                                    error &&
                                    <span className="text-red-800 text-base font-light w-full rounded h-10 flex justify-center items-center ">
                                        <MdError />
                                        {error}
                                    </span>
                                }
                            </div>
                            <span ref={saveRef} className="p-2 bg-purple-400 rounded-lg cursor-pointer border-1 border-black/30 text-white hover:bg-purple-500"
                                onClick={updateDetails}>
                                Save Changes
                            </span>
                            <span className="text-sm font-light">Note: Username cannot be changed.</span>
                        </div>
                    </div>
                </>
            }
            {
                coverImagePopup &&
                <>
                    <div className="w-screen h-screen bg-black/80 fixed z-100 flex justify-center items-center"
                        onClick={() => setCoverImagePopup(false)}>
                        <div className="h-fit w-11/12 sm:w-130 md:w-150 p-5 text-gray-200 font-figtree font-extrabold rounded-lg flex flex-col justify-center items-center backdrop-blur-sm bg-white/30 border-1 border-white/20 gap-4 hide-scrollbar overflow-x-scroll"
                            onClick={(e) => e.stopPropagation()}>
                            <span className="text-xl md:text-3xl cursor-default pt-4 text-white">
                                Update your Cover Image
                            </span>
                            <div className="relative">
                                <RiPencilFill
                                    className="absolute top-1 right-1 bg-black/50 rounded p-2 w-fit h-fit hover:bg-black"
                                    onClick={() => handleImage("coverImage")}
                                />
                                {
                                    userUpdateDetails?.coverImage ? (
                                        <img src={userUpdateDetails?.coverImage} alt="coverImage" className="w-fit h-3/4 " />

                                    ) : (
                                        <span>No cover image</span>
                                    )
                                }
                                <input type="file" accept=".jpg,.jpeg,.png"
                                    ref={coverImageRef} className="hidden"
                                    onChange={(e) => handleDetailsChange(e, "coverImage")}
                                />
                            </div>
                            <span ref={saveRef} className="p-2 bg-purple-400 rounded-lg cursor-pointer border-1 border-black/30 text-white hover:bg-purple-500"
                                onClick={updateDetails}>
                                Save Changes
                            </span>
                        </div>
                    </div>
                </>
            }


            <div className="bg-black h-screen text-lg text-white w-screen font-figtree pt-15 pb-5 sm:pt-20 overflow-x-hidden hide-scrollbar ">
                <div className="w-full md:px-5 md:pl-15">
                    <div className="rounded-b-md flex justify-center items-center w-screen bg-black ">
                        {
                            userProfile.ownProfile &&
                            <RiPencilFill className="absolute top-17 sm:top-22 right-1 sm:right-3 bg-black/50 rounded p-2 w-fit h-fit hover:bg-black" onClick={() => setCoverImagePopup(true)} />
                        }
                        {
                            userProfile.coverImage ? (
                                <img
                                    src={userProfile?.coverImage} alt="coverimage"
                                    className="object-cover w-full h-20 sm:h-25 md:h-30 lg:h-40 xl:h-45 bg-white/10" />

                            ) : (
                                <div
                                    className="object-cover w-full h-20 sm:h-25 md:h-30 lg:h-40 xl:h-45 flex justify-center items-center bg-white/10">
                                </div>
                            )
                        }
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 w-full h-fit sm:h-30 gap-3 md:gap-5 lg:pt-10">
                        <div className="flex justify-start items-center md:gap-2  w-fit md:w-8/12">
                            <img src={userProfile.avatar} alt="avatar" className="w-20 h-20 xl:w-30 xl:h-30 object-cover rounded-full border-2 border-white/20 cursor-pointer" onClick={() => setShowAvatar(!showAvatar)} />
                            <div className="flex flex-col justify-center items-start h-fit p-2">
                                <span className="text-sm sm:text-2xl md:text-3xl w-fit line-clamp-3 text-white">{userProfile.fullName} <span className="text-xs sm:text-sm text-gray-400">@{userProfile.username}</span></span>
                                <span className="text-xs sm:text-sm text-gray-400">Joined on {joinedOn}</span>
                                <span className="text-sm sm:text-base">{userProfile.subscriberCount} subscribers</span>
                            </div>
                        </div>
                        <div className="flex justify-end items-center gap-2 h-fit w-full sm:w-fit md:w-4/12">
                            <div className="transition-all duration-150 ease-in-out bg-purple-800 p-2 px-2 sm:p-3 sm:px-4 w-full sm:w-fit flex justify-center text-xs sm:text-base items-center rounded hover:bg-purple-900 cursor-pointer font-figtree font-bold "
                                onClick={() => userProfile.isSubscribed ? (handleSubscription("unsubscribe")) : handleSubscription("subscribe")}>
                                {userProfile.isSubscribed ? ("Unsubscribe") : ("Subscribe")}
                            </div>
                            {userProfile.ownProfile &&
                                <div className="transition-all duration-150 ease-in-out bg-purple-800 p-2 px-2 sm:p-3 sm:px-4 w-full sm:w-fit flex justify-center text-xs sm:text-base items-center rounded hover:bg-purple-900 cursor-pointer font-figtree font-bold "
                                    onClick={() => setEditProfilePopup(!editProfilePopup)}>
                                    Edit Profile
                                </div>
                            }
                        </div>
                    </div>
                    <div className="p-2">
                        <span className="flex justify-center items-center w-full h-fit font-figtree font-extrabold text-4xl pb-2">
                            {
                                (userProfile.videos?.length === 0) ?
                                    (
                                        <>
                                            <div className="text-lg md:text-2xl flex flex-col items-center justify-center">
                                                <span>No videos</span>
                                                <img src="/assets/no-videos.png" alt="no-videos" className="w-fit h-50 md:h-70" />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            Videos
                                        </>
                                    )
                            }
                        </span>
                        <div className="flex justify-center items-center w-full">
                            <div className="w-full grid grid-cols-1 gap-2 h-fit place-items-center md:gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 rounded-2xl">
                                {Array.isArray(userProfile?.videos) && [...(userProfile?.videos)]?.reverse().map((video) => (
                                    <CardProfile
                                        key={video._id}
                                        username={userProfile.username}
                                        videoId={video._id}
                                        channelName={userProfile.fullName}
                                        avatar={userProfile.avatar}
                                        title={video.title}
                                        thumbnail={video.thumbnail}
                                        viewCount={video.views}
                                        date={video.createdAt.split('T')[0].split('-').reverse().join('-')}
                                        onClick={() => handleClick(video._id)}
                                        ownProfile={userProfile.ownProfile} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div >
            </div>
        </>
    )

}

export default Profile;