import React from 'react';
import RelationForm from './RelationForm';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import actions, {createItem} from './redux/actions';

import './RelationForm.scss';

export const componentName = 'RelationForm';

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            created: false
        };
    }

    componentDidMount(){
        this.props.createItem(this.props.core.id, (_id)=>{
            this.setState({created: true, _id});
        });
    }

    render() {
        const {template, pcb, relations} = this.props.core;
        return (
            this.state.created ?
                <RelationForm {...this.props} pcbMade={pcb.make(this.state._id, template, relations)}/> : null
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