exports.seed = function(knex, Promise) {
  return knex('commits').del()
    // .then(() => knex('').del())
}
