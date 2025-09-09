import {Image, View} from 'react-native';
import React from 'react';
import {Typography} from '../../../components';
import {colors} from '../../../theme';
import {Fonts, Images} from '../../../constants';
import styles from './styles';

const Banner = () => {
  return (
    <View style={styles.bannerContainer}>
      <View style={styles.bannerSubContainer}>
        <Typography
          title={'| NEW COLLECTION'}
          color={colors.slateGrey}
          font={Fonts.Light}
          size={14}
        />
        <Typography
          title={'BUY AND \n& SELL'}
          color={colors.tuna}
          size={20}
          mt={10}
          mr={38}
          font={Fonts.Light}
        />
      </View>
      <Image
        resizeMode="contain"
        source={Images.lights_slider}
        style={styles.bannerSideImage}
      />
    </View>
  );
};

export default Banner;
