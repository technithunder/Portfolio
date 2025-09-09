import { Model, DataTypes } from "sequelize";
import { sequelize } from "@/config/db.config";
import Order from "./order";
import User from "./user";

class OrderStaff extends Model { }

OrderStaff.init(
  {
    orderId: {
      type: DataTypes.INTEGER,
      references: {
        model: Order,
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
    tableName: "OrderStaffs",
    timestamps: false,
  }
);


Order.belongsToMany(User, {
  through: OrderStaff,
  as: "assignedStaff",
  foreignKey: "orderId",
});
User.belongsToMany(Order, {
  through: OrderStaff,
  as: "assignedOrders",
  foreignKey: "staffId",
});

export default OrderStaff;
