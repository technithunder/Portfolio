import { Model, DataTypes } from "sequelize";
import { sequelize } from "@/config/db.config";
import Order from "./order";
import User from "./user";

class OrderNote extends Model { }

OrderNote.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        orderId: {
            type: DataTypes.INTEGER,
            references: { model: Order, key: "id" },
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            references: { model: User, key: "id" },
            allowNull: false,
        },
        note: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        // replyToNoteId: {
        //   type: DataTypes.INTEGER,
        //   references: { model: "OrderNotes", key: "id" }, // self-reference
        //   allowNull: true,
        // },
        // noteType: {
        //   type: DataTypes.ENUM("staff", "admin"),
        //   allowNull: false,
        // }
    },
    {
        sequelize,
        tableName: "OrderNotes",
        timestamps: true,
    }
);

// Associations
Order.hasMany(OrderNote, { foreignKey: "orderId" });
OrderNote.belongsTo(Order, { foreignKey: "orderId" });

User.hasMany(OrderNote, { foreignKey: "userId" });
OrderNote.belongsTo(User, { foreignKey: "userId" });

// OrderNote.hasMany(OrderNote, { foreignKey: "replyToNoteId", as: "replies" }); // for replies
// OrderNote.belongsTo(OrderNote, { foreignKey: "replyToNoteId", as: "parentNote" });

export default OrderNote;
