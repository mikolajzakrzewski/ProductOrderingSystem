const bookshelf = require('../bookshelf');

const Category = bookshelf.Model.extend({
    tableName: 'categories',
    hasTimestamps: true,
    products() {
        return this.hasMany('Product', 'category_id');
    }
});

module.exports = Category;