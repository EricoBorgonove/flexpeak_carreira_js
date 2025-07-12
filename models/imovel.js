'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Imovel extends Model {
    static associate(models) {
      // Um imóvel pertence a um locador (usuário)
      Imovel.belongsTo(models.Users, {
        foreignKey: 'usuario_id',
        as: 'locador'
      });

      // Um imóvel pode ter várias locações
      Imovel.hasMany(models.Locacao, {
        foreignKey: 'imovel_id',
        as: 'locacoes'
      });
    }
  }

  Imovel.init({
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    endereco: {
      type: DataTypes.STRING,
      allowNull: false
    },
    preco_noite: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      field: 'usuario_id'
    }
  }, {
    sequelize,
    modelName: 'Imovel',
    tableName: 'imoveis'
  });

  return Imovel;
};
