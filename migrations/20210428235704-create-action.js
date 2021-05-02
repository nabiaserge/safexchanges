'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('actions', {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('actions');
  }
};