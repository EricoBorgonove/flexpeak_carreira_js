module.exports = function permitidos (...tiposPermitidos){
    return (req, res, next) =>{
        const tipoUsuario = req.usuario?.tipo_usuario

        if (!tipoUsuario){
            return res.status(403).json({message: 'Tipo de Usuário não Identificado'})
        }
        if (!tiposPermitidos.includes(tipoUsuario)){
            return res.status(403).json({message: `Acesso negado para tipo de usuario
                ${tipoUsuario}`
            })
        }
        next()
    }
}