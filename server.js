const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejsLayouts = require('express-ejs-layouts');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files
app.use(ejsLayouts); // Enable EJS layouts
app.set('view engine', 'ejs'); // Set EJS as the view engine

mongoose.connect(
    'mongodb+srv://vijaysreearun:Vijaysree@landofmagic.2mei9.mongodb.net/blogDB?retryWrites=true&w=majority'
)
.then(() => console.log("Connected to MongoDB Atlas"))
.catch(err => console.error("Failed to connect to MongoDB Atlas:", err));


// Schema for Blog Posts
const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    comments: [{ name: String, comment: String }],
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

// Routes
app.get('/', async (req, res) => {
    const posts = await Post.find();
    res.render('home', { title: 'Home - Laki Treasure Trove', posts: posts });
});

app.get('/post/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('post', { title: post.title, post: post });
});

app.get('/create', (req, res) => {
    res.render('create', { title: 'Create a New Post - Laki Treasure Trove' });
});

app.post('/create', async (req, res) => {
    const newPost = new Post({
        title: req.body.title,
        content: req.body.content,
        comments: [],
    });
    await newPost.save();
    res.redirect('/');
});

app.post('/post/:id/comment', async (req, res) => {
    const post = await Post.findById(req.params.id);
    post.comments.push({ name: req.body.name, comment: req.body.comment });
    await post.save();
    res.redirect(`/post/${req.params.id}`);
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

