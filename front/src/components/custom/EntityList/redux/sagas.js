import {select, takeEvery, put, take, call} from 'redux-saga/effects'
import * as R from "ramda";
import axios from 'axios';
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

function* dataDownloadHandle({id, payload}) {
    const {api} = payload;
    console.log(api);
    yield put({type: TYPES.FLAGS, payload: {key: 'loading', value: true}, id});
    const data = yield call(dataDownload, payload);
    yield put({type: TYPES.FLAGS, payload: {key: 'loading', value: false}, id});
    yield put({type: TYPES.CHANGE, payload: {key: 'data', value: data}, id});
}

const dataDownload = (api) => {
    return axios.get(`${SERVER}${api}`).then(function (response) {
        console.log(response);
        return response.data;
    }).catch(error => {
        console.error(error);
        return error;
    })
};