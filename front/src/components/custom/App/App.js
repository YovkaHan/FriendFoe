import React from 'react';
import {Button} from '../../';
import {Home, Main, Edit} from '../../../pages';
import {Route, Link} from "react-router-dom";
import {pcbGenerate} from '../../../common/pcb';
import {pcbTemplate} from '../../../common/appConfig';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 'home',
            headerIsVisible: true,
            footerIsVisible: true
        };
        this.pcb = pcbGenerate(pcbTemplate);
    };

    switchPage = (page) =>{
        this.setState({
            currentPage: page,
            headerIsVisible: page !== 'edit',
            footerIsVisible: page !== 'edit'
        });
    };

    render() {
        const {headerIsVisible, footerIsVisible} = this.state;

        return (
            <div className={`the-app`}>
                <Header visible={headerIsVisible}/>
                <Route
                    exact path="/"
                    render={props => <Home {...props} pcb={this.pcb} onInit={()=>this.switchPage('home')}/>}
                />
                <Route
                    exact path="/main"
                    render={props => <Main {...props} pcb={this.pcb} onInit={()=>this.switchPage('main')}/>}
                />
                <Route
                    exact path="/edit"
                    render={props => <Edit {...props} pcb={this.pcb} onInit={()=>this.switchPage('edit')}/>}
                />
                <Footer visible={footerIsVisible}/>
            </div>
        )
    }
}

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

    return(
        <footer className={'main-footer'} style={visible ? {} : {display: 'none'}}>

        </footer>
    )
}