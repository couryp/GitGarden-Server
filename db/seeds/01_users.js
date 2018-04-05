exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function() {
      return knex('users').insert([
        {id: 1, fName: 'Pat', email: 'pourky@gmail.com', password: '1234'},
        {id: 2, fName: 'EggYo', email: 'eggplant@gmail.com', password: 'eggybaby'},
        {id: 3, fName: 'test', email: 'test@gmail.com', password: 'test'}
      ])
    })
    .then(() => {
      return knex.raw(
        `SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))`
      )
    })
}
