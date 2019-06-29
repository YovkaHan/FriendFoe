const express = require('express');
const router = express.Router();

const Fraction = require('../models/fraction');

/**endpoints ...*/
router.get('/:id', (req, res)=>{
    if(req.params.id){

    }else {
        Fraction
            .find()
            .sort({ date: -1 })
            .then(fractions => res.json(fractions));
    }
});

router.post('/', (req, res)=>{

});

router.put('/:id', (req, res)=>{

});

router.delete('/:id', (req, res)=>{

});

module.exports =  router;