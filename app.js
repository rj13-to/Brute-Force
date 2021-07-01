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
const { stringify }       =   require("querystring");



app.set('view engine','ejs');
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
var pregras =mongoose.Schema({
    title    : String,
    exam     : String,
    year     : Number,
    des      : String,
})
var postgras =mongoose.Schema({
    title    : String,
    exam     : String,
    year     : Number,
    des      : String,
})
var noncints =mongoose.Schema({
    title    : String,
    company : String,
    year     : Number,
    des      : String,
})
var coreints =mongoose.Schema({
    title    : String,
    company  : String,
    year     : Number,
    des      : String,
})
var reviews = mongoose.Schema({
    name     : String,
    author   : String,
    isbn     : Number,
    type     : String,
    category : String,
    branch   : String,
    des      : String,
})
var books = mongoose.Schema({
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
    pic      : String,
})

var coaching    = mongoose.model('coaching', coachings);
var gcoaching   = mongoose.model('gcoaching', gcoachings);
var pregra      = mongoose.model('pregra' , pregras );
var postgra     = mongoose.model('postgra',postgras);
var noncint     = mongoose.model('noncint',noncints);
var coreint     = mongoose.model('coreint',coreints);


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
           res.redirect("/logedin");
        });
    });
});


app.post("/login", passport.authenticate("local", {
    successRedirect: "/logedin",
    failureRedirect: "/home"
}) ,function(req, res){
    console.log("hello");
});

app.get("/logedin",isLoggedIn ,function(req,res){
    res.render("loghome.ejs");
})
app.get("/sellbook",isLoggedIn,function(req,res){
    res.render("sellbook.ejs");
})
app.get("/sellstuff",isLoggedIn,function(req,res){
    res.render("sellstuff.ejs");
})

// pre gradutaion exams section

app.get("/preengadd",isLoggedIn,function(req,res){
    res.render("preengadd.ejs");
})
app.post("/preengadd",function(req,res){
    pregra.create(req.body,function(err){
        if(err){
            console.log(err);
            res.render("/preengadd");
        }
        else res.render("/loghome");
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
// post graduation exams section 


app.get("/postengadd",isLoggedIn,function(req,res){
    res.render("postengadd.ejs");
})
app.post("/postengadd",function(req,res){
    postgra.create(req.body,function(err){
        if(err){
            console.log(err);
            res.render("/postengadd");
        }
        else res.render("/loghome");
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
// core graduation exams section 

app.get("/coreadd",isLoggedIn,function(req,res){
    res.render("coreadd.ejs");
})
app.post("/coreadd",function(req,res){
    coreint.create(req.body,function(err){
        if(err){
             console.log(err);
             res.render("/coreadd")
        }
        else  res.render("/loghome")
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
// noncore inteview section 

app.get("/noncoreadd",isLoggedIn,function(req,res){
    res.render("noncoreadd.ejs");
})
app.post("/noncoreadd",function(req,res){
    noncint.create(req.body,function(err){
        if(err){
             console.log(err);
             res.render("/noncoreadd")
        }
        else  res.render("/loghome")
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
    coaching.create(req.body,function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render("/loghome");
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

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

app.get("*",function(req,res){
    res.render("/");
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