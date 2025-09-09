import {StyleSheet} from 'react-native';
import {COLORS} from '../../config/colors';
import {moderateScale} from 'react-native-size-matters';
import {commonSty} from '../../theme';

const styles = StyleSheet.create({
  divider: {
    backgroundColor: '#E6E6E6',
    height: 1,
  },
  detailContainer: {
    backgroundColor:COLORS.APP_WHITE,
    padding:10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    marginTop:12,
    marginHorizontal:5,
    elevation: 1,
    borderRadius:10
  },
  detailText: {
    width: '64%',
    ...commonSty.ml10,
  },
  profileImg: {
    ...commonSty.size(35),
    borderRadius: moderateScale(4),
    zIndex: 99,
  },
  rightContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: moderateScale(12),
    width: '20%',
    alignItems: 'flex-end',
  },
});

export default styles;
