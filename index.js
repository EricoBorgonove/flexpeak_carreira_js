const express = require("express")
require('dotenv').config()

const userRoutes = require ('./routes/userRoutes')
const authRoutes = require ('./routes/authRoutes')
const authMiddleware = require("./middleware/authMiddleware")
const roleMiddleware = require("./middleware/roleMiddleware")
const imovelRoutes = require('./routes/imovelRoutes');
const locacaoRoutes = require('./routes/locacaoRoutes');

const app = express()
const routes = require('./routes/routes')



app.use(express.json())

app.use('/', routes)
app.use('/user', userRoutes)
app.use('/auth', authRoutes)
app.use('/imoveis', imovelRoutes);
app.use('/locacoes', locacaoRoutes);

app.get('/perfil', authMiddleware, async (req, res) => {
    res.json({message: `Bem Vindo usuário ${req.usuario.nome}`})
})
app.get('/perfil-locador', authMiddleware, roleMiddleware('locador'), async (req, res) => {
    res.json({message: `Bem Vindo usuário ${req.usuario.id}`})
})

app.use((req, res, next) => {
    res.status(404).send(`404 Não Encontrado`)
})

app.listen(process.env.PORT, () => {
    console.log (`App rodando na porta: ${process.env.PORT}`)
})

