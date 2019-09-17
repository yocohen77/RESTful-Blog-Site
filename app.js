var bodyParser = require("body-parser"),
mongoose       = require("mongoose"),
express        = require("express"),
app            = express();

// app config
mongoose.connect("mongodb://localhost:27017/restful_blog", { useNewUrlParser:true, useUnifiedTopology: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// mongoose/model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// restful routes

app.get("/blogs", function(req, res){
    res.render("index");
});
app.listen(3006, function(){
    console.log("RESTful Blog is listenning on port 3000...");
})