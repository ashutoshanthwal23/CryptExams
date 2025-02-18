import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        minLength: 6,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["teacher", "student"],
        default: "teacher"
    },
    rollNumber: {
        type: String,
    },
    groupsList: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Group'
            }
        ],
        required: false,
        default: []
    }
})

const User = mongoose.model("User", userSchema);
export default User;