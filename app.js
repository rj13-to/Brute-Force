var express =require("express");
var app=express();
var mongoose=require("mongoose");
var bodyParser =require("body-parser");
var path=require("path");
const { stringify } = require("querystring");
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost/bookOcean",{ useNewUrlParser: true , useUnifiedTopology: true })
.then(()=> console.log("data base connection succesfull!!! "))
.catch((err)=> console.log(err));
app.use(express.static("public"));
// schema's start
/* var bblog = mongoose.Schema({
    user   : String,
    topic  : String,
    votes  : Number,
    year   : Number,
});
var rreview = mongoose.Schema({
    book    : String,
    answer  : Boolean,
    user    : String,
    votes   : Number,
    cat     : String, 
});
var bbooks = mongoose.Schema({
    user     : String,
    country  : String,
    state    : String,
    district : String,
    local    : String,
    reviews  : String,
    cat      : [ccat],
});
var uuser =  mongoose.Schema({
    email    : String,
    username : String,
    password : String,
    sellbook : [bbooks],
    wishlist : [bbooks],
    blog     : [bblog], 
});

var cat    = mongoose.model('cat',    ccat);
var blog   = mongoose.model('blog',   bblog);
var review = mongoose.model('review', rreview);
var book   = mongoose.model('book',   bbooks);
var user   = mongoose.model('user',   uuser);
 */
// routes starts

app.get("/",function(req,res){
    res.render("ushome.ejs");
})
app.get("/logedin",function(req,res){
    res.render("loghome.ejs");
})
app.get("/preengadd",function(req,res){
    res.render("preengadd.ejs");
})
app.get("/postengadd",function(req,res){
    res.render("postengadd.ejs");
})
app.get("/coreadd",function(req,res){
    res.render("coreadd.ejs");
})
app.get("/noncoreadd",function(req,res){
    res.render("noncoreadd.ejs");
})
app.get("/breviewadd",function(req,res){
    res.render("breviewadd.ejs");
})
app.get("/creviewadd",function(req,res){
    res.render("creviewadd.ejs");
})
app.get("*",function(req,res){
    res.render("home.ejs");
})

app.listen(3000,function(){
    console.log("server started!!!");
})