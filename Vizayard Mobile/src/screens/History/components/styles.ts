import {StyleSheet} from 'react-native';
import {COLORS} from '../../../config/colors';
import {FONTS} from '../../../config/font';

const styles = StyleSheet.create({
  applicationItemStyle: {
    borderWidth: 1,
    borderColor:'#E5E7EB',
    margin:16,
    gap: 16,
    borderRadius:12
  },
  countryImage: {
    height: 140,
    borderTopRightRadius: 12,
    borderTopLeftRadius:12
  },
  txtCountryName: {
    fontFamily: FONTS.INTER_SEMIBOLD,
    fontSize: 18  ,
    color:'#111827',
    marginBottom:10
  },
  durationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 5,
  },
  duration: {
    fontSize: 14,
    fontFamily: FONTS.INTER_SEMIBOLD,
    color: '#4B5563',
  },
  statusView: {
    height: 30,
    justifyContent: 'center',
    borderRadius: 50,
    marginTop: 10,
    maxWidth: 200,
    alignItems: 'center',
    position:'absolute',
    top:0,
    right:5,
    paddingHorizontal:10
  },
  txtStatus: {
    fontFamily: FONTS.INTER_MEDIUM,
    fontSize: 12,
  },
});

export default styles;
