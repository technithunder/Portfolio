import React from 'react';
import {StyleProp, TextStyle, TouchableOpacity} from 'react-native';
import IconF from 'react-native-vector-icons/Feather';
import IconA from 'react-native-vector-icons/AntDesign';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import IconL from 'react-native-vector-icons/MaterialIcons';
import IconT from 'react-native-vector-icons/FontAwesome';
import IconE from 'react-native-vector-icons/EvilIcons';
import IconJ from 'react-native-vector-icons/Entypo';
import IconG from 'react-native-vector-icons/Ionicons';
import IconP from 'react-native-vector-icons/Octicons';
import IconW from 'react-native-vector-icons/FontAwesome5';
import IconV from 'react-native-vector-icons/Fontisto';

import {moderateScale} from 'react-native-size-matters';

export type IconType =
  | 'Feather'
  | 'AntDesign'
  | 'MaterialCommunityIcons'
  | 'MaterialIcons'
  | 'FontAwesome'
  | 'Fontisto'
  | 'EvilIcons'
  | 'Entypo'
  | 'Ionicons'
  | 'Octicons'
  | 'FontAwesome5';

interface VectorIconsProps {
  icon: IconType;
  name: string;
  color?: string;
  size?: number;
  style?: StyleProp<TextStyle>;
  onPress?: () => void;
}

const Icon: React.FC<VectorIconsProps> = ({
  icon,
  name,
  color,
  size,
  style,
  onPress,
}) => {
  const renderIcon = () => {
    switch (icon) {
      case 'Feather':
        return (
          <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
            <IconF
              name={name}
              color={color}
              size={size ? moderateScale(size) : moderateScale(20)}
              style={style}
            />
          </TouchableOpacity>
        );
      case 'AntDesign':
        return (
          <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
            <IconA
              name={name}
              color={color}
              size={size ? moderateScale(size) : moderateScale(20)}
              style={style}
            />
          </TouchableOpacity>
        );
      case 'MaterialCommunityIcons':
        return (
          <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
            <IconM
              name={name}
              color={color}
              size={size ? moderateScale(size) : moderateScale(20)}
              style={style}
            />
          </TouchableOpacity>
        );
      case 'MaterialIcons':
        return (
          <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
            <IconL
              name={name}
              color={color}
              size={size ? moderateScale(size) : moderateScale(20)}
              style={style}
            />
          </TouchableOpacity>
        );
      case 'FontAwesome':
        return (
          <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
            <IconT
              name={name}
              color={color}
              size={size ? moderateScale(size) : moderateScale(20)}
              style={style}
            />
          </TouchableOpacity>
        );
      case 'Fontisto':
        return (
          <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
            <IconV
              name={name}
              color={color}
              size={size ? moderateScale(size) : moderateScale(20)}
              style={style}
            />
          </TouchableOpacity>
        );
      case 'EvilIcons':
        return (
          <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
            <IconE
              name={name}
              color={color}
              size={size ? moderateScale(size) : moderateScale(20)}
              style={style}
            />
          </TouchableOpacity>
        );
      case 'Entypo':
        return (
          <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
            <IconJ
              name={name}
              color={color}
              size={size ? moderateScale(size) : moderateScale(20)}
              style={style}
            />
          </TouchableOpacity>
        );
      case 'Ionicons':
        return (
          <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
            <IconG
              name={name}
              color={color}
              size={size ? moderateScale(size) : moderateScale(20)}
              style={style}
            />
          </TouchableOpacity>
        );
      case 'Octicons':
        return (
          <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
            <IconP
              name={name}
              color={color}
              size={size ? moderateScale(size) : moderateScale(20)}
              style={style}
            />
          </TouchableOpacity>
        );
      case 'FontAwesome5':
        return (
          <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
            <IconW
              name={name}
              color={color}
              size={size ? moderateScale(size) : moderateScale(20)}
              style={style}
            />
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return renderIcon();
};

export default Icon;
