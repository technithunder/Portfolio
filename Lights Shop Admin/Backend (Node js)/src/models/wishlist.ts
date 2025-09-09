import { Model, DataTypes } from "sequelize";
import { sequelize } from "@/config/db.config";

class Wishlist extends Model {
  public id!: number;
  public userId!: number;
  public productId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Wishlist.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Wishlist",
    tableName: "Wishlists",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "productId"], // prevent duplicate wishlists
      },
    ],
  }
);

export default Wishlist;
