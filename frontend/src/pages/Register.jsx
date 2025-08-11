import { useMemo, useState } from "react";
import Animation from "../components/Animation.jsx";
import Stepper, { Step } from '../components/Stepper.jsx';
import BlurText from "../components/BlurTexts.jsx";
import axiosInstance from "../util/axiosIntance.js"
import { useNavigate } from "react-router-dom";
import { LiaCloudUploadAltSolid } from "react-icons/lia";

function Register() {

    const [avatar, setAvatar] = useState(null)
    const [coverImage, setCoverImage] = useState(null)
    const [errMessage, setErrMessage] = useState(null)
    const navigate = useNavigate();

    var size;
    if (innerWidth <= 450) {
        size = 10
    } else {
        size = 40
    }

    const memoAnimation = useMemo(() => (
        <Animation size={8} elements={size} />
    ), [])

    const [form, setForm] = useState({
        fullName: "",
        username: "",
        email: "",
        password: ""
    })

    const handleImage = (e, filename) => {
        const file = e.target.files[0];
        if (!file) return;

        if (filename === "avatar") {
            setAvatar(file);
        } else if (filename === "coverImage") {
            setCoverImage(file);
        } else {
            console.warn("Unknown filename key:", filename);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }



    const sumbitForm = async () => {
        if (!avatar) {
            setErrMessage("Please upload avatar ");
            return;
        }
        const formData = new FormData();
        formData.append("fullName", form.fullName);
        formData.append("username", form.username);
        formData.append("email", form.email);
        formData.append("password", form.password);
        if (avatar) formData.append("avatar", avatar);
        if (coverImage) formData.append("coverImage", coverImage);
        try {
            const res = await axiosInstance.post("/user/register", formData)
            console.log(res)

            navigate("/login")
        } catch (err) {
            console.log("Message : ", err)
            console.log(err.response?.data)
            setErrMessage(err.response?.data?.message)
            setTimeout(() => {
                setErrMessage(null)
            }, 10000);
        }
    }
    return (
        <>
            <div className="w-screen h-screen fixed bg-black z-0">
                {memoAnimation}
            </div>
            <div className="w-screen h-screen z-1 bg-black/30 backdrop-blur-md fixed font-figtree text-white flex justify-center items-center ">
                <Stepper
                    initialStep={1}
                    onFinalStepCompleted={sumbitForm}
                    backButtonText="Previous"
                    nextButtonText="Next"
                >
                    <Step >
                        <BlurText
                            text="Welcome to Vastora"
                            delay={150}
                            animateBy="words"
                            direction="bottom"

                            className="text-2xl"
                        />
                        <p>Start registering on next page!</p>
                    </Step>
                    <Step>
                        <h2>How about some input?</h2>
                        <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Your name?"
                            className="transition-all duration-200 bg-black/20 backdrop-blur-md rounded p-1 md:w-3/4 hover:bg-black/30"
                        />
                        <input name="username" value={form.username} onChange={handleChange} placeholder="Username"
                            className="transition-all duration-200 bg-black/20 backdrop-blur-md rounded p-1 md:w-3/4 hover:bg-black/30"
                        />
                        <input name="email" value={form.email} onChange={handleChange} placeholder="Email?"
                            className="transition-all duration-200 bg-black/20 backdrop-blur-md rounded p-1 md:w-3/4 hover:bg-black/30"
                        />
                        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password"
                            className="transition-all duration-200 bg-black/20 backdrop-blur-md rounded p-1 md:w-3/4 hover:bg-black/30"
                        />
                    </Step>
                    <Step>
                        <div className="flex justify-center items-center flex-col">
                            <label className="flex w-full h-fit justify-center items-center  rounded-lg">
                                <span className="rounded transition-all duration-100 ease-in bg-white/20 flex p-3 w-4/4 justify-center items-center gap-2 font-bold cursor-pointer hover:bg-purple-500 hover:scale-105">
                                    <LiaCloudUploadAltSolid />
                                    Upload Avatar
                                </span>
                                <input type="file" accept="image/*" onChange={(e) => handleImage(e, "avatar")}
                                    className="hidden"
                                />
                            </label>

                            {avatar &&
                                <img src={URL.createObjectURL(avatar)}
                                    style={{ width: "200px", marginTop: "10px" }}
                                    className="max-w-xs rounded-md shadow-lg h-fit"
                                />
                            }
                        </div>
                    </Step>
                    <Step>
                        <div className="flex justify-center items-center flex-col">
                            <label className="flex w-full h-fit justify-center items-center  rounded-lg">
                                <span className="rounded transition-all duration-100 ease-in bg-white/20 flex p-3 w-4/4 justify-center items-center gap-2 font-bold cursor-pointer hover:bg-purple-500 hover:scale-105">
                                    <LiaCloudUploadAltSolid />
                                    Upload Cover
                                </span>
                                <input type="file" accept="image/*" onChange={(e) => handleImage(e, "coverImage")}
                                    className="hidden"
                                />
                            </label>

                            {coverImage &&
                                <div>
                                    <img src={URL.createObjectURL(coverImage)} style={{ width: "200px", marginTop: "10px" }} className="max-w-xs rounded-md shadow-lg h-fit" />
                                </div>}
                        </div>
                    </Step>
                    <Step>
                        {
                            errMessage &&
                            <div className="text-red-600">
                                {errMessage}
                            </div>
                        }
                        <h2>Final Step</h2>
                        <p>You made it!</p>
                    </Step>
                </Stepper>
            </div>
        </>
    )
}

export default Register;