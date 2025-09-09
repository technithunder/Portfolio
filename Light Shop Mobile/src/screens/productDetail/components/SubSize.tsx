import {TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import {Typography} from '../../../components';
import {colors} from '../../../theme';
import styles from './styles';
import {SubSizeProps} from '../types';

const SubSize: FC<SubSizeProps> = props => {
  const {isSelected, item} = props;
  const containerStyle = {
    backgroundColor: isSelected ? colors.vampireGrey : colors.ghostWhite,
  };
  return (
    <TouchableOpacity style={[styles.sizeContainer, containerStyle]} {...props}>
      <Typography
        title={item}
        size={14}
        color={isSelected ? colors.white : colors.silver}
      />
    </TouchableOpacity>
  );
};

export default SubSize;
