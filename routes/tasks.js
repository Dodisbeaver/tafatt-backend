const express = require('express')
const router = express.Router()
const Task = require("../models/task.js")

router.get('/', async (req, res)=>{
    try{
        const tasks = await Task.find();
        res.send(tasks);
    }catch(error){
        res.status(500).send({msg: error.message})
    }
});
router.post('/', async (req,res)=> {
   
    try{
        const task = await Task.findOne({_id: req.body.id})
        if(task){
            return res.send({msg:'Task already exists?'})
        }
    }catch(error){
        res.status(500).send({msg: error.message});
    }
    try{
        const task = new Task({
            title: "pending",
            index: 0,
            username: req.body.username,
            task: req.body.task,
            reward: req.body.reward,
            isCompleted: false,

        })
        const newTask = await task.save()
        res.send(task)
        console.log(newTask._id + " " + newTask + " the new task ")
    }
    catch(error){
        res.status(500).send({msg: error.message})

    }
})

router.patch('/:id', async (req, res)=>{
    console.log(req.body)
    try{
        const updateTask = await Task.findOneAndUpdate(
            {_id: req.params.id},
            {index: req.body.index,
            title: req.body.title,
            isCompleted: req.body.isCompleted},
            {new: true}
        )
        if(!updateTask){
            return res.status(404).send({msg: "No such task"})
        }
        res.send({msg:'Task updated', updateTask: updateTask})
    } catch (error){
        return res.status(500).send({msg: error.message})
    }
})

router.delete('/:id',  async (req, res) => {
    try {
        const task = await Task.deleteOne({
            _id: req.params.id,})
        if(!task){
            return res.status(404).send({msg: "task not found"});
        }
        return res.send(task)
        }
        catch(error){
            res.status(500).send({msg: error.message})
        }
})

module.exports = router
// router.get('/',authToken, async (req, res)=>{
//     try{
//         const bookings = await Booking.find();
//         res.send(bookings);
//     }catch(error){
//         res.status(500).send({msg: error.message})
//     }
// });