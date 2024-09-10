import { StyleSheet } from 'react-native'
import { FONTS, HEIGHT, WIDTH } from '../../helper/constants';

export default StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    flex: 1,
  },
  cardContainer: {
    borderRadius: 20,
    marginHorizontal: 10
  },
  cardInner: {
    flex: 1,
    borderRadius: 20
  },
  innerContainer: {
    flex: 1,
    paddingLeft: 25,
    paddingVertical: 16
  },
  symbolContainer: {
    height: 50,
    width: 50,
    backgroundColor: '#fff',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS._BOLD,
    textTransform: 'capitalize',
    marginTop: 10,
  },
  subTitle: {
    fontSize: 15,
    fontFamily: FONTS.BOOK,
    marginTop: 10,
  },
  btn: {
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '85%',
    paddingVertical: 10,
    marginTop: 15
  },
  btnText: {
    fontSize: 18,
    fontFamily: FONTS._BOLD
  },
  price: {
    fontSize: 16,
    fontFamily: FONTS._BOLD,
  },
  priceBig: {
    fontSize: 23,
    fontFamily: FONTS._BOLD,
    textAlign: 'center'
  }
})