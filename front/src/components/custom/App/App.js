import React from 'react';
import {Button} from '../../';
import {pcbGenerate} from '../../../common/pcb';
import {pcbTemplate} from '../../../common/appConfig';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.pcb = pcbGenerate(pcbTemplate);
    };

    render() {

        return (
            <div className={`the-app`}>
                <Button.Component
                    className={`test-button`}
                    core={{pcb: this.pcb, template: 'Button0', component: 'Button'}}
                />
                <Button.Component
                    className={`test-button`}
                    core={{pcb: this.pcb, template: 'Button0', component: 'Button'}}
                />
                <Button.Component
                    className={`test-button`}
                    core={{pcb: this.pcb, template: 'Button0', component: 'Button'}}
                />
                <Button.Component
                    className={`test-button`}
                    core={{pcb: this.pcb, template: 'Button0', component: 'Button'}}
                />
                <Button.Component
                    className={`test-button`}
                    core={{pcb: this.pcb, template: 'Button0', component: 'Button'}}
                />
            </div>
        )
    }
}