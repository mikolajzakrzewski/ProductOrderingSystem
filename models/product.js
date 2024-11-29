const bookshelf = require('../bookshelf');

const Product = bookshelf.Model.extend({
    tableName: 'products',
    hasTimestamps: true,
    category() {
        return this.belongsTo('Category', 'category_id');
    },
    orders() {
        return this.belongsToMany('Order', 'order_products', 'product_id', 'order_id');
    }
});

module.exports = Product;