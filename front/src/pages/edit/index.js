import React from 'react';
import {MdSearch, MdHome, MdKeyboardArrowRight} from 'react-icons/md';

import './edit-page.scss';

class Edit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchValue: '',
            entity: '',
            isSidePanelOn: true,
        };

        props.onInit();
    }

    handleBack = () => {
        this.props.history.push('/');
    };

    handleToggleSidePanel = () => {
      this.setState({isSidePanelOn: !this.state.isSidePanelOn});
    };

    onSearch = (e) => {
        this.setState({searchValue: e.target.value})
    };

    render() {
        const {searchValue, entity, isSidePanelOn} = this.state;

        return (
            <section className={'the-app__page edit-page'}>
                <div className={`side-panel ${isSidePanelOn ? '' : 'side-panel--hidden'}`}>
                    <div className={`side-panel__toggle ${isSidePanelOn ? '' : 'side-panel__toggle--on'}`} onClick={this.handleToggleSidePanel}>
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
                            <div className={'go-home'} onClick={this.handleBack}>
                                <MdHome/>
                            </div>
                            <div className={'change-entity'}>
                                Change Entity
                            </div>
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
                        <div className={`side-panel__list`}>

                        </div>
                        <div className={'side-panel__footer'}>
                            <div className={'side-panel__create'}>
                                {`create new ${entity}`}
                            </div>
                        </div>
                    </div>
                </div>
                <main className={'entity'}></main>
            </section>
        )
    }
}

export default Edit;