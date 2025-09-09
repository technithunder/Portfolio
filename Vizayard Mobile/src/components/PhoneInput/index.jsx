import React, {useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  VirtualizedList,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {data} from './country.json';
import {COLORS} from '../../config/colors';
import {FONTS} from '../../config/font';
import BottomDrawer from '../BottomDrawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PhoneInput = ({
  onSelectCountry,
  onChangeText,
  value,
  placeholder,
  setPhoneInputValue,
}) => {
  const [visible, setVisible] = useState(false);
  const deviceHeight = Dimensions.get('window').height;
  const [selectedCountry, setSelectedCountry] = useState(
    data.find(country => country.country === 'India'),
  );
  const [searchQuery, setSearchQuery] = useState('');
  const filteredCountries = data.filter(country =>
    country.country.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getItemCount = () => filteredCountries.length;

  const getItem = (data, index) => filteredCountries[index];

  const handleCountrySelect = country => {
    setSelectedCountry(country);
    onSelectCountry(country);
    setVisible(false);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.numberInput}>
        <TouchableOpacity
          onPress={() => setVisible(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            width: '20%',
          }}>
          <Text style={styles.countryFlag}>{selectedCountry?.flag}</Text>
          <Entypo name="chevron-down" size={16} />
        </TouchableOpacity>
        <View style={{width: '80%'}}>
          <TextInput
            placeholder={placeholder || 'Enter Phone number'}
            style={styles.input}
            value={value}
            onChangeText={setPhoneInputValue}
            maxLength={selectedCountry?.phone_number_limit || 10}
            placeholderTextColor={COLORS.APP_DIVIDER}
            keyboardType="number-pad"
          />
        </View>
      </View>
      <BottomDrawer
        isCountry={true}
        visible={visible}
        onClose={() => setVisible(false)}
        height={deviceHeight}
        duration={400}>
        <SafeAreaView
          style={{
            flex: 1,
            marginHorizontal: 20,
            paddingTop: Platform.OS === 'android' ? 20 : 0,
          }}>
          <TouchableOpacity onPress={() => setVisible(false)}>
            <Ionicons name="chevron-back" size={26} />
          </TouchableOpacity>
          <View style={{marginTop: 20}}>
            <Text
              style={
                styles.txtHeading
              }>{`Which country’s password \n do you held ?`}</Text>
          </View>
          <View style={styles.searchInput}>
            <TextInput
              placeholder="Search for a country"
              style={styles.searchField}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={COLORS.APP_GRAY}
            />
            <View style={{width: '10%'}}>
              <Ionicons name="search" size={20} />
            </View>
          </View>

          <View style={{marginTop: 30}}>
            <VirtualizedList
              data={filteredCountries}
              getItemCount={getItemCount}
              getItem={getItem}
              contentContainerStyle={{paddingBottom: 240}}
              renderItem={({item}) => {
                const isDisabled = item.country !== 'India';
              
                return (
                  <TouchableOpacity
                    disabled={isDisabled}
                    style={[
                      styles.countryItem,
                      isDisabled && {opacity: 0.5}, // Make visually disabled
                    ]}
                    onPress={() => {
                      if (!isDisabled) handleCountrySelect(item);
                    }}>
                    <Text style={styles.countryFlag}>{item.flag}</Text>
                    <Text style={styles.countryName}>{item.country}</Text>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item, index) => index}
            />
          </View>
        </SafeAreaView>
      </BottomDrawer>
    </SafeAreaView>
  );
};

export default PhoneInput;

const styles = StyleSheet.create({
  numberInput: {
    height: 45,
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.APP_DIVIDER,
    borderStyle: 'solid',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtHeading: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: FONTS.INTER_MEDIUM,
  },
  flag: {
    height: 24,
    width: 24,
    borderRadius: 2,
  },
  input: {
    fontSize: 14,
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_MEDIUM,
  },
  searchInput: {
    backgroundColor: COLORS.APP_WHITE,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
    height: 50,
    paddingHorizontal: 20,
    shadowColor: '#D9D9D9',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.APP_GRAY,
  },
  searchField: {
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_MEDIUM,
    marginRight: 10,
    width: '90%',
  },
  countryItem: {
    backgroundColor: COLORS.APP_WHITE,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 10,
    shadowColor: '#D9D9D9',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryFlag: {
    fontSize: 20,
  },
  countryName: {
    fontSize: 16,
    fontFamily: FONTS.INTER_MEDIUM,
    color: COLORS.APP_BLACK,
    marginLeft: 10,
  },
});
