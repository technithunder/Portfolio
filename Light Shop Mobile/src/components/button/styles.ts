import {moderateScale} from 'react-native-size-matters';
import {StyleSheet} from 'react-native';
import {Fonts} from '../../constants';

const styles = StyleSheet.create({
  btnStyle: {
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: moderateScale(1),
  },
  btnTextStyle: {
    fontFamily: Fonts.Medium,
    textAlign: 'center',
  },
});

export default styles;
