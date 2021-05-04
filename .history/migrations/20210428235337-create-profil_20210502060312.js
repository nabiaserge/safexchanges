'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('profils', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idCompt: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
            model: 'compte_users',
            key: 'id'
        }
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
    await queryInterface.dropTable('profils');
  }
};