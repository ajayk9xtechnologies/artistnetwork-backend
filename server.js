
require('dotenv').config()
const express = require('express')
const PORT = process.env.PORT || 5000
const dbConnect = require('./src/config/db');

const app = express();

dbConnect(); 
app.get('/', (req, res) => {
  res.send('Hello artists!')
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})