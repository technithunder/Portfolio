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
  const [inputValue, setInputValue] = useState(count?.toString() || '1');

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
    // Allow only digits
    if (/^\d*$/.test(text)) {
      setInputValue(text);
    }
  };

  const handleInputBlur = () => {
    const number = parseInt(inputValue, 10);
    if (inputValue === '' || isNaN(number)) {
      // Reset to current count if empty or invalid input
      setInputValue(count?.toString() || '1');
    } else if (number <= 0) {
      // If 0 or negative, reset input first then trigger removal
      setInputValue(count?.toString() || '1');
      // Use setTimeout to ensure input is reset before triggering removal
      setTimeout(() => {
        onQuantityChange(0); // This will trigger product removal
      }, 0);
    } else {
      // Update quantity if valid and greater than 0
      if (number !== count) {
        onQuantityChange(number);
      }
    }
  };

  const handleInputFocus = () => {
    // Update input value when focused to ensure it matches current count
    setInputValue(count?.toString() || '1');
  };

  // Update input value when count prop changes (from + or - buttons)
  React.useEffect(() => {
    setInputValue(count?.toString() || '1');
  }, [count]);

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
        value={inputValue}
        onChangeText={handleInputChange}
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
        style={styles.quantityInput}
        maxLength={5}
        keyboardType="numeric"
        selectTextOnFocus={true}
      />
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