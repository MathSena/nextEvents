const router = require('express').Router()
const bcrypt = require('bcrypt')

const User = require('../models/user')

// middlewares
const verifyToken = require('../helpers/check-token')

// helpers
const getUserByToken = require('../helpers/get-user-by-token')

// get a user
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

// put a user
router.put('/:id', verifyToken, async (req, res) => {
  const token = req.headers('auth-token')
  const user = await getUserByToken(token)
  const userReqIdId = req.body.id
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword

  const userId = user.id.toString()

  if (userId !== userReqIdId) {
    return res.status(401).json({ message: 'Access denied' })
  }

  const updateUser = {
    name: req.body.name,
    email: req.body.email
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' })
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  updateUser.password = hashedPassword

  try {
    const updated = await User.findOneAndUpdate(
      { _id: user },
      { $set: updateUser },
      { new: true }
    )
    res.json({ error: null, updated })
  } catch (err) {
    res.status(400).json({ message: 'User not found' })
  }
})

router.delete('/:id', (req, res) => {})

module.exports = router
