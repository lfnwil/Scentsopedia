import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Note = sequelize.define("Note", {
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  img: { type: DataTypes.STRING },
  isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
});

export default Note;
