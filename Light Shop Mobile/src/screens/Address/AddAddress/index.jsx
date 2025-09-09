import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Text, TextInput, View} from 'react-native';
import styles from './style';
import {Container, Typography} from '../../../components';
import {useRoute} from '@react-navigation/native';
import {Images, Routes} from '../../../constants';
import {COLORS} from '../../../theme/colors';
import LinearButton from '../../../components/LinearButton';
import {FONTS} from '../../../constants/fonts';
import {addAddress, getSingleAddress, updateAddress} from '../../../api';

const AddAddress = ({navigation}) => {
  const route = useRoute();
  const addressId = route.params?.addressId;
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
  });

  useEffect(() => {
    if (addressId) {
      fetchSingleAddress(addressId);
    }
  }, [addressId]);

  const fetchSingleAddress = async () => {
    try {
      setIsLoading(true);
      const response = await getSingleAddress(addressId);
      if (response?.data?.status === 'success') {
        const address = response.data.data;
        setFormData({
          street: address.street || '',
          city: address.city || '',
          state: address.state || '',
          country: address.country || '',
          zipCode: address.zipCode || '',
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const onSave = async () => {
    try {
      setLoading(true);

      const response = addressId
        ? await updateAddress(addressId, formData)
        : await addAddress(formData);
      if (response?.data?.status === 'success') {
        navigation.navigate(Routes.Address);
      }
    } catch (e) {
      console.log('Error saving address:', e);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    formData.street === '' ||
    formData.city === '' ||
    formData.state === '' ||
    formData.country === '' ||
    formData.zipCode === '' ||
    formData.zipCode.length < 6;

  return (
    <Container
      title={addressId ? 'Edit Address' : 'Add Address'}
      leftIcon={Images.back}
      onLeftPress={() => {
        navigation.navigate(Routes.Address);
      }}
      style={styles.container}>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={20} color={COLORS.APP_PRIMARY} />
        </View>
      ) : (
        <View style={{marginHorizontal: 20, marginTop: 10}}>
          {/* Street - Full Width */}
          <View style={{marginTop: 10}}>
            <Typography
              title={'Street'}
              size={14}
              color={COLORS.APP_BLACK}
              font={FONTS.INTER_MEDIUM}
            />
            <TextInput
              placeholder="Enter street"
              placeholderTextColor={COLORS.APP_GRAY}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              style={[styles.input, styles.multilineInput]}
              onChangeText={text => setFormData({...formData, street: text})}
              value={formData.street}
            />
          </View>

          {/* City and State - Grid Layout */}
          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <Typography title={'City'} size={14} color={COLORS.APP_BLACK} />
              <TextInput
                placeholder="Enter city"
                placeholderTextColor={COLORS.APP_GRAY}
                style={styles.input}
                onChangeText={text => setFormData({...formData, city: text})}
                value={formData.city}
              />
            </View>
            <View style={styles.gridItem}>
              <Typography title={'State'} size={14} color={COLORS.APP_BLACK} />
              <TextInput
                placeholder="Enter state"
                placeholderTextColor={COLORS.APP_GRAY}
                style={styles.input}
                onChangeText={text => setFormData({...formData, state: text})}
                value={formData.state}
              />
            </View>
          </View>

          {/* Country and Zipcode - Grid Layout */}
          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <Typography
                title={'Country'}
                size={14}
                color={COLORS.APP_BLACK}
              />
              <TextInput
                placeholder="Enter country"
                placeholderTextColor={COLORS.APP_GRAY}
                style={styles.input}
                onChangeText={text => setFormData({...formData, country: text})}
                value={formData.country}
              />
            </View>
            <View style={styles.gridItem}>
              <Typography
                title={'Zipcode'}
                size={14}
                color={COLORS.APP_BLACK}
              />
              <TextInput
                placeholder="Enter zipcode"
                placeholderTextColor={COLORS.APP_GRAY}
                style={styles.input}
                maxLength={6}
                onChangeText={text => setFormData({...formData, zipCode: text})}
                value={formData.zipCode}
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={{alignItems: 'center', marginTop: 30}}>
            <LinearButton
              disabled={isDisabled}
              loading={loading}
              title="Save"
              onPress={onSave}
              style={styles.loginButton}
              gradientStyle={{height: 40}}
              textStyle={{
                fontSize: 16,
                fontFamily: FONTS.INTER_REGULAR,
                color: COLORS.APP_WHITE,
              }}
            />
          </View>
        </View>
      )}
    </Container>
  );
};

export default AddAddress;
