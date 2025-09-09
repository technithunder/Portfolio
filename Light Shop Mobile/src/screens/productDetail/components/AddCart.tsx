import {Image, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import {Typography} from '../../../components';
import {Images} from '../../../constants';
import {colors, commonSty} from '../../../theme';
import styles from './styles';
import {AddCartProps} from '../types';

const AddCart: FC<AddCartProps> = props => {
  return (
    <TouchableOpacity
      style={styles.addCartContainer}
      activeOpacity={0.8}
      {...props}>
      <Image
        resizeMode="contain"
        source={Images.addCart}
        style={commonSty.size(30)}
      />
      <Typography
        title={'Add to cart'}
        color={colors.white}
        ml={10}
        size={20}
      />
    </TouchableOpacity>
  );
};

export default AddCart;
