var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
mongoose       = require("mongoose"),
express        = require("express"),
app            = express();

// app config
mongoose.connect("mongodb://localhost:27017/restful_blog", { useNewUrlParser:true, useUnifiedTopology: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// mongoose/model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// restful routes


// INDEX
app.get("/", function(req ,res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!");
        } else {
            res.render("index", {blogs: blogs});
        }
    })
});

// NEW & CREATE
app.get("/blogs/new", function(req, res){
    res.render("new");
});

app.post("/blogs", function(req, res){
    /*
        since we named the form variables as part of a blog object ie blog[title], we can simply pass blog directly from body using body-parser
    */
    Blog.create(req.body.blog, function(err, newPost){
        if(err) {
            console.log("error creating new post!");
            res.render("new");
        } else {
            console.log("success");
            res.redirect("/blogs");
        }
    });
});

// SHOW
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog})
        }
    });
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    // we pass the id of the blog, the blog object itself, and a callback function
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            console.log(err);
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    // destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs/" + req.params.id);
        } else {
            res.redirect("/blogs");
        }
    })
    // redirect
})

app.listen(3006, function(){
    console.log("RESTful Blog is listenning on port 3000...");
});