import { sequelize } from "@/config/db.config";

// Import all models
import User from "./user";
import { Cart } from "./cart";
import { CartItem } from "./cartItem";
import Product from "./product";
import Wishlist from "./wishlist";
import { DailyProgress } from "./dailyPorgress";
import OrderStaff from "./orderStaff";
import Order from "./order";
import LeadStaff from "./leadStaff";
import { Lead } from "./lead";
import { LeadConversion } from "./leadConversion";
import Complaint from "./complaint";
import { complaintNote } from "./complaintNotes";
import ProductVariant from "./productVariant";
import ProductAttributeDiscount from "./ProductAttributeDiscounts";
import { Category } from "./category";

// Define all associations here to avoid circular dependencies
const setupAssociations = () => {
  // User associations
  Cart.hasMany(CartItem, {
    as: "items",
    foreignKey: "cartId",
  });
  User.belongsToMany(Product, {
    through: Wishlist,
    foreignKey: "userId",
    as: "wishlistedProducts",
  });

  DailyProgress.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });
  OrderStaff.belongsTo(Order, { foreignKey: "orderId" });
  Order.hasMany(OrderStaff, { foreignKey: "orderId" });
  OrderStaff.belongsTo(User, { foreignKey: "staffId", as: "staff" });
  User.hasMany(OrderStaff, { foreignKey: "staffId", as: "orderStaffs" });
  LeadStaff.hasOne(LeadConversion, { as: "LeadsConverted", foreignKey: "leadId" });


  // Complaint - ComplaintNote association
  Complaint.hasMany(complaintNote, {
    foreignKey: "complaintId",
    as: "complaintNotes"
  });

  complaintNote.belongsTo(Complaint, {
    foreignKey: "complaintId",
    as: "complaint"
  });

  // User - ComplaintNote association
  User.hasMany(complaintNote, {
    foreignKey: "userId",
    as: "complaintNotes"
  });

  complaintNote.belongsTo(User, {
    foreignKey: "userId",
    as: "User"
  });
  Complaint.belongsTo(Order, { foreignKey: "orderId", as: "orderdata" });
  Order.hasMany(Complaint, { foreignKey: "orderId", as: "complaints" });
  Product.hasMany(ProductVariant, { foreignKey: "productId", as: "variants" });
  ProductVariant.belongsTo(Product, { foreignKey: "productId" });

  Product.hasMany(ProductAttributeDiscount, { foreignKey: "productId", as: "attributeDiscounts" });
  ProductAttributeDiscount.belongsTo(Product, { foreignKey: "productId" });
  Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
  Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
};

// Call the function to set up associations
setupAssociations();

// Export all models
export { User, Cart, CartItem, Wishlist, Product, DailyProgress, OrderStaff, Order, Lead, LeadStaff, LeadConversion, Category, sequelize };

export default {
  User,
  Cart,
  CartItem,
  sequelize,
};
