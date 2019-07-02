import {actionTemplate} from '../../../../redux/common';

export const name = 'relationForm';

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
    FORM_ITEM_APPLY: "FORM_ITEM_APPLY",
    FORM_ITEM_CANCEL: "FORM_ITEM_CANCEL",
    FORM_ITEM_DELETE: "FORM_ITEM_DELETE",
    FORM_ITEM_APPLY_COMPLETE: "FORM_ITEM_APPLY_COMPLETE",
    FORM_ITEM_DELETE_COMPLETE: "FORM_ITEM_DELETE_COMPLETE",
    FORM_DATA_COPY: "FORM_DATA_COPY"
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
