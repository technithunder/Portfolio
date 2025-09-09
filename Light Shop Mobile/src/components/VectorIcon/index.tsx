import React from 'react';
import {StyleProp, TextStyle, TouchableOpacity, ViewStyle} from 'react-native';
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
  containerStyle?: StyleProp<ViewStyle>;
}

const Icon: React.FC<VectorIconsProps> = ({
  icon,
  name,
  color,
  size,
  style,
  onPress,
  containerStyle,
}) => {
  const hitSlop = {
    top: moderateScale(10),
    bottom: moderateScale(10),
    left: moderateScale(10),
    right: moderateScale(10),
  };
  const renderIcon = () => {
    switch (icon) {
      case 'Feather':
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            hitSlop={hitSlop}
            style={containerStyle}>
            <IconF
              name={name}
              color={color}
              size={size ? moderateScale(size) : moderateScale(20)}
              style={style}
              onPress={onPress}
            />
          </TouchableOpacity>
        );
      case 'AntDesign':
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            hitSlop={hitSlop}
            style={containerStyle}>
            <IconA
              name={name}
              color={color}
              size={size ? moderateScale(size) : moderateScale(20)}
              style={style}
              onPress={onPress}
            />
          </TouchableOpacity>
        );
      case 'MaterialCommunityIcons':
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            hitSlop={hitSlop}
            style={containerStyle}>
            <IconM
              name={name}
              color={color}
              size={size ? moderateScale(size) : moderateScale(20)}
              style={style}
              onPress={onPress}
            />
          </TouchableOpacity>
        );
      case 'MaterialIcons':
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            hitSlop={hitSlop}
            style={containerStyle}>
            <IconL
              name={name}
              color={color}
              size={size ? moderateScale(size) : moderateScale(20)}
              style={style}
              onPress={onPress}
            />
          </TouchableOpacity>
        );
      case 'FontAwesome':
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            hitSlop={hitSlop}
            onPress={onPress}
            style={containerStyle}>
            <IconT
              name={name}
              color={color}
              size={size ? moderateScale(size) : moderateScale(20)}
              style={style}
              onPress={onPress}
            />
          </TouchableOpacity>
        );
      case 'Fontisto':
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            hitSlop={hitSlop}
            style={containerStyle}>
            <IconV
              name={name}
              color={color}
              hitSlop={hitSlop}
              size={size ? moderateScale(size) : moderateScale(20)}
              style={style}
              onPress={onPress}
            />
          </TouchableOpacity>
        );
      case 'EvilIcons':
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            hitSlop={hitSlop}
            style={containerStyle}>
            <IconE
              name={name}
              color={color}
              size={size ? moderateScale(size) : moderateScale(20)}
              style={style}
              onPress={onPress}
            />
          </TouchableOpacity>
        );
      case 'Entypo':
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            hitSlop={hitSlop}
            style={containerStyle}>
            <IconJ
              name={name}
              color={color}
              size={size ? moderateScale(size) : moderateScale(20)}
              style={style}
              onPress={onPress}
            />
          </TouchableOpacity>
        );
      case 'Ionicons':
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            hitSlop={hitSlop}
            onPress={onPress}
            style={containerStyle}>
            <IconG
              name={name}
              color={color}
              size={size ? moderateScale(size) : moderateScale(20)}
              style={style}
              onPress={onPress}
            />
          </TouchableOpacity>
        );
      case 'Octicons':
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            hitSlop={hitSlop}
            onPress={onPress}
            style={containerStyle}>
            <IconP
              name={name}
              color={color}
              size={size ? moderateScale(size) : moderateScale(20)}
              style={style}
              onPress={onPress}
            />
          </TouchableOpacity>
        );
      case 'FontAwesome5':
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            hitSlop={hitSlop}
            style={containerStyle}>
            <IconW
              name={name}
              color={color}
              size={size ? moderateScale(size) : moderateScale(20)}
              style={style}
              onPress={onPress}
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
