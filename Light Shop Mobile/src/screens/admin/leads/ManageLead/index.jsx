import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Container, Sheet, Typography} from '../../../../components';
import {FONTS} from '../../../../constants/fonts';
import {COLORS} from '../../../../theme/colors';
import LinearButton from '../../../../components/LinearButton';
import moment from 'moment';
import {addLead, getSingleLead, updateLead} from '../../../../api';
import Toast from 'react-native-toast-message';
import {Images, Routes} from '../../../../constants';
import {useRoute} from '@react-navigation/native';
import {Dropdown} from 'react-native-element-dropdown';

const lead_source_type = [
  {
    label: 'Lead 1',
    value: 'lead1',
  },
  {
    label: 'Lead 2',
    value: 'lead2',
  },
  {
    label: 'Lead 3',
    value: 'lead3',
  },
];

const customer_type = [
  {
    label: 'Customer Type 1',
    value: 'customerType1',
  },
  {
    label: 'Customer Type 2',
    value: 'customerType2',
  },
  {
    label: 'Customer Type 3',
    value: 'customerType3',
  },
];

const ManageLead = ({navigation}) => {
  const route = useRoute();
  const leadId = route?.params?.leadId;
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [requirement, setRequirement] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [showFollowUpDatePicker, setShowFollowUpDatePicker] = useState(false);
  const [followUpDate, setFollowUpDate] = useState(null);
  const [summary, setSummary] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [loading, setIsLoading] = useState(false);

  const [customerType, setCustomerType] = useState(null);
  const [leadType, setLeadType] = useState(null);

  console.log('leadData', selectedType);

  useEffect(() => {
    if (leadId) {
      fetchSingleLead(leadId);
    }
  }, [leadId]);

  const fetchSingleLead = async id => {
    setIsLoading(true);
    try {
      const response = await getSingleLead(id);
      if (response?.data?.status === 'success') {
        setEmail(response?.data?.data?.email || '');
        setName(response?.data?.data?.customerName || '');
        setNumber(response?.data?.data?.mobileNumber || '');
        setRequirement(response?.data?.data?.requirement || '');
        setSelectedType(
          response?.data?.data?.type
            ? response?.data?.data?.type.charAt(0).toUpperCase() +
                response?.data?.data?.type.slice(1)
            : null,
        );
        setLeadType(data?.leadSourceType || null);
        setCustomerType(data?.customerType || null);
        setFollowUpDate(
          response?.data?.data?.followUpDate
            ? moment(response?.data?.data?.followUpDate).toDate()
            : null,
        );
        setSummary(response?.data?.data?.summary || '');
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const onSave = async () => {
    if (number && number.length < 10) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Number',
        text2: 'Please enter a valid 10-digit number.',
      });
      return;
    }

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
      });
      return;
    }

    setLoading(true);

    try {
      let obj = {
        email: email.trim().toLowerCase(),
        customerName: name,
        mobileNumber: number,
        requirement: requirement,
        type: selectedType.toLowerCase(),
        followUpDate: followUpDate
          ? moment(followUpDate).format('YYYY-MM-DD')
          : null,
        summary: summary,
      };
      const response = leadId
        ? await updateLead(leadId, obj)
        : await addLead(obj);
      if (response?.data?.status === 'success') {
        setName('');
        setNumber('');
        setEmail('');
        setRequirement('');
        setSelectedType(null);
        setFollowUpDate(null);
        onCancel();
      }
    } catch (e) {
      console.log('error');
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    if (leadId) {
      navigation.navigate(Routes.AdminLeadView, {leadId: leadId});
    } else {
      navigation.navigate(Routes.DrawerStack, {
        screen: Routes.AdminBottomStack,
        params: {
          screen: Routes.AdminLeads,
        },
      });
    }
  };

  const handleDOBConfirm = date => {
    setShowFollowUpDatePicker(false);
    setFollowUpDate(date);
  };

  const isDisabled =
    name === '' ||
    number === '' ||
    selectedType === null ||
    email === '' ||
    requirement === '' ||
    !followUpDate;

  return (
    <Container
      contentContainerStyle={{flex: 1}}
      showBack={true}
      onLeftPress={onCancel}
      title={leadId ? 'Edit Lead' : 'Add Lead'}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="handled">
          {loading ? (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator size={24} color={COLORS.APP_PRIMARY} />
            </View>
          ) : (
            <View style={{marginHorizontal: 26, marginTop: 10}}>
              <View>
                <TextInput
                  placeholder="Name *"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                />
                <TextInput
                  placeholder="Phone Number *"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={styles.input}
                  keyboardType="phone-pad"
                  value={number}
                  maxLength={10}
                  onChangeText={setNumber}
                />
                <TextInput
                  placeholder="Email *"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                />
                <Dropdown
                  style={[styles.input, styles.dropdown]}
                  placeholderStyle={styles.dropdownPlaceholder}
                  selectedTextStyle={styles.dropdownSelectedText}
                  inputSearchStyle={styles.dropdownSearch}
                  iconStyle={styles.dropdownIcon}
                  data={lead_source_type}
                  maxHeight={240}
                  labelField="label"
                  valueField="value"
                  placeholder="Lead Source Type *"
                  itemTextStyle={{color: COLORS.APP_BLACK}}
                  value={leadType}
                  onChange={item => {
                    setLeadType(item.value);
                  }}
                  renderRightIcon={() => (
                    <MaterialIcons
                      name="keyboard-arrow-down"
                      size={20}
                      color={COLORS.APP_GRAY}
                    />
                  )}
                />
                <Dropdown
                  style={[styles.input, styles.dropdown]}
                  placeholderStyle={styles.dropdownPlaceholder}
                  selectedTextStyle={styles.dropdownSelectedText}
                  inputSearchStyle={styles.dropdownSearch}
                  iconStyle={styles.dropdownIcon}
                  data={customer_type}
                  maxHeight={240}
                  labelField="label"
                  valueField="value"
                  placeholder="Customer Type *"
                  itemTextStyle={{color: COLORS.APP_BLACK}}
                  value={customerType}
                  onChange={item => {
                    setCustomerType(item.value);
                  }}
                  renderRightIcon={() => (
                    <MaterialIcons
                      name="keyboard-arrow-down"
                      size={20}
                      color={COLORS.APP_GRAY}
                    />
                  )}
                />
                <TextInput
                  placeholder="Requirement *"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={[styles.input, {height: 80}]}
                  textAlignVertical="top"
                  multiline
                  value={requirement}
                  onChangeText={setRequirement}
                />
                <TextInput
                  placeholder="Summary *"
                  placeholderTextColor={COLORS.APP_GRAY}
                  style={[styles.input, {height: 80}]}
                  textAlignVertical="top"
                  multiline
                  value={summary}
                  onChangeText={setSummary}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  justifyContent: 'space-between',
                }}>
                <View style={{width: '12%', height: 20}}>
                  <Typography
                    title={'Type*'}
                    size={13}
                    color={COLORS.APP_GRAY}
                  />
                </View>
                <View style={{width: '90%', height: 20}}>
                  <FlatList
                    horizontal
                    contentContainerStyle={{flexDirection: 'row', gap: 10}}
                    data={['Hot', 'Warm', 'Cold']}
                    renderItem={({item, index}) => {
                      return (
                        <TouchableOpacity
                          onPress={() => setSelectedType(item)}
                          style={[
                            styles.type,
                            {
                              backgroundColor:
                                selectedType === item
                                  ? COLORS.APP_PRIMARY
                                  : COLORS.APP_WHITE,
                              borderColor:
                                selectedType === item
                                  ? COLORS.APP_PRIMARY
                                  : COLORS.APP_GRAY,
                            },
                          ]}>
                          <Typography
                            title={item}
                            size={12}
                            color={
                              selectedType === item
                                ? COLORS.APP_WHITE
                                : COLORS.APP_GRAY
                            }
                          />
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 20,
                  alignItems: 'center',
                  gap: 10,
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    width: '25%',
                  }}>
                  <Typography
                    title={'Follow-up *'}
                    size={14}
                    color={COLORS.APP_GRAY}
                  />
                </View>
                <View style={{width: '65%'}}>
                  <TouchableOpacity
                    style={[styles.datePickerButton]}
                    onPress={() => setShowFollowUpDatePicker(true)}>
                    <Text
                      style={[
                        styles.datePickerText,
                        !followUpDate && {color: COLORS.APP_GRAY},
                      ]}>
                      {followUpDate
                        ? moment(followUpDate).format('DD MMM, YYYY')
                        : 'Select Date'}
                    </Text>
                    <MaterialIcons
                      name="date-range"
                      size={20}
                      color={COLORS.APP_GRAY}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  marginTop: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={onCancel}
                  style={styles.cancelButton}>
                  <Typography
                    title={'Cancel'}
                    size={16}
                    font={FONTS.INTER_REGULAR}
                  />
                </TouchableOpacity>
                <LinearButton
                  loading={isLoading}
                  disabled={isDisabled}
                  title="Save"
                  onPress={onSave}
                  style={{width: '48%'}}
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
        </ScrollView>
      </KeyboardAvoidingView>

      <DateTimePickerModal
        isVisible={showFollowUpDatePicker}
        mode="date"
        date={followUpDate || new Date()}
        maximumDate={new Date()}
        onConfirm={handleDOBConfirm}
        onCancel={() => setShowFollowUpDatePicker(false)}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      />
    </Container>
  );
};

export default ManageLead;

const styles = StyleSheet.create({
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: COLORS.APP_GRAY,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    fontSize: 14,
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_BLACK,
  },
  type: {
    borderWidth: 1,
    borderColor: COLORS.APP_GRAY,
    borderRadius: 50,
    paddingHorizontal: 24,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: '48%',
    borderRadius: 50,
    backgroundColor: COLORS.APP_LIGHT_GRAY,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.APP_GRAY,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_BLACK,
  },
  datePickerText: {
    fontSize: 14,
    fontFamily: FONTS.INTER_REGULAR,
    color: COLORS.APP_BLACK,
  },
  dropdownSelectedText: {
    color: COLORS.APP_BLACK,
    fontSize: 16,
    fontFamily: FONTS.INTER_REGULAR,
  },
  dropdownSearch: {
    color: COLORS.APP_BLACK,
    fontSize: 16,
    fontFamily: FONTS.INTER_REGULAR,
  },
  dropdownIcon: {
    width: 20,
    height: 20,
  },

  dropdown: {
    height: 50,
  },
  dropdownPlaceholder: {
    color: COLORS.APP_GRAY,
  },
});
