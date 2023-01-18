const mongoose = require('mongoose')
const Schema = mongoose.Schema

const scoreSchema = new Schema ({
  score: {
    type: Number,
    required: true
  }
})

const Score = new mongoose.model('Score', scoreSchema)

module.exports = Score
