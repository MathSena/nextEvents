const router = require('express').Router()
const jwt = require('jsonwebtoken')
const multer = require('multer')
const { User } = require('../models/user')
const verifyToken = require('../helpers/check-token')
const getUserByToken = require('../helpers/get-user-by-token')
const diskStorage = require('../helpers/file-storage')
const event = require('../models/event')
const upload = multer({ storage: diskStorage })
const Event = require('../models/event')

router.post('/', verifyToken, async (req, res) => {
  const { title, description, event_date, location, privacy } = req.body
  let files = []

  // Handling photos if they exist
  if (req.files && req.files.photos) {
    files = req.files.photos.map(photo => photo.path)
  }

  // Validating the input data
  if (!title || !description || !event_date.trim() || !location) {
    return res
      .status(400)
      .json({ error: 'All fields are required and must be non-empty' })
  }

  // Convert event_date to a Date object and check if it's invalid
  const date = new Date(event_date)
  if (isNaN(date.getTime())) {
    return res.status(400).json({ error: 'Invalid date format' })
  }

  const token = req.header('auth-token')
  const userByToken = await getUserByToken(token)
  if (!userByToken) {
    return res.status(404).json({ error: 'User not found' })
  }

  try {
    const event = new Event({
      name: title, // Using title as the event name
      description: description,
      date: date,
      location: location,
      photos: files,
      privacy: privacy,
      userId: userByToken._id
    })

    const savedEvent = await event.save()
    res.json({ error: null, event: savedEvent })
    console.log('Event created:', savedEvent)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/all', async (req, res) => {
  try {
    const events = await Event.find({ privacy: 'false' }).sort([
      ['event_date', 'asc']
    ])
    res.json(events)
  } catch {
    res.status(400).json({ error: 'Events not found' })
  }
})

router.get('/my-events', verifyToken, async (req, res) => {
  const token = req.header('auth-token')
  const userByToken = await getUserByToken(token)
  if (!userByToken) {
    return res.status(404).json({ error: 'User not found' })
  }

  try {
    const events = await Event.find({ userId: userByToken._id }).sort([
      ['event_date', 'asc']
    ])
    res.json(events)
  } catch {
    res.status(400).json({ error: 'Events not found' })
  }
})

module.exports = router
