const Router = require('express').Router()
const passport = require('passport');
const { auth } = require('../../middleware/tokenVerify');
const User = require('../../models/User')




Router.post('/sign_up', async(req, res, next)=>{
    const {email, password, name, username, date_of_birth} = req.body;
    console.log(req.body)

    await User.findOne({email: email}, (err, user)=>{
        console.log("user", user)
        console.log("error", err)
        if(err) {res.status(500).send(err)}
        else{ 
            if(user)
            res.status(500).send('User already exists.');
            else{
                    
                const newUser = new User();
                newUser.email = email;
                newUser.name = name;
                newUser.username = username;
                newUser.password = newUser.hashPassword(password);
                newUser.dob = date_of_birth;
                // newUser.occupation = occupation;
                newUser.save((err, user)=>{
                    console.log(user)
                    if(err)
                    res.status(500).json({err: err});
                    else
                    res.send({token:newUser.createToken(newUser._id, "1234567890"), username:newUser.username })
                    
                })
                
            }
        }
    }) 
});

Router.post('/sign_in', async(req, res, next)=>{
    const {email, password} = req.body;

    await User.findOne({email: email}, (err, user)=>{
        // res.send(err)
        if(err)  return res.status(500).send(err);
         
        if (user == null) {
            return res.status(500).send({error: "no user found"});
        }
        //    res.json(err);
        let existUser = User(user);
        if(existUser.comparePassword(password,existUser.password))
            res.json({token:existUser.createToken(existUser._id, "1234567890"), username:existUser.username })
        else
            res.status(401).send("wrong password")
        
    }) 
});
Router.post('/verify', auth,(req, res, next)=>{
    res.send(req.headers)
});





module.exports = Router