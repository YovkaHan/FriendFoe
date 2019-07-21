import React from 'react';
import * as R from 'ramda';
import {MdAddCircleOutline, MdCheckCircle, MdClear} from 'react-icons/md';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {
    flagHandle,
    deleteItem,
    changeField,
    formInit,
    updateMeta,
    changeRelationFiled,
    applyEntityItem,
    cancelEntityItem,
    deleteEntityItem
} from './redux/actions';

const innerClass = (suffix, mainClass, rootClass) => {
    return `${mainClass}__${suffix} ${rootClass ? rootClass + '__' + suffix : ''}`.trim()
};

class FractionForm extends React.Component {

    static defaultProps = {
        className: '',
        rootClass: '',
        formFields: {},
        formData: {},
        data: {},
        bufferData: {},
        newFlag: false
    };

    constructor(props) {
        super(props);

        this.state = {
            addNewRelation: false,
            newFormFlag: false,
            name: '',
            icon: '',
            amount: '',
            relations: [],
            newRelation: {}
        };

        if (!props.data.hasOwnProperty('_id'))
            props.formInit({
                name: `${R.path(['name', 'default'], props.formFields) !== undefined ? props.formFields.name.default : ''}`,
                icon: `${R.path(['icon', 'default'], props.formFields) !== undefined ? props.formFields.icon.default : ''}`,
                amount: `${R.path(['amount', 'default'], props.formFields) !== undefined ? props.formFields.amount.default : ''}`,
                relations: R.path(['relations', 'default'], props.formFields) !== undefined ? props.formFields.relations.default : [],
            });
        props.updateMeta(props.pcbMade);
    }

