import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Carousel, {Pagination} from 'react-native-reanimated-carousel';
import {Images} from '../../constants';
import {useSharedValue} from 'react-native-reanimated';
import {moderateScale, scale} from 'react-native-size-matters';
import {WIDTH} from '../../theme';
import FastImage from 'react-native-fast-image';
import {Typography} from '../../components';
import {COLORS} from '../../theme/colors';
import {FONTS} from '../../constants/fonts';

const HomeCarousel = () => {
  const progress = useSharedValue(0);

  const carouselData = [
    {
      id: 1,
      bgImage: Images.slider_bg1,
      title: 'Warm LED strips highlight a cozy living room with dark walls.',
      subtitle: 'Soft Radiance',
      buttonText: 'Shop Now',
    },
    {
      id: 2,
      bgImage: Images.slider_bg2,
      title: 'A single pendant light glows over a matte black kitchen island.',
      subtitle: 'Sleek Illumination',
      buttonText: 'Shop Now',
    },
    {
      id: 3,
      bgImage: Images.slider_bg3,
      title: 'Hanging Edison bulbs light up a rustic loft with exposed brick.',
      subtitle: 'Raw Lighting',
      buttonText: 'Shop Now',
    },
    {
      id: 4,
      bgImage: Images.slider_bg4,
      title: 'A sparkling crystal chandelier glows above a dim dining space.',
      subtitle: 'Elegant Spark',
      buttonText: 'Shop Now',
    },
    {
      id: 5,
      bgImage: Images.slider_bg5,
      title: 'Garden path lights cast soft light on a dark evening terrace.',
      subtitle: 'Night Glow',
      buttonText: 'Shop Now',
    },
  ];

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        autoPlay={true}
        autoPlayInterval={3000}
        data={carouselData}
        height={moderateScale(180)}
        pagingEnabled={true}
        snapEnabled={true}
        width={WIDTH}
        style={styles.mainSliderWidth}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: scale(20),
        }}
        onProgressChange={progress}
        renderItem={({item}) => {
          return (
            <FastImage
              resizeMode="cover"
              source={item.bgImage}
              style={styles.carouselBgImageStyle}>
              {/* Dark overlay */}
              <View style={styles.overlay} />

              {/* Content */}
              <View style={styles.contentContainer}>
                <View style={{width: '100%',zIndex:999}}>
                  <Typography
                    title={item?.subtitle}
                    font={FONTS.INTER_MEDIUM}
                    color={COLORS.APP_WHITE}
                    size={12}
                  />
                  <View style={{marginTop: 8}}>

                  <Typography
                    title={item?.title}
                    font={FONTS.INTER_MEDIUM}
                    color={COLORS.APP_WHITE}
                    size={16}
                  />
                  </View>
                </View>
                {/* <TouchableOpacity style={styles.shopButton}>
                  <Text style={styles.buttonText}>{item.buttonText}</Text>
                </TouchableOpacity> */}
              </View>
            </FastImage>
          );
        }}
      />

      <Pagination.Basic
        progress={progress}
        data={carouselData}
        dotStyle={styles.paginationDot}
        activeDotStyle={styles.activePaginationDot}
        containerStyle={styles.paginationContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainSliderWidth: {
    width: WIDTH,
    alignSelf: 'center',
  },
  carouselBgImageStyle: {
    height: moderateScale(180),
    width: WIDTH,
    borderRadius: 20,
    overflow: 'hidden', // important to keep the overlay inside bounds
    justifyContent: 'space-between',
    flexDirection: 'row',
    position: 'relative',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // adjust darkness here
    borderRadius: 20,
    zIndex: 1,
  },

  contentContainer: {
    width: '70%',
    paddingLeft: 16,
    justifyContent: 'center',
  },
  shopButton: {
    marginTop: 30,
    borderRadius: 20,
    paddingHorizontal: 20,
    backgroundColor: COLORS.APP_PRIMARY,
    width: '40%',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999, // Ensure button is above the overlay
  },
  buttonText: {
    color: COLORS.APP_WHITE || '#FFFFFF',
    fontSize: 12,
    fontFamily: FONTS.INTER_REGULAR,
  },
  paginationContainer: {
    marginTop: moderateScale(5),
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
    backgroundColor: COLORS.APP_LIGHT_GRAY || '#CCCCCC',
  },
  activePaginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.APP_PRIMARY || '#007AFF',
  },
});

export default HomeCarousel;
