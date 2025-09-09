import {View} from 'react-native';
import React, {useEffect} from 'react';
import Carousel, {Pagination} from 'react-native-reanimated-carousel';
import {moderateScale, scale} from 'react-native-size-matters';
import {colors, WIDTH} from '../../../theme';
import {emptyData, sliderColors} from '../../../constants';
import {useAnimatedReaction, useSharedValue} from 'react-native-reanimated';
import MiniCarousel from './MiniCarousel';
import styles from './styles';

const ProductCarousel = ({data}) => {
  const progress = useSharedValue<number>(0);
  const currentIndex = useSharedValue<number>(0);
  console.log('🚀 ~ ProductCarousel ~ currentIndex:', currentIndex);

  // Log currentIndex for debugging
  useEffect(() => {
    currentIndex.value = 0; // Initialize index
    console.log('Initial currentIndex:', currentIndex.value);
  }, []);

  // Sync currentIndex with progress
  useAnimatedReaction(
    () => {
      return Math.round(progress.value);
    },
    newIndex => {
      if (newIndex !== currentIndex.value) {
        currentIndex.value = newIndex;
      }
    },
    [progress],
  );

  // Ensure data is valid for debugging
  console.log('Carousel data length:', emptyData.length);

  return (
    <View id="carousel-component">
      <Carousel
        autoPlay={true}
        autoPlayInterval={2000}
        data={data}
        height={moderateScale(250)}
        pagingEnabled={true}
        snapEnabled={true}
        width={WIDTH / 1.1}
        style={styles.productCarouselMainContainer}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: scale(40),
        }}
        onProgressChange={progress}
        renderItem={ele => {
          return <MiniCarousel item={ele?.item} />;
        }}
      />
      {/* <Pagination
        item={{index: currentIndex.value}}
        // containerStyle={styles.productPaginationContainer}
        dotColor={colors.davyGrey}
      /> */}
      {/*  This is for future use */}
      <Pagination.Basic<{color: string}>
        progress={progress}
        data={data}
        dotStyle={styles.paginatedDotStyle}
        activeDotStyle={styles.paginatedActiveDotStyle}
        containerStyle={styles.paginatedContainerStyle}
        horizontal
      />
    </View>
  );
};

export default ProductCarousel;
