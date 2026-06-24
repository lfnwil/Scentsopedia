import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Review = sequelize.define("Review", {
  fragranceId: { type: DataTypes.INTEGER },
  rating: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 } },
  longevity: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 } },
  sillage: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 } },
  comment: { type: DataTypes.TEXT },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
});

export default Review;
