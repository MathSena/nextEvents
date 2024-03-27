const jwt = require('jsonwebtoken')
const User = require('../models/user')

const getUserByToken = async token => {
  if (!token) {
    return res.status(401).json({ message: 'Access denied' })
  }

  const decoded = jwt.verify(token, 'secret')
  const userId = decoded.id
  const user = await User.findOne({ id: decoded.id })

  return user
}

module.exports = getUserByToken
