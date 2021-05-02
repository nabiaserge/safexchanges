'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class compte_user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  compte_user.init({
    type: DataTypes.STRING,
    adress: DataTypes.STRING,
    phone: DataTypes.STRING,
    num_ref: DataTypes.STRING,
    num_id: DataTypes.STRING,
    specificite: DataTypes.STRING,
    confirm_compte: DataTypes.STRING,
    confirm_mail: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'compte_user',
  });
  return compte_user;
};