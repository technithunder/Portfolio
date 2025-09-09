import React, {useState} from 'react';
import {TextInput, View} from 'react-native';
import {Icon, Typography} from '../../../components';
import styles from './styles';
import {COLORS} from '../../../theme/colors';
import {FONTS} from '../../../constants/fonts';

const AddRemoveBtn = ({
  onAddPress,
  onRemovePress,
  count,
  onQuantityChange,
  disabled,
}) => {
  const handleAddPress = () => {
    console.log('plus');
    if (onAddPress) {
      onAddPress();
    }
  };

  const handleRemovePress = () => {
    console.log('minus');
    if (onRemovePress) {
      onRemovePress();
    }
  };

  const handleInputChange = text => {
    if (/^\d*$/.test(text)) {
      const number = parseInt(text, 10);
      onQuantityChange(isNaN(number) ? 0 : number);
    }
  };

  return (
    <View style={styles.addRemoveContainer}>
      <Icon
        icon="AntDesign"
        name="minus"
        size={14}
        color={COLORS.APP_BLACK}
        onPress={handleRemovePress}
      />
      <TextInput
        value={count?.toString()}
        onChangeText={handleInputChange}
        style={styles.quantityInput}
        maxLength={5}
        keyboardType="numeric"
      />
      {/* <Typography font={FONTS.INTER_REGULAR} title={count?.toString() || '1'} size={13} /> */}
      <Icon
        icon="AntDesign"
        name="plus"
        size={14}
        color={COLORS.APP_BLACK}
        onPress={handleAddPress}
      />
    </View>
  );
};

export default AddRemoveBtn;
