const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    text: String,
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Comment", commentSchema);