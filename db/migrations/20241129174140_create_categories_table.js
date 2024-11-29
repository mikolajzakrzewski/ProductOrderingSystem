
exports.up = function(knex) {
  return knex.schema.createTable('categories', table => {
    table.increments('category_id').primary();
    table.string('name').notNullable();
    table.timestamps(true, true);
  }).then(() => {
    return knex('categories').insert([
      { name: 'Fashion' },
      { name: 'Essentials' },
      { name: 'Home' },
      { name: 'Electronics' },
      { name: 'Books' }
    ]);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('categories');
};
