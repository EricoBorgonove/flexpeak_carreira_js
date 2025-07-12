'use strict';
const bcrypt = require ('bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const hash = async (senha) => bcrypt.hash(senha, 10)

    const usuarios = [
      {
      nome: 'admin',
      cpf: '00000000000',
      email: 'admin@ifpk.com.br',
      senha: await hash('admin'),
      tipo_usuario: 'locador',
      createdAt: new Date(),
      updatedAt: new Date()
      }
    ]
    await queryInterface.bulkInsert('Users', usuarios, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
