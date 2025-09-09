import {StyleSheet} from 'react-native';
//relative path imports
import {COLORS} from '../../config/colors';
import {FONTS} from '../../config/font';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: COLORS.APP_DIVIDER,
    height: 140,
    width: '100%',
  },
  chipView: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 240,
    backgroundColor: COLORS.APP_PRIMARY,
    borderRadius: 20,
    gap: 10,
  },
  txtDateDesc: {
    color: COLORS.APP_WHITE,
    fontFamily: FONTS.INTER_REGULAR,
    fontSize: 14,
  },
  stepContainer: {
    width:"50%",

    justifyContent:'center',
  },
  stepContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
},
});

export default styles;
