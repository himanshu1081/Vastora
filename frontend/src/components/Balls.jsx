import { Navbar } from "./Navbar";
import Sidebar from "./Sidebar";
import { motion } from "motion/react"

function Balls({ xValues, yVlaues,color }) {
    return (
        <>
            <div className="z-22 w-screen h-screen">
                <motion.div
                    className={`w-40 h-40 rounded-full ${color}`}
                    animate={{
                        x: xValues,
                        y: yVlaues
                    }}

                    transition={{ duration: 7, repeat: Infinity, ease: 'anticipate' }}
                >

                </motion.div>
            </div>
        </>
    )
}

export default Balls;