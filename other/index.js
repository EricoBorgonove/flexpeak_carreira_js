const express = require("express")
require('dotenv').config()

const path = require('path')

const app = express()
//onst port = 3000

//http://localhost:3000/

app.get('/cafeaurora',(req, res ) => {
    res.sendFile(path.resolve('cafeAurora.html'))
})

app.get('/flex',(req, res ) => {
    res.status(200).send (`Bem vindo a FlexPeak`)
})

app.get('/',(req, res) => {
    res.send (`Olá Mundo`)
})

app.use((req, res, next) => {
    res.status(404).sendFile(path.resolve('404.html'))
    //res.status(404).send(`404 Não Encontrado`)
})

app.listen(process.env.PORT, () => {
    //console.log (`App rodando na porta: ${port}`)
    console.log (`App rodando na porta: ${process.env.PORT}`)
})

