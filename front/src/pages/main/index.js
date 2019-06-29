import React from 'react';

import './main-page.scss';
import Edit from "../edit";

class Main extends React.Component {
    constructor(props){
        super(props);

        props.onInit();
    }

    render(){
        return(
            <section className={'the-app__page main-page'}>
                MAIN
            </section>
        )
    }
}

export default Main;