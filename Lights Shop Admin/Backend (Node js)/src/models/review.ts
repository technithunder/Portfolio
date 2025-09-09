// models/review.ts
import { Model, DataTypes } from "sequelize";
import { sequelize } from "@/config/db.config";
import Product from "./product";
import User from "./user";

class Review extends Model {
    public id!: number;
    public userId!: number;
    public productId!: number;
    public rating!: number;
    public reviewText?: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Review.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        reviewImage: {
            type: DataTypes.STRING,
            allowNull: true
        },
        rating: {
            type: DataTypes.FLOAT,
            allowNull: true,
            validate: {
                min: 0,
                max: 5,
            },
        },
        reviewText: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "Reviews",
        timestamps: true,
    }
);

// Associations
Review.belongsTo(User, { foreignKey: "userId", as: "user" });
Review.belongsTo(Product, { foreignKey: "productId", as: "product" });

Product.hasMany(Review, { foreignKey: "productId", as: "reviews" });
User.hasMany(Review, { foreignKey: "userId", as: "reviews" });

export default Review;
