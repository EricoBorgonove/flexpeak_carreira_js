const { Users } = require ('../models')
const jwt = require ('jsonwebtoken')
require('dotenv').config()

module.exports = {
    async login(req, res){
        const {email, senha} = req.body
        try{
            const user = await Users.findOne({where: {email}})
            if (!user){
                return res.status(401).json({message: "Usuário não encontrado"})
            }
            const senhaValida = await user.validarSenha(senha)

            if (!senhaValida){
                return res.status(401).json({message: "Senha Inválida"})
            }

            const token = jwt.sign(
                    {id: user.id, tipo_usuario: user.tipo_usuario},
                    process.env.JWT_SECRET,
                    {expiresIn: '2h'}
            )

            return res.json({
                token,
                usuario:{
                    id: user.id,
                    nome: user.nome,
                    email: user.email,
                    tipo_usuario: user.tipo_usuario
                }
            })
        }catch(error){
            return res.status(500).json({message: 'Erro no login:  ', error: error.message})
        }
    }
}