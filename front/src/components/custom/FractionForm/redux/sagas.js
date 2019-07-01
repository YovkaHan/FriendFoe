import {select, takeEvery, put, take, call} from 'redux-saga/effects'
import * as R from "ramda";
import {TYPES, name} from "./types";
import {INIT_STATE_ITEM} from './reducer';
import {componentName} from '../';
import {dataDownload} from "../../../../common/lib";

const idMake = (index) => name + index;

export default [
    takeEvery(TYPES.FLAGS, flagHandleComplete),
    takeEvery(TYPES.ITEM_CREATE, createItemHandle),
    takeEvery(TYPES.ITEM_DELETE, deleteItemHandle),
    takeEvery(TYPES.UPDATE_META, updateMetaInfoHandle)
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
    const relationObject = R.path(['configs', 'entities'], appObject).find(item => item.id === 'relation');
    const fractionObject = R.path(['configs', 'entities'], appObject).find(item => item.id === 'fraction');

    if(relationObject !== undefined){
        resultPayload.relations = yield call(dataDownload, relationObject.api);
        resultPayload.fractions = yield call(dataDownload, fractionObject.api);
    }

    yield put({type: TYPES.UPDATE_META_COMPLETE, payload: resultPayload, id});
}