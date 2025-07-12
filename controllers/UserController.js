const { Users } = require('../models')
const { Op } = require('sequelize')

module.exports = {
    // create - cadastrar usuário
    async createUser (req, res){
        try{
            const {nome, cpf, email, senha, tipo_usuario} = req.body
        if (!['locador','locatario'].includes(tipo_usuario)){
            return res.status(400).json({message: 'Tipo de usuário inválido, Use "locador" ou "locatario"'})
        }
        const emailExistente = await Users.findOne({where: {email}})
        if(emailExistente){
            return res.status(400).json({message: 'email já cadastrado"'})
        }
        const user = await Users.create({nome, cpf, email, senha, tipo_usuario})
        //print (user)
        //return (res.status(200))
        const {senha: _, ...userSemSenha} = user.toJSON()
        return res.status(201).json(userSemSenha)

        }catch(error){
            return res.status(500).json({message: 'Erro ao criar usuário: ', error: error.message})
        }
    },

    //READ - Listar Todos os Usuários
    async getAllUsers(req, res){
        try{
            const users = await Users.findAll({
                attributes: {exclude:['senha']}
            })
            return res.json(users)

        }catch(error){
            return res.status(500).json({message: 'Erro ao buscar usuários: ', error: error.message})
        }
    },
    //READ - Buscar usuário pelo ID
    async getUserById(req, res){
        try{
            const {id} = req.params
            const user = await Users.findByPk(id, {
                attributes: {exclude:['senha']}
            })
            if (!user){
                return res.status(404).json({message: "Usuário não encontrado."})
            }
            return res.json(user)

        }catch(error){
            return res.status(500).json({message: 'Erro ao buscar usuário: ', error: error.message})
        }
    },
    //READ - Buscar usuário por email
    async findByEmail(req, res){
        try{
            const {email} = req.query
            if (!email){
                return res.status(400).json({message: "Informe o email na query"})
            }
            const user = await Users.findOne({
                where:{email}, 
                attributes: {exclude:['senha']}
            })
            if (!user){
                return res.status(404).json({message: "Usuário não encontrado."})
            }
            return res.json(user)

        }catch(error){
            return res.status(500).json({message: 'Erro ao buscar usuário: ', error: error.message})
        }
    },
    //READ - Buscar usuário por nome
    async findByName(req, res){
        try{
            const {nome} = req.query
            if (!nome){
                return res.status(400).json({message: "Informe o nome na query"})
            }
            const users = await Users.findAll({
                where:{nome: {[Op.like] :`%${nome}%`}},
                //where:{[Op.like]: `%${nome}%`}, 
                attributes: {exclude:['senha']}
            })
            if (!users.length === 0){
                return res.status(404).json({message: "Nenhum Usuário não encontrado."})
            }
            return res.json(users)

        }catch(error){
            return res.status(500).json({message: 'Erro ao buscar usuário: ', error: error.message})
        }
    },
    // UPDATE - Atualizar Usuário
    async updateUser (req, res){
        try{
            const {id} = req.params
            const {nome, cpf, email, senha, tipo_usuario} = req.body
            
            if (!['locador','locatario'].includes(tipo_usuario)){
                return res.status(400).json({message: 'Tipo de usuário inválido, Use "locador" ou "locatario"'})
            }
            const user = await Users.findByPk(id)
            if (!user){
                return res.status(404).json({message: "Usuário não encontrado."})
            }
            await user.update ({nome, cpf, email, senha, tipo_usuario})

            const { senha: _, ...userAtualizado} = user.toJSON()
            return res.json(userAtualizado)

        }catch(error){
            return res.status(500).json({message: 'Erro ao atualizar usuário: ', error: error.message})
        }
    },
    // DELETE -Remover usuário
    async deleteUser (req, res){
        try{
            const { id } = req.params
            const user = await Users.findByPk(id)
            if (!user){
                return res.status(404).json({message: "Usuário não encontrado."})
            }
            await user.destroy()
            return res.status(204).send()
        }catch(error){
            return res.status(500).json({message: 'Erro ao deletar usuário: ', error: error.message})
        }
    }
}