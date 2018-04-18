const commitsModel = require('../models/commits.models')

let everything = (req, res, next) => {
  commitsModel.everything().then(commits => {
    res.json({commits})
  })
}

let byUser = (req, res, next) => {
  commitsModel.byUser(req.params.id).then(userCommits => {
    res.json(userCommits)
  })
}

let addCommits = (req, res, next) => {
  commitsModel.addCommits(req.body).then(newCommit => {
    res.json({newCommit})
  })
}

module.exports = {everything, byUser, addCommits}
