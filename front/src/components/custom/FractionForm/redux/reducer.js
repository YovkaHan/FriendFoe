import {TYPES} from './types';
import {createReducer} from '../../../../redux/common'
import * as R from 'ramda';


const INIT_STATE = {
    length: 0
};

export const INIT_STATE_ITEM = {
    flags: {
        toggle: false,
        hover: false
    },
    data: {
        name: undefined,
        icon: undefined,
        amount: 0,
        relations: [],
        unions: []
    },
    buffer: {},
    meta: {}
};

const cases = (type) => {
    switch (type) {
        case TYPES.LENGTH_PLUS: {
            return (draft, payload, id) => {
                draft.length = draft.length + payload;
            };
        }
        case TYPES.ITEM_CREATE_COMPLETE: {
            return (draft, payload, id) => {
                draft[id] = payload;
            };
        }
        case TYPES.ITEM_DELETE_COMPLETE: {
            return (draft, payload, id) => {
                draft.length = draft.length - 1;
                delete draft[id];
            };
        }
        case TYPES.FLAGS_COMPLETE: {
            return (draft, payload, id) => {
                draft[id].flags = payload;
            };
        }
        case TYPES.CHANGE: {
            return (draft, payload, id) => {
                draft[id][payload.key] = payload.value;
            };
        }
        case TYPES.INITIALIZE: {
            const _initClone = R.clone(INIT_STATE_ITEM);
            return draft => {
                Object.keys(_initClone).map(d => {
                    draft[d] = _initClone[d];
                });
            };
        }
        case TYPES.CHANGE_FIELD: {
            return (draft, payload, id) => {
                draft[id].buffer[payload.key] = payload.value
            };
        }
        case TYPES.FORM_INIT: {
            return (draft, payload, id) => {
                draft[id].buffer = {};
                draft[id].data = R.clone(payload);
            };
        }
        case TYPES.FORM_ITEM_APPLY: {
            return (draft, payload, id) => {
                draft[id].flags.transaction = true;
            };
        }
        case TYPES.FORM_ITEM_APPLY_COMPLETE: {
            return (draft, payload, id) => {
                draft[id].transactionResult = payload;
                draft[id].flags.transaction = false;
                if(!payload.hasOwnProperty('errors')){
                    draft[id].buffer = {};
                }
            };
        }
        case TYPES.FORM_ITEM_DELETE: {
            return (draft, payload, id) => {
                draft[id].flags.transaction = true;
            };
        }
        case TYPES.FORM_ITEM_DELETE_COMPLETE: {
            return (draft, payload, id) => {
                draft[id].transactionResult = payload;
                draft[id].flags.transaction = false;
            };
        }
        case TYPES.UPDATE_META_COMPLETE: {
            return (draft, payload, id) => {
                draft[id].meta = payload;
            };
        }
        default : {
            return () => {
            }
        }
    }
};

const reducer = function (id) {
    return createReducer(cases, INIT_STATE, id);
};

export default reducer;
