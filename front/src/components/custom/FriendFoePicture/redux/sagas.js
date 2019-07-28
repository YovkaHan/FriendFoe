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
    takeEvery(TYPES.UPDATE_DATA, updateDataHandle),
    takeEvery(TYPES.UPDATE_FILTER, updateFilterHandle)
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

function* updateDataHandle({payload, id}) {
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

    if (relationObject !== undefined) {
        const relationResult = yield call(getData, relationObject.api);
        const fractionResult = yield call(getData, fractionObject.api);
        resultPayload.relations = relationResult.hasOwnProperty('data') ? relationResult.data : [];
        resultPayload.fractions = fractionResult.hasOwnProperty('data') ? fractionResult.data : [];
    }

    yield put({type: TYPES.UPDATE_DATA_COMPLETE, payload: resultPayload, id});
    yield put({type: TYPES.UPDATE_FILTER, payload: resultPayload, id});
}

function* updateFilterHandle({payload, id}) {
    const resultPayload = {};

    Object.keys(payload).map(key => {
        resultPayload[key] = {
            all: true
        };

        if(Array.isArray(payload[key])){
            payload[key].map(prop => {
                resultPayload[key][prop._id] = false
            });
        }
    });

    yield put({type: TYPES.UPDATE_FILTER_COMPLETE, payload: resultPayload, id});
}