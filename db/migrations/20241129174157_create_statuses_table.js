
exports.up = function(knex) {
  return knex.schema.createTable('statuses', table => {
    table.increments('status_id').primary();
    table.string('name').notNullable();
    table.timestamps(true, true);
  }).then(() => {
    return knex('statuses').insert([
      { name: 'NOT_APPROVED' },
      { name: 'APPROVED' },
      { name: 'CANCELLED' },
      { name: 'COMPLETED' }
    ]);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('statuses');
};
