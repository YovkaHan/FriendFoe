import React from 'react';

import './main-page.scss';
import Edit from "../edit";
import * as R from "ramda";

class Main extends React.Component {
    constructor(props){
        super(props);

        this.madeChildren = {
            MainFriendFoePicture: null
        };
        Object.keys(this.madeChildren).map(c => {
            const name = props.pcb.children[c].component;
            const o = R.clone(require('../../components')[name]);
            o.core = {pcb: props.pcb, ...props.pcb.children[c]};

            this.madeChildren[c] = o;
        });

        props.onInit();
    }

    render(){
        const {MainFriendFoePicture} = this.madeChildren;
        return(
            <section className={'the-app__page main-page'}>
                <MainFriendFoePicture.Component
                    core={MainFriendFoePicture.core}
                    className={'main-picture'}
                />
            </section>
        )
    }
}

export default Main;