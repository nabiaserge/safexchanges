'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class produit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.produit.belongsTo(models.compte_user);
      models.produit.belongsTo(models.categorie);
    }
  };
  produit.init({
    denomination: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    volume: DataTypes.STRING,
    poids: DataTypes.STRING,
    stock: DataTypes.STRING,
    prix: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'produit',
  });
  return produit;
};