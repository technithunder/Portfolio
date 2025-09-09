import {StatusBar, View} from 'react-native';
import React, {useEffect} from 'react';
import {Container} from '../../components';
import {colors, commonSty} from '../../theme';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Images} from '../../constants';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import styles from './styles';

const Splash = () => {
  const inset = useSafeAreaInsets().top;
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
      opacity: opacity.value,
    };
  });
  useEffect(() => {
    scale.value = withTiming(1, {duration: 2000});
    opacity.value = withTiming(1, {duration: 2000});
  }, [scale, opacity]);

  const dynamicStyle = {
    marginBottom: inset,
  };
  return (
    <Container showHeader={false} center>
      <StatusBar translucent backgroundColor={colors.transparent} />
      <View style={dynamicStyle}>
        <Animated.Image
          resizeMode={'contain'}
          source={Images.logo}
          style={[commonSty.size(130), animatedStyle]}
        />
        <Animated.Text style={[animatedStyle, styles.titleStyle]}>
          Virtual Lights
        </Animated.Text>
      </View>
    </Container>
  );
};

export default Splash;
