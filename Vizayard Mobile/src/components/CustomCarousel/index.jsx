import React, { useRef, useState } from 'react';
import { View, Image, FlatList, Dimensions, Animated, StyleSheet,Pn } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const CustomCarousel = ({ data }) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <View>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        snapToAlignment="center"
        decelerationRate="fast"
        snapToInterval={screenWidth * 0.8} 
        contentContainerStyle={{ paddingHorizontal: (screenWidth * 0.2) / 2 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={item.image} style={styles.carouselImage} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: screenWidth * 0.8, 
    marginHorizontal: 10,
    alignItems: 'center',
  },
  carouselImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
});

export default CustomCarousel;
