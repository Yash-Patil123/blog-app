const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        default: "Anonymous"
    },
    likes: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Blog", blogSchema);