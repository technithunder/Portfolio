import {StyleSheet} from 'react-native';
import {COLORS} from '../../theme/colors';
import {FONTS} from '../../constants/fonts';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  searchBarContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchBar: {
    backgroundColor: COLORS.APP_LIGHT_GRAY,
    height: 45,
    width: '100%',
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 8,
  },
  searchInput: {
    fontSize: 14,
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_REGULAR,
    width: '80%',
  },
  filterInput: {
    backgroundColor: COLORS.APP_LIGHT_GRAY,
    height: 45,
    width: '16%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 20,
    paddingHorizontal: 5,
    flexWrap: 'nowrap', // Prevent wrapping to keep in one row
  },

  categoryWrapper: {
    alignItems: 'center',
    flex: 1, // Equal distribution of space
    paddingHorizontal: 2, // Small padding between items
  },

  categoryItem: {
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  categoryIcon: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
  },

  categoryTitleContainer: {
    width: '100%',
    minHeight: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  flatListContainer: {
    paddingHorizontal: 5,
    marginTop: 20,
  },

  categoryRow: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop:20,
  },
});

export default styles;
