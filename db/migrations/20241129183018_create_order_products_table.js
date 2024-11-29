
exports.up = function(knex) {
  return knex.schema.createTable('order_products', table => {
    table.increments('order_product_id').primary();
    table.integer('order_id').unsigned().notNullable();
    table.foreign('order_id').references('order_id').inTable('orders');
    table.integer('product_id').unsigned().notNullable();
    table.foreign('product_id').references('product_id').inTable('products');
    table.integer('quantity').unsigned().notNullable();
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('order_products');
};
