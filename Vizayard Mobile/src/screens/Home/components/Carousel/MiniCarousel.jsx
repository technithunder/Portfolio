import {View, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import FastImage from 'react-native-fast-image';
import styles from './style';
import Pagination from './Pagination';
import {Typography} from '../../../../components';
import {COLORS} from '../../../../config/colors';
import {Images} from '../../../../config';
import {FONTS} from '../../../../config/font';
import { navigate } from '../../../../utils';

const MiniCarousel = props => {
  const {item, emptyData} = props;

  const isFirstSlide = item.index === 0;

  const handleAboutUsPress = () => {
    navigate('About'); 
  };

  if (isFirstSlide) {
    return (
      <View style={styles.carouselBgImageStyle}>
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.aboutUsCard}
            onPress={handleAboutUsPress}
            activeOpacity={0.8}>
            <Typography
              title="About Us"
              color={COLORS.APP_WHITE}
              size={18}
              font={FONTS.INTER_SEMIBOLD}
            />
          </TouchableOpacity>
        </View>
        <Pagination item={item} emptyData={emptyData} />
      </View>
    );
  }

  // For other slides, render with FastImage
  return (
    <FastImage
      resizeMode="cover"
      source={Images.home_banner}
      style={styles.carouselBgImageStyle}>
      <View style={{width: '100%', height: '100%'}}>
      </View>
      <Pagination item={item} emptyData={emptyData} />
    </FastImage>
  );
};

export default MiniCarousel;