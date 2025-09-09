import {TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import {commonSty} from '../../../theme';
import FastImage from 'react-native-fast-image';
import {Fonts, Images} from '../../../constants';
import {MiniRecommendedProps} from '../types';
import {Typography} from '../../../components';
import styles from './styles';
import {COLORS} from '../../../theme/colors';

const MiniRecommended: FC<MiniRecommendedProps> = props => {
  const {item} = props;
  return (
    <TouchableOpacity style={styles.recommendedContainer} {...props}>
      <FastImage
        source={{uri: item.image[0]}}
        resizeMode="contain"
        style={styles.recommendedImage}
      />
      <View style={commonSty.ml10}>
        <Typography
          title={item?.productName}
          size={13}
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{width: 80, color: COLORS.APP_BLACK}}
        />
        <Typography
          title={`₹ ${item?.productPrice.toFixed(2)}`}
          size={16}
          font={Fonts.Main}
          numberOfLines={1}
          mt={4}
        />
      </View>
    </TouchableOpacity>
  );
};

export default MiniRecommended;
