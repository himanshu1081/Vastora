import mongoose, { Schema } from "mongoose";

const comment = mongoose.Schema({
    content: {
        type: String,
        trim: true
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    owner: {
        type:Schema.Types.ObjectId,
        ref:"User"
    }
}, { timestamps: true })

export const Comment = mongoose.model("Comment",comment);