import { Model, DataTypes } from "sequelize";
import { sequelize } from "@/config/db.config";
import User from "./user";
import { CartItem } from "./cartItem";

export class Cart extends Model {
  public id!: number;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  static associate(models: any) {
    // Association with CartItem
  }
}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "Cart",
    tableName: "carts",
    timestamps: true,
  }
);

// Cart.hasMany(CartItem, {
//   as: "items",
//   foreignKey: "cartId",
// });
