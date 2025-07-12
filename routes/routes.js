const express = require('express')
const router = express.Router()
const path = require('path')

router.get ('/', (req, res) => {
    res.send ("Aplicação em Construção")
})
//http://localhost:3000/flex
router.get ('/flex', (req, res) => {
    res.sendFile(path.resolve('people.json'))
})

module.exports = router