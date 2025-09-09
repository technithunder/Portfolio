import { Model, DataTypes } from "sequelize";
import { sequelize } from "@/config/db.config";
import User from "./user";
import Complaint from "./complaint";

export class complaintNote extends Model { }

complaintNote.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        complaintId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Complaint,
                key: "id"
            },
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id"
            },
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
        tableName: "complaintNotes",
        timestamps: true,
    }
);


