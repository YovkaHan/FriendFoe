export const pcbTemplate = {
    idList: {
        app0: {
            component: 'App',
            children: [
                {alias: 'EditFractionForm', id: 'fF0'},
                {alias: 'EditUnionForm', id: 'uF0'}
            ]
        },
        b0: {component: 'Button'},
        eL0: {
            component: 'EntityList0',
            props: {
                api: '/api/configs/entities'
            }
        },
        eL1: {
            component: 'EntityList1'
        },
        fF0: {
            component: 'FractionForm',
            relations: {
                App: {
                    id: 'app0',
                    component: 'App',
                }
            }
        },
        uF0: {
            component: 'UnionForm',
            relations: {
                App: {
                    id: 'app0',
                    component: 'App',
                }
            }
        },
    },
    templateList: {
        Button0: {
            component: 'Button'
        },
        EntityList0: {
            component: 'EntityList'
        },
        UnionForm0: {
            component: 'UnionForm'
        }
    }
};