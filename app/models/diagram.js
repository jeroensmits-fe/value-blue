import Model, { attr } from '@ember-data/model';

export default class DiagramItemsModel extends Model {
    @attr key;
    @attr color;
    @attr links;
}
