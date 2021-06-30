var express = require('express');
const Instrector = require('../../models/Instrector');
const User = require('../../models/User');
var Router = express.Router();
const fs = require('fs')
const multer = require('multer');
const {storage} = require('../../middleware/upload')
const upload = multer({
    storage: storage("./public/upload"),
    fileFilter: (req, file, cb)=>{
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
    }
})

/* GET users listing. */
Router.get('/', async(req, res, next)=>{
  console.log(req.headers);
  await User.findById(req.headers._id, (err, user)=>{
    res.status(200).send({username: user.username, email: user.email, name: user.name, verification: user.verification, 
      instructor:user.instructor, profile:user.profile,  block_data: user.block_data, occupation: user.occupation, 
      dob: user.dob,phone:user.phone,
      enrollments: {
        ongoing: user.enrollments.in_progress.length, 
        completed: user.enrollments.completed.length}})
  })
});

Router.get('/books', async(req, res, next)=>{
  console.log(req.headers);
  await User.findById(req.headers._id, (err, user)=>{
    if(err) 
    return res.status(500).send({status: 'failed', msg: err}) 
    res.status(200).send({status: 'success', msg: "Successfully found", data:user.books})
  })
});
Router.get('/enrollments', async(req, res, next)=>{
  console.log(req.headers);
  await User.findById(req.headers._id, (err, user)=>{
    if(err) 
    return res.status(500).send({status: 'failed', msg: err}) 
    res.status(200).send({status: 'success', msg: "Successfully found", data:user.enrollments})
  })
});



Router.put('/update', async(req, res, next)=>{
  // console.log()
  await User.findByIdAndUpdate(req.headers._id,{$set: req.body},(err)=>{
    console.log(err)
    if(err)
    res.send(err)
    res.send({status: "success", msg:"Successfully Profile Updated"})
  })
});

Router.put('/update_image', upload.single('image'),async(req, res, next)=>{
    const file = req.file;
    console.log(file);
    await User.findById(req.headers._id,async(err, user)=>{
      if (err) return res.send({err: err})
      if(fs.existsSync('./public/upload/'+user.profile))
      fs.unlinkSync('./public/upload/'+user.profile);
      await User.findByIdAndUpdate(req.headers._id,{$set: {profile: file.filename}},(err, user)=>{
        if(err)
        res.send(err)
        res.send(file);
  
      })
    })
});

Router.put('/new_instructor', async(req, res, next)=>{
  await Instrector.findOne({user_id: req.headers._id}, async(err, user)=>{
    if(user)
    return res.end("user already exist");

    let newInstructor = new Instrector()
    newInstructor.user_id = req.headers._id;
    newInstructor.verification_data = {
      document_type: req.body.document_type,
      document_id: req.body.document_id
    }
    newInstructor.save(async(err, inst)=>{
      if(err)
      return res.send({error:err})
      await User.findByIdAndUpdate(req.headers._id, {$set:{instructor_id: inst._id, instructor: true}}, (err, user)=>{
        if(err)
        return res.send({error: err})
        res.send({status: "success", user: user})
      })
    
    });

  })
 

});


Router.all('*', function(req, res, next) {
  res.status(404).send("Page not found");
});

 
module.exports = Router;
