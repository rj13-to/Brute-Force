var express               =   require("express");
var app                   =   express();
var mongoose              =   require("mongoose");
var bodyParser            =   require("body-parser");
var bcrypt                =   require("bcrypt");
var passport              =   require('passport');
var flash                 =   require('express-flash');
var session               =   require('express-session');
var path                  =   require("path");
var LocalStrategy         =   require("passport-local");
var passportLocalMongoose =   require("passport-local-mongoose")
var User                  =   require("./models/user")
var multer                =   require("multer");
const { stringify }       =   require("querystring");



app.set('view engine','ejs');
app.use(express.static("./pulic/uploads"));
var Storage =multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploads"); 
    },
    filename:(req,file,cb)=>{
        cb(null,file.filename+"_"+Date.now()+path.extname(file.originalname));
    }
});

var upload=multer({
    storage:Storage
}).single('img');

app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost/bruteForce",{ useNewUrlParser: true , useUnifiedTopology: true,useFindAndModify : false,useCreateIndex : true })
.then(()=> console.log("data base connection succesfull!!! "))
.catch((err)=> console.log(err));
app.use(express.static("public"));
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var gcoachings= mongoose.Schema({
    username : String,
    name     : String,
    type     : String,
    country  : String,
    state    : String,
    district : String,
    city     : String,
});
var coachings= mongoose.Schema({
    username : String,
    name     : String,
    type     : String,
    country  : String,
    state    : String,
    district : String,
    city     : String,
    review   : String,
});
var pregras =mongoose.Schema({
    username : String,
    title    : String,
    exam     : String,
    year     : Number,
    des      : String,
})
var postgras =mongoose.Schema({
    username : String,
    title    : String,
    exam     : String,
    year     : Number,
    des      : String,
}) 
var noncints =mongoose.Schema({
    username : String,
    title    : String,
    company : String,
    year     : Number,
    des      : String,
})
var coreints =mongoose.Schema({
    username : String,
    title    : String,
    company  : String,
    year     : Number,
    des      : String,
})
var reviews = mongoose.Schema({
    username : String,
    name     : String,
    author   : String,
    isbn     : Number,
    type     : String,
    category : String,
    branch   : String,
    des      : String,
})
var books = mongoose.Schema({
    username : String,
    name     : String,
    author   : String,
    isbn     : Number,
    price    : Number,
    type     : String,
    category : String,
    branch   : String,
    country  : String,
    state    : String,
    district : String,
    phone    : Number,
    email    : String,
    img      : String,
})
var stuffs = mongoose.Schema({
    username : String,
    name     : String,
    price    : Number,
    country  : String,
    state    : String,
    district : String,
    phone    : Number,
    email    : String,
    img      : String,
})
var wishbooks = mongoose.Schema({
    username : String,
    id       : String
})
var wishstuff = mongoose.Schema({
    username: String,
    id      : String
})
var coaching    = mongoose.model('coaching', coachings);
var gcoaching   = mongoose.model('gcoaching', gcoachings);
var pregra      = mongoose.model('pregra' , pregras );
var postgra     = mongoose.model('postgra',postgras);
var noncint     = mongoose.model('noncint',noncints);
var coreint     = mongoose.model('coreint',coreints);
var book        = mongoose.model('book',books);
var stuff       = mongoose.model('stuff',stuffs);

app.get("/",function(req,res){
    res.render("home.ejs");
})
app.post("/signup", function(req, res){
    User.register(new User({username: req.body.username,email:req.body.email}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("home.ejs");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/logedin")
        });
    });
});


app.post("/login", passport.authenticate("local", {
    successRedirect: "/logedin",
    failureRedirect: "/home"
}) ,function(req, res){
});
// profile 

