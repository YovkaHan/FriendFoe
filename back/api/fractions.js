const express = require('express');
const router = express.Router();

const {Fraction, CustomRelation} = require('../models');

/**endpoints ...*/
router.get('/', (req, res) => {
    try {
        Fraction
            .find()
            .sort({date: -1})
            .then(fractions => res.json(fractions))
            .catch(error => res.status(404).json({error}));
    } catch (error) {
        res.status(400).json({error})
    }
});

router.get('/:id', (req, res) => {
    try {
        if (req.params.id) {
            Fraction
                .findById(req.params.id)
                .then(fraction => res.json(fraction))
                .catch(error => res.status(404).json({error}));
        }
    } catch (error) {
        res.status(400).json({error})
    }
});

router.post('/', (req, res) => {
    try {
        const newItem = new Fraction({
            name: req.body.name,
            icon: req.body.icon,
            amount: req.body.amount,
            relations: req.body.relations,
            unions: req.body.unions
        });

        newItem.save().then(item => res.json(item)).catch(error => res.status(400).json({error}));
    } catch (error) {
        res.status(400).json({error})
    }
});

router.post('/:id/relations', (req, res) => {
    try{
        const _data = req.body.data.map(r => {r.b = req.params.id; return r});
        CustomRelation.create(_data)
            .then(relation => res.json(Array.isArray(relation) ? relation: []))
            .catch(error => res.status(400).json({error}));
    } catch (error) {
        res.status(400).json(error)
    }
});

router.put('/:id', (req, res)=>{
    try {
        Fraction
            .update({_id: req.params.id}, {$set: {...req.body}})
            .then(fraction => res.json(fraction))
            .catch(error => res.status(400).json({error}));
    } catch (error) {
        res.status(400).json(error)
    }
});

router.delete('/:id', (req, res) => {
    try {
        if (req.params.id) {
            Fraction
                .remove({_id: req.params.id})
                .then(fraction => res.json(fraction.ok))
                .catch(error => res.status(400).json({error}));
        }
    } catch (error) {
        res.status(400).json(error)
    }
});

module.exports = router;