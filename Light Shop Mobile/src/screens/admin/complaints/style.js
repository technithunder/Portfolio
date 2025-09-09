import { StyleSheet } from "react-native";
import { COLORS } from "../../../theme/colors";
import { FONTS } from "../../../constants/fonts";

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
  paginationInfo: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.APP_LIGHT_GRAY,
  },
  resultCount: {
    fontSize: 12,
    color: COLORS.APP_GRAY,
    fontFamily: FONTS.INTER_REGULAR,
  },
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop:20
  },
  complaintItem: {
    backgroundColor: COLORS.APP_WHITE,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: COLORS.APP_LIGHT_GRAY,
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 16,
    fontFamily: FONTS.INTER_MEDIUM,
    color: COLORS.APP_BLACK,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontFamily: FONTS.INTER_MEDIUM,
    color: COLORS.APP_WHITE,
  },
  customerName: {
    fontSize: 14,
    fontFamily: FONTS.INTER_MEDIUM,
    color: COLORS.APP_BLACK,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_GRAY,
    lineHeight: 20,
    marginBottom: 12,
  },
  complaintFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priority: {
    fontSize: 12,
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_GRAY,
    textTransform: 'capitalize',
  },
  createdBy: {
    fontSize: 12,
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_GRAY,
  },
  createdDate: {
    fontSize: 12,
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_LIGHTER_GRAY,
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_GRAY,
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: FONTS.INTER_MEDIUM,
    color: COLORS.APP_BLACK,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_GRAY,
    textAlign: 'center',
    lineHeight: 20,
  },
  detailsButton:{
    borderWidth:1,
    borderColor:COLORS.APP_GRAY,
    paddingHorizontal:20,
    paddingVertical:8,
    borderRadius:50
  }
});

export default styles;