exports.seed = function(knex, Promise) {
  return knex('commits').del()
    .then(function() {
      return knex('commits').insert([
        {id: 1, message: 'this is a message', emotion_score: 0.9, emotion_name: 'joyous'}
      ])
    })
    .then(() => {
      return knex.raw(
        `SELECT setval('commits_id_seq', (SELECT MAX(id) FROM commits))`
      )
    })
}
