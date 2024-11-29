const bookshelf = require('../bookshelf');

const Status = bookshelf.Model.extend({
    tableName: 'statuses',
    hasTimestamps: true,
    orders() {
        return this.hasMany('Order', 'status_id');
    }
});

module.exports = Status;