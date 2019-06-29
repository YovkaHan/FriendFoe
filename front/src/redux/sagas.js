import {all} from 'redux-saga/effects';

import Button from '../components/custom/Button/redux/sagas';

export default function* rootSaga() {
    const sagas = [
        ...Button
    ];

    yield all(sagas)
}