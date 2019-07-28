import {select, takeEvery, put, take, call} from 'redux-saga/effects'
import * as R from "ramda";
import {getData} from '../../../../common/lib';
import {TYPES, name} from "./types";
import {INIT_STATE_ITEM} from './reducer';
import {componentName} from '../';

const idMake = (index) => name + index;

export default [
    takeEvery(TYPES.FLAGS, flagHandleComplete),
    takeEvery(TYPES.ITEM_CREATE, createItemHandle),
    takeEvery(TYPES.ITEM_DELETE, deleteItemHandle),
    takeEvery(TYPES.DATA_DOWNLOAD, dataDownloadHandle)
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

function* dataDownloadHandle(action) {
    const {id, payload} = action;
    yield put({type: TYPES.FLAGS, payload: {key: 'loading', value: true}, id});
    const result = yield call(getData, payload);
    if(result.hasOwnProperty('data')){
        yield put({type: TYPES.CHANGE, payload: {key: 'data', value: result.data}, id});
    }
    yield put({type: TYPES.FLAGS, payload: {key: 'loading', value: false}, id});
}