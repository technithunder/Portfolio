import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {colors, commonSty} from '../../theme';

const styles = StyleSheet.create({
  mainContainer: {
    ...commonSty.pv20,
  },
  header: {
    height: moderateScale(4),
    width: moderateScale(70),
    backgroundColor: colors.white,
    borderRadius: moderateScale(20),
    alignSelf: 'center',
    position: 'absolute',
    top: moderateScale(-15),
  },
});

export default styles;
