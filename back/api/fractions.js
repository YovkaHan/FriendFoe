const express = require('express');
const router = express.Router();

const Fraction = require('../models/fraction');

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

    newItem.save().then(item => res.json(item));
});

router.put('/:id', (req, res) => {

});

router.delete('/:id', (req, res) => {

});

module.exports = router;