import {ImageSourcePropType, TouchableOpacityProps} from 'react-native';
import {IconType} from '../../components/VectorIcon';

export interface ProfileItem {
  id: number;
  title: string;
  image: ImageSourcePropType | any;
  onPress?: () => void | boolean;
  icoName: string;
  icon: IconType;
}

export interface ProfileOptionsProps {
  item: ProfileItem;
  onPress: () => void;
}
export interface ProfileViewProps extends TouchableOpacityProps {}
