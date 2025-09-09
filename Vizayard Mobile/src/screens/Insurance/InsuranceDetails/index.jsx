import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import HeaderWithBack from '../../../components/HeaderWithBack';
import {Container, Icon, Typography} from '../../../components';
import {COLORS} from '../../../config/colors';
import Button from '../../../components/button';
import {FONTS} from '../../../config/font';
import {goBack} from '../../../utils';

const InsuranceDetails = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [data, setData] = useState(null);
  const destination = require('../../../../assets/images/destination.png');
  const duration = require('../../../../assets/images/duration.png');
  const travellers = require('../../../../assets/images/travellers.png');
  const right = require('../../../../assets/images/right.png');
  const clock = require('../../../../assets/images/clock.png');
  const phone = require('../../../../assets/images/phone.png');
  const moneyBack = require('../../../../assets/images/moneyBack.png');


  const details = route?.params;
  console.log(details);

  const country = details?.country?.name;
  const durations = details?.days;

  const onBack = async () => {
    navigation.goBack();
  };

  const onClickNextButton = async () => {
    setIsLoading(true);
  };

  const info = () => {
    console.log('infooooo');
  };

  const tripDetails = [
    {id: 1, icon: destination, title: 'Destination', details: country},
    {id: 2, icon: duration, title: 'Duration', details: durations},
    {id: 3, icon: travellers, title: 'Travelers', details: '2 Adults'},
  ];

  const planList = [
    {
      id: 1,
      name: 'Essential',
      discription: 'Basic coverage for peace of mind',
      price: `₹${12}/day`,
      totalPrice: 12 * durations,
      facelities: [
        {id: 1, title: 'Medical Emergency up to ₹100K', icon: right},
        {id: 2, title: 'Trip Cancellation up to ₹5K', icon: right},
        {id: 3, title: 'Baggage Loss up to ₹1K', icon: right},
        {id: 4, title: 'Adventure Sports Coverage', icon: right},
      ],
      provider: 'SafeTravel Inc.',
      rating: '4.2',
    },
    {
      id: 2,
      name: 'Premium',
      discription: 'Comprehensive protection',
      price: `₹${20}/day`,
      totalPrice: 20 * durations,
      facelities: [
        {id: 1, title: 'Medical Emergency up to ₹500K', icon: right},
        {id: 2, title: 'Trip Cancellation up to ₹50K', icon: right},
        {id: 3, title: 'Baggage Loss up to ₹5K', icon: right},
        {id: 4, title: '24/7 Global Assistance', icon: right},
      ],
      provider: 'GlobalProtect Ltd.',
      rating: '4.7',
    },
  ];

  const whyChooseUs = [
    {
      id: 1,
      title: '24/7 Claims Support',
      subtitle: 'Get help anytime, anywhere',
      icon: clock,
      bgColor: '#EFF6FF', // Light blue
      color: '#2563EB', // Dark blue
    },
    {
      id: 2,
      title: 'Digital Claims Process',
      subtitle: 'Submit claims via mobile app',
      icon:phone,
      bgColor: '#F0FDF4', // Light green
      color: '#16A34A', // Dark green
    },
    {
      id: 3,
      title: 'Trusted by 2M+ Travelers',
      subtitle: 'Join our satisfied customers',
      icon: travellers,
      bgColor: '#FAF5FF', // Light purple
      color: '#9333EA', // Dark purple
    },
  ];

  const renderTripDetails = ({item}) => {
    return (
      <View style={styles.tripBox}>
        <View
          style={{
            height: 40,
            width: 40,
            backgroundColor: '#EFF6FF',
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image source={item.icon} style={styles.tripIcon} />
        </View>
        <View style={{marginLeft: 12}}>
          <Typography title={item.title} style={styles.tripTitle} />
          <Typography title={item.details} style={styles.tripDetails} />
        </View>
      </View>
    );
  };

  const renderPlanList = ({item}) => {
    const isSelected = selectedPlan === item.id; // ✅ check current plan

    return (
      <View style={styles.planCard}>
        {/* Header */}
        <View style={styles.planHeader}>
          <View>
            <Typography title={item.name} style={styles.planName} />
            <Typography
              title={item.discription}
              style={styles.planDescription}
            />
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Typography
              title={`₹ ${item.totalPrice}`}
              style={styles.planPrice}
            />
            <Typography title={item.price} style={styles.planSubPrice} />
          </View>
        </View>

        {/* Facilities */}
        <View style={{marginTop: 12}}>
          {item.facelities.map((f, index) => (
            <View key={index} style={styles.facilityRow}>
              <Image
                source={f.icon}
                style={{width: 16, height: 16, marginRight: 6}}
              />
              <Typography title={f.title} style={styles.facilityText} />
            </View>
          ))}
        </View>

        {/* Provider */}
        <View style={styles.providerBox}>
          <Typography
            title={`Provider: ${item.provider}`}
            style={styles.providerText}
          />
          <Text style={{marginLeft: 6, color: '#f59e0b'}}>
            {item.rating} ⭐
          </Text>
        </View>

        {/* Select Button */}
        <TouchableOpacity
          style={[
            styles.selectBtn,
            {
              backgroundColor: isSelected
                ? COLORS.APP_PRIMARY
                : COLORS.APP_COMMON_WHITE,
              borderColor: isSelected ? COLORS.APP_PRIMARY : '#E5E7EB',
            },
          ]}
          onPress={() => {
            setSelectedPlan(item.id);
            setData(item); // selected plan ki full details save karne ke liye
          }}>
          <Text
            style={[
              styles.selectBtnText,
              {color: isSelected ? '#fff' : '#374151'},
            ]}>
            {isSelected ? `Selected (${item.name})` : `Select ${item.name}`}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Container showHeader={false} containerStyle={styles.container}>
      <HeaderWithBack
        title={'Traveler Insurance'}
        onBack={onBack}
        // rightIcon={info}


        
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          <View style={{padding: 24}}>
            <Typography
              title={'Trip Details'}
              style={{
                fontSize: 18,
                marginBottom: 10,
                fontFamily: FONTS.INTER_MEDIUM,
              }}
            />
            <FlatList
              data={tripDetails}
              keyExtractor={item => item.id.toString()}
              renderItem={renderTripDetails}
            />

            <TouchableOpacity
              onPress={goBack}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: 45,
                marginTop: 20,
                borderWidth: 1,
                borderRadius: 12,
                borderColor: '#324D75',
              }}>
              <Typography title={'Edit Details'} style={{fontSize: 16}} />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 24,
          }}>
          <Typography
            title={'Choose Your Plan'}
            style={{fontSize: 20, fontFamily: FONTS.INTER_SEMIBOLD}}
          />
          <Typography
            title={'Compare All'}
            style={{
              fontSize: 14,
              fontFamily: FONTS.INTER_REGULAR,
              color: '#324D75',
            }}
          />
        </View>

        <View style={{padding: 24}}>
          <FlatList data={planList} renderItem={renderPlanList} />
        </View>

        {data && (
          <View style={styles.breakdownCard}>
            {/* Title */}
            <Typography
              title="Price Breakdown"
              style={{
                fontSize: 18,
                fontFamily: FONTS.INTER_SEMIBOLD,
                marginBottom: 12,
              }}
            />

            {/* Plan */}
            <View style={styles.rowBetween}>
              <Text
                style={styles.label}>{`${data.name} Plan (2 travelers)`}</Text>
              <Text style={styles.value}>₹{data.totalPrice}</Text>
            </View>

            {/* Daily Rate */}
            <View style={styles.rowBetween}>
              <Text style={styles.subLabel}>
                Daily rate: {data.price} × {durations} days
              </Text>
              <Text style={styles.value}>₹{data.totalPrice}</Text>
            </View>

            {/* Taxes */}
            <View style={styles.rowBetween}>
              <Text style={styles.subLabel}>Taxes & fees</Text>
              <Text style={styles.value}>₹12</Text>
            </View>

            {/* Divider */}
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: '#E5E7EB',
                marginVertical: 12,
              }}
            />

            {/* Total */}
            <View style={styles.rowBetween}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{data.totalPrice + 12}</Text>
            </View>

            {/* Guarantee Box */}
            <View style={styles.guaranteeBox}>
              <Image source={moneyBack} style={{height: 15, width: 15}} />
              <Text style={styles.guaranteeText}>
                30-day money-back guarantee
              </Text>
            </View>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.heading}>Why Choose Us?</Text>

          {whyChooseUs.map(item => (
            <View key={item.id} style={styles.row}>
              <View
                style={[styles.iconCircle, {backgroundColor: item.bgColor}]}>
                <Image source={item.icon} size={20} color={item.color} />
              </View>
              <View style={{marginLeft: 12}}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Continue Button */}
        <View style={styles.footer}>
          <Button
            // onPress={onClickNextButton}
            loading={isLoading}
            title="Continue to Plans"
            // disabled={!selectedCountry || !selectedAge || !days}
          />
        </View>
      </ScrollView>
    </Container>
  );
};

