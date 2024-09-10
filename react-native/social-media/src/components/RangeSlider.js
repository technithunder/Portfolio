import React from 'react';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {Platform, View, Text} from 'react-native';
import {FONTS, WIDTH} from '../helper/constants';

const MIN_VALUE = 18;

const RangeSlider = ({minAge, maxAge, changeRangeValue}) => {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <View
        style={{
          justifyContent: 'center',
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.sliderLabel}>
            Min:{' '}
            <Text
              style={{fontSize: 16, fontFamily: FONTS._BOLD, color: '#000'}}>
              {minAge} year
            </Text>
          </Text>
          <Text style={styles.sliderLabel}>
            Max:{' '}
            <Text
              style={{fontSize: 16, fontFamily: FONTS._BOLD, color: '#000'}}>
              {maxAge} year
            </Text>
          </Text>
        </View>
        <MultiSlider
          markerStyle={{
            ...Platform.select({
              ios: {
                height: 30,
                width: 30,
                shadowColor: '#000000',
                marginTop: 5,
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowRadius: 1,
                shadowOpacity: 0.1,
              },
              android: {
                height: 30,
                width: 30,
                marginTop: 5,
                borderRadius: 50,
                backgroundColor: '#68E74A',
              },
            }),
          }}
          pressedMarkerStyle={{
            ...Platform.select({
              android: {
                height: 30,
                width: 30,
                marginTop: 5,
                borderRadius: 20,
                backgroundColor: '#68E74A',
              },
            }),
          }}
          selectedStyle={{
            backgroundColor: '#68E74A',
          }}
          trackStyle={{
            backgroundColor: '#CECECE',
            height: 8,
          }}
          touchDimensions={{
            height: 40,
            width: 40,
            borderRadius: 20,
            slipDisplacement: 40,
          }}
          values={[minAge, maxAge]}
          sliderLength={WIDTH * 0.8}
          onValuesChange={changeRangeValue}
          min={MIN_VALUE}
          max={85}
          allowOverlap={false}
          minMarkerOverlapDistance={10}
        />
      </View>
    </View>
  );
};

const styles = {
  sliderLabel: {
    fontSize: 16,
    fontFamily: FONTS.BOOK,
    color: 'darkgray',
  },
};

export default RangeSlider;
