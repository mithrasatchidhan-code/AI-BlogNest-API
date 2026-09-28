const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

const filePath = "./data/blogs.json";

// GET all blogs
app.get("/api/blogs", (req, res) => {
    const blogs = JSON.parse(fs.readFileSync(filePath));
    res.json(blogs);
});

// GET one blog
app.get("/api/blogs/:id", (req, res) => {
    const blogs = JSON.parse(fs.readFileSync(filePath));

    const blog = blogs.find(b => b.id === parseInt(req.params.id));

    if (!blog) {
        return res.status(404).json({
            message: "Blog not found"
        });
    }

    res.json(blog);
});

// CREATE blog
app.post("/api/blogs", (req, res) => {
    const blogs = JSON.parse(fs.readFileSync(filePath));

    const newBlog = {
        id: blogs.length + 1,
        title: req.body.title,
        author: req.body.author,
        content: req.body.content
    };

    blogs.push(newBlog);

    fs.writeFileSync(filePath, JSON.stringify(blogs, null, 2));

    res.status(201).json({
        message: "Blog created successfully",
        blog: newBlog
    });
});

// UPDATE blog
app.put("/api/blogs/:id", (req, res) => {
    const blogs = JSON.parse(fs.readFileSync(filePath));

    const index = blogs.findIndex(
        b => b.id === parseInt(req.params.id)
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Blog not found"
        });
    }

    blogs[index] = {
        id: blogs[index].id,
        title: req.body.title,
        author: req.body.author,
        content: req.body.content
    };

    fs.writeFileSync(filePath, JSON.stringify(blogs, null, 2));

    res.json({
        message: "Blog updated successfully",
        blog: blogs[index]
    });
});

// DELETE blog
app.delete("/api/blogs/:id", (req, res) => {
    const blogs = JSON.parse(fs.readFileSync(filePath));

    const index = blogs.findIndex(
        b => b.id === parseInt(req.params.id)
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Blog not found"
        });
    }

    const deletedBlog = blogs.splice(index, 1);

    fs.writeFileSync(filePath, JSON.stringify(blogs, null, 2));

    res.json({
        message: "Blog deleted successfully",
        blog: deletedBlog[0]
    });
});

// Home
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to AI BlogNest API"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`AI BlogNest API is running on http://localhost:${PORT}`);
});
