const express = require('express');
const router = express.Router();

const {Fraction, CustomRelation} = require('../models');

/**endpoints ...*/
router.get('/', (req, res) => {
    if (req.params.id) {
        Fraction
            .findById(req.params.id)
            .then(fraction => res.json(fraction))
            .catch(err => res.status(404).json({success: false}));
    } else {
        Fraction
            .find()
            .sort({date: -1})
            .then(fractions => res.json(fractions))
            .catch(err => res.status(404).json({success: false}));
    }
});

router.post('/', (req, res) => {
    const newItem = new Fraction({
        name: req.body.name,
        icon: req.body.icon,
        amount: req.body.amount,
        relations: req.body.relations,
        unions: req.body.unions
    });

    newItem.save().then(item => res.json(item)).catch(err => res.status(400).json(err));
});

router.post('/:id/relations', (req, res) => {
    const _data = req.body.data.map(r => {r.b = req.params.id; return r});
    CustomRelation.create(_data)
        .then(relation => res.json(Array.isArray(relation) ? relation: []))
        .catch(err => res.status(400).json(err));
});

router.put('/:id', (req, res)=>{
    Fraction
        .update({_id: req.params.id},{$set: {...req.body}})
        .then(fraction => res.json(fraction))
        .catch(err => res.status(400).json(err));
});

router.delete('/:id', (req, res) => {
    if (req.params.id) {
        Fraction
            .remove({_id: req.params.id})
            .then(fraction => res.json(fraction.ok))
            .catch(err => res.status(400).json(err));
    }
});

module.exports = router;