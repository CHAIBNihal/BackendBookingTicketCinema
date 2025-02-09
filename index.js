const PORT = 4242
const express = require('express')
const app = express()
require('dotenv').config()
require("./DB/Connexion/DBconnect")
const userRouter = require('./Routes/UserRoute')

app.use(userRouter)

app.get('/', (req, res) => {
    res.send("Hello")
})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})