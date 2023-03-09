const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
        title:{
            type: String,
            required: false
        }
        ,
        index:{
            type: Number,
            required: false
        },
        username:{
            type: String,
            required: false
        },
        task: {
            type: String,
            required: false,
            
        },
        reward: {
            type: String,
            required: false,
        },
        isCompleted: {
            type: Boolean,
            required: false,
        }

}, {timestamps: true})

module.exports = mongoose.model("Task", taskSchema)
