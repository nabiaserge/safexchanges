'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.session.belongsTo(models.compte_users);
     models.produit.hasMany(models.session);
    }
  };
  session.init({
    date_deb_sess: DataTypes.STRING,
    date_fin_sess: DataTypes.STRING,
    action_sess: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'session',
  });
  return session;
};