import Component from '@ember/component';
import { tracked } from '@glimmer/tracking';
import go from 'gojs';

export default class MyComponent extends Component {
    @tracked isSaving

    init() {
        super.init(...arguments);

        this.store = this.get('diagram');
        this.diagram = null;
    }

    getLinks() {
        const linksArray = [];

        this.store.forEach(({ key, links }) => {
            links.forEach(link => {
                linksArray.push({
                    from: key,
                    to: link
                })
            })
        });

        return linksArray;
    }

    getItems() {
        const items = [];

        this.store.forEach(item => {
            items.push({
                key: item.key,
                color: item.color
            });
        });

        return items;
    }

    setSaving() {
        this.isSaving = true;
    }

    removeSaving() {
        this.isSaving = false;
    }

    onChange(event) {
        if (!event.isTransactionFinished || this.isSaving) return;

        this.setSaving();

        setTimeout(this.removeSaving.bind(this), 5000);
    }

    changeFontSize(obj, factor) {
        var adorn = obj.part;

        this.diagram.startTransaction("Change Text Size");

        var node = adorn.adornedPart;

        node.scale *= factor;

        this.diagram.commitTransaction("Change Text Size");
    }

    increaseFontSize(e, obj) {
        this.changeFontSize(obj, 1.1);
    }

    decreaseFontSize(e, obj) {
        this.changeFontSize(obj, 1 / 1.1);
    }

    changeColor(e, obj) {
        this.diagram.commit(d => {
            const contextmenu = obj.part;
            const nodedata = contextmenu.data;

            let newcolor = "lightblue";

            switch (nodedata.color) {
                case 'lightblue': newcolor = 'lightgreen'; break;
                case 'lightgreen': newcolor = 'lightyellow'; break;
                case 'lightyellow': newcolor = 'orange'; break;
                case 'orange': newcolor = 'lightblue'; break;
            }

            d.model.set(nodedata, 'color', newcolor);
        }, 'changed color');
    }

    get draw() {
        const $go = go.GraphObject.make;
        this.diagram = $go(
            go.Diagram,
            'test',
            {
                'undoManager.isEnabled': true
            }
        );

        // define a simple Node template
        this.diagram.nodeTemplate =
            $go(go.Node, 'Auto',
                new go.Binding('location', 'location', go.Point.parse).makeTwoWay(go.Point.stringify),
                $go(go.Shape, 'Rectangle', { strokeWidth: 0, fill: 'white' },
                    new go.Binding('fill', 'color')),
                $go(go.TextBlock,
                    { margin: 8, font: 'bold 14px sans-serif', stroke: '#333' },
                    new go.Binding('text', 'key')),
                    {
                        contextMenu: $go(
                            'ContextMenu',
                            $go(
                                'ContextMenuButton',
                                $go(go.TextBlock, 'Change Color'),
                                { click: this.changeColor.bind(this) }
                            ),
                            $go(
                                'ContextMenuButton',
                                $go(go.TextBlock, 'Bigger'),
                                { click: this.increaseFontSize.bind(this) }
                            ),
                            $go(
                                'ContextMenuButton',
                                $go(go.TextBlock, 'Smaller'),
                                { click: this.decreaseFontSize.bind(this) }
                            )
                        )
                    }
            );

        this.diagram.model = new go.GraphLinksModel(
            this.getItems(),
            this.getLinks()
        );

        this.diagram.addModelChangedListener(this.onChange.bind(this));

        return null;
    }
}
