import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Button, Container, Icon, Typography} from '../../components';
import {COLORS} from '../../config/colors';
import {FONTS} from '../../config/font';
import HeaderWithBack from '../../components/HeaderWithBack';
import {Dropdown} from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useRoute} from '@react-navigation/native';

const Insurance = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {visaId} = route.params || {};

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedAge, setSelectedAge] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [days, setDays] = useState(1);

  const minus = require('../../../assets/images/minus.png');
  const add = require('../../../assets/images/add.png');
  const medical = require('../../../assets/images/medical.png');
  const plan = require('../../../assets/images/plan.png');
  const bagage = require('../../../assets/images/bagage.png');

  const countries = [
    {name: 'United States', code: 'us'},
    {name: 'United Kingdom', code: 'gb'},
    {name: 'Canada', code: 'ca'},
    {name: 'India', code: 'in'},
    {name: 'Australia', code: 'au'},
  ];

  const ageData = [
    {id: '1', title: '18-30'},
    {id: '2', title: '31-45'},
    {id: '3', title: '46-60'},
    {id: '4', title: '60+'},
  ];

  const insurance = [
    {id: 1, title: 'Medical emergency coverage', Icon: medical},
    {id: 2, title: 'Trip cancellation protection', Icon: plan},
    {id: 3, title: 'Baggage loss coverage', Icon: bagage},
  ];

  const onBack = async () => {
    navigation.navigate('Home');
  };

  const onClickNextButton = async () => {
    // setIsLoading(true);

    navigation.navigate('InsuranceDetails', {
      country: selectedCountry,
      ageGroup: selectedAge,
      days: days,
    });
  };

  const renderAge = ({item}) => (
    <TouchableOpacity
      style={[
        styles.ageBox,
        selectedAge?.id === item.id && styles.ageBoxSelected,
      ]}
      onPress={() => setSelectedAge(item)}>
      <Typography
        title={item.title}
        style={[
          styles.ageText,
          {
            color:
              selectedAge?.id === item.id ? COLORS.APP_WHITE : COLORS.APP_BLACK,
          },
        ]}
      />
    </TouchableOpacity>
  );

  const renderInsurance = ({item}) => (
    <View style={styles.insuranceBox}>
      <Image source={item.Icon} style={styles.insuranceIcon} />
      <Typography title={item.title} style={styles.insuranceText} />
    </View>
  );

  return (
    <Container showHeader={false} containerStyle={styles.container}>
      <Text style={styles.txtProfile}>Travel Insurance</Text>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          <View style={{padding: 24}}>
            <Typography title={'Tell us about your trip'} />

            {/* Country Dropdown */}
            <View style={{marginTop: 30}}>
              <Typography title={'Destination Country'} style={styles.label} />

              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={countries}
                labelField="name"
                valueField="code"
                value={selectedCountry?.code}
                onChange={item => setSelectedCountry(item)}
                placeholder="Select a country"
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
                        color: selected
                          ? COLORS.APP_PRIMARY
                          : COLORS.APP_COMMON_BLACK,
                      }}>
                      {item.name}
                    </Text>
                  </View>
                )}
              />
            </View>

            {/* Age Group */}
            <View style={{marginTop: 25}}>
              <Typography title={'Age Group'} style={styles.label} />
              <FlatList
                data={ageData}
                renderItem={renderAge}
                keyExtractor={item => item.id}
                numColumns={2}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{marginTop: 14}}
              />
            </View>

            <View style={{marginTop: 20}}>
              <Typography
                title={'Duration of Insurance'}
                style={styles.label}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 25,
                }}>
                <TouchableOpacity
                  onPress={() => setDays(days => (days == 1 ? days : days - 1))}
                  style={{
                    backgroundColor: '#F3F4F6',
                    height: 30,
                    width: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 8,
                    borderColor: '#E5E7EB',
                  }}>
                  <Image source={minus} style={{height: 20, width: 20}} />
                </TouchableOpacity>
                <Typography title={`${days}  days`} />
                <TouchableOpacity
                  onPress={() => setDays(days => days + 1)}
                  style={{
                    backgroundColor: '#F3F4F6',
                    height: 30,
                    width: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 8,
                    borderColor: '#E5E7EB',
                  }}>
                  <Image source={add} style={{height: 20, width: 20}} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{margin: 20, backgroundColor: '#DBEAFE', borderRadius: 12}}>
          <View style={{padding: 16}}>
            <Typography
              title={'Why choose travel insurance?'}
              style={{
                fontSize: 18,
                fontFamily: FONTS.INTER_MEDIUM,
                color: '#2563EB',
                marginBottom: 10,
              }}
            />

            <FlatList
              data={insurance}
              renderItem={renderInsurance}
              keyExtractor={item => item.id.toString()}
            />
          </View>
        </View>

        {/* Continue Button */}
        <View style={styles.footer}>
          <Button
            onPress={onClickNextButton}
            loading={isLoading}
            title="Continue to Plans"
            disabled={!selectedCountry || !selectedAge || !days}
          />
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  txtProfile: {
    fontFamily: FONTS.INTER_BOLD,
    color: COLORS.APP_BLACK,
    fontSize: 22,
    marginTop: 16,
    paddingHorizontal:16
  },
  scrollView: {
    flex: 1,
  },
  mainContainer: {
    elevation: 3,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#D7D7D7',
    height: 56,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 14,
  },
  placeholderStyle: {
    color: COLORS.APP_COMMON_PLACEHOLDER || '#999',
    fontSize: 16,
    fontFamily: FONTS.INTER_REGULAR,
  },
  selectedTextStyle: {
    color: COLORS.APP_BLACK || '#000',
    fontSize: 16,
    fontFamily: FONTS.INTER_REGULAR,
  },
  label: {
    fontSize: 14,
    fontFamily: FONTS.INTER_REGULAR,
    letterSpacing: 0.5,
    color: '#374151',
  },
  ageBox: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.APP_COMMON_WHITE,
    width: '48%',
    marginVertical: 6,
    height: 50,
  },
  ageBoxSelected: {
    backgroundColor: COLORS.APP_PRIMARY,
    borderColor: COLORS.APP_PRIMARY,
  },
  ageText: {
    fontSize: 16,
    fontFamily: FONTS.INTER_REGULAR,
  },
  footer: {
    paddingVertical: 20,
    paddingBottom: 120,
    backgroundColor: COLORS.APP_WHITE,
    borderTopColor: COLORS.APP_BORDER,
    borderTopWidth: 1,
  },
  insuranceIcon: {
    height: 20,
    width: 20,
  },
  insuranceText: {
    fontSize: 15,
    fontFamily: FONTS.INTER_REGULAR,
    color: '#374151',
  },

  insuranceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 15,
  },
});

export default Insurance;
