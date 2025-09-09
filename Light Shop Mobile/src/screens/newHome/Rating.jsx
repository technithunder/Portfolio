import React from 'react';
import {View, Text} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {FONTS} from '../../constants/fonts';
import {COLORS} from '../../theme/colors';
import { Typography } from '../../components';

const Rating = ({rating = 0}) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    // Render full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <MaterialIcons
          key={`full-${i}`}
          name="star"
          size={18}
          color="#508A7B"
          style={{marginRight: 2}}
        />
      );
    }

    // Render half star if needed
    if (hasHalfStar) {
      stars.push(
        <MaterialIcons
          key="half"
          name="star-half"
          size={18}
          color="#508A7B"
          style={{marginRight: 2}}
        />
      );
    }

    // Render empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <MaterialIcons
          key={`empty-${i}`}
          name="star-border"
          size={18}
          color="#508A7B"
          style={{marginRight: 2}}
        />
      );
    }

    return stars;
  };

  return (
    <View style={{flexDirection: 'row', marginTop: 4, alignItems: 'center'}}>
      {renderStars()}
      <Typography
        title={`(${rating?.toFixed(1)})`}
        font={FONTS.INTER_REGULAR}
        size={12}
        color={COLORS.APP_GRAY}
      />
    </View>
  );
};

export default Rating;