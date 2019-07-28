const express = require('express');
const router = express.Router();

const {Relation} = require('../models');

/**endpoints ...*/
router.get('/', (req, res) => {
    try{
        Relation
            .find()
            .sort({date: -1})
            .then(relations => res.json(relations))
            .catch(err => res.status(404).json(err));
    } catch (error) {
        res.status(400).json({error})
    }
});

router.get('/:id', (req, res) => {
    try{
        if (req.params.id) {
            Relation
                .findById(req.params.id)
                .then(relation => res.json(relation))
                .catch(err => res.status(404).json({success: false}));
        }
    } catch (error) {
        res.status(400).json({error})
    }
});

router.post('/', (req, res)=>{
    try {
        const newItem = new Relation({
            name: req.body.name,
            color: req.body.color
        });

        newItem.save().then(item => res.json(item)).catch(err => res.status(400).json(err));
    } catch (error) {
        res.status(400).json({error})
    }
});

router.put('/:id', (req, res)=>{
    try {
        Relation
            .update({_id: req.params.id},{$set: {...req.body}})
            .then(relation => res.json(relation))
            .catch(err => res.status(400).json(err));
    } catch (error) {
        res.status(400).json({error})
    }
});

router.delete('/:id', (req, res)=>{
    try {
        if (req.params.id) {
            Relation
                .remove({_id: req.params.id})
                .then(relation => res.json(relation.ok))
                .catch(err => res.status(400).json(err));
        }
    } catch (error) {
        res.status(400).json({error})
    }
});

module.exports =  router;