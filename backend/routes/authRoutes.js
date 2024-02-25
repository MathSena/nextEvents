const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Please enter all fields' })
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' })
  }

  const existing = await User.findOne({ email: email })

  if (existing) {
    return res.status(400).json({ message: 'User already exists' })
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const user = new User({
    name,
    email,
    password: hash
  })

  try {
    const saved = await user.save()

    const token = jwt.sign(
      { id: saved._id, name: saved._name },
      'process.env.JWT_SECRET'
    )

    res.json({
      error: null,
      msg: 'Você se cadastrou com sucesso! ',
      token: token,
      id: saved._id
    })

    res.json(saved)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' })
  }

  const user = await User.findOne({ email: email })

  if (!user) {
    return res.status(400).json({ message: 'User does not exist' })
  }

  const match = await bcrypt.compare(password, user.password)

  if (!match) {
    return res.status(400).json({ message: 'Invalid credentials' })
  }

  const token = jwt.sign(
    { id: user._id, name: user._name },
    'process.env.JWT_SECRET'
  )

  res.json({
    error: null,
    msg: 'Você se logou com sucesso! ',
    token: token,
    id: user._id
  })

  res.json(saved)
})

module.exports = router
