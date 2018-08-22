const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Chatkit = require('pusher-chatkit-server');
const jwt = require('jsonwebtoken')

const app = express()

const chatkit = new Chatkit.default({
  instanceLocator: 'v1:us1:22e27933-0947-4417-b014-33448febbc22',
  key: 'be768a30-64f5-4dd2-9bf2-9e370761d8a4:9VIdf8LtpNZ6gwD5b2StYHMXgkDFLQDg94lbS1paSxM='
})
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.post('/users', (req, res) => {
  const { username } = req.body
  chatkit.createUser({
    id: username,
    name: username
  })
    .then(() => res.sendStatus(201))
    .catch(error => {
      if (error.error_type === 'services/chatkit/user_already_exists') {
        res.sendStatus(200)
      } else {
        res.status(error.status).json(error)
      }
    })
})

app.post('/authenticate', (req, res) => {
  const authData = chatkit.authenticate({ userId: req.query.user_id })
  //res.status(authData.status).send(authData.body)
  res.json({token: jwt.sign({
    "instance": 'v1:us1:22e27933-0947-4417-b014-33448febbc22',
    "iss": 'be768a30-64f5-4dd2-9bf2-9e370761d8a4:9VIdf8LtpNZ6gwD5b2StYHMXgkDFLQDg94lbS1paSxM=',
    "iat": Math.round((new Date()).getTime() / 1000),
    "exp": 600,
    "sub": req.query.user_id
  }, 'RESTFULAPIs', { algorithm: 'HS256'})});
})

const PORT = 3001
app.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`Running on port ${PORT}`)
  }
})
