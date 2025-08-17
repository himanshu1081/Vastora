const Card2 = ({ channelName, avatar, title, viewCount, thumbnail, onClick ,date }) => {


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
            <div onClick={onClick}
                className="transition-all duration-100 ease-in w-full border-2 border-white/20 backdrop-blur-2xl bg-[#0b0b0b] text-white rounded-2xl p-2 scale-100 hover:scale-103 hover:bg-[#8200db]/10 cursor-pointer">
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
                        className="flex flex-col justify-start items-baseline text-base 
                        w-full h-13 md:h-17 min-w-0">
                        <span
                            className="w-full line-clamp-1 md:line-clamp-2">
                            {title}
                        </span>
                         <div
                            className="flex justify-between items-center w-full ">
                            <span className="">{views()} views</span>
                            {date}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Card2