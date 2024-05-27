// Import required modules
const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user') // Make sure the path is correct for your User model

// Ensure environment variables are loaded (if not already set up in your app entry file)
require('dotenv').config()

// POST /register - Registers a new user
router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  // Check for missing fields
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Please enter all fields' })
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' })
  }

  // Check for existing user
  const existing = await User.findOne({ email: email })
  if (existing) {
    return res.status(400).json({ message: 'User already exists' })
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  // Create new user
  const user = new User({
    name,
    email,
    password: hash
  })

  try {
    const savedUser = await user.save()

    // Sign JWT
    const token = jwt.sign(
      { id: savedUser._id, name: savedUser.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    )

    res.json({
      error: null,
      msg: 'You have successfully registered!',
      token: token,
      id: savedUser._id
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /login - Logs in a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  // Check for missing fields
  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' })
  }

  // Find user
  const user = await User.findOne({ email: email })
  if (!user) {
    return res.status(400).json({ message: 'User does not exist' })
  }

  // Compare password
  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    return res.status(400).json({ message: 'Invalid credentials' })
  }

  // Sign JWT
  const token = jwt.sign(
    { id: user._id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '1h' } // Token expires in 1 hour
  )

  res.json({
    error: null,
    msg: 'You have successfully logged in!',
    token: token,
    id: user._id
  })
})

module.exports = router
