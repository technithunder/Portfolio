import {Text, TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import {moderateScale} from 'react-native-size-matters';
import styles from './style';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../constants/fonts';

const SubColor= props => {
  const {isSelected, item} = props;
  console.log("==>welcome",item)
  const dynamicStyle = {
    backgroundColor: item.color,
    borderColor: isSelected ? COLORS.APP_PRIMARY : "lightgray",
    borderWidth: isSelected ? moderateScale(2.5) : 1,
  };
  return (
    <View style={{marginRight:10,}}>
      <TouchableOpacity
        style={[styles.colorContainer, dynamicStyle]}
        {...props}
      />
      <Text style={{fontSize:12,fontFamily:FONTS.INTER_REGULAR,color:COLORS.APP_GRAY,marginTop:4}}>{item?.name}</Text>
    </View>
  );
};

export default SubColor;