app.get("/profile",isLoggedIn,function(req,res){
    res.render("profile.ejs");
})
// contribution books 
app.get("/profilebooks",function(req,res){
    book.find({username:req.user.username},function(err,ans){
        if(err) console.warn(err);
        else{
             res.render("profilebooks",{ans:ans});
        }
    })
})
app.get("/delbooks/:id",function(req,res){
    book.deleteOne({_id:req.params.id},function(err){
        if(err) res.redirect('/profilebooks');
        else res.redirect('/logedin');
    })
})

// contribution stuff
app.get("/profilestuff",function(req,res){
    stuff.find({username:req.user.username},function(err,ans){
        if(err) console.warn(err);
        else{
             res.render("profilestuff",{ans:ans});
        }
    })
})
app.get("/delstuff/:id",function(req,res){
    stuff.deleteOne({_id:req.params.id},function(err){
        if(err) res.redirect('/profilestuff');
        else res.redirect('/logedin');
    })
})

app.get("/logedin",isLoggedIn ,function(req,res){  
    res.render("loghome.ejs");
})
// sellbook routes 
app.get("/sellbook",isLoggedIn,function(req,res){
    res.render("sellbook.ejs");
})
app.post("/sellbook",upload,function(req,res){
    var temp={
        username : String,
        name     : String,
        author   : String,
        isbn     : Number,
        price    : Number,
        type     : String,
        category : String,
        branch   : String,
        country  : String,
        state    : String,
        district : String,
        phone    : Number,
        email    : String,
        img      : String,
    }
    temp.username = req.user.username;
    temp.name     = req.body.name;
    temp.author   = req.body.author;
    temp.isbn     = req.body.isbn;
    temp.price    = req.body.price;
    temp.type     = req.body.type;
    temp.category = req.body.category;
    temp.branch   = req.body.branch;
    temp.country  = req.body.country;
    temp.state    = req.body.state;
    temp.district = req.body.district;
    temp.phone    = req.body.phone;
    temp.email    = req.body.email;
    temp.img      = req.file.filename;
    book.create(temp,function(err){
        if(err) {
            res.render('/sellbook');
        }
        else{
            res.redirect('/logedin')
        } 
    });
})

app.get("/showbook",function(req,res){
    book.find({},function(err,ans){
        if(err) console.log(err);
        else res.render("showbook.ejs",{ans:ans})
    })
})
app.post("/searchbook",function(req,res){
    book.find(req.body,function(err,ans){
        if(err) console.log(err);
        else res.render("showbook",{ans:ans});
    })
})
app.get("/usershowbook",function(req,res){
    book.find({username:req.user.username},function(err,ans){
        if(err) console.log(err);
        else res.render("showbook.ejs",{ans:ans})
    })
})
app.post("/usersearchbook",function(req,res){
    var temp={
        username : String,
        name     : String,
        author   : String,
        type     : String,
        category : String,
        branch   : String,
    }
    temp.username = req.user.username;
    temp.name     = req.body.name;
    temp.author   = req.body.author;
    temp.type     = req.body.type;
    temp.category = req.body.category;
    temp.branch   = req.body.branch;
    book.find(temp,function(err,ans){
        if(err) console.log(err);
        else res.render("showbook",{ans:ans});
    })
})
// sellstuf routes
app.get("/sellstuff",isLoggedIn,function(req,res){
    res.render("sellstuff.ejs");
})
app.post("/sellstuff",upload,function(req,res){
    var temp={
        username : String,
        name     : String,
        price    : Number,
        country  : String,
        state    : String,
        district : String,
        phone    : Number,
        email    : String,
        img      : String,
    }
    temp.username = req.user.username;
    temp.name     = req.body.name;
    temp.price    = req.body.price;
    temp.country  = req.body.country;
    temp.state    = req.body.state;
    temp.district = req.body.district;
    temp.phone    = req.body.phone;
    temp.email    = req.body.email;
    temp.img      = req.file.filename;
    stuff.create(temp,function(err){
        if(err) res.render('/sellstuff');
        else res.redirect("/logedin");
    });
})

