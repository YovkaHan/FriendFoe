import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from "react-router-dom";
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
// import {ConnectedRouter, routerMiddleware} from 'react-router-redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {Provider} from 'react-redux';
import App from './src/components/custom/App';
import reducers from './src/redux/reducers';
import rootSaga from './src/redux/sagas';

import './vendor/normalize.css';
import {pcbGenerate} from './src/common/pcb';
import {pcbTemplate} from './src/common/appConfig';

const logger = createLogger({duration: true, diff: false});
// const history = createHistory();

const pcb = pcbGenerate(pcbTemplate);

const findTypyes = (action) => {
    const types = [];

    return types.some(type => action.type.indexOf(type) >= 0);
};

const actionSanitizer = action => (
    findTypyes(action) && action.payload ?
        {...action, payload: "TOO LONG"} : action
);

const reduxDevtoolsExtensionOptions = {
    actionSanitizer
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(reduxDevtoolsExtensionOptions) || compose;
const sagaMiddleware = createSagaMiddleware();
// const middleware = process.env.NODE_ENV === 'development' ?
//     [thunk, sagaMiddleware] :
//     [thunk, sagaMiddleware];

const store = createStore(
    combineReducers(reducers),
    composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

const rootElement = document.getElementById('root');

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <App.Component core={{pcb, id: 'app0'}}/>
        </Router>
    </Provider>,
    rootElement
);
