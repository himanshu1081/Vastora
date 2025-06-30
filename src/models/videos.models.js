import mongoose, { Schema } from "mongoose";

const videoSchema = mongoose.Schema({
    videoFile: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    thumbnail: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    views: {
        type: Number,
        default:0,
    },
    isPublished: {
        type: Boolean,
        default:true
    }
}, {
    timestamps: true
}
)
export const Video = mongoose.model("Video",videoSchema)