import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {commonSty, WIDTH} from '../../theme';

const styles = StyleSheet.create({
  mainCategoryContainer: {
    height: moderateScale(110),
    ...commonSty.center,
    width: WIDTH / 1,
    marginRight: moderateScale(10),
  },
  featureProductsContainer: {
    height: moderateScale(270),
  },
  listContainers: {
    ...commonSty.ph20,
    ...commonSty.mt15,
    // flex: 1,
  },
  recommendedContainer: {
    height: moderateScale(135),
  },
});
export default styles;
