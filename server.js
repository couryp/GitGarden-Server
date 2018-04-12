const express = require('express')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const app = express();
const cors = require('cors')
const axios = require('axios')

app.use(cors())
app.use(bodyParser.json());
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
const { usersRouter } = require('./routes')
app.use('/users', usersRouter)

app.use((req, res) => {
  const status = 404;
  const message = `Could not ${req.method} ${req.path}`;
  res.status(status).json({ status, message });
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Something went wrong!';
  res.status(status).json({ message, status });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log('listening on port', port);
});

module.exports = app
