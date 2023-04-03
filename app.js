const path = require('path')
const express = require('express')
const app = express()
const PORT = 3000

app.set('view engine', 'pug')
app.use('/public', express.static(__dirname + '/public'))
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/users', require('./routes/users'))

app.get('/', (req, res) => {
    res.render('home', { title: 'Home' })
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${ PORT }`)
})