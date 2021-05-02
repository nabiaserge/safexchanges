'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('compte_users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING
      },
      adress: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      num_ref: {
        type: Sequelize.STRING
      },
      num_id: {
        type: Sequelize.STRING
      },
      specificite: {
        type: Sequelize.STRING
      },
      confirm_compte: {
        type: Sequelize.STRING
      },
      confirm_mail: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('compte_users');
  }
};