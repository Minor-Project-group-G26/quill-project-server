const express = require('express');
const Courses = require('../../models/Courses');
const User = require('../../models/User');
const Router = express.Router()

Router.post('/:page', (req, res)=>{
    
})

Router.get('/:id', (req, res)=>{
    Courses.findById(req.params.id, (err, course)=>{
        console.log(err)
        if(err) return res.send({status:'fail', msg:"No Course Found"})
        if(!course) return res.send({status:'fail', msg:"No Course Found"})        
        return res.send({status: 'success', msg: "Successfully Data found", data: course})
    })
})

Router.get('/:id/:week', (req, res)=>{
    Courses.findById(req.params.id, (err, course)=>{
        console.log(err)
        if(err) return res.send({status:'fail', msg:"No Course Found"})
        if(!course) return res.send({status:'fail', msg:"No Course Found"})        
        return res.send({status: 'success', msg: "Successfully Data found", data: course.data[req.params.week]})
    })
})

Router.get('/:id/:week/:data_id', (req, res)=>{
    Courses.findById(req.params.id, (err, course)=>{
        console.log(err)
        if(err) return res.send({status:'fail', msg:"No Course Found"})
        if(!course) return res.send({status:'fail', msg:"No Course Found"})        
        return res.send({status: 'success', msg: "Successfully Data found", data: course.data[req.params.week][req.params.data_id]})
    })
})

Router.post('/buy/:id', async(req, res, next)=>{
    const course = await Courses.findById(req.params.id);
    const user = await User.findById(req.headers._id)
    if(!course)
    return res.send({status: 'failed', msg:'course not found'})
    if(!user)
    return res.send({status: 'failed', msg:'User not found'})
    const {transaction} = req.body;
    if(transaction.length !== 10)
    return res.send({status: 'failed', msg:'Wrong Transaction Id'})
    // const alreadyExist = user.courses.filter((item)=> item.course_id === course._id)
    // console.log("found course",alreadyExist)
    // if(alreadyExist.length === 1)
    // return res.send({status:"warning", msg:"Already have"}) 
    user.enrollments.in_progress.push({
        course_id: course.id,
        course_title: course.title,
        week_status: 1
    }) 
    course.enrollment_details.push({
        user_id: user._id,
        transaction: transaction,

    })
    // course.no_sales = course.no_sales+1
    if(user.save() && course.save())
    return res.send({status: 'success', msg:'Successfully transaction completed'})
    return res.send({status: 'failed', msg:'Something went wrong'})

})

Router.all('*', function(req, res, next) {
    res.status(404).send("Page not found");
});
  


module.exports = Router