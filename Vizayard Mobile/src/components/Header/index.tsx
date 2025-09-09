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
import {COLORS} from '../../config/colors';
import styles from './styles';
import Typography from '../Typo';
import {goBack} from '../../utils';
import Icon from '../VectorIcon';

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
  } = props;
  const handleLeftPress = () => goBack();
  const insets = useSafeAreaInsets();

  return (
    <>
      <View
        style={[
          styles.mainContainer,
          containerStyle,
          {
            paddingTop: insets.top + moderateScale(10),
            backgroundColor: backgroundColor || COLORS.APP_WHITE,
          },
        ]}>
        {showBack ? (
          <TouchableOpacity
            style={[styles.smallContainer, leftContainerStyle]}
            onPress={onLeftPress || handleLeftPress}
            hitSlop={20}>
            <View style={styles.leftIconSubContainer}>
              <Icon
                name="chevron-back-outline"
                icon="Ionicons"
                color={COLORS.APP_PRIMARY_MAIN}
                onPress={onLeftPress || handleLeftPress}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.smallContainer} />
        )}
        <View style={styles.bigContainer}>
          <Typography title={title} txtStyle={[styles.txt, titleStyle || {}]} />
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
