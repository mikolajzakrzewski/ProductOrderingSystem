
exports.up = function(knex) {
  return knex.schema.createTable('orders', table => {
    table.increments('order_id').primary();
    table.date('approval_date').nullable();
    table.integer('status_id').unsigned().notNullable();
    table.foreign('status_id').references('status_id').inTable('statuses');
    table.string('username').notNullable();
    table.string('email').notNullable();
    table.string('phone').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('orders');
};
