import React, {useEffect, useState} from 'react';
import styles from './style';
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Typography} from '../../../../../components';
import {FONTS} from '../../../../../constants/fonts';
import {COLORS} from '../../../../../theme/colors';

const AddAddressModal = ({
  visible,
  onClose,
  onSubmit,
  editAddressId,
  addressData,
}) => {
  const [formData, setFormData] = useState({
    id: new Date().getTime(),
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
  });

  useEffect(() => {
    if (editAddressId) {
      const temp = addressData.find(item => item.id === editAddressId);
      if (temp) {
        setFormData({
          id: temp.id,
          street: temp.street,
          city: temp.city,
          state: temp.state,
          country: temp.country,
          zipCode: temp.zipCode,
        });
      }
    } else {
      setFormData({
        id: new Date().getTime(),
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
      });
    }
  }, [editAddressId]);

  // Check if all required fields are filled
  const isFormValid = () => {
    return (
      formData.street.trim() !== '' &&
      formData.city.trim() !== '' &&
      formData.state.trim() !== '' &&
      formData.country.trim() !== '' &&
      formData.zipCode.trim() !== ''
    );
  };

  const handleClose = () => {
    onClose();
    if (!editAddressId) {
      setFormData({
        id: new Date().getTime(),
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
      });
    }
  };

  const onSave = () => {
    if (!isFormValid()) {
      return;
    }

    let obj = {
      id: editAddressId ? formData.id : new Date().getTime(),
      street: formData.street.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      country: formData.country.trim(),
      zipCode: formData.zipCode.trim(),
    };
    onSubmit(obj);
    onClose();
    setFormData({
      id: new Date().getTime(),
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    });
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      transparent={true}
      animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={e => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {editAddressId ? 'Edit Address' : 'Add Address'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Typography
                  title={'Street'}
                  size={14}
                  font={FONTS.INTER_MEDIUM}
                />
                <Typography
                  title="*"
                  size={14}
                  font={FONTS.INTER_MEDIUM}
                  color="red"
                />
              </View>

              <TextInput
                placeholder="Enter street "
                placeholderTextColor={COLORS.APP_GRAY}
                style={styles.input}
                multiline
                numberOfLines={2}
                onChangeText={text => setFormData({...formData, street: text})}
                value={formData.street}
              />
            </View>
            <View style={{marginTop: 10}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Typography
                  title={'City'}
                  size={14}
                  font={FONTS.INTER_MEDIUM}
                />
                <Typography
                  title="*"
                  size={14}
                  font={FONTS.INTER_MEDIUM}
                  color="red"
                />
              </View>

              <TextInput
                placeholder="Enter city"
                placeholderTextColor={COLORS.APP_GRAY}
                style={styles.inputField}
                onChangeText={text => {
                  const cleanedText = text.replace(/[^a-zA-Z\s]/g, '');
                  setFormData({...formData, city: cleanedText});
                }}
                value={formData.city}
              />
            </View>
            <View style={{marginTop: 10}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Typography
                  title={'State'}
                  size={14}
                  font={FONTS.INTER_MEDIUM}
                />
                <Typography
                  title="*"
                  size={14}
                  font={FONTS.INTER_MEDIUM}
                  color="red"
                />
              </View>

              <TextInput
                placeholder="Enter state"
                placeholderTextColor={COLORS.APP_GRAY}
                style={styles.inputField}
                onChangeText={text => {
                  const cleanedText = text.replace(/[^a-zA-Z\s]/g, '');
                  setFormData({...formData, state: cleanedText});
                }}
                value={formData.state}
              />
            </View>
            <View style={{marginTop: 10}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Typography
                  title={'Country'}
                  size={14}
                  font={FONTS.INTER_MEDIUM}
                />
                <Typography
                  title="*"
                  size={14}
                  font={FONTS.INTER_MEDIUM}
                  color="red"
                />
              </View>

              <TextInput
                placeholder="Enter country"
                placeholderTextColor={COLORS.APP_GRAY}
                style={styles.inputField}
                onChangeText={text => {
                  const cleanedText = text.replace(/[^a-zA-Z\s]/g, '');
                  setFormData({...formData, country: cleanedText});
                }}
                value={formData.country}
              />
            </View>
            <View style={{marginTop: 10}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Typography
                  title={'ZipCode'}
                  size={14}
                  font={FONTS.INTER_MEDIUM}
                />
                <Typography
                  title="*"
                  size={14}
                  font={FONTS.INTER_MEDIUM}
                  color="red"
                />
              </View>

              <TextInput
                placeholder="Enter zipcode"
                placeholderTextColor={COLORS.APP_GRAY}
                style={styles.inputField}
                onChangeText={text => {
                  const numericText = text.replace(/[^0-9]/g, '');
                  setFormData({...formData, zipCode: numericText});
                }}
                value={formData.zipCode}
                keyboardType="numeric"
                maxLength={6}
              />
            </View>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                !isFormValid() && styles.disabledButton,
              ]}
              onPress={onSave}
              disabled={!isFormValid()}>
              <Text
                style={[
                  styles.submitText,
                  !isFormValid() && styles.disabledText,
                ]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default AddAddressModal;
