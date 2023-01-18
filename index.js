const express = require('express')
const app = express()
const ejsmate = require('ejs-mate')
const path = require('path')
const mongoose = require('mongoose')
const Score = require('./models/score')

const dummy_data = [500, 300, 235, 123, 45]

mongoose.connect('mongodb://127.0.0.1:27017/pong')

app.engine('ejs', ejsmate)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
  res.render('leaderboard', {scores: dummy_data})
})

app.get('/play', (req, res) => {
  res.render('play.ejs')
})

app.post('/score/new', async (req, res) =>{
  const topScores = await Score.find().sort({score: -1})
  console.log(topScores)
  if (topScores[9] == null) {
    const score = new Score({score: req.body.score})
    await score.save()
  } else if (topScores[9].score < req.body.score) {
    await Score.findOneAndReplace({}, {score: req.body.score}, {sort: {score: 1}})
  }
})

app.listen(5000, () => {
  console.log("listening")
})
