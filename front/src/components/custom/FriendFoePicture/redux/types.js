import {actionTemplate} from '../../../../redux/common';

export const name = 'friendFoePicture';

const defaultTypes = {
    INITIALIZE: "INITIALIZE",
    FLAGS: "FLAGS",
    CHANGE: "CHANGE",
    FLAGS_COMPLETE: "FLAGS_COMPLETE",
    ITEM_CREATE: "ITEM_CREATE",
    ITEM_CREATE_COMPLETE: "ITEM_CREATE_COMPLETE",
    ITEM_DELETE: "ITEM_DELETE",
    ITEM_DELETE_COMPLETE: "ITEM_DELETE_COMPLETE",
    LENGTH_PLUS: "LENGTH_PLUS",
    CHANGE_FIELD: "CHANGE_FIELD",
    UPDATE_DATA: "UPDATE_DATA",
    UPDATE_DATA_COMPLETE: "UPDATE_DATA_COMPLETE",
    UPDATE_FILTER: "UPDATE_FILTER",
    UPDATE_FILTER_COMPLETE: "UPDATE_FILTER_COMPLETE",
    FILTER_CHANGE: "FILTER_CHANGE"
};

const _sequence = ["name","root"];

const _template = {
    name: name.toUpperCase(),
    root: {...defaultTypes}
};

const foo = (() =>{
    return actionTemplate(_sequence, _template, '__');
})();

export const TYPES = foo;