app.get("/showstuff",function(req,res){
    stuff.find({},function(err,ans){
        if(err) console.log(err);
        else res.render("showstuff.ejs",{ans:ans})
    })
})
app.post("/searchstuff",function(req,res){
    stuff.find(req.body,function(err,ans){
        if(err) console.log(err);
        else res.render("showstuff",{ans:ans});
    })
})
// pre gradutaion exams section
app.get("/preengadd",isLoggedIn,function(req,res){
    res.render("preengadd.ejs");
})
app.post("/preengadd",function(req,res){
    var temp = {
        username : String,
        title    : String,
        exam     : String,
        year     : Number,
        des      : String,
    }
    temp.username=req.user.username;
    temp.title=req.body.title;
    temp.exam= req.body.exam;
    temp.year=req.body.year;
    temp.des=req.body.des;
    pregra.create(temp,function(err){
        if(err){
            console.log(err);
            res.render("/preengadd");
        }
        else {
            res.redirect("/logedin");
        }
    });
})
app.get("/preengshow",function(req,res){
    pregra.find((req.body),function(err,ans){
        if(err) console.warn(err);
        else{
             res.render("preengshow",{ans:ans});
        }
    })
})
app.post("/preengshowadd",function(req,res){
    pregra.find((req.body),function(err,ans){
        if(err) console.warn(err);
        else{
             res.render("preengshow",{ans:ans});
        }
    })
})
// preeng contruibution show 
app.get("/contpregra",function(req,res){
    pregra.find({username:req.user.username},function(err,ans){
        if(err) console.warn(err);
        else{
             res.render("contpregra",{ans:ans});
        }
    })
})
app.get("/delpregra/:id",function(req,res){
    pregra.deleteOne({_id:req.params.id},function(err){
        if(err) res.redirect('/contpregra');
        else res.redirect('/logedin');
    })
})

// post graduation exams section 


app.get("/postengadd",isLoggedIn,function(req,res){
    res.render("postengadd.ejs");
})
app.post("/postengadd",isLoggedIn,function(req,res){
    var temp = {
        username : String,
        title    : String,
        exam     : String,
        year     : Number,
        des      : String,
    }
    temp.username = req.user.username;
    temp.title    = req.body.title;
    temp.exam     = req.body.exam;
    temp.year     = req.body.year;
    temp.des      = req.body.des;
    postgra.create(temp,function(err){
        if(err){
            console.log(err);
            res.render("/postengadd");
        }
        else res.redirect("/logedin");
    });
})
app.get("/postengshow",function(req,res){
    postgra.find((req.body),function(err,ans){
        if(err) console.warn(err);
        else{
             res.render("postengshow",{ans:ans});
        }
    })
})
app.post("/postengshowadd",function(req,res){
    postgra.find((req.body),function(err,ans){
        if(err) console.warn(err);
        else{
             res.render("postengshow",{ans:ans});
        }
    })
})
// posteng contribution show 

app.get("/contpostgra",function(req,res){
    postgra.find({username:req.user.username},function(err,ans){
        if(err) console.warn(err);
        else{
             res.render("contpostgra",{ans:ans});
        }
    })
})
app.get("/delpostgra/:id",function(req,res){
    postgra.deleteOne({_id:req.params.id},function(err){
        if(err) res.redirect('/contpostgra');
        else res.redirect('/logedin');
    })
})

// core graduation exams section 

app.get("/coreadd",isLoggedIn,function(req,res){
    res.render("coreadd.ejs");
})
app.post("/coreadd",function(req,res){
    var temp = {
        username : String,
        title    : String,
        company : String,
        year     : Number,
        des      : String,
    }
    temp.username=req.user.username;
    temp.title=req.body.title;
    temp.company= req.body.company;
    temp.year=req.body.year;
    temp.des=req.body.des;
    coreint.create(temp,function(err){
        if(err){
             console.log(err);
             res.render("/coreadd")
        }
        else  res.redirect("/logedin")
    });
})
app.get("/coreshow",function(req,res){
    coreint.find((req.body),function(err,ans){
        if(err) console.warn(err);
        else{
             res.render("coreshow",{ans:ans});
        }
    })
})
app.post("/coreshowadd",function(req,res){
    coreint.find(req.body,function(err,ans){
        if(err){
            console.log(err);
        }
        else res.render("coreshow",{ans,ans});
    });
})
// non-core contribution show 

