import React, {useState, useRef} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {moderateScale, scale} from 'react-native-size-matters';
import {WIDTH} from '../../theme';
import {COLORS} from '../../theme/colors';

const ProductCarousel = ({data}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  const renderPagination = () => {
    if (data.length <= 1) return null;

    return (
      <View style={styles.paginationContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dotStyle,
              index === activeIndex && styles.activeDotStyle,
            ]}
          />
        ))}
      </View>
    );
  };

  const handleProgressChange = (_, absoluteProgress) => {
    const currentIndex = Math.round(absoluteProgress % data.length);
    setActiveIndex(currentIndex);
  };

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        ref={carouselRef}
        loop={data.length > 1} 
        autoPlay={data.length > 1}
        autoPlayInterval={3000}
        data={data}
        height={moderateScale(200)}
        width={WIDTH / 1.1}
        style={styles.carousel}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: scale(40),
        }}
        pagingEnabled={data.length > 1}
        snapEnabled={data.length > 1}
        enabled={data.length > 1} 
        onProgressChange={handleProgressChange}
        renderItem={({item, index}) => (
          <View style={styles.imageWrapper} key={index}>
            <Image
              source={{uri: item}}
              style={styles.image}
              resizeMode="cover"
              onError={(e) => console.log('Image error:', e.nativeEvent)}
            />
          </View>
        )}
      />
      {renderPagination()}
    </View>
  );
};

export default ProductCarousel;


const styles = StyleSheet.create({
    carouselContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    carousel: {
      borderRadius: 12,
    },
    imageWrapper: {
      borderRadius: 10,
      overflow: 'hidden',
      backgroundColor: '#f0f0f0', 
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 10,
    },
    dotStyle: {
      height: 10,
      width: 10,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#4F4F4F',
      backgroundColor: 'transparent',
      marginHorizontal: 4,
    },
    activeDotStyle: {
      backgroundColor: '#4F4F4F',
      borderColor: '#4F4F4F',
    },
    paginationContainer: {
      flexDirection: 'row',
      marginTop: 10,
      alignSelf: 'center',
    },
  });