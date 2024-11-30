const bookshelf = require('../bookshelf');

const Status = bookshelf.Model.extend({
    tableName: 'statuses',
    idAttribute: 'status_id',
    hasTimestamps: true,
    orders() {
        return this.hasMany('Order', 'status_id');
    }
});

module.exports = bookshelf.model('Status', Status);