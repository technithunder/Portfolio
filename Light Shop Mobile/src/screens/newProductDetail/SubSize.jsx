import {TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import styles from './style';
import {COLORS} from '../../theme/colors';
import {Typography} from '../../components';
import {FONTS} from '../../constants/fonts';

const SubSize = props => {
  const {isSelected, item} = props;
  const containerStyle = {
    backgroundColor: isSelected ? COLORS.APP_PRIMARY : COLORS.APP_GRAY,
  };
  return (
    <TouchableOpacity style={[styles.sizeContainer, containerStyle]} {...props}>
      <Typography
        title={item}
        size={14}
        font={FONTS.INTER_REGULAR}
        color={isSelected ? COLORS.APP_WHITE : COLORS.APP_LIGHT_GRAY}
      />
    </TouchableOpacity>
  );
};

export default SubSize;
