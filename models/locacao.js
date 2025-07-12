'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Locacao extends Model {
    static associate(models) {
      Locacao.belongsTo(models.Users, {
        foreignKey: 'usuario_id',
        as: 'locatario'
      });

      Locacao.belongsTo(models.Imovel, {
        foreignKey: 'imovel_id',
        as: 'imovel'
      });
    }
  }

  Locacao.init({
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    imovel_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    data_inicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    data_fim: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pendente'
    }
  }, {
    sequelize,
    modelName: 'Locacao',
    tableName: 'locacoes'
  });

  return Locacao;
};
