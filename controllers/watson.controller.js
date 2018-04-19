// const watsonModel = require('../models/users.models')
/*
"url": "https://gateway.watsonplatform.net/tone-analyzer/api",
"username": "7019706e-eb00-4ce1-a88b-fde32f54ff20",
"password": ""*/

/*
let analyzeCommitTone = () => {
  return axios({
       method: 'post',
       url: 'https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2016-05-19',
       data: { "text": 'damnit charlie this better be negative. im so angry. and mad. and grumpy. and not confident. not positive'},
       auth: {
         username: "7019706e-eb00-4ce1-a88b-fde32f54ff20",
         password: ""
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
const commitsModel = require('../models/commits.models')
const axios = require('axios')

let analyzeTone = (req, res, next) => {
  console.log('analyzing tone')

  axios.get(`https://api.github.com/users/${req.body.username}/repos?sort=pushed`)
  .then(result => {
    const repos = result.data.slice(0,7)
    console.log('REPOS', repos);
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
            // ORIGINAL return [...messages, currentMessage.commit.message]
            return [...messages, {repo: currentMessage.commit.message, sha: currentMessage.sha}]
          }, [])
        })
        // debugger
        // console.log('SCOTT', arrayOfReposCommits);

        return arrayOfReposCommits

      })
      .then(reposArray => {

        let watsonPromises = reposArray.map((repo) => {
          debugger
          let commitPromises = repo.map(({repo: commit, sha}) => {
            console.log('watson', commit);
              return axios({
                 method: 'post',
                 url: 'https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2016-05-19',
                 data: { "text": `${commit}`},
                 auth: {
                   username: `${process.env.WATSON_USER}`,
                   password: `${process.env.WATSON_PW}`
                 }
               })
               .then(result => {
                 let toneHelper = result.data.document_tone.tone_categories[0].tones
                 const printy = JSON.stringify(result.data, null, 4)
                 // console.log('yo', printy);
                 let highestTone = toneHelper.reduce((result, tone) => {
                  if(tone.score > result.score) {
                    result.score = tone.score
                    result.tone = tone.tone_id

                  }
                  return result
                }, {score: toneHelper[0].score, tone: toneHelper[0].tone_id})

                  // let languageHelper = result.data.document_tone.tone_categories[1].tones
                  // let highestLang = languageHelper.reduce((result, lang) => {
                  //   if(lang.score > result.score) {
                  //     result.score = lang.score
                  //     result.lang = lang.tone_id
                  //   }
                  //   console.log('this stuff', result);
                  //   return result
                  // }, {score: languageHelper[0].score}, lang: languageHelper[0].tone_id})

                  // let socialHelper = result.data.document_tone.tone_categories[2].tones
                  // let highestSocial = socialHelper.reduce((result, social) => {
                  //   if(social.score > result.score) {
                  //     result.score = social.score
                  //     result.social = social.tone_id
                  //   }
                  //   return result
                  // }, {score: socialHelper[0].score}, social: socialHelper[0].tone_id})

                // let finalResult = {
                //   watsonTones: [
                //     highestTone0, highestTone1, highestTone2
                //   ],
                //   text: commit
                // }


                 return {
                   username: req.body.username,
                   emotion_score: highestTone.score,
                   emotion_name: highestTone.tone,
                   commit: commit,
                   sha: sha
                 }
               })
          })
          return Promise.all(commitPromises)
        })

        return Promise.all(watsonPromises)
      })
      .then(result => {
        console.log('result', result, 'result0', result[0], 'result00', result[0][0]);

        let repoProm = result.map(repo => {
          repo.forEach(thing => {
            thing.message = thing.commit
            delete thing.commit
          })

          return commitsModel.addCommits(repo)
        })

        Promise.all(repoProm)
          .then(result => {
            res.json(result)
          })

      })

      .catch(err => {
        // debugger
        console.log(err)
      })
  })
  .catch(err => {
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
