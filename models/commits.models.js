const knex = require('../db/knex')

let everything = () => {
  return knex('commits')
}

let byUser = (username) => {
  return knex('commits')
    .where({username})
}

let addCommits = (body) => {
  return knex('commits')
    .insert(body)
    .returning('*')
}


module.exports = {everything, byUser, addCommits}
