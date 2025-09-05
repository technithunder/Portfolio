import { StyleSheet } from 'react-native';
import { FONTS, HEIGHT, hp, WIDTH } from '../../helper/constants';

export default StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  imagePicker: {
    height: 120,
    width: 120,
    borderRadius: 100,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('4%')
  },
  img: {
    height: 38,
    width: 38,
    resizeMode: "contain"
  },
  descText: {
    fontSize: 16,
    fontFamily: FONTS.BOOK,
    color: 'darkgray',
    textAlign: 'center',
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
  ringingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 30,
    justifyContent: 'center'
  },
  txtRinging: {
    fontSize: 23,
    color: "#000000",
    fontFamily: FONTS.BOOK,
    paddingLeft: 20
  },
  callimg: {
    height: 22,
    width: 22,
    resizeMode: 'contain'
  },
  sliderLabel: {
    fontSize: 16,
    fontFamily: FONTS.BOOK,
    color: 'darkgray',
    marginTop: 15,
    marginBottom: 25
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: hp('3%'),
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  inputLabel: {
    fontFamily: FONTS.BOOK,
    fontSize: 20
  },
  inputs: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontFamily: FONTS.BOOK
  },
});
