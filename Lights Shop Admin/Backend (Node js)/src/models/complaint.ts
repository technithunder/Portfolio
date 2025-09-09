import { Model, DataTypes } from "sequelize";
import { sequelize } from "@/config/db.config";
import Order from "./order";
import User from "./user";
import { complaintNote } from "./complaintNotes";

class Complaint extends Model {
    public id!: number;
    public orderId!: number;
    public description!: string;
    public status!: "open" | "in_progress" | "resolved" | "closed" | "cancelled";
    public priority!: "low" | "medium" | "high" | "urgent";
    public targetCloseDate?: Date | null;
    public createdById!: number;
    public updatedById?: number | null;

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt?: Date | null;
}

Complaint.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Order,
                key: "id",
            },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("open", "in_progress", "resolved", "closed", "cancelled"),
            allowNull: true,
        },
        priority: {
            type: DataTypes.ENUM("low", "medium", "high", "urgent"),
            allowNull: true,
        },
        targetCloseDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        createdById: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: User,
                key: "id",
            },
        },
        updatedById: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: User,
                key: "id",
            },
            onDelete: "SET NULL",
        },
    },
    {
        sequelize,
        tableName: "complaints",
        timestamps: true,
        paranoid: true, // enables soft delete
        underscored: true, // snake_case columns
    }
);

// Associations
Complaint.belongsTo(Order, { foreignKey: "orderId", as: "order" });
Complaint.belongsTo(User, { foreignKey: "createdById", as: "creator" });
Complaint.belongsTo(User, { foreignKey: "updatedById", as: "updater" });
Complaint.hasMany(complaintNote, { foreignKey: "complaintId", as: "notes" });
User.hasMany(Complaint, { foreignKey: "staffId", as: "handledComplaints" });


export default Complaint;
