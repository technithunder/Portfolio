import { Model, DataTypes } from "sequelize";
import { sequelize } from "@/config/db.config";
import User from "./user";
import Product from "./product";
import { Cart } from "./cart";

export class CartItem extends Model {
  public id!: number;
  public cartId!: number;
  public productId!: number;
  public quantity!: number;
  public ledcolors!: string;
  public bodycolors!: string;
  public reflectors!: number; // NOT DoubleDataType
  public watts!: number;
  public price!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Virtual field for product details
  public Product?: Product;
}

CartItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Cart,
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
      onDelete: "CASCADE",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    ledcolor: {
      type: DataTypes.JSONB,
    },
    bodycolor: {
      type: DataTypes.JSONB,
    },
    watts: {
      type: DataTypes.JSONB,
    },
    reflectors: {
      type: DataTypes.JSONB,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "CartItem",
    tableName: "cart_items",
    timestamps: true,
  }
);

CartItem.belongsTo(Cart, { foreignKey: "cartId", as: "cart" });
CartItem.belongsTo(Product, { foreignKey: "productId", as: "product" });
