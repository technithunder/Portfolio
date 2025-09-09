import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {Container} from '../../components';
import {commonSty} from '../../theme';
import Animated, {Easing, withDelay} from 'react-native-reanimated';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {COLORS} from '../../config/colors';
import {Images} from '../../config';
import { FONTS } from '../../config/font';

const DURATION = 1000;
const DELAY = 500;

const Splash = () => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      DELAY,
      withTiming(1, {
        duration: DURATION,
        easing: Easing.linear,
      }),
    );
    scale.value = withDelay(
      DELAY,
      withTiming(1, {
        duration: DURATION,
        easing: Easing.linear,
      }),
    );
  }, []);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });
  const animatedScaleStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  });

  return (
    <Container
      showHeader={false}
      containerStyle={[commonSty.center, {backgroundColor: COLORS.APP_WHITE}]}>
      <View style={styles.subContainer}>
        <Animated.Image
          source={Images.new_app_logo}
          style={[commonSty.size(200), animatedScaleStyle,{resizeMode:'contain'}]}
        />
        {/* <Animated.Text style={[styles.letter, animatedStyle]}>
          VIZAYARD
        </Animated.Text>
        <Animated.Text style={[styles.subTitleStyle, animatedStyle]}>
          Where approval meets adventure
        </Animated.Text> */}
      </View>
    </Container>
  );
};

export default Splash;

const styles = StyleSheet.create({
  subContainer: {
    ...commonSty.flex,
    ...commonSty.center,
    backgroundColor: COLORS.APP_WHITE,
    marginBottom: verticalScale(55),
  },
  subTitleStyle: {
    fontSize: moderateScale(10),
    color: COLORS.APP_WHITE,
  },
  letter: {
    fontSize: moderateScale(38),
    fontFamily:FONTS.INTER_SEMIBOLD,
    color: COLORS.APP_WHITE,
    marginHorizontal: 2,
  },
});
