import { StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../constants/fonts";

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
  addButton: {
    position: 'absolute',
    bottom: 60,
    right: 30,
    width: 46,
    height: 46,
    backgroundColor: COLORS.APP_PRIMARY,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    elevation: 5,
    shadowColor: COLORS.APP_BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120, // To avoid overlap with add button
  },
  addressCard: {
    backgroundColor: COLORS.APP_WHITE,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: COLORS.APP_BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    borderWidth: 1,
    borderColor: COLORS.APP_LIGHT_GRAY,
  },
  addressContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.APP_LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addressDetails: {
    flex: 1,
    marginRight: 8,
  },
  streetText: {
    fontFamily: FONTS.INTER_MEDIUM,
    fontSize: 14,
    color: COLORS.APP_BLACK,
    marginBottom: 4,
    lineHeight: 20,
  },
  locationText: {
    fontFamily: FONTS.INTER_REGULAR,
    fontSize: 13,
    color: COLORS.APP_GRAY,
    marginBottom: 2,
  },
  countryText: {
    fontFamily: FONTS.INTER_REGULAR,
    fontSize: 12,
    color: COLORS.APP_LIGHTER_GRAY,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.APP_LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontFamily: FONTS.INTER_REGULAR,
    fontSize: 12,
    color: COLORS.APP_GRAY,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  emptyText: {
    fontFamily: FONTS.INTER_MEDIUM,
    fontSize: 16,
    color: COLORS.APP_GRAY,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubText: {
    fontFamily: FONTS.INTER_REGULAR,
    fontSize: 14,
    color: COLORS.APP_LIGHTER_GRAY,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default styles;