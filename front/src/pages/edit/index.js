import React from 'react';
import * as R from "ramda";
import {MdSearch, MdHome, MdKeyboardArrowRight} from 'react-icons/md';

import {EntityList, List} from '../../components';

import './edit-page.scss';
import {connect} from "react-redux";


class Edit extends React.Component {
    static defaultProps = {
        entityName: 'Entity'
    };

    constructor(props) {
        super(props);

        this.state = {
            searchValue: '',
            entity: '',
            isSidePanelOn: true,
            isChangeEntityOn: true,
            isCreationNewEntity: false
        };

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
        this.setState({isCreationNewEntity: !this.state.isCreationNewEntity});
    };

    onSearch = (e) => {
        this.setState({searchValue: e.target.value})
    };

    render() {
        const {searchValue, entity, isSidePanelOn, isChangeEntityOn, isCreationNewEntity} = this.state;
        const {pcb, entityName, entityApi} = this.props;

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
                                disabled={entityApi === undefined}
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
                                />
                        }
                        <div className={`side-panel__footer ${isChangeEntityOn ? 'side-panel__footer--hidden' : ''}`}>
                            <button className={'side-panel__create'} onClick={this.handleToggleNewEntity}>
                                {`create new ${entity}`}
                            </button>
                        </div>
                    </div>
                </div>
                <main className={'edit-page__section entity-block'}>
                    <div className={'entity-block__name'}>{`${isCreationNewEntity ? 'new' : ''} ${entityName}`}</div>
                </main>
            </section>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        entityName: R.path(['EntityList', 'eL0', 'value', 'name'], state.Components),
        entityApi: R.path(['EntityList', 'eL0', 'value', 'api'], state.Components)
    }
};

export default connect(mapStateToProps)(Edit);