const { Locacao, Users, Imovel } = require('../models');

module.exports = {
  // Criar locação — apenas locatário autenticado
  async create(req, res) {
    try {
      const { imovel_id, data_inicio, data_fim } = req.body;
      const usuario_id = req.usuario.id;

      const locacao = await Locacao.create({
        imovel_id,
        usuario_id,
        data_inicio,
        data_fim,
        status: 'pendente'
      });

      res.status(201).json(locacao);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar locação.', error: error.message });
    }
  },

  // Listar locações do locatário autenticado
  async list(req, res) {
    try {
      const usuario_id = req.usuario.id;

      const locacoes = await Locacao.findAll({
        where: { usuario_id },
        include: [
          {
            model: Imovel,
            as: 'imovel',
            attributes: ['id', 'titulo', 'endereco', 'preco_noite']
          }
        ]
      });

      res.json(locacoes);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar locações.', error: error.message });
    }
  },

  // Buscar locação por ID (do próprio locatário)
  async getById(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = req.usuario.id;

      const locacao = await Locacao.findOne({
        where: { id, usuario_id },
        include: [
          {
            model: Imovel,
            as: 'imovel',
            attributes: ['id', 'titulo', 'endereco']
          }
        ]
      });

      if (!locacao) {
        return res.status(404).json({ message: 'Locação não encontrada.' });
      }

      res.json(locacao);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar locação.', error: error.message });
    }
  },

  // Cancelar locação (deletar) — apenas locatário dono
  async remove(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = req.usuario.id;

      const locacao = await Locacao.findOne({ where: { id, usuario_id } });

      if (!locacao) {
        return res.status(404).json({ message: 'Locação não encontrada ou acesso negado.' });
      }

      await locacao.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Erro ao cancelar locação.', error: error.message });
    }
  }
};
