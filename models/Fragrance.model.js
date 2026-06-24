import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Fragrance = sequelize.define("Fragrance", {
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  brandId: { type: DataTypes.INTEGER },
  price: { type: DataTypes.FLOAT },
  description: { type: DataTypes.TEXT },
  img: { type: DataTypes.STRING },
  topNoteId: { type: DataTypes.INTEGER },
  heartNoteId: { type: DataTypes.INTEGER },
  baseNoteId: { type: DataTypes.INTEGER },
  accords: { type: DataTypes.STRING },
  genre: { type: DataTypes.ENUM("Homme", "Femme", "Unisex"), allowNull: false },
  saison: { type: DataTypes.ENUM("Printemps", "Eté", "Automne", "Hiver"), allowNull: false },
  isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
});

export default Fragrance;
