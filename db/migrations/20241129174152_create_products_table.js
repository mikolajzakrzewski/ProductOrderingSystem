
exports.up = function(knex) {
  return knex.schema.createTable('products', table => {
    table.increments('product_id').primary();
    table.string('name').notNullable();
    table.string('description').notNullable();
    table.decimal('unit_price').unsigned().notNullable();
    table.decimal('unit_weight').unsigned().notNullable();
    table.integer('category_id').unsigned().notNullable();
    table.foreign('category_id').references('category_id').inTable('categories');
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('products');
};
