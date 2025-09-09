import {TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import {SubSizeProps} from '../types';
import {colors} from '../../../theme';
import {moderateScale} from 'react-native-size-matters';
import styles from './styles';

const SubColor: FC<SubSizeProps> = props => {
  const {isSelected, item} = props;
  const dynamicStyle = {
    backgroundColor: item.color,
    borderColor: isSelected ? colors.white : colors.transparent,
    borderWidth: isSelected ? moderateScale(4) : 0,
  };
  return (
    <TouchableOpacity
      style={[styles.colorContainer, dynamicStyle]}
      {...props}
    />
  );
};

export default SubColor;
