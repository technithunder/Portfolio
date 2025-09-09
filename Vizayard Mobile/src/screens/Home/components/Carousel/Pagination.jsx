import {View} from 'react-native';
import React, {FC} from 'react';
import styles from '../Carousel/style';
import {moderateScale} from 'react-native-size-matters';
import { COLORS } from '../../../../config/colors';

const Pagination= props => {
  const {item, containerStyle, dotColor,emptyData} = props;
  return (
    <View style={[styles.paginationContainer, containerStyle]}>
      {emptyData.map((itm, ind) => {
        const dynamicPaginationStyle = {
          borderWidth: item?.index == ind ? moderateScale(0.5) : 0,
          borderColor: dotColor ?? COLORS.APP_WHITE,
        };
        const dynamicDotStyle = {
          backgroundColor: dotColor ?? COLORS.APP_WHITE,
        };
        return (
          <View
            key={ind}
            style={[dynamicPaginationStyle, styles.paginationItemContainer]}>
            <View style={[styles.paginationItem, dynamicDotStyle]} />
          </View>
        );
      })}
    </View>
  );
};

export default Pagination;
