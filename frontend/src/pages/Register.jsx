import { useMemo } from "react";
import Animation from "../components/Animation";

function Register() {

    var size;
    if (innerWidth <= 450) {
        size = 10
    } else {
        size = 40
    }

    const memoAnimation = useMemo(() => (
        <Animation size={8} elements={size} />
    ), [])



    return (
        <>
            <div className="w-screen h-screen fixed bg-black z-0">
                {memoAnimation}
            </div>
            <div className="w-screen h-screen z-1 bg-black/30 backdrop-blur-md fixed">

            </div>
        </>
    )
}

export default Register;