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
    img      : String,
})
var stuffs = mongoose.Schema({
    name     : String,
    price    : Number,
    country  : String,
    state    : String,
    district : String,
    phone    : Number,
    email    : String,
    img      : String,
})

var byYou = mongoose.Schema({
    your     : String, 
    book     : [books],
    stuff    : [stuffs],
    review   : [reviews],
    corints  : [coreints],
    noncint  : [noncints],
    postgra  : [postgras],
    pregra   : [pregras],
    coaching : [coachings],
})
var coaching    = mongoose.model('coaching', coachings);
var gcoaching   = mongoose.model('gcoaching', gcoachings);
var pregra      = mongoose.model('pregra' , pregras );
var postgra     = mongoose.model('postgra',postgras);
var noncint     = mongoose.model('noncint',noncints);
var coreint     = mongoose.model('coreint',coreints);
var book        = mongoose.model('book',books);
var stuff       = mongoose.model('stuff',stuffs);
var you         = mongoose.model('you',byYou);
var uname =  String;
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
            var tempin ={
                your     : String, 
                book     : [books],
                stuff    : [stuffs],
                review   : [reviews],
                corints  : [coreints],
                noncint  : [noncints],
                postgra  : [postgras],
                pregra   : [pregras],
                coaching : [coachings],
            }
            tempin.your=req.user.username;
            you.create(tempin,function(err){
                if(err) res.redirect("/");
                else  res.redirect("/logedin");
            })
        });
    });
});


app.post("/login", passport.authenticate("local", {
    successRedirect: "/logedin",
    failureRedirect: "/home"
}) ,function(req, res){
});

app.get("/logedin",isLoggedIn ,function(req,res){  
    res.render("loghome.ejs");
})
// sellbook routes 
app.get("/sellbook",isLoggedIn,function(req,res){
    res.render("sellbook.ejs");
})
app.post("/sellbook",upload,function(req,res){
    var temp={
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
            var tempin ={
                your     : String, 
                book     : [books],
                stuff    : [stuffs],
                review   : [reviews],
                corints  : [coreints],
                noncint  : [noncints],
                postgra  : [postgras],
                pregra   : [pregras],
                coaching : [coachings],
            };
            tempin.book=temp;
            tempin.your="check";
            you.create(tempin,function(err){
                if(err) console.log(err);
                else res.redirect('/logedin');
            })
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
app.delete("/deletebook",function(req,res){
    console.log("delted !!!");
})
// sellstuf routes
app.get("/sellstuff",isLoggedIn,function(req,res){
    res.render("sellstuff.ejs");
})
app.post("/sellstuff",upload,function(req,res){

    var temp={
        name     : String,
        price    : Number,
        country  : String,
        state    : String,
        district : String,
        phone    : Number,
        email    : String,
        img      : String,
    }
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
    pregra.create(req.body,function(err){
        if(err){
            console.log(err);
            res.render("/preengadd");
        }
        else {
            you.findOne({your:req.body.user.username},function(err,arr){
                if(err) console.log(err);
                else{  
                    arr.pregra.push(req.body);
                    res.redirect("/logedin");
                }
            })
        }
            /*you.findOne({your:query}
                      arr.pregra.create(req.body,function(err){
                        if(err){
                            console.log(err);
                        }
                        else res.redirect("/logedin");
                    })
                }
            })*/
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