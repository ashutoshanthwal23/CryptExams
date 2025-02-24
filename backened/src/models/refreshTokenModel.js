import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const RefreshToken =  mongoose.model('RefreshToken', refreshTokenSchema)
export default RefreshToken;