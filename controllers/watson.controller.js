// const watsonModel = require('../models/users.models')
/*
"url": "https://gateway.watsonplatform.net/tone-analyzer/api",
"username": "7019706e-eb00-4ce1-a88b-fde32f54ff20",
"password": "7HBHTFHvHXXq"*/

/*
let analyzeCommitTone = () => {
  return axios({
       method: 'post',
       url: 'https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2016-05-19',
       data: { "text": 'god damnit charlie this better be negative. im so angry. and mad. and grumpy. and not confident. not positive'},
       auth: {
         username: "7019706e-eb00-4ce1-a88b-fde32f54ff20",
         password: "7HBHTFHvHXXq"
       }
     })
}

analyzeCommitTone()
  .then(res => {
    debugger
    console.log(res)
  })
  .catch(err => {
    console.log(err)
  })
*/
const axios = require('axios')

let analyzeTone = (req, res, next) => {
  console.log('analyzing tone')
  // debugger

  // create an array of commit messages
  // plug each commit message into the analyze commit analyzeTone
  // function created above
  // console.log('repos', repos)
  // console.log('pat', repos[0], repos[0].name, repos[0].full_name)
  let repos = req.body
  // let helper = repos[0].full_name
  let reposPromises = repos.map(repo =>
  axios.get(`https://api.github.com/repos/${repo.full_name}/commits`,{headers: {Authorization: `token ${process.env.GITHUB_TOKEN}`}}))
  // debugger
  Promise.all(reposPromises)
    .then(repos => {
      // debugger
      let arrayOfReposCommits = repos.map(repo => {
        // debugger
        return repo.data.reduce((messages, currentMessage) => {
          return [...messages, currentMessage.commit.message]
        }, [])
      })
      // debugger
      // console.log(arrayOfReposCommits)
      return arrayOfReposCommits

    })
    .then(reposArray => {
      // console.log('patty', reposArray);
      let watsonPromises = reposArray.map(repo => {
        repo.map(commit => {
          // console.log('watson', commit);
          axios({
               method: 'post',
               url: 'https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2016-05-19',
               data: { "text": `${commit}`},
               auth: {
                 username: "7019706e-eb00-4ce1-a88b-fde32f54ff20",
                 password: "7HBHTFHvHXXq"
               }
             })
             .then(result => {
               console.log('result',result.data);
             })
        })
        // console.log('watson', repo);
      })
    })


    .catch(err => {
      // debugger
      console.log(err)
    })
/*
  let commitArray = []
  repos.forEach(e => {
    axios.get(`https://api.github.com/repos/${e.full_name}/commits`)
      .then(res => {
        res.data.map(e => {
          commitArray.push(e.commit.message)
        })

        console.log(commitArray);
      })

  })
*/
  // axios.get(`https://api.github.com/repos/${helper}/git/refs/heads/master`)
  //   .then(res => {
  //     let commitURL = res.data.object.url
  //     console.log('this stuff', commitURL);
  //     axios.get(`${commitURL}`)
  //       .then(res => {
  //         console.log('res', res.data.message);
  //         commitArray.push(res.data.message)
  //         console.log('a nice array of commits for sale:', commitArray);
  //       })
  //   })


  // axios.get(`https://api.github.com/users/`)


  res.json({msg: 'hi'})
  /*
  axios.post('/watson', {
    repos:
  })
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.log(err)
  })*/
}

 module.exports = {analyzeTone}
