if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const express = require('express')
const app = express()
const ejsmate = require('ejs-mate')
const path = require('path')
const mongoose = require('mongoose')
const Score = require('./models/score')

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/pong'
const port = process.env.PORT || 5000

mongoose.connect(dbUrl).then(console.log('conected'))

app.engine('ejs', ejsmate)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', async (req, res) => {
  const scores = await Score.find().sort({score: -1})
  res.render('leaderboard', {scores})
})

app.get('/play', (req, res) => {
  res.render('play.ejs')
})

app.get('/rules', (req, res)=> {
  res.render('rules')
})

app.post('/score/new', async (req, res) =>{
  const topScores = await Score.find().sort({score: -1})
  if (topScores[9] == null) {
    const score = new Score({score: req.body.score})
    await score.save()
  } else if (topScores[9].score < req.body.score) {
    await Score.findOneAndReplace({}, {score: req.body.score}, {sort: {score: 1}})
  }
})

app.all('*', (req, res) => {
  res.render('404')
})

app.listen(port)
