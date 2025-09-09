import React, {FunctionComponent, memo, useEffect} from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
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
import {COLORS} from '../../config/colors';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {hapticOption} from '../../utils';
import Octicons from "react-native-vector-icons/Octicons"

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

const PrimaryBtn: FunctionComponent<btnProps> = ({
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
  ...props
}) => {
  const finalHeight = height ? height : Math.floor(HEIGHT / 16);
  const finalWidth = width ? width : Math.floor(WIDTH / 1.125);
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
    backgroundColor: COLORS.APP_GRAY_100,
    borderColor: COLORS.APP_GRAY_100,
  };
  return (
    <AnimatedTouchable
      activeOpacity={0.6}
      style={[
        {
          backgroundColor: !!backgroundColor ? backgroundColor : COLORS.APP_PRIMARY_MAIN,
          borderColor: borderColor ?? COLORS.TRANSPARENT,
        },
        styles.btnStyle,
        btnStyle,
        rStyle,
        props.disabled && disabledStyle,
      ]}
      {...props}
      onPress={handlePress}>
      {loading ? (
        <ActivityIndicator size={'small'} color={COLORS.APP_WHITE} />
      ) : (
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:10}}>
          <Typography
            color={txtClr ? txtClr : COLORS.APP_WHITE}
            txtStyle={[styles.btnTextStyle, btnTextStyle]}
            title={title}
            size={18}
          />
          <Octicons name="arrow-right" size={20} color={COLORS.APP_WHITE} style={{marginTop:5}}/>
        </View>
      )}
    </AnimatedTouchable>
  );
};

export default memo(PrimaryBtn);
