import {Image, StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import styles from './styles';
import {commonSty} from '../../../theme';
import {loginCarouselDataType} from '../types';

import {scale, verticalScale} from 'react-native-size-matters';

interface MiniCarouselProps {
  item: loginCarouselDataType;
  index: number;
}
const MiniCarousel: FC<MiniCarouselProps> = props => {
  const {item, index} = props;

  return (
    <View style={[styles.carouselContainer]}>
      <Image
        source={item?.image}
        resizeMode="contain"
        style={styles.carouselImage}
      />
    </View>
  );
};

export default MiniCarousel;