app.get("/contcore",function(req,res){
    coreint.find({username:req.user.username},function(err,ans){
        if(err) console.warn(err);
        else{
             res.render("contcore",{ans:ans});
        }
    })
})
app.get("/delcore/:id",function(req,res){
    coreint.deleteOne({_id:req.params.id},function(err){
        if(err) res.redirect('/contcore');
        else res.redirect('/logedin');
    })
})

// noncore inteview section 

app.get("/noncoreadd",isLoggedIn,function(req,res){
    res.render("noncoreadd.ejs");
})
app.post("/noncoreadd",function(req,res){
    var temp = {
        username : String,
        title    : String,
        company : String,
        year     : Number,
        des      : String,
    }
    temp.username=req.user.username;
    temp.title=req.body.title;
    temp.company= req.body.company;
    temp.year=req.body.year;
    temp.des=req.body.des;
    noncint.create(temp,function(err){
        if(err){
             console.log(err);
             res.render("/noncoreadd")
        }
        else  res.redirect("/logedin")
    });
})
app.get("/noncoreshow",function(req,res){
    noncint.find((req.body),function(err,ans){
        if(err) console.warn(err);
        else{
             res.render("noncoreshow",{ans:ans});
        }
    })
})
app.post("/noncoreshowadd",function(req,res){
    noncint.find(req.body,function(err,ans){
        if(err){
            console.log(err);
        }
        else res.render("noncoreshow",{ans,ans});
    });
})
// non-core contribution show 

app.get("/contnonc",function(req,res){
    noncint.find({username:req.user.username},function(err,ans){
        if(err) console.warn(err);
        else{
             res.render("contnonc",{ans:ans});
        }
    })
})
app.get("/delnonc/:id",function(req,res){
    noncint.deleteOne({_id:req.params.id},function(err){
        if(err) res.redirect('/contnonc');
        else res.redirect('/logedin');
    })
})


// books review section 

app.get("/breviewadd",function(req,res){
    res.render("breviewadd.ejs");
})
app.get("/getbr",function(req,res){
    res.render("getbr.ejs");
})

// coaching review  secion 
app.get("/creviewadd",isLoggedIn,function(req,res){
    res.render("creviewadd.ejs");
})

app.post("/creviewadd",function(req,res){
    var temp={
        username : String,
        name     : String,
        type     : String,
        country  : String,
        state    : String,
        district : String,
        city     : String,
        review   : String,
    }
    temp.username = req.user.username;
    temp.name     = req.body.name;
    temp.type     = req.body.type;
    temp.country  = req.body.state;
    temp.state    = req.body.state;
    temp.district = req.body.district;
    temp.city     = req.body.city;
    temp.review   = req.body.review;
    coaching.create(temp,function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/logedin ");
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


app.get("/getcr",isLoggedIn,function(req,res){
    res.render("getcr.ejs");
})

app.post("/getcr",function(req,res){
    var temp={
        username : String,
        name     : String,
        type     : String,
        country  : String,
        state    : String,
        district : String,
        city     : String,
    }
    temp.username = req.user.username;
    temp.name     = req.body.name;
    temp.type     = req.body.type;
    temp.country  = req.body.state;
    temp.state    = req.body.state;
    temp.district = req.body.district;
    temp.city     = req.body.city;
    gcoaching.create(temp,function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log(req.body);
            res.redirect("/logedin");
        }
    }) 
})

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

app.get("*",function(req,res){
    res.redirect("/");
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3000,function(){
    console.log("server started!!!");
})