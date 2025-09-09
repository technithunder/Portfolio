import React, {useContext, useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';
//import styles
import styles from './style';
import {createVisaAPI, getAllVisaCategory, getAllVisaType} from '../../api';
import {AuthContext} from '../../context/AuthContext';
import {useRoute} from '@react-navigation/native';
import {commonSty} from '../../theme';
import {
  Button,
  Container,
  CustomDropdown,
  DatePicker,
  Typography,
} from '../../components';
import {moderateScale} from 'react-native-size-matters';
import {COLORS} from '../../config/colors';
import dayjs from 'dayjs';
import {useDispatch} from 'react-redux';
import {addTravelersAppID} from '../../redux/MainSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FONTS} from '../../config/font';
import DateTimePicker from 'react-native-modal-datetime-picker';
import HeaderWithBack from '../../components/HeaderWithBack';
import StepProcess from './StepProcess';
import {Images} from '../../config';
import { Screen } from 'react-native-screens';

const icon = {
  'single-entry-visa': Images.single_icon,
  'multiple-entry-visa': Images.group_icon,
};

const Traveller = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const route = useRoute();
  const dispatch = useDispatch();
  const {
    visaId,
    countryName,
    visaGaurrentedOn,
    additionalDocuments,
    visaProcessingDays,
    isExplore,
  } = route?.params || {};
  const [typeOfVisa, setTypeOfVisa] = useState(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [visaCategory, setVisaCategory] = useState(null);
  const [travelDate, setTravelDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [visaCategoryData, setVisaCategoryData] = useState([]);
  const [visaTypeData, setVisaTypeData] = useState([]);
  const [lastSubmitted, setLastSubmitted] = useState(null);

  console.log('visaProcessingDays:', visaProcessingDays);

  console.log(
    '67',
    visaId,
    countryName,
    visaGaurrentedOn,
    additionalDocuments,
    visaProcessingDays,
  );

  // Calculate minimum date based on visa processing days
  const getMinimumDate = () => {
    const today = new Date();
    const processingDays = visaProcessingDays || 0;

    // Add processing days to current date
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + processingDays);

    return minDate;
  };

  const getMinimumDateString = () => {
    const minDate = getMinimumDate();
    return dayjs(minDate).format('DD MMM YYYY');
  };

  useEffect(() => {
    fetchAllVisaType();
    fetchAllCategory();
  }, []);

  useEffect(() => {
    if (visaTypeData.length > 0 && visaCategoryData.length > 0) {
      loadSavedVisaDetails();
    }
  }, [visaTypeData, visaCategoryData]);

  const fetchAllCategory = async () => {
    try {
      const response = await getAllVisaCategory();
      if (response?.data?.status) {
        const transformedData = response?.data?.data?.map(item => ({
          label: item.label,
          value: item.value,
        }));
        setVisaCategoryData(transformedData);
        return transformedData;
      }
    } catch (e) {
      console.log('Error fetching visa categories:', e);
    }
    return [];
  };

  const fetchAllVisaType = async () => {
    try {
      const response = await getAllVisaType();
      if (response?.data?.status) {
        const transformedData = response?.data?.data?.map(item => ({
          label: item.label,
          value: item.value,
        }));
        setVisaTypeData(transformedData);
        return transformedData;
      }
    } catch (e) {
      console.log('Error fetching visa types:', e);
    }
    return [];
  };

  const loadSavedVisaDetails = async () => {
    try {
      const storedData = await AsyncStorage.getItem('visaDetails');
      if (storedData) {
        const parsedData = JSON.parse(storedData);

        const selectedType = visaTypeData.find(
          item => item.label === parsedData.selectedVisaType,
        )?.value;
        const selectedCategory = visaCategoryData.find(
          item => item.label === parsedData.selectedVisaCategory,
        )?.value;

        setTypeOfVisa(selectedType || null);
        setVisaCategory(selectedCategory || null);

        // Check if saved travel date is valid (not before minimum date)
        if (parsedData.travelDate) {
          const savedDate = new Date(parsedData.travelDate);
          const minDate = getMinimumDate();

          if (savedDate >= minDate) {
            setTravelDate(parsedData.travelDate);
          } else {
            // Clear invalid date
            setTravelDate(null);
          }
        }
      }
    } catch (e) {
      console.log('Failed to load visa details from AsyncStorage:', e);
    }
  };

  const onClickNextButton = async () => {
    if (!visaCategory || !typeOfVisa || !travelDate) {
      return;
    }

    const currentValues = {
      parentUserId: user?.id,
      visaType: visaTypeData.find(item => item.value === typeOfVisa)?.label,
      visaCategory: visaCategoryData.find(item => item.value === visaCategory)
        ?.label,
      travelDate: travelDate,
      visaId: visaId,
    };

    if (
      lastSubmitted &&
      JSON.stringify(lastSubmitted) === JSON.stringify(currentValues)
    ) {
      console.log('Using cached submission with appId:', lastSubmitted.appId);
      let obj = {
        selectedVisaType: visaTypeData.find(item => item.value === typeOfVisa)
          ?.label,
        selectedVisaCategory: visaCategoryData.find(
          item => item.value === visaCategory,
        )?.label,
        travelDate: travelDate,
      };
      await AsyncStorage.setItem('visaDetails', JSON.stringify(obj));
      navigation.navigate('TravelDetails', {
        visaId,
        appId: lastSubmitted.appId,
        countryName,
        visaGaurrentedOn,
        additionalDocuments,
        travelDate,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await createVisaAPI(currentValues);
      if (response?.data?.status) {
        const appId = response?.data?.data?.id;
        console.log('Received appId:', appId);

        dispatch(addTravelersAppID(appId));

        setLastSubmitted({...currentValues, appId});
        let obj = {
          selectedVisaType: visaTypeData.find(item => item.value === typeOfVisa)
            ?.label,
          selectedVisaCategory: visaCategoryData.find(
            item => item.value === visaCategory,
          )?.label,
          travelDate: travelDate,
        };
        await AsyncStorage.setItem('visaDetails', JSON.stringify(obj));

        navigation.navigate('TravelDetails', {
          visaId,
          appId,
          countryName,
          visaGaurrentedOn,
          additionalDocuments,
          travelDate,
        });
      }
    } catch (e) {
      console.log('Error creating visa:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const onBack = async () => {
    console.log('welcome')
    await AsyncStorage.removeItem('visaDetails');
    isExplore
      ? navigation.navigate('Bottom',{
        screen:"Explore"
      })
      : navigation.navigate('VisaInfo', {visaID: visaId});
  };

  const handleDateConfirm = date => {
    setTravelDate(dayjs(date).format('YYYY-MM-DD'));
    setOpenDatePicker(false);
  };

  const disabled = !visaCategory || !typeOfVisa || !travelDate;

  return (
    <Container
      showHeader={false}
      contentContainerStyle={{flex: 1, backgroundColor: COLORS.APP_WHITE}}>
      <HeaderWithBack title={'Traveler Details'} onBack={onBack} />
      <View
        style={{
          marginTop: 10,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.APP_GRAY_LIGHT,
          paddingBottom: 10,
        }}>
        <StepProcess step={1} />
      </View>
      {visaCategoryData?.length > 0 ? (
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.APP_WHITE,
          }}>
          <ScrollView style={{flex: 1, marginBottom: 20}}>
            <View style={{marginTop: 20, paddingHorizontal: 16}}>
              <Typography
                title={'Types of Visa'}
                font={FONTS.INTER_MEDIUM}
                size={16}
              />
              <FlatList
                data={visaTypeData}
                numColumns={2}
                columnWrapperStyle={{
                  justifyContent: 'space-between',
                  marginBottom: 10,
                  marginTop: 16,
                }}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => setTypeOfVisa(item.value)}
                      style={[
                        styles.requireDocument,
                        {
                          borderColor:
                            item.value === typeOfVisa
                              ? COLORS.APP_PRIMARY_MAIN
                              : COLORS.APP_BORDER,
                        },
                      ]}>
                      <View
                        style={{
                          backgroundColor:
                            item.value === typeOfVisa ? '#EFF6FF' : '#F3F4F6',
                          height: 50,
                          width: 50,
                          borderRadius: 50,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={icon[item?.value]}
                          style={{
                            height: 26,
                            width: 26,
                            resizeMode: 'contain',
                            tintColor:
                              item.value === typeOfVisa
                                ? COLORS.APP_PRIMARY
                                : COLORS.APP_GRAY,
                          }}
                        />
                      </View>
                      <Text style={styles.requiredDocumentLabel}>
                        {item?.label}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
              {/* <Dropdown
              style={{
                borderWidth: 1,
                borderColor: '#D7D7D7',
                height: 56,
                borderRadius: 10,
                paddingHorizontal: 10,
                marginTop: 14,
              }}
              placeholderStyle={{
                color: COLORS.APP_COMMON_PLACEHOLDER || '#999',
                fontSize: 16,
                fontFamily: FONTS.INTER_REGULAR,
              }}
              selectedTextStyle={{
                color: COLORS.APP_BLACK || '#000',
                fontSize: 16,
                fontFamily: FONTS.INTER_REGULAR,
              }}
              data={visaTypeData}
              labelField="label"
              valueField="value"
              placeholder="Select Visa Type"
              value={typeOfVisa}
              onChange={item => setTypeOfVisa(item.value)}
              renderItem={(item, selected) => (
                <View
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 12,
                    backgroundColor: selected
                      ? 'rgba(203, 31, 31, 0.05)'
                      : COLORS.APP_COMMON_WHITE,
                    borderBottomColor: '#E1E1E1',
                    borderBottomWidth: 1,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: FONTS.INTER_REGULAR,
                      color: selected ? '#DD0A0A' : COLORS.APP_COMMON_BLACK,
                    }}>
                    {item.label}
                  </Text>
                </View>
              )}
            /> */}
            </View>

            <View style={{marginTop: 20, paddingHorizontal: 16}}>
              <Typography
                title={'Visa Category'}
                font={FONTS.INTER_MEDIUM}
                size={16}
              />

              <FlatList
                data={visaCategoryData}
                numColumns={3}
                disableScrollViewPanResponder
                columnWrapperStyle={{
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
                contentContainerStyle={{
                  backgroundColor: '#F3F4F6',
                  marginTop: 16,
                  borderRadius: 10,
                  padding: 12,
                }}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      style={{
                        backgroundColor:
                          item?.value === visaCategory
                            ? COLORS.APP_WHITE
                            : 'transparent',
                        padding: 10,
                        borderRadius: 50,
                        // elevation: 2,
                        // shadowColor: '#000',
                        // shadowOffset: {width: 0, height: 0},
                        // shadowOpacity: 0.05,
                        // shadowRadius: 2,
                      }}
                      onPress={() => setVisaCategory(item.value)}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: FONTS.INTER_REGULAR,
                          color:
                            item?.value === visaCategory
                              ? COLORS.APP_BLACK
                              : '#4B5563',
                        }}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
              {/* <Dropdown
              style={{
                borderWidth: 1,
                borderColor: '#D7D7D7',
                height: 56,
                borderRadius: 10,
                paddingHorizontal: 10,
                marginTop: 14,
              }}
              placeholderStyle={{
                color: COLORS.APP_COMMON_PLACEHOLDER || '#999',
                fontSize: 16,
                fontFamily: FONTS.INTER_REGULAR,
              }}
              selectedTextStyle={{
                color: COLORS.APP_BLACK || '#000',
                fontSize: 16,
                fontFamily: FONTS.INTER_REGULAR,
              }}
              data={visaCategoryData}
              labelField="label"
              valueField="value"
              placeholder="Select Category"
              value={visaCategory}
              onChange={item => setVisaCategory(item.value)}
              renderItem={(item, selected) => (
                <View
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 12,
                    backgroundColor: selected
                      ? 'rgba(203, 31, 31, 0.05)'
                      : COLORS.APP_COMMON_WHITE,
                    borderBottomColor: '#E1E1E1',
                    borderBottomWidth: 1,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: FONTS.INTER_REGULAR,
                      color: selected ? '#DD0A0A' : COLORS.APP_COMMON_BLACK,
                    }}>
                    {item.label}
                  </Text>
                </View>
              )}
            /> */}
            </View>

            <View style={{marginTop: 20, paddingHorizontal: 16}}>
              <Typography
                title={'Select Date'}
                font={FONTS.INTER_MEDIUM}
                size={16}
              />
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: '#D7D7D7',
                  height: 56,
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  marginTop: 14,
                  justifyContent: 'center',
                  backgroundColor: COLORS.APP_WHITE,
                }}
                onPress={() => setOpenDatePicker(true)}>
                <Text
                  style={{
                    color: travelDate
                      ? COLORS.APP_BLACK
                      : COLORS.APP_COMMON_PLACEHOLDER || '#999',
                    fontSize: 16,
                    fontFamily: FONTS.INTER_REGULAR,
                  }}>
                  {travelDate
                    ? dayjs(travelDate).format('DD MMM, YYYY')
                    : 'Select Travel Date'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Date Picker Modal */}
          <DateTimePicker
            isVisible={openDatePicker}
            mode="date"
            onConfirm={handleDateConfirm}
            onCancel={() => setOpenDatePicker(false)}
            minimumDate={getMinimumDate()}
            date={travelDate ? new Date(travelDate) : getMinimumDate()}
            buttonTextColorIOS={COLORS.APP_PRIMARY_MAIN}
            pickerContainerStyleIOS={{
              backgroundColor: 'white',
            }}
            themeVariant="light"
          />

          {/* Bottom Button */}
          <View
            style={{
              paddingVertical: 20,
              paddingBottom: 30,
              backgroundColor: COLORS.APP_WHITE,
              borderTopColor: COLORS.APP_BORDER,
              borderTopWidth: 1,
            }}>
            <Button
              onPress={onClickNextButton}
              loading={isLoading}
              title="Continue"
              disabled={disabled}
            />
          </View>
        </View>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator color={COLORS.APP_PRIMARY_MAIN} size={24} />
        </View>
      )}
    </Container>
  );
};

export default Traveller;
