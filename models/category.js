const bookshelf = require('../bookshelf');

const Category = bookshelf.Model.extend({
    tableName: 'categories',
    idAttribute: 'category_id',
    hasTimestamps: true,
    products() {
        return this.hasMany('Product', 'category_id');
    }
});

module.exports = Category;