    static getDerivedStateFromProps(props, state) {
        const propsName = props.bufferData.hasOwnProperty('name') ? props.bufferData.name : !props.data.hasOwnProperty('_id') ? props.formData.name : props.data.name;
        const propsIcon = props.bufferData.hasOwnProperty('icon') ? props.bufferData.icon : !props.data.hasOwnProperty('_id') ? props.formData.icon : props.data.icon;
        const propsAmount = props.bufferData.hasOwnProperty('amount') ? props.bufferData.amount : !props.data.hasOwnProperty('_id') ? props.formData.amount : props.data.amount;
        const propsRelations = props.bufferData.hasOwnProperty('relations') ? props.bufferData.relations : !props.data.hasOwnProperty('_id') ? props.formData.relations : props.data.relations;

        return {
            ...state,
            name: propsName !== undefined ? propsName : '',
            icon: propsIcon !== undefined ? propsIcon : '',
            amount: propsAmount !== undefined ? propsAmount : '',
            relations: propsRelations !== undefined ? propsRelations : []
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
            addNewRelation: !this.state.addNewRelation,
        }, () => {
            if (!this.state.addNewRelation && Object.keys(this.state.newRelation).length) {
                this.props.changeRelationFiled('add', this.state.newRelation);
            } else if (this.state.addNewRelation && !this.props.bufferData.hasOwnProperty('relations')) {
                this.props.changeRelationFiled('init', this.props.data.relations);
            }
        });
    };
    newRelationAddOnChange = (key, e) => {
        const value = e.target.value;
        this.setState({newRelation: {...this.state.newRelation, [key]: value}})
    };

    handleDeleteItem = () => {
        this.props.deleteItem(this.props.data._id);
        this.setState({deleting: true});
    };
    handleApplyItem = () => {
        this.props.applyItem(this.props.data._id);
        this.setState({applying: true});
    };
    handleCancelItem = () => {
        this.setState({addNewRelation: false, newRelation: {}});
        this.props.cancelItem();
    };
    deleteRelation = (index) => {
        this.props.changeRelationFiled('init', this.props.data.relations);
        this.props.changeRelationFiled('delete', index);
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.props.data.hasOwnProperty('_id') && this.props.data._id !== this.props.data._id) {
            this.props.formInit(this.props.data);
            this.props.updateMeta(this.props.pcbMade);
            this.setState({
                newFormFlag: false
            });
        }
        // } else if (!Object.keys(this.props.data).length && !this.state.newFormFlag) {
        //     this.props.formInit(this.props.data);
        //     this.props.updateMeta(this.props.pcbMade);
        //     this.setState({
        //         newFormFlag: true
        //     });
        // }
        if (this.state.deleting && !this.props.transactionFlag) {
            this.setState({deleting: false}, () => {
                if (!this.props.transactionResult.hasOwnProperty('errors')) {
                    this.props.quitItem();
                }
            });
        } else if (this.state.applying && !this.props.transactionFlag) {
            this.setState({applying: false}, () => {
                if (!this.props.transactionResult.hasOwnProperty('errors')) {
                    this.props.goToItem(this.props.data.hasOwnProperty('_id') ? this.props.data._id : this.props.transactionResult._id);
                }
            });
        }
        if (this.props.newFlag !== prevProps.newFlag) {
            this.setState({
                addNewRelation: false
            });
        }
    }

    render() {
        const {props, state, handleClick} = this;
        const {className, rootClass, formFields, metaData, bufferData} = props;
        const {name, icon, amount, relations, addNewRelation, newRelation} = state;
        const mainClass = 'c-form--fraction';

        const someChanges = !!Object.keys(bufferData).length;

        return (
            <div
                className={`${mainClass} ${className} ${rootClass}`.trim()}
                onClick={handleClick}
            >
                <div className={innerClass('content', mainClass, rootClass)}>
                    <div className={'c-form__main'}>
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
                            newRelation={newRelation}
                            handleToggleAddNewRelation={this.handleToggleAddNewRelation}
                            newRelationAddOnChange={this.newRelationAddOnChange}
                            deleteRelation={this.deleteRelation}
                        />
                    </div>
                    <div className={`c-form__footer`}>
                        <button
                            className={`c-form__button c-form__button--delete`}
                            onClick={this.handleDeleteItem}>Delete
                        </button>
                        <div>
                            <button
                                className={`c-form__button c-form__button--ok`}
                                onClick={this.handleApplyItem}>Ok
                            </button>
                            <button
                                disabled={!someChanges}
                                className={`c-form__button c-form__button--cancel ${someChanges ? '' : 'disabled'}`.trim()}
                                onClick={this.handleCancelItem}>Cancel
                            </button>
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

FractionForm.propTypes = {
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
    const _object = state.Components.FractionForm[cId];
    const app = state.Components.App[props.pcbMade.relations.App.id];

    if (_object) {
        return ({
            transactionResult: _object.transactionResult,
            transactionFlag: _object.flags.transaction,
            flags: _object.flags,
            formData: _object.data,
            formFields: R.path(['configs', 'fields', 'fraction'], app),
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
        applyItem: (itemId) => applyEntityItem(cId, props.pcbMade, itemId),
        cancelItem: () => cancelEntityItem(cId, props.pcbMade),
        deleteItem: (itemId) => deleteEntityItem(cId, props.pcbMade, itemId),
        updateMeta: (pcb) => updateMeta(cId, pcb),
        changeRelationFiled: (action, object) => changeRelationFiled(cId, action, object)
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(FractionForm);

function RelationBlock({
                           data,
                           formFields,
                           metaData,
                           relations,
                           addNewRelation,
                           handleToggleAddNewRelation,
                           newRelation,
                           newRelationAddOnChange,
                           deleteRelation
                       }) {
    const relationItem = (relation) => {
        return metaData.hasOwnProperty('relations') ? metaData.relations.find(r => r._id === relation.relation) : undefined;
    };
    const fractionItem = (relation) => {
        return metaData.hasOwnProperty('fractions') ? metaData.fractions.find(r => r._id === relation.a) : undefined;
    };

    const newRelationValue = newRelation.hasOwnProperty('relation') ? newRelation.relation : '';
    const newRelationFraction = newRelation.hasOwnProperty('a') ? newRelation.a : '';

    return (
        <div className={`form-block form-block--relations`}>
            <div className={`form-block__name`}>Relations</div>
            <div className={`form-block__main relation`}>
                <div className={`relation__add add-field`}>
                    <div
                        className={`relation__btn ${addNewRelation ? newRelationValue && newRelationFraction ? '' : 'disabled' : ''}`}
                        onClick={(e) => addNewRelation ? newRelationValue && newRelationFraction ? handleToggleAddNewRelation(e) : e.stopPropagation() : handleToggleAddNewRelation(e)}>
                        {
                            addNewRelation ? <MdCheckCircle key={0} className={'icon'}
                                                            onClick={(e) => newRelationValue && newRelationFraction ? '' : e.stopPropagation()}/> :
                                <MdAddCircleOutline key={1} className={'icon'}/>
                        }
                    </div>
                    <div className={'add-field__inputs'}>
                        {
                            addNewRelation ? (
                                <React.Fragment>
                                    <select className={`form-block__input`} value={newRelationValue}
                                            onChange={(e) => newRelationAddOnChange('relation', e)}>
                                        {
                                            metaData.hasOwnProperty('relations') ?
                                                metaData.relations.map(item =>
                                                    (<option key={item._id} value={item._id}>{item.name}</option>)
                                                ) : null
                                        }
                                        <option key={0} value={''}>Choose your option</option>
                                    </select>
                                    <select className={`form-block__input`} value={newRelationFraction}
                                            onChange={(e) => newRelationAddOnChange('a', e)}>
                                        {
                                            metaData.hasOwnProperty('fractions') ?
                                                metaData.fractions.map(item => {
                                                    if (data.hasOwnProperty('_id') && data._id === item._id) {
                                                        return null;
                                                    }
                                                    return <option key={item._id} value={item._id}>{item.name}</option>
                                                }) : null
                                        }
                                        <option key={0} value={''}>Choose your option</option>
                                    </select>
                                </React.Fragment>
                            ) : null
                        }
                        {
                            addNewRelation ? <div className={`relation__btn`} onClick={handleToggleAddNewRelation}>
                                <MdClear className={'icon'}/>
                            </div> : null
                        }
                    </div>
                </div>
                <div className={'relation__data'}>
                    <div className={'relation__list'}>
                        {
                            relations.map((r, i) => (
                                <div key={i}
                                     className={'relation__list-item'}>{R.path(['name'], fractionItem(r))}</div>)
                            )
                        }
                    </div>
                    <div className={'relation__list'}>
                        {
                            relations.map((r, i) => (
                                <div key={i}
                                     className={'relation__list-item'}>{R.path(['name'], relationItem(r))}</div>)
                            )
                        }
                    </div>
                    <div className={'relation__list'}>
                        {
                            relations.map((r, i) => (
                                <div key={i} className={`relation__list-item relation__btn`}>
                                    <MdClear className={'icon'} onClick={()=>deleteRelation(i)}/>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
