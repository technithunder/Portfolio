import { Model, DataTypes } from "sequelize";
import { sequelize } from "@/config/db.config";
import { Json } from "sequelize/types/utils";
import User from "./user";
import Wishlist from "./wishlist";

class Product extends Model {
  public id!: number;
  public productName!: string;
  public image?: Json;
  public categoryId!: number;
  public productPrice!: number;
  public discount!: number;
  public discountPrice!: number;
  public productDescription!: string;
  public addedStock!: number;
  public openingStock!: number;
  public remainingStock!: number;
  public expiryDate!: Date;
  public ledColors?: Json;
  public bodyColors?: Json;
  public watts?: Json;
  public reflectors?: Json;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productName: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.JSON,
    },
    categoryId: {
      type: DataTypes.INTEGER,
    },
    productPrice: {
      type: DataTypes.FLOAT,
    },
    discount: {
      type: DataTypes.FLOAT,
    },
    discountPrice: {
      type: DataTypes.FLOAT,
    },
    productDescription: {
      type: DataTypes.STRING,
    },
    addedStock: {
      type: DataTypes.INTEGER,
    },
    openingStock: {
      type: DataTypes.INTEGER,
    },
    remainingStock: {
      type: DataTypes.INTEGER,
    },
    expiryDate: {
      type: DataTypes.DATE,
    },
    ledColors: {
      type: DataTypes.JSON,
    },
    bodyColors: {
      type: DataTypes.JSON,
    },
    watts: {
      type: DataTypes.JSON,
    },
    reflectors: {
      type: DataTypes.JSON,
    },
    averageRating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "Products",
    timestamps: true,
  }
);

Product.belongsToMany(User, {
  through: Wishlist,
  foreignKey: "productId",
  as: "wishlistedBy",
});
export default Product;
