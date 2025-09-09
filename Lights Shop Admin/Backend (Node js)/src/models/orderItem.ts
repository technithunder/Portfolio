import { Model, DataTypes } from "sequelize";
import { sequelize } from "@/config/db.config";
import Order from "./order";
import Product from "./product";

class OrderItem extends Model {
  public id!: number;
  public orderId!: number;
  public productId!: number;
  public productName!: string;
  public quantity!: number;
  public unitPrice!: number;
  public totalPrice!: number;
  public ledcolors?: string;
  public bodycolors?: string;
  public watts?: string;
  public reflectors?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Order,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
      },
    },
    unitPrice: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    totalPrice: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    ledcolors: {
      type: DataTypes.JSONB,
    },
    bodycolors: {
      type: DataTypes.JSONB,
    },
    watts: {
      type: DataTypes.JSONB,
    },
    reflectors: {
      type: DataTypes.JSONB,
    },
  },
  {
    sequelize,
    tableName: "OrderItems",
    timestamps: true,
  }
);

// Set up associations
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "orderItems" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

export default OrderItem;
