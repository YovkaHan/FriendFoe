import App from '../components/custom/App/redux/reducer';
import Button from '../components/custom/Button/redux/reducer';
import EntityList from '../components/custom/EntityList/redux/reducer';
import FractionForm from '../components/custom/FractionForm/redux/reducer';
import UnionForm from '../components/custom/UnionForm/redux/reducer';
import {combineReducers} from 'redux';

export default {
    Components: combineReducers({
        App: App(),
        Button: Button(),
        EntityList: EntityList(),
        FractionForm: FractionForm(),
        UnionForm: UnionForm()
    })
};
