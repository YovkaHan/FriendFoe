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

export function updateData(id, pcb) {
    return ({type: TYPES.UPDATE_DATA, payload: pcb, id})
}

export function filterChange(id, path, value) {
    return ({type: TYPES.FILTER_CHANGE, payload: {path, value}, id})
}

export default {
    initialize,
    flagHandle,
    createItem,
    deleteItem,
    changeField,
    updateData,
    filterChange
}