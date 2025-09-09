import {StyleSheet} from 'react-native';
import {COLORS} from '../../../../../theme/colors';
import {FONTS} from '../../../../../constants/fonts';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  container: {
    width: '95%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  closeText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  content: {
    padding: 10,
    minHeight: 200,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    marginRight: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    padding: 12,
    marginLeft: 10,
    backgroundColor: COLORS.APP_PRIMARY,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  // New styles for disabled button
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
  disabledText: {
    color: '#666666',
  },
  input: {
    minHeight: 70, // Increased for multiline
    height: 'auto', // allow expansion if needed
    borderColor: COLORS.APP_GRAY,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10, // extra padding for multiline comfort
    marginTop: 5,
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_REGULAR,
    textAlignVertical: 'top', // ensure text starts at top in multiline
  },
  inputField: {
    borderColor: COLORS.APP_GRAY,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_BLACK,
    marginTop: 5,
  },
});

export default styles;