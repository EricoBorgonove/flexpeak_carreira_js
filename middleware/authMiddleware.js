const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (req, res, next)=> {
    const authHeader = req.headers.authorization

    if (!authHeader){
        return res.status(401).json({message: 'Token não fornecido'})
    }
    const [, token] = authHeader.split(' ')
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.usuario = decoded
        return next()
    }catch(err){
        return res.status(401).json({message: 'Token inválido ou expirado'})
    }
}