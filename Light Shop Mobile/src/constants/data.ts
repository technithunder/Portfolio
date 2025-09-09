import {NotifyProps} from '../screens/Notify/types';
import {OrderProps} from '../screens/orders/types';
import {ProfileItem} from '../screens/profile/types';
import {colors} from '../theme';
import {navigate} from '../utils';
import Images from './images';
import Routes from './routes';

export const categoryData = [
  {
    id: 1,
    title: 'Hanging Lights',
    image: Images.men,
    price: '$ 39.99',
    isLiked: true,
  },
  {
    id: 2,
    title: 'Fairy lights',
    image: Images.women,
    price: '$ 45.00',
    isLiked: true,
  },
  {
    id: 3,
    title: 'Series',
    image: Images.beauty,
    price: '$ 80.00',
    isLiked: true,
  },
  {
    id: 4,
    title: 'Hanging Lights',
    image: Images.eye_wear,
    price: '$ 60.00',
    isLiked: true,
  },
  {
    id: 5,
    title: 'Hanging Lights',
    image: Images.men,
    price: '$ 39.99',
    isLiked: true,
  },
  {
    id: 6,
    title: 'Fairy lights',
    image: Images.women,
    price: '$ 45.00',
    isLiked: true,
  },
  {
    id: 7,
    title: 'Series',
    image: Images.beauty,
    price: '$ 80.00',
    isLiked: true,
  },
  {
    id: 8,
    title: 'Hanging Lights',
    image: Images.eye_wear,
    price: '$ 60.00',
    isLiked: true,
  },
];
export const emptyData = Array.from({length: 6});
export const wattsData = [10, 20, 50, 60];
export const reflectorsData = [10, 20, 50];

export const productColorData = [
  {
    id: 1,
    color: '#E7C0A7',
    colorName: 'Cashmere',
  },
  {
    id: 2,
    color: '#050302',
    colorName: 'Jet Black',
  },
  {
    id: 3,
    color: '#EE6969',
    colorName: 'Coral Red',
  },
  {
    id: 4,
    color: '#E7C0A7',
    colorName: 'Cashmere',
  },
  {
    id: 5,
    color: '#050302',
    colorName: 'Jet Black',
  },
  {
    id: 6,
    color: '#EE6969',
    colorName: 'Coral Red',
  },
];

// export const orderStatusData = [
//   {
//     id: 0,
//     title: 'All',
//     key: 'all',
//   },
//   {
//     id: 1,
//     title: 'Order Placed',
//     key: 'order_placed',
//   },
//   {
//     id: 2,
//     title: 'Processing',
//     key: 'processing',
//   },
//   {
//     id: 3,
//     title: 'Shipped',
//     key: 'shipped',
//   },
//   {
//     id: 4,
//     title: 'Out for Delivery',
//     key: 'out_for_delivery',
//   },
//   {
//     id: 5,
//     title: 'Delivered',
//     key: 'delivered',
//   },
//   {
//     id: 6,
//     title: 'Cancelled',
//     key: 'cancelled',
//   },
// ];

export const orderStatusData = [
  {key: 'all',title:"All"},
  {key: 'admin_approval', title: 'Under Admin Approval'},
  {key: 'approved', title: 'Approved'},
  {key: 'process_for_advance', title: 'In-process For Advance'},
  {key: 'update_receipt', title: 'Advance Received'},
  {key: 'processing', title: 'Processing For Production'},
  {key: 'production', title: 'In Production'},
  {key: 'production_finished', title: 'Production Finished'},
  {key: 'rest_of_payment', title: 'Rest Of Payment'},
  {key: 'admin_final_approval', title: 'Final Approval Given'},
  {key: 'out_for_delivery', title: 'Out For Delivery'},
  {key: 'dispatched', title: 'Dispatched'},
  {key: 'delivered', title: 'Delivered'},
  {key: 'cancelled', title: 'Cancelled'},
];

