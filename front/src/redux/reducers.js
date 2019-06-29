import Button from '../components/custom/Button/redux/reducer';
import {combineReducers} from 'redux';

export default {
    Components: combineReducers({
        Button: Button()
    })
};
