const router = require('express').Router()
const bcrypt = require('bcrypt')

const User = require('../models/user')

const verifyToken = require('../helpers/check-token')

router.get('/', verifyToken, async (req, res) => {
  const allUsers = await User.find({}, { password: 0 })

  res.json(allUsers)
})

router.get('/:id', async (req, res) => {
  const id = req.params.id

  try {
    const user = await User.findOne({ _id: id }, { password: 0 })
    res.json({ error: null, user })
  } catch (err) {
    res.status(400).json({ message: 'User not found' })
  }
})

router.put('/:id', verifyToken, async (req, res) => {
  const id = req.params.id
  const { name, email, password, confirmPassword } = req.body

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Please enter all fields' })
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' })
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
})

router.delete('/:id', (req, res) => {})

module.exports = router
