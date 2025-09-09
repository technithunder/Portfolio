import {StyleSheet} from 'react-native';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import { commonSty } from '../../theme';

const styles = StyleSheet.create({
  tabContainer: {
    width: '100%',
    height: verticalScale(60),
    borderTopLeftRadius: moderateScale(30),
    borderTopRightRadius: moderateScale(30),
    ...commonSty.lightShadow,
    overflow: 'hidden',

    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderWidth: moderateScale(1.2),
  },
  tabIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: moderateScale(60),
    marginTop: verticalScale(20),
    height: verticalScale(60),
  },
});
export default styles;
