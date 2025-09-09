export const getStatusOptions = [
  { value: "order_placed", label: "Order Placed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "out_for_delivery", label: "Out For Delivery" },
];

export const roleOptions = ["staff", "dealer"];

export const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export const maritalStatusOptions = [
  {
    value: "single",
    label: "Single",
  },
  {
    value: "married",
    label: "Married",
  },
];

export const leadTypeOptions = [
  { value: "hot", label: "Hot" },
  { value: "warm", label: "Warm" },
  { value: "cold", label: "Cold" },
  // { value: "medium", label: "Medium" },
];

export const isAdminOptions = [
  { value: "true", label: "True" },
  { value: "false", label: "False" },
];

export const orderApprovalOptions = [
  { value: "pending", label: "Pending" },
  { value: "approve", label: "Approve" },
  { value: "reject", label: "Reject" },
];

export const productImages = {
  30: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center",
  31: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=300&fit=crop&crop=center",
  default:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center",
};

export const productCategoryOptions = [
  { value: "ledstrips", name: "LED Strips", id: 2 },
];
