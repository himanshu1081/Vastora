import mongoose, { Schema } from "mongoose"

const likes = mongoose.Schema({
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    toggledBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    likeToggle: {
        type: String,
        trim: true,
        lowercase: true,
        enum: ["like", "dislike"]
    }
}, { timestamps: true });

export const Likes = mongoose.model("Likes", likes);