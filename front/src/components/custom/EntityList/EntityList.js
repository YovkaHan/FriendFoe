import React from 'react';
import {connect} from 'react-redux';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {flagHandle, deleteItem, valueChange, dataDownload, chooseItem} from './redux/actions';

import {List} from '../../';

const innerClass = (suffix, mainClass, rootClass) => {
    return `${mainClass}__${suffix} ${rootClass ? rootClass + '__' + suffix : ''}`.trim()
};

class Entity extends React.Component {
    render(){
        const {listItemData, index, className, onChoose} = this.props;
        return(
            <div className={`${className} entity`.trim()} onClick={()=>onChoose(listItemData)}>
                <div className={'entity__count'}>{index}.</div>
                <div className={'entity__name'}>{listItemData.name !== undefined ? listItemData.name : 'Test'}</div>
            </div>
        )
    }
}

class EntityList extends React.Component {

    static defaultProps = {
        className: '',
        rootClass: '',
        value: {}
    };

    constructor(props) {
        super(props);

        props.dataDownload(props.api);
    }

    handleChooseItem = (item) => {
        this.props.chooseItem(item);
    };

    render() {
        const {props, state, handleClick} = this;
        const {value, className, rootClass, disabled, listData} = props;
        const mainClass = 'c-entity-list';

        return (
            <div
                className={`${mainClass} ${className} ${rootClass}`.trim()}
                onClick={handleClick}
            >
                <div className={innerClass('content', mainClass, rootClass)}>
                    <List
                        data={listData}
                        Item={Entity}
                        className={'c-entity-list__main'}
                        rootClass={'list'}
                        itemProps={{rootClass:'c-entity-list', onChoose: this.handleChooseItem}}
                    />
                </div>
            </div>
        )
    }

    componentWillUnmount(){
        this.props.deleteComponent()
    }
}

EntityList.propTypes = {
    className: PropTypes.string,
    rootClass: PropTypes.string,
    value: PropTypes.object,
    pcb: PropTypes.object
};

const mapStateToProps = (state, props) => {
    const cId = props.pcbMade.id;
    const _object = state.Components.EntityList[cId];

    if(_object) {
        return ({
            flags: _object.flags,
            value: props.value ? props.value : _object.value,
            listData: _object.data
        })
    } else {
        return {};
    }
};

const mapDispatchers = (dispatch, props) => {
    const cId = props.pcbMade.id;

    return bindActionCreators({
        valueChange: (value) => valueChange(cId, value),
        deleteComponent: () => deleteItem(cId),
        dataDownload: (api) => dataDownload(cId, api !== undefined ? api : R.path(['props','api'], props.pcbMade)),
        chooseItem: (item) => chooseItem(cId, item)
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(EntityList);
