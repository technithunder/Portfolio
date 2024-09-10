import { Platform, StyleSheet } from 'react-native'
import { FONTS, HEIGHT, hp, WIDTH, wp } from '../../helper/constants';
export default StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    flex: 1,
  },
  headerMain: {
    marginTop: Platform.OS == 'ios' ? 40 : 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerBorder: {
    backgroundColor: '#96F280',
    height: 5,
    width: 38,
    marginRight: 30
  },
  mainHeaderText: {
    fontSize: 44,
    fontFamily: FONTS._BOLD,
  },
  upgradeToPro: {
    height: 50,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15
  },
  txtUpgradetopro: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: FONTS.BOOK,
  },
  imagePicker: {
    height: 100,
    width: 100,
    borderRadius: 100
  },
  textProfilename: {
    fontSize: 24,
    fontFamily: FONTS.BOOK,
    marginTop: 10,
    fontWeight: "500"
  },
  country: {
    fontSize: 18,
    fontFamily: FONTS.BOOK,
    textAlign: 'center',
    fontWeight: "500",
    color: 'gray',
    textTransform: 'capitalize'
  },
  ageyears: {
    fontSize: 16,
    fontFamily: FONTS.BOOK,
    color: 'darkgray',
    textAlign: 'center',
    marginTop: 5
  },
  //dropdown
  dropdownSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  dropdownText: {
    fontFamily: FONTS.BOOK,
    fontSize: 18,
    marginLeft: 20
  },
  dropdown: {
    flex: 1,
    shadowColor: '#000000',
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    borderRadius: 50,
  },
  dp: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 100,
    borderColor: '#68E74A',
    borderWidth: 3
  },
  edit: {
    height: 35,
    width: 35,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    position: 'absolute',
    zIndex: 999,
    right: -5,
    top: -5,
    shadowColor: '#000000',
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  sliderLabel: {
    fontSize: 16,
    fontFamily: FONTS.BOOK,
    color: 'darkgray',
    marginTop: 15,
    marginBottom: 25
  },
  descText: {
    fontSize: 16,
    fontFamily: FONTS.BOOK,
    color: 'darkgray',
    textAlign: 'center',
  },
  descText: {
    fontSize: 16,
    fontFamily: FONTS.BOOK,
    color: 'darkgray',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: hp('3%'),
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  btn: {
    backgroundColor: '#fff',
    width: WIDTH * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: wp('4%'),
    marginTop: 20,
    alignSelf: 'center',
        shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,

    elevation: 5,
  },
  btnText: {
    fontFamily: FONTS._BOLD,
    fontSize: wp('5%'),
    textTransform: "uppercase"
  },
})