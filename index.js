const express = require('express')
const app = express()
const ejsmate = require('ejs-mate')
const path = require('path')

const dummy_data = [500, 300, 235, 123, 45]

app.engine('ejs', ejsmate)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.render('leaderboard', {scores: dummy_data})
})

app.get('/play', (req, res) => {
  res.render('play.ejs')
})

app.listen(5000, () => {
  console.log("listening")
})
