import React from 'react';
import * as R from 'ramda';
import {MdAddCircleOutline, MdCheckCircle} from 'react-icons/md';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {flagHandle, deleteItem, changeField, formInit, updateMeta} from './redux/actions';

const innerClass = (suffix, mainClass, rootClass) => {
    return `${mainClass}__${suffix} ${rootClass ? rootClass + '__' + suffix : ''}`.trim()
};

class FractionForm extends React.Component {

    static defaultProps = {
        className: '',
        rootClass: '',
        formFields: {},
        data: undefined,
        formData: {},
        bufferData: {}
    };

    constructor(props) {
        super(props);

        this.state = {
            addNewRelation: false,
            newFormFlag: false,
            name: '',
            icon: '',
            amount: '',
            relations: ''
        };

        props.data !== undefined ? props.formInit(props.data) : {};
    }

    static getDerivedStateFromProps(props, state) {
        const propsName = props.bufferData.hasOwnProperty('name') ? props.bufferData.name : props.formData.name;
        const propsIcon = props.bufferData.hasOwnProperty('icon') ? props.bufferData.icon : props.formData.icon;
        const propsAmount = props.bufferData.hasOwnProperty('amount') ? props.bufferData.amount : props.formData.amount;
        const propsRelations = props.bufferData.hasOwnProperty('relations') ? props.bufferData.relations : props.formData.relations;

        return {
            ...state,
            name: propsName !== undefined ? propsName : `${R.path(['name', 'default'], props.formFields) !== undefined ? props.formFields.name.default : ''}`,
            icon: propsIcon !== undefined ? propsIcon : `${R.path(['icon', 'default'], props.formFields) !== undefined ? props.formFields.icon.default : ''}`,
            amount: propsAmount !== undefined ? propsAmount : `${R.path(['amount', 'default'], props.formFields) !== undefined ? props.formFields.amount.default : ''}`,
            relations: propsRelations !== undefined ? propsRelations : `${R.path(['relations', 'default'], props.formFields) !== undefined ? props.formFields.relations.default : ''}`,
        }
    }

    handleNameChange = (e) => {
        this.props.changeField('name', e.target.value);
    };
    handleIconChange = (e) => {
        this.props.changeField('icon', e.target.value);
    };
    handleAmountChange = (e) => {
        this.props.changeField('amount', e.target.value);
    };
    handleToggleAddNewRelation = () => {
        this.setState({
            addNewRelation: !this.state.addNewRelation
        });
    };

    componentDidUpdate(){
        if (this.props.data.hasOwnProperty('_id') && this.props.data._id !== this.props.formData._id) {
            this.props.formInit(this.props.data);
            this.props.updateMeta(this.props.pcbMade);
            this.setState({
                newFormFlag: false
            });
        }
        if (!Object.keys(this.props.data).length && !this.state.newFormFlag) {
            this.props.formInit(this.props.data);
            this.props.updateMeta(this.props.pcbMade);
            this.setState({
                newFormFlag: true
            });
        }
    }

    render() {
        const {props, state, handleClick} = this;
        const {className, rootClass, formFields, metaData} = props;
        const {name, icon, amount, relations, addNewRelation} = state;
        const mainClass = 'c-form--fraction';

        console.log('RENDER');
        return (
            <div
                className={`${mainClass} ${className} ${rootClass}`.trim()}
                onClick={handleClick}
            >
                <div className={innerClass('content', mainClass, rootClass)}>
                    <div className={`form-block`}>
                        <div className={`form-block__name`}>Name</div>
                        <input className={`form-block__input`}
                               placeholder={'Input fraction name'}
                               value={name}
                               onChange={this.handleNameChange}
                        />
                    </div>
                    <div className={`form-block`}>
                        <div className={`form-block__name`}>Icon</div>
                        <input className={`form-block__input`}
                               placeholder={'Input fraction icon'}
                               value={icon}
                               onChange={this.handleIconChange}
                        />
                    </div>
                    <div className={`form-block`}>
                        <div className={`form-block__name`}>Amount</div>
                        <input className={`form-block__input`}
                               placeholder={'Input fraction amount'}
                               value={amount}
                               onChange={this.handleAmountChange}
                        />
                    </div>
                    <RelationBlock
                        {...this.props}
                        relations={relations}
                        addNewRelation={addNewRelation}
                        handleToggleAddNewRelation={this.handleToggleAddNewRelation}
                    />
                </div>
            </div>
        )
    }

    componentWillUnmount() {
        this.props.deleteComponent()
    }
}

FractionForm.propTypes = {
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
    const _object = state.Components.FractionForm[cId];
    const app = state.Components.App[props.pcbMade.relations.App.id];

    if (_object) {
        return ({
            flags: _object.flags,
            formFields: R.path(['configs', 'fields', 'fraction'], app),
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
        updateMeta: (pcb) => updateMeta(cId, pcb)
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(FractionForm);

function RelationBlock({formData, formFields, metaData, relations, addNewRelation, handleToggleAddNewRelation}) {
    const relationItem = (item) => metaData.hasOwnProperty('relations') ? metaData.relations.find(r => r._id === item._id) : undefined;
    const fractionItem = (id) => metaData.hasOwnProperty('fractions') ? metaData.fractions.find(r => r._id === id) : undefined;

    return (
        <div className={`form-block form-bock--relations`}>
            <div className={`form-block__name`}>Relations</div>
            <div className={`form-block_box relation`}>
                <div className={`form-block_box__item`}>
                    <div className={'relation__add'} onClick={handleToggleAddNewRelation}>
                        {
                            addNewRelation ? <MdCheckCircle className={'icon'}/> :
                                <MdAddCircleOutline className={'icon'}/>
                        }
                    </div>
                    <select className={`form-block__input`}>
                        {
                            metaData.hasOwnProperty('relations') ?
                                metaData.relations.map(item =>
                                    (<option key={item._id} value={item._id}>{item.name}</option>)
                                ) : null
                        }
                    </select>
                    <select className={`form-block__input`}>
                        {
                            metaData.hasOwnProperty('fractions') ?
                                metaData.fractions.map(item => {
                                    if(formData.hasOwnProperty('_id') && formData._id === item._id){
                                        return null;
                                    }
                                    return <option key={item._id} value={item._id}>{item.name}</option>;
                                }) : null
                        }
                    </select>
                </div>
                <div style={{display: 'flex'}}>
                    <div className={`form-block_box__item`}>
                        {
                            relations.map(r => (
                                <div>{R.path(['name'], fractionItem(r))}</div>)
                            )
                        }
                    </div>
                    <div className={`form-block_box__item`}>
                        {
                            relations.map(r => (
                                <div>{R.path(['name'], relationItem(r.a))}</div>)
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
