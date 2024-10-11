const express = require('express');
const router = express.Router();
const Song = require('../model/song.model');

router.post('/', async (req, res) => {
    const { title, artist, genre, duration } = req.body
        const newSong = new Song({ title, artist, genre, duration });
    try{
        const savedSong = await newSong.save();
        res.status(201).json(savedSong);
    }catch(error){
        res.status(400).json({ message: error.message });   
    }
});

router.get('/', async (req, res) => {
    try{
        const getSong = await Song.find();
        if(getSong.length === 0) return res.status(404).json({ message: 'Song not found' });
        res.json(getSong);
    }catch(error){
        res.status(500).json({ message: error.message });   
    }
});

router.get('/id/:id', async (req, res) => {
    try{
        const getById = await Song.findOne({_id:  req.params.id});
        if(!getById) return res.status(404).json({ message: 'Song not found' });
        res.status(201).json(getById);
    }catch(error){
        res.status(500).json({ message: error.message });   
    }
});

router.put('/id/:id', async (req, res) => {
    try{
        const updatedSong = await Song.updateOne({_id: req.params.id}, {$set: req.body});
        if (updatedSong.matchedCount === 0) {
            return res.status(404).json({ message: 'Song not found' });
        }
        res.status(201).json({message: 'Song updated successfully'});
    }catch(error){
        res.status(500).json({ message: error.message });   
    }
});

router.delete('/id/:id', async (req, res) => {
    try{
        const deletedSong = await Song.deleteOne({_id: req.params.id});
        if (!deletedSong) {
            return res.status(404).json({ message: 'Song not found' });
        }
        res.status(201).json({message: 'Song deleted successfully'});
    }catch(error){
        res.status(500).json({ message: error.message });   
    }
});

module.exports = router;