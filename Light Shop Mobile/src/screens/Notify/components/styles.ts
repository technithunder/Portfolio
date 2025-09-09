import {StyleSheet} from 'react-native';
import {colors, commonSty} from '../../../theme';
import {moderateScale} from 'react-native-size-matters';

const styles = StyleSheet.create({
  miniNotifyContainer: {
    backgroundColor: colors.white,
    width: '90%',
    padding: moderateScale(20),
    alignSelf: 'center',
    borderRadius: moderateScale(10),
    ...commonSty.mt20,
  },
});

export default styles;
