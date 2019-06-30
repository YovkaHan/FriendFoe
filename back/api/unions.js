const express = require('express');
const router = express.Router();

const Union = require('../models/union');

/**endpoints ...*/
router.get('/', (req, res) => {
    if (req.params.id) {
        Union
            .findById(req.params.id)
            .then(union => res.json(union))
            .catch(err => res.status(404).json({success: false}));
    } else {
        Union
            .find()
            .sort({date: -1})
            .then(unions => res.json(unions))
            .catch(err => res.status(404).json({success: false}));
    }
});

router.post('/', (req, res)=>{

});

router.put('/:id', (req, res)=>{

});

router.delete('/:id', (req, res)=>{

});

module.exports =  router;