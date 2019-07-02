import React from 'react';
import * as R from 'ramda';
import {MdAddCircleOutline, MdCheckCircle} from 'react-icons/md';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {
    flagHandle,
    deleteItem,
    changeField,
    formInit,
    applyEntityItem,
    cancelEntityItem,
    deleteEntityItem,
    copyDataToBuffer
} from './redux/actions';

const innerClass = (suffix, mainClass, rootClass) => {
    return `${mainClass}__${suffix} ${rootClass ? rootClass + '__' + suffix : ''}`.trim()
};

class RelationForm extends React.Component {

    static defaultProps = {
        className: '',
        rootClass: '',
        formFields: {},
        data: undefined,
        formData: {},
        bufferData: {},
        quitItem: ()=>{}
    };

    constructor(props) {
        super(props);

        this.state = {
            addNewRelation: false,
            newFormFlag: false,
            deleting: false,
            applying: false,
            name: '',
            color: ''
        };

        props.data !== undefined ? props.formInit(props.data) : {};
    }

    static getDerivedStateFromProps(props, state) {
        const propsName = props.bufferData.hasOwnProperty('name') ? props.bufferData.name : props.formData.name;
        const propsIcon = props.bufferData.hasOwnProperty('color') ? props.bufferData.color : props.formData.color;

        return {
            ...state,
            name: propsName !== undefined ? propsName : '',
            color: propsIcon !== undefined ? propsIcon : ''
        }
    }

    handleNameChange = (e) => {
        this.props.changeField('name', e.target.value);
    };
    handleIconChange = (e) => {
        this.props.changeField('color', e.target.value);
    };
    handleDeleteItem = () => {
        this.props.deleteItem();
        this.setState({deleting: true});
    };
    handleApplyItem = () => {
        this.props.applyItem();
        this.setState({applying: true});
    };
    handleCancelItem = () => {
        this.props.cancelItem();
    };

    componentDidUpdate(){
        if (this.props.data.hasOwnProperty('_id') && JSON.stringify(this.props.data) !== JSON.stringify(this.props.formData)) {
            this.props.formInit(this.props.data);
            this.setState({
                newFormFlag: false
            });
        }
        if (!Object.keys(this.props.data).length && !this.state.newFormFlag) {
            this.props.formInit({
                name: `${R.path(['name', 'default'], this.props.formFields) !== undefined ? this.props.formFields.name.default : ''}`,
                color: `${R.path(['color', 'default'], this.props.formFields) !== undefined ? this.props.formFields.color.default : ''}`
            });
            this.setState({
                newFormFlag: true
            }, ()=>{
                this.props.copyDataToBuffer();
            });
        }
        if(this.state.deleting && !this.props.transactionFlag){
            this.setState({deleting: false}, ()=> {
                if(!this.props.transactionResult.hasOwnProperty('errors')){
                    this.props.quitItem();
                }
            });
        }
        if(this.state.applying && !this.props.transactionFlag){
            this.setState({applying: false}, ()=> {
                if(!this.props.transactionResult.hasOwnProperty('errors')){
                    this.props.goToItem(this.props.data.hasOwnProperty('_id') ? this.props.data._id : this.props.transactionResult._id);
                }
            });
        }
    }

    render() {
        const {props, state, handleClick} = this;
        const {className, rootClass, formFields, metaData, bufferData} = props;
        const {name, color} = state;
        const mainClass = 'c-form--relation';

        const someChanges = !!Object.keys(bufferData).length;

        return (
            <div
                className={`${mainClass} ${className} ${rootClass}`.trim()}
                onClick={handleClick}
            >
                <div className={innerClass('content', mainClass, rootClass)}>
                    <div className={`form-block`}>
                        <div className={`form-block__name`}>Name</div>
                        <input className={`form-block__input form-block__input--text`}
                               placeholder={'Input fraction name'}
                               value={name}
                               onChange={this.handleNameChange}
                        />
                    </div>
                    <div className={`form-block`}>
                        <div className={`form-block__name`}>Color</div>
                        <input className={`form-block__input form-block__input--text`}
                               placeholder={'Input fraction icon'}
                               value={color}
                               onChange={this.handleIconChange}
                        />
                    </div>
                    <div className={`c-form__footer`}>
                        <button
                            className={`c-form__button c-form__button--delete`}
                            onClick={this.handleDeleteItem}>Delete</button>
                       <div>
                           <button
                               className={`c-form__button c-form__button--ok`}
                               onClick={this.handleApplyItem}>Ok</button>
                           <button
                               disabled={!someChanges}
                               className={`c-form__button c-form__button--cancel ${someChanges ? '':'disabled'}`.trim()}
                               onClick={this.handleCancelItem}>Cancel</button>
                       </div>
                    </div>
                </div>
            </div>
        )
    }

    componentWillUnmount() {
        this.props.deleteComponent()
    }
}

RelationForm.propTypes = {
    className: PropTypes.string,
    rootClass: PropTypes.string,
    pcb: PropTypes.object,
    data: PropTypes.object,
    formData: PropTypes.object,
    bufferData: PropTypes.object,
    formFields: PropTypes.object
};

const mapStateToProps = (state, props) => {
    const cId = props.pcbMade.id;
    const _object = state.Components.RelationForm[cId];
    const app = state.Components.App[props.pcbMade.relations.App.id];

    console.log(_object);

    if (_object) {
        return ({
            flags: _object.flags,
            transactionResult: _object.transactionResult,
            transactionFlag: _object.flags.transaction,
            formFields: R.path(['configs', 'fields', 'relation'], app),
            formData: _object.data,
            bufferData: _object.buffer,
            metaData: _object.meta
        })
    } else {
        return {};
    }
};

const mapDispatchers = (dispatch, props) => {
    const cId = props.pcbMade.id;

    return bindActionCreators({
        deleteComponent: () => deleteItem(cId),
        changeField: (key, value) => changeField(cId, key, value),
        formInit: (data) => formInit(cId, data),
        applyItem: () => applyEntityItem(cId, props.pcbMade),
        cancelItem: () => cancelEntityItem(cId, props.pcbMade),
        deleteItem: () => deleteEntityItem(cId, props.pcbMade),
        copyDataToBuffer: () => copyDataToBuffer(cId)
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(RelationForm);
