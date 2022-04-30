/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('users', function(table) {
      table.increments('id').primary();
      table.string('username');
      table.string('email');
      table.string('password');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('restaurants', function(table) {
      table.increments('id').primary();
      table.string('mealChoice');
      table.string('restaurantName');
      table.string('location');
      table.string('dateVisited');
      table.string('mealRating');
      table.string('experienceDescription');
      table.integer('user_id').unsigned();
      table.foreign('user_id')
        .references('users.id');

      table.timestamps(true, true);
    })
  ])
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('users'),
    knex.schema.dropTable('restaurants')
  ]);
};
