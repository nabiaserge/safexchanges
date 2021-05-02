'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('compte_users', {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('compte_users');
  }
};