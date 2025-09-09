import {TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import {colors} from '../../../theme';
import {Icon, TouchableImage, Typography} from '../../../components';
import {Fonts, Images} from '../../../constants';
import {MiniProductsProps} from '../types';
import styles from './styles';
import {FONTS} from '../../../constants/fonts';

const MiniProducts: FC<MiniProductsProps> = props => {
  const {
    item,
    containerStyle,
    imageStyle,
    showLikeIcon = false,
    onLikePress,
    activeOpacity,
  } = props;
  console.log('item', item);
  return (
    <TouchableOpacity
      style={[styles.mainProductContainer, containerStyle]}
      activeOpacity={activeOpacity ?? 0.6}
      {...props}>
      {showLikeIcon && (
        <Icon
          icon="AntDesign"
          name={item.isLiked ? 'heart' : 'hearto'}
          color={item.isLiked ? colors.sunriseOrange : colors.cadetBlue}
          containerStyle={styles.likeIconContainerStyle}
          size={16}
          onPress={onLikePress}
        />
      )}
      {item?.image && (
        <TouchableImage
          source={{uri: item?.image[0]}}
          imageStyle={[styles.featureProductImageStyle, imageStyle]}
          onPress={props.onPress}
          resizeMode="cover"
        />
      )}
      {item?.productName && (
        <Typography
          title={item?.productName}
          size={13}
          mt={10}
          color={colors.dark}
        />
      )}
      {item?.productPrice && (
        <Typography
          title={`₹ ${item?.productPrice?.toFixed(2)}`}
          size={14}
          mt={5}
          color={colors.dark}
          font={FONTS.INTER_REGULAR}
        />
      )}
    </TouchableOpacity>
  );
};

export default MiniProducts;
