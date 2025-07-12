const { Imovel, Users } = require('../models');

module.exports = {
  // Criar imóvel — apenas locador autenticado
  async create(req, res) {
    try {
      const { titulo, descricao, endereco, preco_noite } = req.body;
      const usuario_id = req.usuario.id;

      const imovel = await Imovel.create({
        titulo,
        descricao,
        endereco,
        preco_noite,
        usuario_id
      });

      res.status(201).json(imovel);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar imóvel.', error: error.message });
    }
  },

  // Listar todos os imóveis
  async list(req, res) {
    try {
      const imoveis = await Imovel.findAll({
        include: {
          model: Users,
          as: 'locador',
          attributes: ['id', 'nome', 'email']
        }
      });

      res.json(imoveis);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar imóveis.', error: error.message });
    }
  },

  // Buscar imóvel por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const imovel = await Imovel.findByPk(id, {
        include: {
          model: Users,
          as: 'locador',
          attributes: ['id', 'nome', 'email']
        }
      });

      if (!imovel) {
        return res.status(404).json({ message: 'Imóvel não encontrado.' });
      }

      res.json(imovel);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar imóvel.', error: error.message });
    }
  },

  // Atualizar imóvel — somente locador dono
  async update(req, res) {
    try {
      const { id } = req.params;
      const { titulo, descricao, endereco, preco_noite } = req.body;

      const imovel = await Imovel.findByPk(id);
      if (!imovel) return res.status(404).json({ message: 'Imóvel não encontrado.' });

      if (imovel.usuario_id !== req.usuario.id) {
        return res.status(403).json({ message: 'Você não tem permissão para editar este imóvel.' });
      }

      await imovel.update({ titulo, descricao, endereco, preco_noite });

      res.json(imovel);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar imóvel.', error: error.message });
    }
  },

  // Deletar imóvel — somente locador dono
  async remove(req, res) {
    try {
      const { id } = req.params;
      const imovel = await Imovel.findByPk(id);

      if (!imovel) return res.status(404).json({ message: 'Imóvel não encontrado.' });

      if (imovel.usuario_id !== req.usuario.id) {
        return res.status(403).json({ message: 'Você não tem permissão para excluir este imóvel.' });
      }

      await imovel.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Erro ao deletar imóvel.', error: error.message });
    }
  }
};
