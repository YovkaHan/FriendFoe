import {select, takeEvery, put, take, call} from 'redux-saga/effects'
import * as R from "ramda";
import {TYPES, name} from "./types";
import {INIT_STATE_ITEM} from './reducer';
import {componentName} from '../';
import {postData, deleteData, putData} from "../../../../common/lib";

const idMake = (index) => name + index;

export default [
    takeEvery(TYPES.FLAGS, flagHandleComplete),
    takeEvery(TYPES.ITEM_CREATE, createItemHandle),
    takeEvery(TYPES.ITEM_DELETE, deleteItemHandle),
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

function* cancelEntityItemHandle({id}) {
    yield put({type: TYPES.FORM_INIT, id});
}

function* applyEntityItemHandle({payload, id}) {
    const state = yield select();
    const {pcb} = payload;
    const {App} = pcb.relations;

    const appObject = R.clone(state.Components[App.component][App.id]);
    const componentObject = R.clone(state.Components[componentName][id]);

    const relationObject = R.path(['configs', 'entities'], appObject).find(item => item._id === 'relation');
    let transactionResult = {};

    if(componentObject.data.hasOwnProperty('_id')){
        transactionResult = yield call(putData, `${relationObject.api}/${componentObject.data._id}`, componentObject.buffer);
    }else {
        transactionResult = yield call(postData, relationObject.api, componentObject.buffer);
    }

    yield put({type: TYPES.FORM_ITEM_APPLY_COMPLETE, payload: transactionResult, id});
}

function* deleteEntityItemHandle({payload, id}) {
    const state = yield select();
    const {pcb} = payload;
    const {App} = pcb.relations;

    const appObject = R.clone(state.Components[App.component][App.id]);
    const componentObject = R.clone(state.Components[componentName][id]);

    const relationObject = R.path(['configs', 'entities'], appObject).find(item => item._id === 'relation');

    const transactionResult = yield call(deleteData, `${relationObject.api}/${componentObject.data._id}`);

    yield put({type: TYPES.FORM_ITEM_DELETE_COMPLETE, payload: transactionResult, id});
}