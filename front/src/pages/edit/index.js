import React from 'react';
import * as R from "ramda";
import {MdSearch, MdHome, MdKeyboardArrowRight} from 'react-icons/md';

import {EntityList, FractionForm, UnionForm} from '../../components';

import './edit-page.scss';
import {connect} from "react-redux";
import {
    valueChange,
    dataDownload
} from "../../components/custom/EntityList/redux/actions";
import {bindActionCreators} from "redux";


class Edit extends React.Component {
    static defaultProps = {
        entityName: 'Entity',
        entityData: {}
    };

    constructor(props) {
        super(props);

        this.state = {
            searchValue: '',
            isSidePanelOn: true,
            isChangeEntityOn: true,
            isCreationNewEntity: false,
            chosenItem: null,
        };

        this.madeChildren = {
            EditFractionForm: null,
            EditFractionFormNew: null,
            EditUnionForm: null,
            EditRelationForm: null
        };
        Object.keys(this.madeChildren).map(c => {
            const name = props.pcb.children[c].component;
            const o = R.clone(require('../../components')[name]);
            o.core = {pcb: props.pcb, ...props.pcb.children[c]};

            this.madeChildren[c] = o;
        });

        props.onInit();
    }

    handleBack = () => {
        this.props.history.push('/');
    };

    handleToggleSidePanel = () => {
        this.setState({isSidePanelOn: !this.state.isSidePanelOn});
    };

    handleToggleSidePanelSet = () => {
        this.setState({isChangeEntityOn: !this.state.isChangeEntityOn});
    };

    handleToggleNewEntity = () => {
        this.setState({isCreationNewEntity: !this.state.isCreationNewEntity, chosenItem: null});
    };

    onSearch = (e) => {
        this.setState({searchValue: e.target.value})
    };

    quitItem = () => {
        this.props.clearListValue();
        this.props.listDataDownload(this.props.entityApi);
        this.setState({
            isCreationNewEntity: false
        });
    };

    goToItem = (item) => {
        this.setState({
            chosenItem: item,
            isCreationNewEntity: false
        }, () => {
            this.props.listDataDownload(this.props.entityApi);
        });
    };

    render() {
        const {EditFractionForm, EditFractionFormNew, EditUnionForm, EditRelationForm} = this.madeChildren;
        const {searchValue, isSidePanelOn, isChangeEntityOn, isCreationNewEntity, chosenItem} = this.state;
        const {pcb, entityName, entityApi, entityData} = this.props;

        return (
            <section className={'the-app__page edit-page'}>
                <div className={`side-panel edit-page__section ${isSidePanelOn ? '' : 'side-panel--hidden'}`}>
                    <div className={`side-panel__toggle ${isSidePanelOn ? '' : 'side-panel__toggle--on'}`}
                         onClick={this.handleToggleSidePanel}>
                        <MdKeyboardArrowRight className={'icon'}/>
                        <MdKeyboardArrowRight className={'icon'}/>
                    </div>
                    <div className={'side-panel__content'}>
                        <div style={
                            {
                                display: 'flex',
                                alignItems: 'center',
                                width: 'calc(100% - 40px)',
                                margin: '14px 20px',
                                justifyContent: 'space-between'
                            }
                        }>
                            <div className={'side-panel__btn--default go-home'} onClick={this.handleBack}>
                                <MdHome/>
                            </div>
                            <button
                                className={`side-panel__btn--default change-entity`}
                                disabled={entityApi === undefined || isCreationNewEntity}
                                onClick={this.handleToggleSidePanelSet}
                                title={entityApi === undefined ? 'Choose entity first' : 'Click to choose other entity'}
                            >
                                {
                                    isChangeEntityOn ?
                                        "List"
                                        :
                                        "Change Entity"
                                }
                            </button>
                        </div>
                        <div className={'search-entity'}>
                            <input
                                type="text"
                                placeholder={'Search'}
                                className={'search-entity__input'}
                                onChange={this.onSearch}
                                value={searchValue}
                            />
                            <div className={'search-entity__apply'}><MdSearch className={'icon'}/></div>
                        </div>
                        <div className={`side-panel__list ${isChangeEntityOn ? '' : 'side-panel__list--hidden'}`}>
                            <EntityList.Component
                                key={0}
                                core={{pcb, id: 'eL0'}}
                            />
                        </div>
                        {
                            isChangeEntityOn ?
                                null
                                :
                                <EntityList.Component
                                    key={1}
                                    core={{pcb, id: 'eL1'}}
                                    className={`side-panel__list`}
                                    api={entityApi}
                                    chosenItem={chosenItem}
                                    clearItem={(...args) => {
                                        this.clearChosenItem.apply(this, args);
                                    }
                                    }
                                    update={this.updateList}
                                    disabled={isCreationNewEntity}
                                />
                        }
                        <div className={`side-panel__footer ${isChangeEntityOn ? 'side-panel__footer--hidden' : ''}`}>
                            <button className={'side-panel__create'} onClick={this.handleToggleNewEntity}>
                                {`create new ${entityName}`}
                            </button>
                        </div>
                    </div>
                </div>
                <main className={'edit-page__section entity-block'}>
                    <div className={'entity-block__name'}>{`${isCreationNewEntity ? 'new' : ''} ${entityName}`}</div>
                    {
                        entityName === 'fraction' && (entityData._id || isCreationNewEntity) ? !isCreationNewEntity ?
                                <EditFractionForm.Component
                                    key={EditFractionForm.core.id}
                                    core={EditFractionForm.core}
                                    data={entityData}
                                    rootClass={'c-form'}
                                    quitItem={this.quitItem}
                                    goToItem={this.goToItem}
                                /> :
                                <EditFractionFormNew.Component
                                    key={EditFractionFormNew.core.id}
                                    core={EditFractionFormNew.core}
                                    rootClass={'c-form'}
                                    quitItem={this.quitItem}
                                    goToItem={this.goToItem}
                                /> : null
                    }
                    {
                        entityName !== 'union' || (!isCreationNewEntity && !entityData._id) ? null :
                            <EditUnionForm.Component
                                core={EditUnionForm.core}
                                data={isCreationNewEntity ? {} : entityData}
                                rootClass={'c-form'}
                            />
                    }
                    {
                        entityName !== 'relation' || !entityData._id ? null :
                            !isCreationNewEntity ?
                                <EditRelationForm.Component
                                    core={EditRelationForm.core}
                                    data={entityData}
                                    rootClass={'c-form'}
                                    quitItem={this.quitItem}
                                    goToItem={this.goToItem}
                                /> :
                                <EditFractionForm.Component
                                    core={EditFractionFormNew.core}
                                    rootClass={'c-form'}
                                    quitItem={this.quitItem}
                                    goToItem={this.goToItem}
                                />
                    }
                </main>
            </section>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        entityName: R.path(['EntityList', 'eL0', 'value', 'name'], state.Components),
        entityApi: R.path(['EntityList', 'eL0', 'value', 'api'], state.Components),
        entityData: R.path(['EntityList', 'eL1', 'value'], state.Components),
    }
};

const mapDispatchers = dispatch => {
    return bindActionCreators({
        clearListValue: () => valueChange('eL1', {}),
        listDataDownload: (api) => dataDownload('eL1', api)
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(Edit);