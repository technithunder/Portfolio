import {TouchableOpacityProps} from 'react-native';

export interface SubSizeProps extends TouchableOpacityProps {
  isSelected?: boolean;
  item: sizeType;
}
export interface sizeType {
  id: number;
  size?: string;
  color?: string;
}
export interface AddCartProps extends TouchableOpacityProps {}
