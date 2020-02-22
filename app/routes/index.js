import Route from '@ember/routing/route';

export default class IndexRoute extends Route {
    model() {
        this.store.push({
            data: [
                {
                    id: 1,
                    type: 'diagram',
                    attributes: {
                        key: 'Alpha',
                        color: 'lightblue',
                        links: [
                            'Beta',
                            'Gamma'
                        ]
                    }
                },
                {
                    id: 2,
                    type: 'diagram',
                    attributes: {
                        key: 'Beta',
                        color: 'orange',
                        links: [
                            'Epsilon'
                        ]
                    }
                },
                {
                    id: 3,
                    type: 'diagram',
                    attributes: {
                        key: 'Gamma',
                        color: 'lightgreen',
                        links: [
                            'Delta'
                        ]
                    }
                },
                {
                    id: 4,
                    type: 'diagram',
                    attributes: {
                        key: 'Delta',
                        color: 'pink',
                        links: [
                            'Alpha'
                        ]
                    }
                },
                {
                    id: 5,
                    type: 'diagram',
                    attributes: {
                        key: 'Epsilon',
                        color: 'blue',
                        links: [
                            'Gamma'
                        ]
                    }
                }
            ]
        });

        return this.store.peekAll('diagram');
    }
}
