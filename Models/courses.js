const mongoose = require('mongoose')
const schema = mongoose.Schema


const Course = new schema({
    courseInstructor: {
        type: String,
        require: true
    },
    courseCredits: {
        type: Number,
        require: true
    },
    courseID: {
        type: String,
        require: true
    },
    courseName: {
        type: String,
        require: true
    },
    dateEntered: {
        type: Date,
        default: Date.now
    }
})

mongoose.model('Course', Course)