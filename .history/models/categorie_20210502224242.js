'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class categorie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.categorie.hasMany(models.produit);
    }
  };
  categorie.init({

    nom_cat: DataTypes.STRING,
    code_douane: DataTypes.STRING,
    caracteristique: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'categorie',
  });
  return categorie;
};