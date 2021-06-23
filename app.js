var express =require("express");
var app=express();
var mongoose=require("mongoose");
var bodyParser =require("body-parser");
var path=require("path");
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost/bookOcean",{ useNewUrlParser: true , useUnifiedTopology: true })
.then(()=> console.log("data base connection succesfull!!! "))
.catch((err)=> console.log(err));
app.use(express.static("public"));
// post routes ends
app.get("/",function(req,res){
    res.render("home.ejs");
})
app.get("/logedin",function(req,res){
    res.render("loghome.ejs");
})
app.get("*",function(req,res){
    res.render("home.ejs");
})

app.listen(3000,function(){
    console.log("server started!!!");
})