import {TouchableOpacity} from 'react-native';
import React, {FC, memo} from 'react';
import styles from './styles';
import {MiniSlotProps} from '../types';
import {COLORS} from '../../../config/colors';
import {Typography} from '../../../components';

const MiniSlot: FC<MiniSlotProps> = props => {
  const {item, selectedTime, onPress} = props;
  
  // Check if the item matches the selectedTime exactly
  const isSelected = selectedTime === item;
  
  const dynamicSelectedStyle = {
    borderColor: isSelected ? COLORS.APP_PRIMARY_MAIN : COLORS.AQUA_HAZE,
    backgroundColor: isSelected ? COLORS.APP_PRIMARY_LIGHT : 'transparent',
  };
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };
  
  return (
    <TouchableOpacity
      style={[styles.miniSlotContainer, dynamicSelectedStyle]}
      activeOpacity={0.4}
      onPress={handlePress}>
      <Typography
        title={item}
        size={12}
        color={isSelected ? COLORS.APP_PRIMARY_MAIN : COLORS.APP_BLACK}
      />
    </TouchableOpacity>
  );
};

export default memo(MiniSlot);