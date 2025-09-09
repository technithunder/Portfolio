import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, {FC, ReactNode, memo} from 'react';
import {moderateScale} from 'react-native-size-matters';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import styles from './styles';
import Typography from '../Typo';
import {goBack} from '../../utils';
import Icon from '../VectorIcon';
import {colors, commonSty} from '../../theme';
import TouchableImage from '../TouchableImage';
import { FONTS } from '../../constants/fonts';

export interface HeaderProps {
  containerStyle?: StyleProp<ViewStyle>;
  leftContainerStyle?: StyleProp<ViewStyle>;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  rightIcon?: ImageSourcePropType;
  title?: string;
  titleStyle?: TextStyle;
  iconStyle?: ImageStyle;
  leftIcon?: ImageSourcePropType;
  customLeftComponent?: ReactNode;
  backgroundColor?: string;
  showBottomBorder?: boolean;
  showBack?: boolean;
}

const Header: FC<HeaderProps> = props => {
  const {
    containerStyle,
    leftContainerStyle,
    onLeftPress,
    titleStyle,
    iconStyle,
    title,
    rightIcon,
    backgroundColor,
    onRightPress,
    showBottomBorder,
    showBack,
    leftIcon,
  } = props;
  const handleLeftPress = () => goBack();
  const insets = useSafeAreaInsets();

  const dynamicHeaderContainerStyle = {
    paddingTop: insets.top + moderateScale(10),
    backgroundColor: backgroundColor || colors.white,
  };

  return (
    <>
      <View
        style={[
          styles.mainContainer,
          containerStyle,
          dynamicHeaderContainerStyle,
        ]}>
        {showBack && !leftIcon ? (
          <View style={[styles.smallContainer, leftContainerStyle]}>
            <Icon
              icon="Ionicons"
              name="chevron-back-outline"
              containerStyle={styles.leftIconSubContainer}
              onPress={onLeftPress || handleLeftPress}
              size={20}
              color={colors.primary}
            />
          </View>
        ) : leftIcon ? (
          <View style={styles.smallContainer}>
            <TouchableImage
              source={leftIcon}
              imageStyle={commonSty.size(18)}
              onPress={onLeftPress || handleLeftPress}
              hitSlop={20}
            />
          </View>
        ) : (
          <View style={styles.smallContainer} />
        )}
        <View style={styles.bigContainer}>
          <Typography title={title} font={FONTS.INTER_MEDIUM} txtStyle={[styles.txt, titleStyle || {}]} />
        </View>
        {rightIcon ? (
          <TouchableOpacity
            style={[styles.smallContainer, leftContainerStyle]}
            onPress={onRightPress}
            hitSlop={20}>
            <Image
              source={rightIcon}
              style={[styles.rightImg, iconStyle]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.smallContainer} />
        )}
      </View>
      {showBottomBorder && <View style={styles.headerBorder} />}
    </>
  );
};

export default memo(Header);
