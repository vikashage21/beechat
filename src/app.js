require('dotenv').config()
const express = require('express')
const app = express()
const http = require('http').Server(app)

const io = require('socket.io')(http)


const PORT = process.env.PORT || 8000
const router = require('./router/router')
const userPost = require('./router/userPost')

const path = require('path')

const hbs = require('hbs')
const cookieParser = require('cookie-parser')

const { nanoid } = require('nanoid');

const fs = require('fs')
// connecting to database 

require('../src/db/conn')

const pratialPath = path.join(__dirname, '../src/template/pratials')
const staticPath = path.join(__dirname, '../public')
const tempPath = path.join(__dirname, '../src/template/views')
const index = path.join(__dirname, "../src/template/views/index.html")
console.log(index)


app.use(cookieParser())

app.use(express.static(staticPath))

hbs.registerPartials(pratialPath)

app.set('view engine', 'hbs')

app.set('views', tempPath)

const bodyParser = require('body-parser')

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.urlencoded({ extended: false }))

app.use(router)
app.use(userPost)





// creating route for socket io 



let user = 0;

io.on('connection', Socket => {
    console.log('A user connected')
    userId = nanoid(Math.floor(Math.random() * 10));


    user++

    Socket.emit('message', `Hii , welcome  ${userId}`)

    Socket.broadcast.emit('TotalUser', { message: 'user connected : ' + user })

    Socket.on('userMessage', function (data) {
        Socket.broadcast.emit('displayMsg', `   ${data}`)
    })


    Socket.on('image', (base64Image) => {
        // Handle the received image on the server side
        // For example, you can save it to a file or send it to other connected clients
        // Socket.broadcast.emit('image', base64Image);
        Socket.broadcast.emit('displayImage',base64Image)

        // console.log('Received Image:', base64Image.substring(0, 30) + '...');
    });

    // for deconnecting the server

    Socket.on('disconnect', () => {
        console.log('A user disconnected')

        user--
        Socket.broadcast.emit('TotalUser', { message: 'user disconneted : ' + user })




        //    Socket.broadcast.emit('broadcast', { messgae: users + ' users connected' })

    })

})






// listing on port 8000

http.listen(PORT, () => {
    console.log(` listing on port ${PORT}`)
})