import {actionTemplate} from '../../../../redux/common';

export const name = 'fractionForm';

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
    FORM_INIT: "FORM_INIT",
    UPDATE_META: "UPDATE_META",
    UPDATE_META_COMPLETE: "UPDATE_META_COMPLETE"
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
