import {TYPES} from './types';
import * as R from 'ramda';

export function initialize(id) {
    return {type: TYPES.INITIALIZE, id};
}

export function flagHandle(id, key, value) {
    return ({type: TYPES.FLAGS, payload: {key, value}, id})
}

export function changeField(id, key, value) {
    return ({type: TYPES.CHANGE_FIELD, payload: {key, value}, id})
}

export function createItem(id, afterCreated) {
    return ({type: TYPES.ITEM_CREATE, id, payload:{callback:afterCreated}})
}

export function deleteItem(id) {
    return ({type: TYPES.ITEM_DELETE, id})
}

export function formInit(id, data) {
    return ({type: TYPES.FORM_INIT, id, payload: data})
}

export function updateMeta(id, pcb) {
    return ({type: TYPES.UPDATE_META, payload: pcb, id})
}

export function changeRelationFiled(id, action, object) {
    return ({type: TYPES.CHANGE_RELATION_FIELD, payload: {action, object}, id})
}

export function applyEntityItem(id, pcb, itemId) {
    return ({type: TYPES.FORM_ITEM_APPLY, id, payload: {pcb, _id: itemId}})
}

export function cancelEntityItem(id) {
    return ({type: TYPES.FORM_ITEM_CANCEL, id})
}

export function deleteEntityItem(id, pcb, itemId) {
    return ({type: TYPES.FORM_ITEM_DELETE, id, payload: {pcb, _id: itemId}})
}

export function copyDataToBuffer(id) {
    return ({type: TYPES.FORM_DATA_COPY, id})
}


export default {
    initialize,
    flagHandle,
    createItem,
    deleteItem,
    changeField,
    updateMeta,
    changeRelationFiled,
    applyEntityItem,
    cancelEntityItem,
    deleteEntityItem,
    copyDataToBuffer
}