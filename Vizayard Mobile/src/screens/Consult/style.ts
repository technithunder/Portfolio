import {StyleSheet} from 'react-native';
import {COLORS} from '../../config/colors';
import {commonSty} from '../../theme';
import { moderateScale } from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
  },
  divider:{
    backgroundColor:"#E6E6E6",
    height:1,
    marginTop: 10,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    textAlign: 'center',
  },
  listContainer: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  miniConsultContainer: {
      borderColor: COLORS.APP_COMMON_PLACEHOLDER,
      borderRadius: moderateScale(8),
      borderWidth: moderateScale(0.9),
      height: moderateScale(60),
      ...commonSty.mt20,
      ...commonSty.justifyCenter,
      ...commonSty.rowCenter,
    },
    miniConsultSubContainer: {
      height: moderateScale(38),
      width: moderateScale(1.5),
      backgroundColor: COLORS.APP_RED,
      ...commonSty.mr10,
      borderRadius: moderateScale(5),
    },
    wid90: {
      width: '70%',
    },
});

export default styles;
