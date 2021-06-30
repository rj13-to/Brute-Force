var express =require("express");
var app=express();
var mongoose=require("mongoose");
var bodyParser =require("body-parser");
var path=require("path");
const { stringify } = require("querystring");
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost/bruteForce",{ useNewUrlParser: true , useUnifiedTopology: true })
.then(()=> console.log("data base connection succesfull!!! "))
.catch((err)=> console.log(err));
app.use(express.static("public"));

var gcoachings= mongoose.Schema({
    name     : String,
    type     : String,
    country  : String,
    state    : String,
    district : String,
    city     : String,
});
var coachings= mongoose.Schema({
    name     : String,
    type     : String,
    country  : String,
    state    : String,
    district : String,
    city     : String,
    review   : String,
});

var coaching   = mongoose.model('coaching', coachings);
var gcoaching   = mongoose.model('gcoaching', gcoachings);


app.get("/",function(req,res){
    res.render("home.ejs");
})
app.get("/logedin",function(req,res){
    res.render("loghome.ejs");
})
app.get("/sellbook",function(req,res){
    res.render("sellbook.ejs");
})
app.get("/sellstuff",function(req,res){
    res.render("sellstuff.ejs");
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
app.get("/getbr",function(req,res){
    res.render("getbr.ejs");
})

// coaching review  secion 
app.get("/creviewadd",function(req,res){
    res.render("creviewadd.ejs");
})

app.post("/creviewadd",function(req,res){
    coaching.create(req.body,function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render("loghome.ejs");
        }
    }) 
})
app.get("/creviewshow",function(req,res){
    coaching.find((req.body),function(err,ans){
        if(err) console.warn(err);
        else{
             res.render("creviewshow",{ans:ans});
        }
    })
})
app.post("/creviewshowadd",function(req,res){
    coaching.find((req.body),function(err,ans){
        if(err) console.warn(err);
        else{
             res.render("creviewshow",{ans:ans});
        }
    })
})
// get coaching reviews section 


app.get("/getcr",function(req,res){
    res.render("getcr.ejs");
})

app.post("/getcr",function(req,res){
    gcoaching.create(req.body,function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log(req.body);
            res.render("loghome.ejs");
        }
    }) 
})


app.get("*",function(req,res){
    res.render("home.ejs");
})
app.listen(3000,function(){
    console.log("server started!!!");
})