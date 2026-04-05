const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");

const Blog = require("./models/blog");
const Comment = require("./models/Comment");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// DB
mongoose.connect("mongodb://127.0.0.1:27017/blogApp")
.then(()=>console.log("DB Connected"))
.catch(err=>console.log(err));

// HOME
app.get("/", (req,res)=>{
    res.redirect("/blogs");
});

// READ + SEARCH (FIXED)
app.get("/blogs", async (req,res)=>{
    let search = req.query.search?.trim() || "";

    let query = {};
    if (search !== "") {
        query.title = { $regex: search, $options: "i" };
    }

    let blogs = await Blog.find(query);
    let comments = await Comment.find();

    res.render("index", { blogs, comments, search });
});

// NEW
app.get("/blogs/new", (req,res)=>{
    res.render("new");
});

// CREATE
app.post("/blogs", async (req,res)=>{
    let { title, content, author } = req.body;
    await Blog.create({ title, content, author });
    res.redirect("/blogs");
});

// EDIT
app.get("/blogs/:id/edit", async (req,res)=>{
    let blog = await Blog.findById(req.params.id);
    res.render("edit", { blog });
});

// UPDATE
app.put("/blogs/:id", async (req,res)=>{
    let { title, content, author } = req.body;
    await Blog.findByIdAndUpdate(req.params.id, {
        title, content, author
    });
    res.redirect("/blogs");
});

// DELETE
app.delete("/blogs/:id", async (req,res)=>{
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect("/blogs");
});

// LIKE
app.post("/blogs/:id/like", async (req,res)=>{
    await Blog.findByIdAndUpdate(req.params.id, {
        $inc: { likes: 1 }
    });
    res.redirect("/blogs");
});

// COMMENT
app.post("/blogs/:id/comment", async (req,res)=>{
    await Comment.create({
        text: req.body.text,
        blogId: req.params.id
    });
    res.redirect("/blogs");
});

app.listen(8080, ()=>{
    console.log("Server running on port 8080");
});