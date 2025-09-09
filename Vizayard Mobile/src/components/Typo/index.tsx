import React from 'react';
import {StyleProp, Text, TextProps, TextStyle} from 'react-native';

import {moderateScale} from 'react-native-size-matters';
import {COLORS} from '../../config/colors';
import {FONTS} from '../../config/font';

interface Txt extends TextProps {
  txtStyle?: StyleProp<TextStyle>;
  title?: string | number | any;
  size?: number;
  color?: string;
  font?: string;
  mt?: number;
  ml?: number;
  mr?: number;
  mb?: number;
  mv?: number;
  mh?: number;
  align?: 'auto' | 'center' | 'left' | 'right' | 'justify';
  children?: React.ReactNode;
}

const Typography: React.FC<Txt> = props => {
  const {
    txtStyle,
    title,
    color,
    size,
    font,
    mt,
    ml,
    mr,
    mb,
    mv,
    mh,
    align,
    children,
  } = props;

  return (
    <Text
      style={[
        {
          fontSize: size ? moderateScale(size) : moderateScale(18),
          color: color ? color : COLORS.APP_BLACK,
          marginTop: mv ? moderateScale(mv) : mt ? moderateScale(mt) : 0,
          marginLeft: mh ? moderateScale(mh) : ml ? moderateScale(ml) : 0,
          marginRight: mh ? moderateScale(mh) : mr ? moderateScale(mr) : 0,
          marginBottom: mv ? moderateScale(mv) : mb ? moderateScale(mb) : 0,
          fontFamily: font ? font : FONTS.INTER_MEDIUM,
          textAlign: align ? align : 'auto',
        },
        txtStyle,
      ]}
      {...props}>
      {title}
      {children}
    </Text>
  );
};

export default Typography;
