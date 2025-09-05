import { StyleSheet } from 'react-native'
import { FONTS, HEIGHT, WIDTH } from '../../helper/constants';

export default StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    flex: 1,
  },
  purchasecars: {
    width: WIDTH-50,
    height: 350,
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginTop: 50,
    borderRadius: 20,
    paddingHorizontal: 40
  },
  forwordBtn: {
    backgroundColor: "lightgray",
    height: 60,
    width: 60,
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 20
  },
  txtoffer: {
    fontWeight: "400",
    fontFamily: FONTS.BOOK,
    fontSize: 18,
    marginTop: 30
  },
  txtpurchseRs: {
    fontSize: 34,
    fontFamily: FONTS.BOOK,
    fontWeight: "700",
    color: "#000000",
    fontStyle: "italic",
    marginTop: 30
  },
  ringingBtn: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: -25,
    marginRight: 50,
    justifyContent: 'center'
  },
  txtpurchase: {
    fontSize: 18,
    fontFamily: FONTS.BOOK,
    fontWeight: '700'
  },
})