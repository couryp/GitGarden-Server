exports.up = function(knex, Promise) {
  return knex.schema.createTable('commits', (t) => {
    t.increments()
    t.string('username').notNullable().defaultTo('')
    t.string('message').notNullable().defaultsTo('')
    t.string('sha').notNullable().unique()
    t.float('emotion_score').notNullable().defaultTo(0)
    t.string('emotion_name').notNullable().defaultTo('')
    t.float('language_score').notNullable().defaultTo(0)
    t.string('language_name').notNullable().defaultTo('')
    t.float('social_score').notNullable().defaultTo(0)
    t.string('social_name').notNullable().defaultTo('')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('commits')
};
