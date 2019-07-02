import {all} from 'redux-saga/effects';

import App from '../components/custom/App/redux/sagas';
import Button from '../components/custom/Button/redux/sagas';
import EntityList from '../components/custom/EntityList/redux/sagas';
import FractionForm from '../components/custom/FractionForm/redux/sagas';
import UnionForm from '../components/custom/UnionForm/redux/sagas';
import RelationForm from '../components/custom/RelationForm/redux/sagas';

export default function* rootSaga() {
    const sagas = [
        ...App,
        ...Button,
        ...EntityList,
        ...FractionForm,
        ...UnionForm,
        ...RelationForm
    ];

    yield all(sagas)
}