export const pcbTemplate = {
    idList: {
        app0: {
            component: 'App',
            children: [
                {alias: 'EditFractionForm', id: 'fF0'},
                {alias: 'EditFractionFormNew', id: 'fF1'},
                {alias: 'EditUnionForm', id: 'uF0'},
                {alias: 'EditRelationForm', id: 'rF0'},
                {alias: 'EditRelationFormNew', id: 'rF1'},
                {alias: 'MainFriendFoePicture', id: 'ffP0'}
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
        fF1: {
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
        rF0: {
            component: 'RelationForm',
            relations: {
                App: {
                    id: 'app0',
                    component: 'App',
                }
            }
        },
        rF1: {
            component: 'RelationForm',
            relations: {
                App: {
                    id: 'app0',
                    component: 'App',
                }
            }
        },
        ffP0: {
            component: 'FriendFoePicture',
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
        },
    }
};