import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    originalQuestionPaper: {
        type: String,
        required: true
    },
    encryptedQuestionPaper: {
        type: String,
        required: true
    },
    pdfPassword: {
        type: String,
        required: true
    },
    answerSubmit: [{
        rollNumber: {
            type: String,
            required: true
        },
        answerSheet: {
            type: String,
            required: true
        },
        submissionTime: {
            type: Date,
            default: Date.now
        },
        verified: {
            type: Boolean,
            default: false
        }
    }],
    shaKeySubmit: [{
        rollNumber: {
            type: String,
            required: true
        },
        key: {
            type: String,
            required: true
        },
        submissionTime: {
            type: Date,
            default: Date.now
        }
    }],
    sendMessageStatus: [{
        rollNumber: {
            type: String,
            required: true
        },
        uri: {
            type: String,
            required: true
        },
        sid: {
            type: String,
            required: true
        }
    }],
    sendMessageOneTime: {
        type: Boolean,
        default: false
    }

}, {timestamps: true})

const Test = mongoose.model('Test', testSchema);
export default Test;