import RotatingText from "../components/RotatingTexts.jsx";
import { useState, useMemo } from "react";
import Animation from "../components/Animation.jsx";
import { NavLink, useNavigate } from "react-router-dom"
import axiosInstance from "../util/axiosIntance.js";
import { login, } from "../features/authSlice.js";
import { useDispatch } from "react-redux";

function Login() {
    const naviagte = useNavigate();
    const dispatch = useDispatch()
    var size;
    if (innerWidth <= 450) {
        size = 20
    } else {
        size = 40
    }

    const [form, setForm] = useState({
        identifier: "",
        password: ""
    });

    const handleKey = (e) => {
        if (e.key == 'Enter') {
            handleLogIn()
        }
    }


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }
    const memoAnimation = useMemo(() => (
        <Animation size={8} elements={size} />
    ), []);

    const [errMessage, setErrMessage] = useState(null)

    const handleLogIn = async () => {
        try {
            const res = await axiosInstance.post("/user/login",
                {
                    identifier: form.identifier,
                    password: form.password
                }
            )
            
            const { _id, fullName, username, avatar, coverImage, email } = res?.data?.data?.userData;
            dispatch(login(
                { _id, fullName, username, avatar, coverImage, email }
            ))
            naviagte("/")
        }
        catch (err) {
            console.log("ERROR:", err);
            console.log("Response Data:", err.response?.data);
            setErrMessage(err.response?.data.message)
        }
    }

    return (
        <>
            <div className="fixed h-screen w-screen z-0 bg-black">
                {memoAnimation}
            </div>
            <div className="fixed bg-black/30 backdrop-blur-md w-screen h-screen flex flex-col justify-center items-center z-23 font-figtree gap-4">
                <div className="font-figtree text-white font-black flex justify-center items-center text-3xl sm:text-6xl gap-2">
                    <span >Vastora</span>
                    <RotatingText
                        texts={['Vibe', 'Cringe', 'Dope', 'Chan']}
                        mainClassName="px-2 sm:px-2 md:px-3 bg-purple-700 text-white overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                        staggerFrom={"last"}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-120%" }}
                        staggerDuration={0.025}
                        splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                        transition={{ type: "spring", damping: 30, stiffness: 400 }}
                        rotationInterval={2000}
                    />
                </div>
                <div
                    className="w-3/4 sm:w-100 h-fit sm:h-100 flex items-center justify-center flex-col backdrop-blur-md border border-white/40 drop-shadow-md/20  p-4 bg-white/30 rounded-xl text-white sm:gap-4">
                    <div
                        className="font-vcr text-4xl sm:text-6xl font-bold tracking-widest cursor-default">
                        VASTORA
                    </div>
                    <div type='form'
                        className="p-2 flex flex-col justify-center items-center w-full h-3/4 sm:h-25 m-2 text-black placeholder-black gap-3 sm:gap-5 text-base md:text-md font-inter">
                        <input
                            name="identifier"
                            type="text"
                            placeholder="Username or Email"
                            className="bg-white/50 shadow-sm shadow-black/50 w-full p-1 rounded-sm focus:outline-0"
                            onChange={handleChange} />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            className="w-full p-1 rounded-sm bg-white/50 shadow-sm shadow-black/50 focus:outline-0"
                            onChange={handleChange}
                            onKeyDown={handleKey} />
                    </div>

                    <span
                        className="transition-all duration-200 ease-in-out bg-purple-700 rounded p-2 w-full flex justify-center items-center font-bold shadow-sm shadow-black/30 md:bg-purple-500 md:hover:bg-purple-700 hover:cursor-pointer"
                        onClick={handleLogIn}

                    >
                        Log in
                    </span>
                    {errMessage &&
                        <div className="text-red-400">
                            {errMessage}
                        </div>
                    }
                    <p className="text-xs sm:text-sm w-full md p-2 m-2 text-gray-400 flex flex-col justify-center items-center sm:gap-1">
                        <span className="hover:cursor-default">Don't have an account?</span>
                        <NavLink to='/register' className="text-white "> Register now</NavLink>
                    </p>
                </div>
            </div>

        </>
    )
}

export default Login;