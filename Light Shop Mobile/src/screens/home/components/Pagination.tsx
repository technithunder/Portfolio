import {View} from 'react-native';
import React, {FC} from 'react';
import styles from './styles';
import {emptyData} from '../../../constants';
import {moderateScale} from 'react-native-size-matters';
import {PaginationProps} from '../types';
import {colors} from '../../../theme';

const Pagination: FC<PaginationProps> = props => {
  const {item, containerStyle, dotColor} = props;
  return (
    <View style={[styles.paginationContainer, containerStyle]}>
      {emptyData.map((itm, ind) => {
        const dynamicPaginationStyle = {
          borderWidth: item?.index == ind ? moderateScale(0.5) : 0,
          borderColor: dotColor ?? colors.white,
        };
        const dynamicDotStyle = {
          backgroundColor: dotColor ?? colors.white,
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
