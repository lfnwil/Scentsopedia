import sequelize from "../config/database.js";
import Brand from "./Brand.model.js";
import Fragrance from "./Fragrance.model.js";
import Note from "./Note.model.js";
import Review from "./Review.model.js";

Brand.hasMany(Fragrance, { foreignKey: "brandId" })
Fragrance.belongsTo(Brand, { foreignKey: "brandId" });
Fragrance.belongsTo(Note, { as: "topNote", foreignKey: "topNoteId" });
Fragrance.belongsTo(Note, { as: "heartNote", foreignKey: "heartNoteId" });
Fragrance.belongsTo(Note, { as: "baseNote", foreignKey: "baseNoteId" });
Fragrance.hasMany(Review, { foreignKey: "fragranceId" });
Review.belongsTo(Fragrance, { foreignKey: "fragranceId" });

export { sequelize, Brand, Fragrance, Note, Review };
