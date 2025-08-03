import { Navbar } from "./Navbar";
import Sidebar from "./Sidebar";
import { motion } from "motion/react"

function Animation({ size, elements }) {
    var animation = [];
    for (var i = 0; i < elements; i++) {
        var xValues = []
        var yValues = []
        if (window.innerWidth <= 450) {
            xValues.push(window.innerWidth/2)
            yValues.push(window.innerHeight/2)
            for (var j = 1; j < size; j++) {
                xValues.push(Math.floor(Math.random() * 300))
                yValues.push(Math.floor(Math.random() * 700))
            }
        } else {
            xValues.push(window.innerWidth/2)
            yValues.push(window.innerHeight/2)
            
            for (var j = 1; j < size / 2; j++) {
                xValues.push(Math.floor(Math.random() * 1576)) //.9
                yValues.push(Math.floor(Math.random() * 800)) // .1*360 = 57 or .9*360=340 
            }
        }
        const xFirst = xValues[0]
        const yFirst = yValues[0]
        xValues.push(xFirst)
        yValues.push(yFirst)
        animation.push(
            <motion.div key={i}
                className="bg-purple-500 w-10 h-10 absolute"
                animate={{
                    x: xValues,
                    y: yValues
                }}
                transition={{ duration: 20, repeat: Infinity, ease: 'anticipate' }}
            >
            </motion.div>
        )
    }
    return (
        <>
            {animation}
        </>
    )
}

export default Animation;