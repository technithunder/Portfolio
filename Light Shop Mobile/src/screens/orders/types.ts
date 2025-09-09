import {ImageSourcePropType, TouchableOpacityProps} from 'react-native';

export interface TabBarProps {
  data: OrderStatus[];
  selectedTab: OrderStatus;
  setSelectedTab: (item: OrderStatus) => void;
}

export interface OrderStatus {
  id: number;
  title: string;
  key?: string;
}
export interface OrderItem {
  name: string;
  quantity: number;
  price: number; // per item
}

export interface OrderSummary {
  items: OrderItem[];
  subTotal: number;
  shipping: number;
  total: number;
}

type OrderStatusType = 'PENDING' | 'DELIVERED' | 'CANCELLED';

export interface OrderProps {
  orderNumber: number;
  trackingNumber: string;
  quantity: number;
  subtotal: number;
  status: OrderStatusType;
  date: string;
  delivery_address?: string;
  order_message?: string;
  image: ImageSourcePropType;
  item?: OrderItem[];
  order_summary?: OrderSummary;
}

export interface OrderCardProps extends TouchableOpacityProps {
  item: OrderProps;
  order?: OrderProps;
  onPress: (item: any) => void;
}
