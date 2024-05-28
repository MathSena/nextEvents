// routes/eventRoutes.js
const router = require('express').Router()
const multer = require('multer')
const path = require('path')

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})
const upload = multer({ storage: diskStorage })

const Event = require('../models/event')
const verifyToken = require('../helpers/check-token')
const getUserByToken = require('../helpers/get-user-by-token')
const logger = require('../utils/logger') // Ensure logger is set up as per previous instructions

router.post('/', verifyToken, upload.array('photos'), async (req, res) => {
  const { title, description, event_date, location, privacy } = req.body
  let files = req.files ? req.files.map(file => file.path) : []

  if (!title || !description || !event_date.trim() || !location) {
    logger.error('Validation failed - all fields are required')
    return res
      .status(400)
      .json({ error: 'All fields are required and must be non-empty' })
  }

  const date = new Date(event_date)
  if (isNaN(date.getTime())) {
    logger.error('Invalid date format')
    return res.status(400).json({ error: 'Invalid date format' })
  }

  const userByToken = await getUserByToken(req.header('auth-token'))
  if (!userByToken) {
    logger.error('User not found during event creation')
    return res.status(404).json({ error: 'User not found' })
  }

  try {
    const newEvent = new Event({
      name: title,
      description,
      date,
      location,
      photos: files,
      privacy,
      userId: userByToken._id
    })

    const savedEvent = await newEvent.save()
    logger.info(`Event created successfully: ${savedEvent._id}`)
    res.json({ error: null, event: savedEvent })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/all', async (req, res) => {
  try {
    const events = await Event.find({ privacy: false }).sort('date')
    res.json(events)
    logger.info('Fetched all public events')
  } catch (err) {
    logger.error('Failed to fetch events', { error: err.message })
    res.status(400).json({ error: 'Events not found' })
  }
})

router.get('/my-events', verifyToken, async (req, res) => {
  const userByToken = await getUserByToken(req.header('auth-token'))
  if (!userByToken) {
    logger.error('User not found when fetching personal events')
    return res.status(404).json({ error: 'User not found' })
  }

  try {
    const events = await Event.find({ userId: userByToken._id }).sort('date')
    res.json(events)
    logger.info(`Fetched events for user ${userByToken._id}`)
  } catch (err) {
    logger.error('Failed to fetch user events', { error: err.message })
    res.status(400).json({ error: 'Events not found' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      logger.error('Event not found', { eventId: req.params.id })
      return res.status(404).json({ error: 'Event not found' })
    }
    if (event.privacy === true) {
      logger.error('Attempt to access private event', {
        eventId: req.params.id
      })
      return res.status(403).json({ error: 'Access denied' })
    }

    res.json(event)
    logger.info(`Event accessed: ${req.params.id}`)
  } catch (err) {
    logger.error('Error fetching event details', { error: err.message })
    res.status(400).json({ error: 'Event not found' })
  }
})

router.delete('/:id', verifyToken, async (req, res) => {
  const userByToken = await getUserByToken(req.header('auth-token'))
  if (!userByToken) {
    logger.error('User not found during deletion attempt')
    return res.status(404).json({ error: 'User not found' })
  }

  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      logger.error('Event not found for deletion', { eventId: req.params.id })
      return res.status(404).json({ error: 'Event not found' })
    }

    if (event.userId.toString() !== userByToken._id.toString()) {
      logger.error('Unauthorized attempt to delete event', {
        userId: userByToken._id,
        eventId: req.params.id
      })
      return res.status(403).json({ error: 'Access denied' })
    }

    await event.remove()
    logger.info(`Event deleted: ${req.params.id}`)
    res.json({ error: null, message: 'Event deleted' })
  } catch (err) {
    logger.error('Failed to delete event', { error: err.message })
    res.status(400).json({ error: 'Event not found' })
  }
})

router.put('/:id', verifyToken, upload.array('photos'), async (req, res) => {
  const { title, description, event_date, location, privacy } = req.body
  let files = req.files ? req.files.map(file => file.path) : []

  // Convert event_date to a Date object and check if it's invalid
  const date = new Date(event_date)
  if (isNaN(date.getTime())) {
    return res.status(400).json({ error: 'Invalid date format' })
  }

  if (!title || !description || !event_date.trim() || !location) {
    return res
      .status(400)
      .json({ error: 'All fields are required and must be non-empty' })
  }

  const userByToken = await getUserByToken(req.header('auth-token'))
  if (!userByToken) {
    return res.status(404).json({ error: 'User not found' })
  }

  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ error: 'Event not found' })
    }

    if (event.userId.toString() !== userByToken._id.toString()) {
      return res.status(403).json({ error: 'Access denied' })
    }

    event.name = title
    event.description = description
    event.date = date
    event.location = location
    event.photos = files
    event.privacy = privacy

    const updatedEvent = await event.save()
    res.json({ error: null, event: updatedEvent })
  } catch (err) {
    res.status(500).json({ error: 'Event not found' })
  }
})

module.exports = router
