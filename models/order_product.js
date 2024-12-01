const bookshelf = require('../bookshelf');

const OrderProduct = bookshelf.Model.extend({
    tableName: 'order_products',
    idAttribute: 'order_product_id',
    hasTimestamps: true,
    order() {
        return this.belongsTo('Order', 'order_id');
    },
    product() {
        return this.belongsTo('Product', 'product_id');
    }
});

module.exports = bookshelf.model('OrderProduct', OrderProduct);