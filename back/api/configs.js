const express = require('express');
const router = express.Router();

const models = require('../models');

const configs = {
    entities: [
        {
            _id: 'fraction',
            name: 'fraction',
            api: '/api/fractions'
        },
        {
            _id: 'union',
            name: 'union',
            api: '/api/unions'
        },
        {
            _id: 'relation',
            name: 'relation',
            api: '/api/relations'
        },
        {
            _id: 'customRelation',
            name: 'customRelation',
            api: '/api/customRelation'
        }
    ],
    fields: {
        'fraction': constructField(models.Fraction.schema),
        'union': constructField(models.Union.schema),
        'relation': constructField(models.Relation.schema),
        'customRelation': constructField(models.CustomRelation.schema)
    }
};

/**endpoints ...*/
router.get('/', (req, res) => {
    res.json(configs);
});

router.get('/entities', (req, res) => {
    res.json(configs.entities);
});

router.get('/fields', (req, res) => {
    res.json(configs.fields);
});

module.exports = router;

function constructField(schema) {
    const result = schema.obj;

    Object.keys(result).map(key => {
        result[key].type = schema.paths[key].instance;
    });

    return result;
}