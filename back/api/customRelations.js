const express = require('express');
const router = express.Router();

const {CustomRelation} = require('../models');

/**endpoints ...*/
router.get('/', (req, res) => {
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
});

router.post('/', (req, res)=>{
    const newItem = new CustomRelation({
        relation: req.body.relation,
        a: req.body.a
    });

    newItem.save().then(item => res.json(item)).catch(err => res.status(400).json(err));
});

router.delete('/:id', (req, res)=>{
    if (req.params.id) {
        CustomRelation
            .remove({_id: req.params.id})
            .then(relation => res.json(relation.ok))
            .catch(err => res.status(400).json(err));
    }
});

module.exports =  router;