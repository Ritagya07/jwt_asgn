const express = require('express')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/ritagya'
const app = express()


mongoose.connect(url,{useNewUrlParser:true})
const connect = mongoose.connection

connect.on('open',() => {
    console.log("connected")
})
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use(express.json())

const abcRouter = require('./routes')
app.use('/',abcRouter)

app.listen(8001, () => {
    console.log('Server started')
})