import Card from "../components/Card.jsx";
import { Navbar } from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

function Home() {
    return (
        <>
            <Sidebar />
            <Navbar />
            <div className="bg-black h-screen text-lg text-black w-screen font-figtree pt-15 pb-5 sm:pt-25 overflow-x-hidden hide-scrollbar ">
                <div className="w-full grid grid-cols-1 gap-2 md:gap-4 place-items-center sm:grid-cols-3 lg:grid-cols-4 sm:px-5 md:pl-20">
                    <Card
                        channelName={"Himanshu"}
                        avatar={"assets/default-avatar.png"}
                        title={"This is the title of the video | Himanshu Chaudhary dsafsdfsadsfsdfsdfsfdsfsdfsdfsdfsdfsdfsdsfsdf"}
                        viewCount={4745003430}
                        thumbnail={"assets/1.png"}
                    />
                    <Card
                        channelName={"Himanshu"}
                        avatar={"assets/default-avatar.png"}
                        title={"This is the title of the video | Himanshu Chaudhary dsafsdfsadsfsdfsdfsfdsfsdfsdfsdfsdfsdfsdsfsdf"}
                        viewCount={4745003430}
                        thumbnail={"assets/2.png"}
                    />
                    <Card
                        channelName={"Himanshu"}
                        avatar={"assets/default-avatar.png"}
                        title={"This is the title of the video | Himanshu Chaudhary "}
                        viewCount={4745003430}
                        thumbnail={"assets/1.png"}
                    />
                    <Card
                        channelName={"Himanshu"}
                        avatar={"assets/default-avatar.png"}
                        title={"This is the title of the video | Himanshu Chaudhary"}
                        viewCount={4745003430}
                        thumbnail={"assets/1.png"}
                    />
                    <Card
                        channelName={"Himanshu"}
                        avatar={"assets/default-avatar.png"}
                        title={"This is the title of the video | Himanshu Chaudhary dsafsdfsadsfsdfsdfsfdsfsdfsdfsdfsdfsdfsdsfsdf"}
                        viewCount={4745003430}
                        thumbnail={"assets/1.png"}
                    />
                    <Card
                        channelName={"Himanshu"}
                        avatar={"assets/default-avatar.png"}
                        title={"This is the title of the video | Himanshu Chaudhary dsafsdfsadsfsdfsdfsfdsfsdfsdfsdfsdfsdfsdsfsdf"}
                        viewCount={4745003430}
                        thumbnail={"assets/2.png"}
                    />
                    <Card
                        channelName={"Himanshu"}
                        avatar={"assets/default-avatar.png"}
                        title={"This is the title of the video | Himanshu Chaudhary "}
                        viewCount={4745003430}
                        thumbnail={"assets/1.png"}
                    />
                    <Card
                        channelName={"Himanshu"}
                        avatar={"assets/default-avatar.png"}
                        title={"This is the title of the video | Himanshu Chaudhary"}
                        viewCount={4745003430}
                        thumbnail={"assets/2.png"}
                    />
                    <Card
                        channelName={"Himanshu"}
                        avatar={"assets/default-avatar.png"}
                        title={"This is the title of the video | Himanshu Chaudhary dsafsdfsadsfsdfsdfsfdsfsdfsdfsdfsdfsdfsdsfsdf"}
                        viewCount={4745003430}
                        thumbnail={"assets/1.png"}
                    />
                    <Card
                        channelName={"Himanshu"}
                        avatar={"assets/default-avatar.png"}
                        title={"This is the title of the video | Himanshu Chaudhary dsafsdfsadsfsdfsdfsfdsfsdfsdfsdfsdfsdfsdsfsdf"}
                        viewCount={4745003430}
                        thumbnail={"assets/2.png"}
                    />
                    <Card
                        channelName={"Himanshu"}
                        avatar={"assets/default-avatar.png"}
                        title={"This is the title of the video | Himanshu Chaudhary "}
                        viewCount={4745003430}
                        thumbnail={"assets/1.png"}
                    />
                    <Card
                        channelName={"Himanshu"}
                        avatar={"assets/default-avatar.png"}
                        title={"This is the title of the video | Himanshu Chaudhary"}
                        viewCount={4745003430}
                        thumbnail={"assets/2.png"}
                    />
                </div>
            </div>
        </>
    )
}

export default Home;