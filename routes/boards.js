const express = require('express')
const router = express.Router()
const Board = require("../models/board.js")

router.get('/', async (req, res)=>{
    try{
        const boards = await Board.find();
        res.send(boards);
    }catch(error){
        res.status(500).send({msg: error.message})
    }
});
router.post('/', async (req,res)=> {
   
    try{
        const board = await Board.findOne({_id: req.body.id})
        if(board){
            return res.send({msg:'Board already exists?'})
        }
    }catch(error){
        res.status(500).send({msg: error.message});
    }
    try{
        const board = new Board({
            title: req.body.title,
            index: req.body.index,

        })
        const newBoard = await board.save()
        res.send(board)
        console.log(newBoard._id + " the new board ")
    }
    catch(error){
        res.status(500).send({msg: error.message})

    }
})

router.patch('/:id', async (req, res)=>{
    try{
        const updateBoard = await Board.findOneAndUpdate(
            {_id: req.params.id},
            {index: req.body.index,
            title: req.body.title,},
            {new: true}
        )
        if(!updateBoard){
            return res.status(404).send({msg: "No such board"})
        }
        res.send({msg:'Board updated', updateTask: updateBoard})
    } catch (error){
        return res.status(500).send({msg: error.message})
    }
})
router.delete('/:id',  async (req, res) => {
    try {
        const board = await Board.deleteOne({
            _id: req.params.id,})
        if(!board){
            return res.status(404).send({msg: "board not found"});
        }
        return res.send(board)
        }
        catch(error){
            res.status(500).send({msg: error.message})
        }
})

module.exports = router