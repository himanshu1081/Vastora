const Card = ({ channelName, avatar, title, viewCount, thumbnail }) => {
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
    return (
        <>
            <div
                className="transition-all duration-100 ease-in w-3/4 sm:w-full md:w-full border-2 border-white/20 backdrop-blur-2xl  bg-[#0b0b0b] text-white rounded-2xl p-2 scale-100 hover:scale-103 hover:bg-[#8200db]/10">
                <div className="aspect-video w-full rounded-lg overflow-hidden border-2 border-black/20 backdrop-blur-2xl ">
                    <img src={thumbnail} alt="thumbnail"
                        className="rounded-lg object-cover"
                    />
                </div>
                <div className="flex gap-2 w-full p-1">
                    <div className="flex justify-start items-baseline w-12">
                        <img src={avatar} alt="avatar"
                            className="h-10 w-10 rounded-full"
                        />
                    </div>
                    <div
                        className="flex flex-col justify-start items-baseline text-base 
                        w-full h-17 min-w-0">
                        <span
                            className="w-full line-clamp-2 ">
                            {title}
                        </span>
                        <div
                            className="flex justify-between items-center w-full text-sm text-gray-400">
                            <span className="w-full line-clamp-1 ">{channelName}</span>
                            <span>{views()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Card