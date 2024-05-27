const jwt = require('jsonwebtoken')
const User = require('../models/user')

// Assegure-se de carregar o JWT_SECRET corretamente
require('dotenv').config()

const getUserByToken = async token => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    return user
  } catch (err) {
    console.error('Error fetching user by token:', err)
    throw err
  }
}

module.exports = getUserByToken
