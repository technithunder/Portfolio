import {StyleSheet} from 'react-native';
import {COLORS} from '../../../../theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
  },
  card: {
    borderWidth: 1,
    borderColor: COLORS.APP_LIGHT_GRAY,
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    backgroundColor: COLORS.APP_WHITE,
  },

  uploadButton: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: COLORS.APP_WHITE,
    borderWidth: 1,
    borderColor: COLORS.APP_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    marginTop: 10,
  },
  noteButton: {
    backgroundColor: COLORS.APP_PRIMARY,
    height: 60,
    width: 60,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 60,
    right: 20,
  },
});

export default styles;
