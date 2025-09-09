import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Sheet, Typography} from '../../../../components';
import {FONTS} from '../../../../constants/fonts';
import {COLORS} from '../../../../theme/colors';
import LinearButton from '../../../../components/LinearButton';
import moment from 'moment';
import {addLead, updateLead} from '../../../../api';
import Toast from 'react-native-toast-message';

const AddLead = ({sheetRef, onLead, leadData}) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [requirement, setRequirement] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [showFollowUpDatePicker, setShowFollowUpDatePicker] = useState(false);
  const [followUpDate, setFollowUpDate] = useState(null);
  const [summary,setSummary] = useState('');
  const [isLoading, setLoading] = useState(false);
  console.log('leadData', selectedType);

  useEffect(() => {
    if (leadData) {
      setEmail(leadData?.email || '');
      setName(leadData?.customerName || '');
      setNumber(leadData?.mobileNumber || '');
      setRequirement(leadData?.requirement || '');
      setSelectedType(
        leadData?.type
          ? leadData?.type.charAt(0).toUpperCase() +
              leadData?.type.slice(1)
          : null,
      );
      setFollowUpDate(
        leadData?.followUpDate ? moment(leadData?.followUpDate).toDate() : null,
      );
      setSummary(leadData?.summary || '');
    }
  }, [leadData]);

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
      const response = leadData?.id
        ? await updateLead(leadData?.id, obj)
        : await addLead(obj);
      if (response?.data?.status === 'success') {
        setName('');
        setNumber('');
        setEmail('');
        setRequirement('');
        setSelectedType(null);
        setFollowUpDate(null);
        onCancel();
        onLead();
      }
    } catch (e) {
      console.log('error');
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    sheetRef.current?.hide();
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
    <Sheet ref={sheetRef}>
      <View style={{padding: 16}}>
        <Typography
          title={leadData?.id ? 'Edit Lead' : 'Add Lead'}
          font={FONTS.INTER_SEMIBOLD}
          size={18}
          align="center"
        />
        <View style={{marginTop: 20}}>
          <TextInput
            placeholder="Name"
            placeholderTextColor={COLORS.APP_GRAY}
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholder="Phone Number"
            placeholderTextColor={COLORS.APP_GRAY}
            style={styles.input}
            keyboardType="phone-pad"
            value={number}
            maxLength={10}
            onChangeText={setNumber}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor={COLORS.APP_GRAY}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Requirement"
            placeholderTextColor={COLORS.APP_GRAY}
            style={[styles.input, {height: 80}]}
            textAlignVertical="top"
            multiline
            value={requirement}
            onChangeText={setRequirement}
          />
           <TextInput
            placeholder="Summary"
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
          <View style={{width: '10%', height: 20}}>
            <Typography title={'Type'} size={14} color={COLORS.APP_GRAY} />
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
              width: '20%',
            }}>
            <Typography title={'Follow-up'} size={14} color={COLORS.APP_GRAY} />
          </View>
          <View style={{width: '70%'}}>
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
          <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <Typography title={'Cancel'} size={16} font={FONTS.INTER_REGULAR} />
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

      <DateTimePickerModal
        isVisible={showFollowUpDatePicker}
        mode="date"
        date={followUpDate || new Date()}
        maximumDate={new Date()}
        onConfirm={handleDOBConfirm}
        onCancel={() => setShowFollowUpDatePicker(false)}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      />
    </Sheet>
  );
};

export default AddLead;

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
});
