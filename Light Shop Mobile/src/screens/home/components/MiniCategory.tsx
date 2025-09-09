import {Image, TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import {colors, commonSty, WIDTH} from '../../../theme';
import {Typography} from '../../../components';
import {moderateScale, scale} from 'react-native-size-matters';
import styles from './styles';
import {MiniCategoryProps} from '../types';

const MiniCategory: FC<MiniCategoryProps> = props => {
  const {item, index, isSelected, onPress} = props;

  const dynamicContainer = {
    width: WIDTH / 4.2,
  };

  const dynamicMainContainerStyle = {
    borderWidth: isSelected ? moderateScale(1) : 0,
    borderColor: isSelected ? colors.primary : colors.transparent,
    borderRadius: moderateScale(25),
    padding: moderateScale(2),
  };
  const dynamicImageContainerStyle = {
    backgroundColor: isSelected ? colors.englishWalnut : colors.whiteSmoke,
  };
  const dynamicImageStyle = {
    tintColor: isSelected ? colors.white : colors.dustyGrey,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.categoryContainer, dynamicContainer]}>
      <View style={dynamicMainContainerStyle}>
        <TouchableOpacity
          style={[styles.categoryImageContainer, dynamicImageContainerStyle]}
          onPress={onPress}>
          <Image
            source={item.image}
            style={[commonSty.size(20), dynamicImageStyle]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <Typography
        title={item.title}
        color={isSelected ? colors.primary : colors.black}
        size={10}
        mt={5}
      />
    </TouchableOpacity>
  );
};

export default MiniCategory;
