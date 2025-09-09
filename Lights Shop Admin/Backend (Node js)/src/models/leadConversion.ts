import { Model, DataTypes } from "sequelize";
import { sequelize } from "@/config/db.config";
import { Lead } from "./lead";
import User from "./user";

export class LeadConversion extends Model { }

LeadConversion.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    leadId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Lead, key: "id" } },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: "id" } },
    oldStatus: { type: DataTypes.STRING, allowNull: true },
    newRole: { type: DataTypes.ENUM("dealer", "customer"), allowNull: false },
    convertedBy: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: "id" } },
    convertedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, {
    sequelize,
    tableName: "LeadConversions",
    timestamps: false,
});

Lead.hasMany(LeadConversion, { foreignKey: "leadId" });
User.hasMany(LeadConversion, { foreignKey: "userId" });
LeadConversion.belongsTo(Lead, { foreignKey: "leadId" });
LeadConversion.belongsTo(User, { foreignKey: "userId" });