export const orderStatus = {
  admin_approval: 'Under Admin Approval',
  approved: 'Approved',
  process_for_advance: 'In-process For Advance',
  update_receipt: 'Advance Received',
  processing: 'Processing For Production',
  production: 'In Production',
  production_finished: 'Production Finished',
  rest_of_payment: 'Rest Of Payment',
  admin_final_approval: 'Final Approval Given',
  out_for_delivery: 'Out For Delivery',
  dispatched: 'Dispatched',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const ordersData: OrderProps[] = [
  {
    orderNumber: 1524,
    trackingNumber: 'IK287368838',
    quantity: 2,
    subtotal: 110,
    status: 'PENDING',
    date: '13/05/2021',
    delivery_address: 'SBI Building, Software Park',
    order_message: 'Your order is on the way',
    image: Images.on_way,
  },
  {
    orderNumber: 1524,
    trackingNumber: 'IK2873218897',
    quantity: 3,
    subtotal: 230,
    status: 'PENDING',
    date: '12/05/2021',
    order_message: 'Your order is on the way',
    delivery_address: 'SBI Building, Software Park',
    image: Images.on_way,
  },
  {
    orderNumber: 1524,
    trackingNumber: 'IK237368820',
    quantity: 5,
    subtotal: 490,
    status: 'PENDING',
    date: '10/05/2021',
    order_message: 'Your order is on the way',
    delivery_address: 'SBI Building, Software Park',
    image: Images.on_way,
  },
  {
    orderNumber: 1514,
    trackingNumber: 'IK987362341',
    quantity: 2,
    subtotal: 110,
    status: 'DELIVERED',
    date: '13/05/2021',
    order_message: 'Your order is delivered',
    delivery_address: 'SBI Building, Software Park',
    image: Images.delivery,
  },
  {
    orderNumber: 1679,
    trackingNumber: 'IK3873218890',
    quantity: 3,
    subtotal: 450,
    status: 'DELIVERED',
    date: '12/05/2021',
    order_message: 'Your order is delivered',
    delivery_address: 'SBI Building, Software Park',
    image: Images.delivery,
  },
  {
    orderNumber: 1671,
    trackingNumber: 'IK237368881',
    quantity: 3,
    subtotal: 400,
    status: 'DELIVERED',
    date: '10/05/2021',
    order_message: 'Your order is delivered',
    delivery_address: 'SBI Building, Software Park',
    image: Images.delivery,
  },
  {
    orderNumber: 1829,
    trackingNumber: 'IK287368831',
    quantity: 2,
    subtotal: 210,
    status: 'CANCELLED',
    date: '10/05/2021',
    order_message: 'Your order is delivered',
    delivery_address: 'SBI Building, Software Park',
    image: Images.delivery,
  },
  {
    orderNumber: 1824,
    trackingNumber: 'IK2882198182',
    quantity: 3,
    subtotal: 120,
    status: 'CANCELLED',
    date: '10/05/2021',
    order_message: 'Your order is delivered',
    delivery_address: 'SBI Building, Software Park',
    image: Images.delivery,
  },
];

export const sliderColors = [
  '#B0604D',
  '#899F9C',
  '#B3C680',
  '#5C6265',
  '#F5D399',
  '#F1F1F1',
];
export const notificationData: NotifyProps[] = [
  {
    id: 1,
    title: 'Good morning! Get 20% Voucher',
    description: 'Summer sale up to 20% off. Limited voucher. Get now!! 😜',
  },
  {
    id: 2,
    title: 'Special offer just for you',
    description: 'New Autumn Collection 30% off',
  },
  {
    id: 3,
    title: 'Holiday sale 50%',
    description: 'Tap here to get 50% voucher.',
  },
  {
    id: 4,
    title: 'Good morning! Get 20% Voucher',
    description: 'Summer sale up to 20% off. Limited voucher. Get now!! 😜',
  },
  {
    id: 5,
    title: 'Special offer just for you',
    description: 'New Autumn Collection 30% off',
  },
  {
    id: 6,
    title: 'Holiday sale 50%',
    description: 'Tap here to get 50% voucher.',
  },
  {
    id: 7,
    title: 'Good morning! Get 20% Voucher',
    description: 'Summer sale up to 20% off. Limited voucher. Get now!! 😜',
  },
  {
    id: 8,
    title: 'Special offer just for you',
    description: 'New Autumn Collection 30% off',
  },
  {
    id: 9,
    title: 'Holiday sale 50%',
    description: 'Tap here to get 50% voucher.',
  },
];
export const profileData: ProfileItem[] = [
  {
    id: 1,
    title: 'My Wishlist',
    icon: 'AntDesign',
    icoName: 'heart',
    image: '',
    onPress: () => navigate(Routes.MyWishlist),
  },
  {
    id: 2,
    title: 'Address',
    icon: 'Entypo',
    icoName: 'location',
    image: '',
    onPress: () => navigate(Routes.Address),
  },
  {
    id: 3,
    title: 'Change Password',
    image: '',
    icoName: 'password',
    icon: 'MaterialIcons',
    onPress: () => navigate(Routes.ChangePassword),
  },
  {
    id: 4,
    title: 'Log out',
    image: Images.logout,
    icoName: '',
    icon: 'AntDesign',
    onPress: false,
  },
];

export const genderData = [
  {
    id: 1,
    label: 'Male',
    value: 'Male',
  },
  {
    id: 2,
    label: 'Female',
    value: 'Female',
  },
];
