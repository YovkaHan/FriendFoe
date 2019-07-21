import {select, takeEvery, put, take, call} from 'redux-saga/effects'
import * as R from "ramda";
import {TYPES, name} from "./types";
import {INIT_STATE_ITEM} from './reducer';
import {componentName} from '../';
import {deleteData, getData, postData, putData} from "../../../../common/lib";

const idMake = (index) => name + index;

export default [
    takeEvery(TYPES.FLAGS, flagHandleComplete),
    takeEvery(TYPES.ITEM_CREATE, createItemHandle),
    takeEvery(TYPES.ITEM_DELETE, deleteItemHandle),
    takeEvery(TYPES.UPDATE_META, updateMetaInfoHandle),
    takeEvery(TYPES.CHANGE_RELATION_FIELD, relationFieldChangeHandle),
    takeEvery(TYPES.FORM_ITEM_CANCEL, cancelEntityItemHandle),
    takeEvery(TYPES.FORM_ITEM_APPLY, applyEntityItemHandle),
    takeEvery(TYPES.FORM_ITEM_DELETE, deleteEntityItemHandle)
];


function* createItemHandle({id, payload}) {
    const {callback} = payload;
    const _id = id ? id : yield call(function* () {
        const state = yield select();
        const {length} = state.Components[componentName];

        return idMake(length);
    });

    yield put({type: TYPES.LENGTH_PLUS, payload: 1});
    yield put({type: TYPES.ITEM_CREATE_COMPLETE, payload: R.clone(INIT_STATE_ITEM), id: _id});
    callback(_id);
}

function* deleteItemHandle({type, id}) {
    yield put({type: TYPES.ITEM_DELETE_COMPLETE, id});
}

function* flagHandleComplete({type, payload, id}) {
    const state = yield select();

    const _object = R.clone(state.Components[componentName][id]);
    const {key, value} = payload;

    if (value !== undefined) {
        _object.flags[key] = value;
    } else {
        _object.flags[key] = !_object.flags[key];
    }

    yield put({type: TYPES.FLAGS_COMPLETE, payload: _object.flags, id});
}

function* updateMetaInfoHandle({payload, id}) {
    const pcb = payload;
    const state = yield select();
    const {App} = pcb.relations;

    const appObject = R.clone(state.Components[App.component][App.id]);
    const resultPayload = {
        relations: [],
        fractions: []
    };
    const relationObject = R.path(['configs', 'entities'], appObject).find(item => item._id === 'relation');
    const fractionObject = R.path(['configs', 'entities'], appObject).find(item => item._id === 'fraction');

    if(relationObject !== undefined){
        resultPayload.relations = yield call(getData, relationObject.api);
        resultPayload.fractions = yield call(getData, fractionObject.api);
    }

    yield put({type: TYPES.UPDATE_META_COMPLETE, payload: resultPayload, id});
}

function* relationFieldChangeHandle({payload, id}) {
    const {action, object} = payload;
    const state = yield select();
    const componentObject = R.clone(state.Components[componentName][id]);
    let relations = R.clone(R.path(['buffer', 'relations'], componentObject));

    switch (action) {
        case 'add': {
            relations.push(object);
            break;
        }
        case 'init': {
            relations = R.clone(object !== undefined ? object : []);
            break;
        }
        case 'delete': {
            relations.splice(object, 1);
            break;
        }
        default: {

        }
    }
    yield put({type: TYPES.CHANGE_FIELD, payload: {key: 'relations', value: relations}, id});
}

function* cancelEntityItemHandle({id}) {
    yield put({type: TYPES.FORM_INIT, id});
}

function* applyEntityItemHandle({payload, id}) {
    const state = yield select();
    const {pcb, _id} = payload;
    const {App} = pcb.relations;

    const appObject = R.clone(state.Components[App.component][App.id]);
    const componentObject = R.clone(state.Components[componentName][id]);

    const fractionObject = R.path(['configs', 'entities'], appObject).find(item => item._id === 'fraction');
    const customRelationObject = R.path(['configs', 'entities'], appObject).find(item => item._id === 'fraction');
    let transactionResult = {};

    const customRelationTransactionResult = yield call(postData, `${fractionObject.api}/${_id}/relations`, {data: componentObject.buffer.relations.filter(r=> !r.hasOwnProperty('_id'))});

    if(customRelationTransactionResult.hasOwnProperty('errors')){

    }else {
        const relationsToAdd = componentObject.buffer.relations.filter(r => !!r.hasOwnProperty('_id'));
        componentObject.buffer.relations = Array.prototype.concat(relationsToAdd, customRelationTransactionResult);
        if(_id){
            transactionResult = yield call(putData, `${fractionObject.api}/${_id}`, componentObject.buffer);
        }else {
            transactionResult = yield call(postData, fractionObject.api, componentObject.buffer);
        }

        yield put({type: TYPES.FORM_ITEM_APPLY_COMPLETE, payload: transactionResult, id});
    }
}

function* deleteEntityItemHandle({payload, id}) {
    const state = yield select();
    const {pcb, _id} = payload;
    const {App} = pcb.relations;

    const appObject = R.clone(state.Components[App.component][App.id]);

    const relationObject = R.path(['configs', 'entities'], appObject).find(item => item._id === 'fraction');

    const transactionResult = yield call(deleteData, `${relationObject.api}/${_id}`);

    yield put({type: TYPES.FORM_ITEM_DELETE_COMPLETE, payload: transactionResult, id});
}