// leadstaff.ts
import { Model, DataTypes } from "sequelize";
import { sequelize } from "@/config/db.config";
import User from "./user";
import { Lead } from "./lead";

class LeadStaff extends Model { }
LeadStaff.init(
    {
        leadId: {
            type: DataTypes.INTEGER,
            references: {
                model: Lead,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        staffId: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: "id",
            },
            onDelete: "CASCADE",
        },
    },
    {
        sequelize,
        tableName: "LeadStaffs",
        timestamps: false,
    }
);

Lead.belongsToMany(User, {
    through: LeadStaff,
    as: "assignedStaff",
    foreignKey: "leadId",
});

User.belongsToMany(Lead, {
    through: LeadStaff,
    as: "assignedLeads",
    foreignKey: "staffId",
});

Lead.hasMany(LeadStaff, { foreignKey: "leadId" });
LeadStaff.belongsTo(Lead, { foreignKey: "leadId" });
User.hasMany(LeadStaff, { foreignKey: "staffId" });
LeadStaff.belongsTo(User, { foreignKey: "staffId" });

export default LeadStaff;
