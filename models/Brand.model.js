import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Brand = sequelize.define("Brand", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  img: { type: DataTypes.STRING },
  isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
});

export default Brand;
