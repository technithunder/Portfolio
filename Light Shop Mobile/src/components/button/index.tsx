import React, {FunctionComponent, memo, useEffect} from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import styles from './styles';
import Typography from '../Typo';
import {HEIGHT, WIDTH} from '../../theme/commSty';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {hapticOption} from '../../utils';
import {colors} from '../../theme';
import {moderateScale} from 'react-native-size-matters';
import { FONTS } from '../../constants/fonts';

interface btnProps extends TouchableOpacityProps {
  btnStyle?: StyleProp<any>;
  title?: string;
  btnTextStyle?: StyleProp<TextStyle>;
  onPress?: (event: GestureResponderEvent) => void;
  txtSize?: number;
  txtClr?: string;
  backgroundColor?: string;
  loading?: boolean;
  height?: number;
  width?: number;
  PressBounceEffect?: boolean;
  borderRadius?: number;
  borderColor?: string;
}

const Button: FunctionComponent<btnProps> = ({
  btnStyle,
  title,
  btnTextStyle,
  onPress,
  txtClr,
  backgroundColor,
  loading,
  height,
  width,
  PressBounceEffect = true,
  borderRadius,
  borderColor,
  txtSize,
  ...props
}) => {
  const finalHeight = height ? moderateScale(height) : Math.floor(HEIGHT / 17);
  const finalWidth = width ? moderateScale(width) : Math.floor(WIDTH / 1.15);
  const finalSize = borderRadius
    ? borderRadius
    : Math.min(finalHeight, finalWidth) / 5;

  const finalRadius = borderRadius ? borderRadius : finalSize;
  const animDuration = {
    duration: 350,
  };

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
  const animHeight = useSharedValue(finalHeight);
  const animWidth = useSharedValue(finalWidth);
  const animRadius = useSharedValue(finalRadius);
  const animScale = useSharedValue(1);

  const rStyle = useAnimatedStyle(() => {
    return {
      height: animHeight.value,
      width: animWidth.value,
      borderRadius: animRadius.value,
      transform: [{scale: animScale.value}],
    };
  }, []);

  useEffect(() => {
    if (loading) {
      animHeight.value = withTiming(finalHeight, animDuration);
      animWidth.value = withTiming(finalWidth / 6, animDuration);
      animRadius.value = withTiming(finalHeight / 2, animDuration);
    } else {
      animHeight.value = withTiming(finalHeight, animDuration);
      animWidth.value = withTiming(finalWidth, animDuration);
      animRadius.value = withTiming(finalRadius, animDuration);
    }
  }, [loading]);

  const handlePress = (e: GestureResponderEvent) => {
    if (PressBounceEffect) {
      animScale.value = withSequence(withTiming(0.95), withTiming(1));
    }
    ReactNativeHapticFeedback.trigger('impactMedium', hapticOption);
    if (!!onPress) {
      onPress(e);
    }
  };
  const disabledStyle = {
    backgroundColor: colors.black,
    borderColor: colors.black,
  };
  return (
    <AnimatedTouchable
      activeOpacity={0.6}
      style={[
        {
          backgroundColor: !!backgroundColor ? backgroundColor : colors.primary,
          borderColor: borderColor ?? colors.transparent,
        },
        styles.btnStyle,
        btnStyle,
        rStyle,
        props.disabled && disabledStyle,
      ]}
      {...props}
      onPress={handlePress}>
      {loading ? (
        <ActivityIndicator size={'small'} color={colors.white} />
      ) : (
        <Typography
          color={txtClr ? txtClr : colors.white}
          txtStyle={[styles.btnTextStyle, btnTextStyle]}
          title={title}
          size={txtSize ? txtSize : 18}
          font={FONTS.INTER_REGULAR}
        />
      )}
    </AnimatedTouchable>
  );
};

export default memo(Button);
