import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {COLORS} from '../../../theme/colors';
import {FONTS} from '../../../constants/fonts';
import {Typography} from '../../../components';
import {addComplaints} from '../../../api';
import { useSelector } from 'react-redux';

const ComplantionModal = ({visible, handleClose, orderId,fetchSingleOrder}) => {
  const user = useSelector(state => state.auth.user)
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      let obj = {
        orderId: orderId,
        description: description,
        userId:user?.id
      };
      const response = await addComplaints(obj);
      if (response?.data?.status === 'success') {
        setDescription('');
        handleClose();
        fetchSingleOrder()
      }
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = description === '' || description.length < 1 || isLoading;

  return (
    <Modal
      visible={visible}
      onRequestClose={handleClose}
      transparent={true}
      animationType="fade">
      <Pressable style={styles.overlay} onPress={!isLoading ? handleClose : null}>
        <Pressable style={styles.container} onPress={e => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Having any complaints?</Text>
            <TouchableOpacity 
              onPress={handleClose} 
              style={styles.closeButton}
              disabled={isLoading}>
              <Text style={[styles.closeText, isLoading && styles.disabledText]}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            <Typography
              title={'Ask your queries :'}
              size={14}
              font={FONTS.INTER_MEDIUM}
            />
            <TextInput
              style={[styles.inputField, styles.multilineInput]}
              placeholder="Enter queries here..."
              placeholderTextColor={COLORS.APP_GRAY}
              onChangeText={text => setDescription(text)}
              value={description}
              multiline
              numberOfLines={10}
              textAlignVertical="top"
              editable={!isLoading}
            />
          </View>
          <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.cancelButton, isLoading && styles.disabledButton]} 
              onPress={handleClose}
              disabled={isLoading}>
              <Text style={[styles.cancelText, isLoading && styles.disabledText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                isDisabled && styles.disabledSubmitButton
              ]}
              disabled={isDisabled}
              onPress={handleSave}>
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.submitText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

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
    paddingHorizontal: 14,
    paddingVertical: 20,
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
    padding: 14,
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
  inputField: {
    borderWidth: 1,
    borderColor: COLORS.APP_LIGHTER_GRAY,
    borderRadius: 10,
    fontSize: 14,
    paddingHorizontal: 6,
    marginTop: 10,
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_REGULAR,
  },
  multilineInput: {
    height: 160,
    textAlignVertical: 'top',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledSubmitButton: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
});

export default ComplantionModal;