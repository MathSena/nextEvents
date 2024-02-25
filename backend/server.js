// modules
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const env = require('dotenv').config()
const authRoutes = require('./routes/authRoutes.js')
const userRoutes = require('./routes/userRoutes.js')

const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD

mongoose.connect(
  `mongodb+srv://${username}:${password}@cluster0.68g1eec.mongodb.net/`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)

const dbName = 'nextEvents'
const port = 3000
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('public'))
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the NextEvents API' })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
