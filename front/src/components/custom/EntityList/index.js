import React from 'react';
import EntityList from './EntityList';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import actions, {createItem} from './redux/actions';

import './EntityList.scss';

export const componentName = 'EntityList';

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            created: false
        };

        props.createItem(props.core.id, (_id) => {
            this.state = {...this.state, created: true, _id};
        });
    }

    render() {
        const {template, pcb, relations} = this.props.core;
        return (
            this.state.created ?
                <EntityList {...this.props} pcbMade={pcb.make(this.state._id, template, relations)}/> : null
        )
    }
}

const mapDispatchers = (dispatch) => {
    return bindActionCreators({
        createItem: (id, next) => createItem(id, next),
    }, dispatch);
};

export default {
    Component: connect(undefined, mapDispatchers)(Component),
    actions
}