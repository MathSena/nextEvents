const jwt = require('jsonwebtoken')

const checkToken = (req, res, next) => {
  const token = req.header('auth-token')

  if (!token) {
    return res.status(401).json({ message: 'Access denied' })
  }

  try {
    const verified = jwt.verify(token, 'secret')
    req.user = verified
    next()
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' })
  }
}

module.exports = checkToken
