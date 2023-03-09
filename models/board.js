const mongoose = require('mongoose')

const boardSchema = new mongoose.Schema({
        title:{
            type: String,
            required: false
        }
        ,
        index:{
            type: Number,
            required: false
        },
       

}, {timestamps: true})

module.exports = mongoose.model("Board", boardSchema)
