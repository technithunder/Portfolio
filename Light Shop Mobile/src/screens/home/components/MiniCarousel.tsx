import {View} from 'react-native';
import React, {FC} from 'react';
import FastImage from 'react-native-fast-image';
import {Images} from '../../../constants';
import {Button, Typography} from '../../../components';
import {colors, commonSty} from '../../../theme';
import styles from './styles';
import Pagination from './Pagination';
import {PaginationProps} from '../types';

const MiniCarousel: FC<PaginationProps> = props => {
  const {item} = props;

  return (
    <FastImage
      resizeMode="cover"
      source={Images.slider_bg}
      style={styles.carouselBgImageStyle}>
      <View style={styles.carouselSubContainerStyle}>
        <Typography
          title={'Lorem ipsum dolor sit\namet consectetur.\nAliquam cursus.'}
          color={colors.white}
          size={12}
        />
        <Button
          title="Shop Now"
          width={90}
          height={30}
          txtSize={12}
          borderRadius={20}
          btnStyle={commonSty.mt25}
          
        />
      </View>
      <FastImage
        resizeMode="cover"
        source={Images.lights_slider}
        style={styles.carouselSideImageStyle}
      />
      <Pagination item={item} />
    </FastImage>
  );
};

export default MiniCarousel;
