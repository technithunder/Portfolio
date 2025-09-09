import {ImageStyle, StyleProp, ViewStyle} from 'react-native';

export interface MiniCategoryProps {
  isSelected?: boolean;
  item: categoryItemProps;
  index?: number;
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  showLikeIcon?: boolean;
  onLikePress?: () => void;
  activeOpacity?: number;
}

export interface categoryItemProps {
  id: number;
  title: string;
  image: any;
  price?: string;
  isLiked?: boolean;
}
export interface MiniProductsProps extends MiniCategoryProps {}
export interface MiniRecommendedProps extends MiniCategoryProps {}
export interface BodyHeaderProps {
  leftTitle: string;
  rightTitle?: string;
  onRightPress?: () => void;
}
export interface PaginationProps {
  item: {
    index: number;
  };
  containerStyle?: StyleProp<ViewStyle>;
  borderColor?: string;
  dotColor?: string;
}
