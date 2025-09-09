import { Model, DataTypes } from "sequelize";
import { sequelize } from "@/config/db.config";
import { Lead } from "./lead";
import User from "./user";

class LeadNote extends Model { }

LeadNote.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        leadId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Lead,
                key: "id"
            },
            onDelete: "CASCADE"
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id"
            },
            onDelete: "CASCADE"
        },
        note: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        // Uncomment below for threaded replies or note types:
        // replyToNoteId: {
        //   type: DataTypes.INTEGER,
        //   references: { model: "LeadNotes", key: "id" },
        //   allowNull: true,
        // },
        // noteType: {
        //   type: DataTypes.ENUM("staff", "admin"),
        //   allowNull: false,
        // }
    },
    {
        sequelize,
        tableName: "LeadNotes",
        timestamps: true,
    }
);

// Associations
Lead.hasMany(LeadNote, { foreignKey: "leadId" });
LeadNote.belongsTo(Lead, { foreignKey: "leadId" });

User.hasMany(LeadNote, { foreignKey: "userId" });
LeadNote.belongsTo(User, { foreignKey: "userId" });

// For threaded replies:
// LeadNote.hasMany(LeadNote, { foreignKey: "replyToNoteId", as: "replies" });
// LeadNote.belongsTo(LeadNote, { foreignKey: "replyToNoteId", as: "parentNote" });

export default LeadNote;
