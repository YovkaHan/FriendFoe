const express = require('express');
const router = express.Router();

const Relation = require('../models/relation');

/**endpoints ...*/
router.get('/', (req, res) => {
    if (req.params.id) {
        Relation
            .findById(req.params.id)
            .then(relation => res.json(relation))
            .catch(err => res.status(404).json({success: false}));
    } else {
        Relation
            .find()
            .sort({date: -1})
            .then(relations => res.json(relations))
            .catch(err => res.status(404).json(err));
    }
});

router.post('/', (req, res)=>{
    const newItem = new Relation({
        name: req.body.name,
        color: req.body.color
    });

    newItem.save().then(item => res.json(item)).catch(err => res.status(400).json(err));
});

router.put('/:id', (req, res)=>{
    Relation
        .update({_id: req.params.id},{$set: {...req.body}})
        .then(relation => res.json(relation))
        .catch(err => res.status(400).json(err));
});

router.delete('/:id', (req, res)=>{
    if (req.params.id) {
        Relation
            .remove({_id: req.params.id})
            .then(relation => res.json(relation.ok))
            .catch(err => res.status(400).json(err));
    }
});

module.exports =  router;