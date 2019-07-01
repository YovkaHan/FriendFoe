import React from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {deleteItem, initItem} from "./redux/actions";
import {Home, Main, Edit} from '../../../pages';
import {Route, Link} from "react-router-dom";
import * as R from "ramda";

class App extends React.Component {

    static defaultProps = {
        flags: {}
    };

    constructor(props) {
        super(props);

        this.state = {
            currentPage: 'home',
            headerIsVisible: true,
            footerIsVisible: true
        };

        props.initItem();
    };

    switchPage = (page) => {
        this.setState({
            currentPage: page,
            headerIsVisible: page !== 'edit',
            footerIsVisible: page !== 'edit'
        });
    };

    render() {
        const {pcbMade, flags} = this.props;
        const {headerIsVisible, footerIsVisible} = this.state;

        return flags.hasOwnProperty('initiated') && flags.initiated ?
            (
                <div className={`the-app`}>
                    <Header visible={headerIsVisible}/>
                    <Route
                        exact path="/"
                        render={props => <Home {...props} pcb={pcbMade} onInit={() => this.switchPage('home')}/>}
                    />
                    <Route
                        exact path="/main"
                        render={props => <Main {...props} pcb={pcbMade} onInit={() => this.switchPage('main')}/>}
                    />
                    <Route
                        exact path="/edit"
                        render={props => <Edit {...props} pcb={pcbMade} onInit={() => this.switchPage('edit')}/>}
                    />
                    <Footer visible={footerIsVisible}/>
                </div>
            ) : null
    }

    componentWillUnmount() {
        this.props.deleteComponent()
    }
}

const mapStateToProps = (state, props) => {
    const cId = props.pcbMade.id;
    const _object = state.Components.App[cId];

    if (_object) {
        return ({
            flags: _object.flags,
        })
    } else {
        return {};
    }
};

const mapDispatchers = (dispatch, props) => {
    const cId = props.pcbMade.id;

    return bindActionCreators({
        deleteComponent: () => deleteItem(cId),
        initItem: () => initItem(cId)
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(App);


/**---------*/
function Header(props) {
    const {visible} = props;

    return (
        <header className={'main-header'} style={visible ? {} : {display: 'none'}}>
            <nav className={'navs'}>
                <div className={'navs__item'}>
                    <Link to="/main">Main</Link>
                </div>
                <div className={'navs__item'}>
                    <Link to="/">Home</Link>
                </div>
                <div className={'navs__item'}>
                    <Link to="/edit">Edit</Link>
                </div>
            </nav>
        </header>
    )
}

function Footer(props) {
    const {visible} = props;

    return (
        <footer className={'main-footer'} style={visible ? {} : {display: 'none'}}>

        </footer>
    )
}