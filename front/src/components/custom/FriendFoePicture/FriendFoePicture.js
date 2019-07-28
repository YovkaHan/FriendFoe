import React from 'react';
import * as R from 'ramda';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {
    //flagHandle,
    deleteItem,
    // changeField,
    // formInit,
    updateData,
    filterChange,
    // changeRelationFiled,
    // applyEntityItem,
    // cancelEntityItem,
    // deleteEntityItem
} from './redux/actions';

import Picture from './canvas';

const innerClass = (suffix, mainClass, rootClass) => {
    return `${mainClass}__${suffix} ${rootClass ? rootClass + '__' + suffix : ''}`.trim()
};

const amountToRadius = (amount) => {
    if(amount >= 1 && amount < 1000) {
        return 5;
    } else if (amount >= 1000 && amount < 5000){
        return 10;
    } else if (amount >= 5000 && amount < 10000){
        return 15;
    } else if (amount >= 10000 && amount < 20000){
        return 20;
    } else if (amount >= 20000 && amount < 30000){
        return 25;
    } else if (amount >= 30000 && amount < 50000){
        return 30;
    } else if (amount >= 50000 && amount < 100000){
        return 35;
    } else if (amount >= 100000 && amount < 200000){
        return 40;
    } else if (amount >= 200000 && amount < 500000){
        return 45;
    } else {
        return 50;
    }
};

function FilterItemOptions({data = {}, filterData = {}, handler = ()=>{}}) {
    const clickHandler = (e, key) => {
        handler(key, e.target.checked);
    };
    const labelRender = (id) => {
      const item = data.find(el => el._id === id);
      return id === 'all' ? id : item ? item.name : ''
    };
    const optionsRender = Object.keys(filterData).map(item => {
        return (
            <div key={item} className={'filter-item-option'}>
                <label>{labelRender(item)}</label>
                <input type={'checkbox'} checked={filterData[item]} onChange={(e)=>clickHandler(e, item)}/>
            </div>
        )
    });
    return (
        <div className={'item__options'}>
            {optionsRender}
        </div>
    )
}

class FriendFoePicture extends React.Component {

    static defaultProps = {
        className: '',
        rootClass: '',
        data: {},
        filter: {},
        isLoading: true,
        filterChange: ()=>{}
    };

    constructor(props) {
        super(props);

        this.state = {
            canvasId: 'cID',
            initCanvas: false
        };
    }

    filterItemOptionHandler = (path, value) => {
        this.props.filterChange(path, value)
    };


    componentDidUpdate(prevProps, prevState) {
        if(!this.props.isLoading && prevProps.isLoading !== this.props.isLoading){
           this.setState({initCanvas: true})
        }
        if(this.state.initCanvas){
           this.setState({initCanvas: false}, ()=>{
               Picture.init(this.state.canvasId);
           })
        }
    }

    componentDidMount(){
        this.props.updateData(this.props.pcbMade);
    }

    render() {
        const {props, state, handleClick, filterItemOptionHandler} = this;
        const {className, rootClass, data, filter, isLoading} = props;
        const {canvasId} = state;
        const mainClass = 'c-picture';

        if(Picture.isInitiated()){
            /**Fractions*/
            const fractions = Picture.getPoints();
            const fractionsThatShouldBeAdded = Object.keys(filter.fractions).filter(f=>filter.fractions[f]);

            if(fractionsThatShouldBeAdded.includes('all')){
                Object.keys(filter.fractions).map(f=>{
                    if(f !== 'all'){
                        const fraction = data.fractions.find(item => item._id === f);

                        if(fraction !== undefined && !fractions.includes(f)){
                            Picture.addPoint(amountToRadius(fraction.amount), f);
                            console.log(f, amountToRadius(fraction.amount));
                        }
                    }
                })
            }else {
                fractions.map(f=>{
                    if(!fractionsThatShouldBeAdded.includes(f)){
                        Picture.removePoint(f);
                    }
                });
                fractionsThatShouldBeAdded.map(f=>{
                    if(!fractions.includes(f)){
                        const fraction = data.fractions.find(item => item._id === f);
                        Picture.addPoint(amountToRadius(fraction.amount), f);
                    }
                })
            }
            /**Fractions*/
        }

        return (
            <div
                className={`${mainClass} ${className} ${rootClass}`.trim()}
                onClick={handleClick}
            >
                {
                    Object.keys(data).length ?
                        <div className={innerClass('content', mainClass, rootClass)}>
                            <div className={`${mainClass}__filter filter`}>
                                {
                                    Object.keys(filter).map((itemName) => (
                                        <div key={itemName} className={'filter__item item'}>
                                            <div className={'item__name'}>{itemName}</div>
                                            <FilterItemOptions
                                                data={data[itemName]}
                                                filterData={filter[itemName]}
                                                handler={(key, value)=>filterItemOptionHandler([itemName, key], value)}
                                            />
                                        </div>
                                    ))
                                }
                            </div>
                            <div className={`${mainClass}__canvas`}>
                                <canvas id={canvasId}></canvas>
                            </div>
                        </div> :
                        null
                }
                {
                    isLoading ? <div className={`${mainClass}__loading`}></div> : null
                }
            </div>
        )
    }

    componentWillUnmount() {
        this.props.deleteComponent()
    }
}

FriendFoePicture.propTypes = {
    className: PropTypes.string,
    rootClass: PropTypes.string,
    pcb: PropTypes.object,
    data: PropTypes.object,
    bufferData: PropTypes.object,
    formFields: PropTypes.object,
    newFlag: PropTypes.bool
};

const mapStateToProps = (state, props) => {
    const cId = props.pcbMade.id;
    const _object = state.Components.FriendFoePicture[cId];

    if (_object) {
        return ({
            isLoading: _object.flags.loading,
            data: _object.data,
            filter: _object.filter
        })
    } else {
        return {};
    }
};

const mapDispatchers = (dispatch, props) => {
    const cId = props.pcbMade.id;

    return bindActionCreators({
        deleteComponent: () => deleteItem(cId),
        // changeField: (key, value) => changeField(cId, key, value),
        // formInit: (data) => formInit(cId, data),
        // applyItem: (itemId) => applyEntityItem(cId, props.pcbMade, itemId),
        // cancelItem: () => cancelEntityItem(cId, props.pcbMade),
        // deleteItem: (itemId) => deleteEntityItem(cId, props.pcbMade, itemId),
        filterChange: (path, value) => filterChange(cId, path, value),
        updateData: (pcb) => updateData(cId, pcb),
        // changeRelationFiled: (action, object) => changeRelationFiled(cId, action, object)
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(FriendFoePicture);