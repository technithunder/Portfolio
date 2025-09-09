import {Dimensions, View} from 'react-native';
import React from 'react';
import Carousel, {Pagination} from 'react-native-reanimated-carousel';
import {moderateScale, scale} from 'react-native-size-matters';
import {useSharedValue} from 'react-native-reanimated';
import MiniCarousel from './MiniCarousel';
import styles from '../Carousel/style';

export const WIDTH = Dimensions.get('window').width;

export const emptyData = Array.from({length: 6});

const HomeCarousel = () => {
  const progress = useSharedValue(0);

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
          return <MiniCarousel item={item} emptyData={emptyData}/>;
        }}
      />
     
    </View>
  );
};

export default HomeCarousel;
