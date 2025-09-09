import {StyleSheet} from 'react-native';
import {colors, commonSty} from '../../theme';
import {moderateScale} from 'react-native-size-matters';

const styles = StyleSheet.create({
  profileItemContainer: {
    borderWidth: moderateScale(1),
    borderColor: colors.seaShell,
    width: '85%',
    borderRadius: moderateScale(10),
    ...commonSty.mv30,
  },
});
export default styles;  
