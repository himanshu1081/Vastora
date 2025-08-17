import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../util/axiosIntance";
import Card from "../components/Card";
import { useSelector } from "react-redux";
import toast from "react-hot-toast"


function Profile() {
    const [showAvatar, setShowAvatar] = useState(false)
    const [userProfile, setUserProfile] = useState({});
    const { username } = useParams();
    const [loginPopup, setLoginPopup] = useState(false);
    const { isLoggedIn } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const joinedOn = userProfile?.createdAt?.split('T')[0].split("-").reverse().join("-")

    useEffect(() => {
        const userDetails = async () => {
            const userInfo = await axiosInstance.get(`user/profile/${username}`)
            setUserProfile(userInfo?.data?.data)
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

    const editProfile = () => {

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

            <div className="bg-black h-screen text-lg text-white w-screen font-figtree pt-15 pb-5 sm:pt-20 overflow-x-hidden hide-scrollbar ">
                <div className="w-full md:px-5 md:pl-15">
                    <div className="rounded-b-md flex justify-center items-center w-screen bg-black">
                        {
                            userProfile.coverImage ? (
                                <img src={userProfile?.coverImage} alt="coverimage" className="object-cover w-full h-20 sm:h-25 md:h-30 lg:h-40 xl:h-45 bg-white/10" />

                            ) : (
                                <div className="object-cover w-full h-20 sm:h-25 md:h-30 lg:h-40 xl:h-45 flex justify-center items-center bg-white/10">

                                </div>
                            )
                        }
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-start sm:items-center p-3 w-full h-fit gap-3 md:gap-0 ">
                        <div className="flex justify-start items-center md:gap-2  w-fit md:w-8/12">
                            <img src={userProfile.avatar} alt="avatar" className="w-20 h-20 xl:w-30 xl:h-30 object-cover rounded-full border-2 border-white/20" onClick={() => setShowAvatar(!showAvatar)} />
                            <div className="flex flex-col justify-center items-start h-fit p-2">
                                <span className="text-sm sm:text-2xl md:text-3xl w-fit line-clamp-3 text-white">{userProfile.fullName} <span className="text-xs sm:text-sm text-gray-400">@{userProfile.username}</span></span>
                                <span className="text-xs sm:text-sm text-gray-400">Joined on {joinedOn}</span>
                                <span className="text-sm sm:text-base">{userProfile.subscriberCount} subscribers</span>
                            </div>
                        </div>
                        <div className="flex justify-end items-center gap-2 h-fit w-fit md:w-4/12">
                            <div className="transition-all duration-150 ease-in-out bg-purple-800 p-2 px-2 sm:p-3 sm:px-4 w-fit flex justify-center text-xs sm:text-base items-center rounded-4xl hover:bg-purple-900 cursor-pointer font-figtree font-bold "
                                onClick={() => userProfile.isSubscribed ? (handleSubscription("unsubscribe")) : handleSubscription("subscribe")}>
                                {userProfile.isSubscribed ? ("Unsubscribe") : ("Subscribe")}
                            </div>
                            <div className="transition-all duration-150 ease-in-out bg-purple-800 p-2 px-2 sm:p-3 sm:px-4 w-fit flex justify-center text-xs sm:text-base items-center rounded-4xl hover:bg-purple-900 cursor-pointer font-figtree font-bold "
                                onClick={() => editProfile}>
                                Edit Profile
                            </div>
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
                                                <img src="/public/assets/no-videos.png" alt="no-videos" className="w-fit h-50 md:h-70" />
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
                                {userProfile?.videos?.map((video) => (

                                    <Card
                                        key={video._id}
                                        channelName={userProfile.fullName}
                                        avatar={userProfile.avatar}
                                        title={video.title}
                                        thumbnail={video.thumbnail}
                                        viewCount={video.views}
                                        date={video.createdAt.split('T')[0].split('-').reverse().join('-')}
                                        onClick={() => handleClick(video._id)} />
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

// {
//     "_id": "68a243ddf016bd56bb589520",
//     "username": "rohitjoshi",
//     "email": "rohitjoshi@gmail.com",
//     "fullName": "rohit",
//     "avatar": "http://res.cloudinary.com/dkusz3kdi/image/upload/f_auto/v1755464664/puytekozbtesippnst7w.png",
//     "coverImage": "http://res.cloudinary.com/dkusz3kdi/image/upload/f_auto/v1755464668/lwaohkygrt7g3yswor51.png",
//     "createdAt": "2025-08-17T21:04:29.292Z",
//     "videos": [],
//     "subscriberCount": 0,
//     "subcribedCount": 1,
//     "isSubscribed": false,
//     "ownProfile": true
// }