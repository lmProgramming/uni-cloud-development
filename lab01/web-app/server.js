const express = require('express')
const path = require('path')
const morgan = require('morgan')
const app = express()
const port = process.env.PORT || 8080
// Middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
// Ustawienie silnika szablonów EJS
app.set('view engine', 'ejs')
// Główna trasa
app.get('/', (req, res) => {
  res.render('index', { title: 'Strona główna', message: 'Witaj świecie!' })
})
// Start serwera
app.listen(port, () => {
  console.log(`Aplikacja nasłuchuje na porcie ${port}`)
})
app.post('/', (req, res) => {
  res.send('Got a POST request')
})
app.put('/user', (req, res) => {
  res.send('Got a PUT request at /user')
})
app.delete('/user', (req, res) => {
  res.send('Got a DELETE request at /user')
})
