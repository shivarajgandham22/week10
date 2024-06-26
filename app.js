const express = require('express');
const bodyparser=require("body-parser")
const bcrypt=require("bcrypt");
const user=require('./models/user');
const mongoose = require('mongoose');
const app = express();
const port = 80
mongoose.connect("mongodb://localhost:27017/user",{useNewUrlParser : true});
app.set('view engine', 'pug')

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}))

//handling get request

app.get('/',function(req,res){

res.render('index')
})

app.get('/Login',function(req,res){

    res.render('Login')
    })

app.get('/Register',function(req,res){

    res.render('Register')
    })

//handling post request

app.post('/Register',function(req,res){
        //console.log(req.body.username)
        const newUser=new user();
        newUser.username=req.body.username;
        var salt=bcrypt.genSaltSync(10);
        var hash=bcrypt.hashSync(req.body.password,salt);
        newUser.password=hash;
        newUser.age=req.body.age;
        newUser.mobile=req.body.mobile;

        // newUser.save(function(err,result){

        //     if(err){

        //         console.log(err);
        //     }
        //     else{
        //         console.log(result);
        //         res.redirect("Login");
        //     }
        // })
        newUser.save()
        .then(result => {
          console.log(result);
          res.redirect("Login");
        })
        .catch(err => {
          console.log(err);
          // Handle the error appropriately
        });
      

    })

    // app.post('/Login',function(req,res){
        
    //     user.findOne({username:req.body.username},function(err,docs){
    //         if(err)
    //         {
    //             console.log(err)
            
    //         }
    //         else
    //         {
    //             if(docs.username==req.body.username)
    //             {
    //                 bcrypt.compare(req.body.password,docs.password,function(err,data)
    //                 {
    //                     if(err)
    //                     {
    //                         console.log(err);
    //                     }
    //                     if(data)
    //                     {
    //                         console.log(data);
    //                         res.send("Welcome");
    //                     }
    //                     else
    //                     {
    //                         res.send("invalid password");
    //                     }

    //                 });
                    

                   
                    
    //             }
    //             else
    //             {
    //                 //res.send("invalid username or password")
    //                 res.redirect("Register");
    //             }

    //         }

    //     })
        

    //     })
    
    app.post('/Login', function(req, res) {
        user.findOne({ username: req.body.username })
            .then(docs => {
                if (!docs) { 
                    // User not found
                    res.redirect("Register");
                    return;
                }
    
                bcrypt.compare(req.body.password, docs.password)
                    .then(data => {
                        if (data) {
                            console.log(data);
                            res.send("Welcome");
                        } else {
                            res.send("Invalid password");
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        res.send("Error occurred");
                    });
            })
            .catch(err => {
                console.log(err);
                res.send("Error occurred");
            });
    });



app.listen(port,() => {console.log(`app is listening on http://localhost:${port}`)})