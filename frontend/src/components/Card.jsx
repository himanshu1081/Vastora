import { useNavigate } from "react-router-dom"

const Card = ({ username, channelName, avatar, title, viewCount, thumbnail, date, onClick }) => {


    const views = () => {
        if (viewCount > 999999999) {
            const result = viewCount / 1000000000
            return result.toFixed(1) + "B"
        } else if (viewCount > 999999) {
            const result = viewCount / 100000
            return result.toFixed(1) + "M"
        } else if (viewCount > 999) {
            return Math.floor(viewCount / 1000) + "K"
        } else {
            return viewCount
        }
    }

    const navigate = useNavigate();

    return (
        <>
            <div onClick={onClick}
                className="transition-all duration-50 md:h-4/4 w-11/12 sm:w-full md:w-full border-2 border-white/20 backdrop-blur-2xl bg-[#0b0b0b] text-white rounded-2xl p-2 scale-100 hover:scale-101 hover:bg-[#8200db]/10 cursor-pointer">
                <div className="aspect-video w-full rounded-lg overflow-hidden border-2 border-black/20 backdrop-blur-2xl ">
                    <img src={thumbnail} alt="thumbnail"
                        className="rounded-lg object-contain"
                    />
                </div>
                <div className="flex gap-2 w-full p-1">
                    <div className=" flex justify-start items-baseline">
                        <img src={avatar}
                            alt="avatar"
                            className="object-cover h-6 w-8 md:h-10 md:w-12 rounded-full"
                        />
                    </div>
                    <div
                        className="flex flex-col justify-start items-baseline  
                        w-full h-fit gap-1 min-w-0 text-xs md:text-sm text-gray-400">
                        <div
                            className="w-full line-clamp-1 md:line-clamp-2 text-base text-white">
                            {title}
                        </div>
                        <span className="w-full line-clamp-1 hover:text-white" onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/profile/${username}`);
                        }}>
                            {channelName}
                        </span>
                        <div
                            className="flex justify-between items-center w-full ">
                            <span className="">{views()} views</span>
                            {date}
                        </div>
                        <div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Card