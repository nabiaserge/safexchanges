'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('produits', {
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
      idCat: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
            model: 'categories',
            key: 'id'
        }
      },
      denomination: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      volume: {
        type: Sequelize.STRING
      },
      poids: {
        type: Sequelize.STRING
      },
      stock: {
        type: Sequelize.STRING
      },
      prix: {
        type: Sequelize.STRING
      },
      type: {
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
    await queryInterface.dropTable('produits');
  }
};
