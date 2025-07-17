import ffprobeStatic from "ffprobe-static";
import ffprobe from "ffprobe";

const videoInfo = async (filePath) => {
    try {
        const info = await ffprobe(filePath, { path: ffprobeStatic.path });
        return info;
    } catch (err) {
        return null;
    }
}

export { videoInfo }