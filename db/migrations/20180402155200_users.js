exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', (t) => {
    t.increments()
    t.string('fName').notNullable().defaultTo('')
    t.string('email').notNullable().defaultTo('')
    t.string('password').notNullable().defaultTo('')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};