export default InsuranceDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
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
    margin: 25,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  footer: {
    paddingVertical: 20,
    paddingBottom: 50,
    backgroundColor: COLORS.APP_WHITE,
    borderTopColor: COLORS.APP_BORDER,
    borderTopWidth: 1,
  },
  tripBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#E5E7EB',
    gap: 10,
  },
  tripIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  tripTitle: {
    fontSize: 14,
    color: '#374151',
  },
  tripDetails: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  planCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    borderTopWidth: 2,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    backgroundColor: '#fff',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planName: {
    fontSize: 18,
    fontFamily: FONTS.INTER_SEMIBOLD,
  },
  planDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    fontFamily: FONTS.INTER_REGULAR,
  },
  planPrice: {
    fontSize: 24,
    fontFamily: FONTS.INTER_BOLD,
    color: '#111827',
  },
  planSubPrice: {
    fontSize: 14,
    color: '#6B7280',
  },
  facilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 10,
    marginVertical: 10,
  },
  facilityText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: FONTS.INTER_REGULAR,
  },
  providerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    justifyContent: 'space-between',
    padding: 10,
    height: 50,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  providerText: {
    fontSize: 14,
    color: '#4B5563',
    fontFamily: FONTS.INTER_REGULAR,
  },
  selectBtn: {
    marginTop: 16,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  selectBtnText: {
    color: '#374151',
    fontSize: 16,
    fontFamily: FONTS.INTER_REGULAR,
  },
  breakdownCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 25,
    marginBottom:20,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 7,
  },
  label: {
    fontSize: 16,
    color: '#4B5563',
    fontFamily: FONTS.INTER_REGULAR,
  },
  subLabel: {
    fontSize: 14,
    color: '#4B5563',
    fontFamily: FONTS.INTER_REGULAR,
  },
  value: {
    fontSize: 14,
    color: '#111827',
    fontFamily: FONTS.INTER_SEMIBOLD,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: FONTS.INTER_SEMIBOLD,
    color: '#111827',
  },
  totalValue: {
    fontSize: 18,
    fontFamily: FONTS.INTER_BOLD,
    color: COLORS.APP_PRIMARY,
  },
  guaranteeBox: {
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 12,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 50,
  },
  guaranteeText: {
    fontSize: 14,
    color: '#15803D',
    fontFamily: FONTS.INTER_MEDIUM,
  },
  card: {
  backgroundColor: '#fff',
  padding: 16,
  marginHorizontal: 25,
  marginBottom:20,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#E5E7EB',
  elevation: 2,
},
heading: {
  fontSize: 18,
  fontWeight: '700',
  marginBottom: 16,
  color: '#111827',
},
row: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 14,
  gap:8
},
iconCircle: {
  width: 40,
  height: 40,
  borderRadius: 20,
  alignItems: 'center',
  justifyContent: 'center',
},
title: {
  fontSize: 15,
  fontFamily:FONTS.INTER_REGULAR,
  color: '#111827',
  lineHeight:20
},
subtitle: {
  fontSize: 13,
  color: '#6B7280',
  marginTop:4
},

});
