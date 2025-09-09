import {View} from 'react-native';
import React from 'react';
import Carousel, {Pagination} from 'react-native-reanimated-carousel';
import {moderateScale, scale} from 'react-native-size-matters';
import {WIDTH} from '../../../theme';
import {emptyData, sliderColors} from '../../../constants';
import {useSharedValue} from 'react-native-reanimated';
import MiniCarousel from './MiniCarousel';
import styles from './styles';

const HomeCarousel = () => {
  const progress = useSharedValue<number>(0);

  return (
    <View id="carousel-component">
      <Carousel
        autoPlay={true}
        autoPlayInterval={2000}
        data={emptyData}
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
        renderItem={item => {
          return <MiniCarousel item={item} />;
        }}
      />
      {/* This is for future use */}
      {/* <Pagination.Basic<{color: string}>
        progress={progress}
        data={sliderColors.map(color => ({color}))}
        dotStyle={styles.paginatedDotStyle}
        activeDotStyle={styles.paginatedActiveDotStyle}
        containerStyle={styles.paginatedContainerStyle}
        horizontal
      /> */}
    </View>
  );
};

export default HomeCarousel;
