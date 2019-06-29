import React from 'react';

import './home-page.scss';
import Edit from "../edit";

class Home extends React.Component {
    constructor(props){
        super(props);

        props.onInit();
    }

    render(){
        return(
            <section className={'the-app__page home-page'}>
                HOME
            </section>
        )
    }
}

export default Home;