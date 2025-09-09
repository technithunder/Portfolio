import {StyleSheet} from 'react-native';
import {COLORS} from '../../../theme/colors';
import {FONTS} from '../../../constants/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
  },
  inputView: {
    backgroundColor: COLORS.APP_LIGHT_GRAY,
    height: 40,
    marginHorizontal: 20,
    borderRadius: 50,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  searchInput: {
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_REGULAR,
    fontSize: 14,
  },
  listContainer: {
    borderWidth: 1,
    borderColor: COLORS.APP_LIGHT_GRAY,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userPicture: {
    width: 56,
    height: 56,
    borderRadius: 50,
    marginRight: 10,
  },
});

export default styles;
