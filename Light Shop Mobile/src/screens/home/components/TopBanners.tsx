import {Image, View} from 'react-native';
import React from 'react';
import {Typography} from '../../../components';
import {colors} from '../../../theme';
import {Fonts, Images} from '../../../constants';
import styles from './styles';

const TopBanners = () => {
  return (
    <View style={styles.topCollectionContainer}>
      <View style={styles.topCollectionLeftContainer}>
        <Typography
          title={'| Sale up to 40%'}
          color={colors.slateGrey}
          font={Fonts.Light}
          size={14}
          mr={15}
        />
        <Typography
          title={'FOR LIGHTS \n& BRIGHT'}
          color={colors.tuna}
          size={20}
          mt={10}
          font={Fonts.Light}
        />
      </View>
      <Image
        resizeMode="contain"
        source={Images.big_bulb}
        style={styles.topCollectionRightContainer}
      />
    </View>
  );
};

export default TopBanners;
