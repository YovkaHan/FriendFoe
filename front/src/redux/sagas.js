import {all} from 'redux-saga/effects';

import Button from '../components/custom/Button/redux/sagas';
import EntityList from '../components/custom/EntityList/redux/sagas';

export default function* rootSaga() {
    const sagas = [
        ...Button,
        ...EntityList
    ];

    yield all(sagas)
}