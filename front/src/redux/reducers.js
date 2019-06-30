import Button from '../components/custom/Button/redux/reducer';
import EntityList from '../components/custom/EntityList/redux/reducer';
import {combineReducers} from 'redux';

export default {
    Components: combineReducers({
        Button: Button(),
        EntityList: EntityList()
    })
};
