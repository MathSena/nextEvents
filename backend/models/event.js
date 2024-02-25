const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  photos: {
    type: Array
  },
  privacy: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.ObjectId
  }
})

module.exports = mongoose.model('Event', EventSchema)
