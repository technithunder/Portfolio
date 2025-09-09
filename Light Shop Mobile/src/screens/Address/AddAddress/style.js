import {StyleSheet} from 'react-native';
import {COLORS} from '../../../theme/colors';
import { FONTS } from '../../../constants/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
  },
  input: {
    color: COLORS.APP_BLACK,
    borderWidth: 1,
    borderColor: COLORS.APP_LIGHT_GRAY,
    borderRadius: 8, 
    padding: 10,
    marginTop: 10,
    fontSize: 14,    
    fontFamily: FONTS.INTER_REGULARs
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  
  },
  gridItem: {
    flex: 1,
    marginHorizontal: 5,
    marginTop: 18,
  },
  loginButton: {
    width: '48%',
  },
});

export default styles;