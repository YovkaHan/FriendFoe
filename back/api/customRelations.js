const express = require('express');
const router = express.Router();

const {CustomRelation} = require('../models');

/**endpoints ...*/
router.get('/', (req, res) => {
    try{
        if (req.params.id) {
            CustomRelation
                .findById(req.params.id)
                .then(relation => res.json(relation))
                .catch(err => res.status(404).json({success: false}));
        } else {
            CustomRelation
                .find()
                .sort({date: -1})
                .then(relations => res.json(relations))
                .catch(err => res.status(404).json(err));
        }
    } catch (error) {
        res.status(400).json({error})
    }
});

router.post('/', (req, res)=>{
    try {
        const newItem = new CustomRelation({
            relation: req.body.relation,
            a: req.body.a
        });

        newItem.save().then(item => res.json(item)).catch(err => res.status(400).json(err));
    } catch (error) {
        res.status(400).json({error})
    }
});

router.delete('/:id', (req, res)=>{
    try {
        if (req.params.id) {
            CustomRelation
                .remove({_id: req.params.id})
                .then(relation => res.json(relation.ok))
                .catch(err => res.status(400).json(err));
        }
    } catch (error) {
        res.status(400).json({error})
    }
});

module.exports =  router;