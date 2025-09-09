import { StyleSheet, Platform } from 'react-native';
import {colors, commonSty} from '../theme';
import {moderateScale, verticalScale} from 'react-native-size-matters';

const styles = StyleSheet.create({
  tabContainer: {
  height: Platform.OS === 'ios' ? verticalScale(70) : verticalScale(70),
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  paddingBottom: Platform.OS === 'ios' ? moderateScale(40) : moderateScale(35),
  paddingTop: moderateScale(10),
  borderTopLeftRadius: moderateScale(30),
  borderTopRightRadius: moderateScale(30),
  ...commonSty.lightShadow,
  position: 'absolute',
  backgroundColor: '#FFFFFF',
  borderWidth: moderateScale(1),
  borderColor: '#EAEAEA',
  elevation: 5, // Android shadow
},
 tabIconContainer: {
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  paddingVertical: moderateScale(6),
  width: moderateScale(60),
},
});
export default styles;