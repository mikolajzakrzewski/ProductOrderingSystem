const bookshelf = require('../bookshelf');

const Order = bookshelf.Model.extend({
    tableName: 'orders',
    idAttribute: 'order_id',
    hasTimestamps: true,
    status() {
        return this.belongsTo('Status', 'status_id');
    },
    products() {
        return this.belongsToMany('Product', 'order_products', 'order_id', 'product_id');
    }
});

module.exports = Order;