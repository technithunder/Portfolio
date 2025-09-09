import {Image, Text, TouchableOpacity, View} from 'react-native';
import React, {FC, useState} from 'react';
import FastImage from 'react-native-fast-image';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Icon, Typography} from '../../../components';
import {CountryProps} from '../types';
import styles from './styles';
import {FONTS} from '../../../config/font';
import CommonButton from '../../../components/CommonButton';
import {useNavigation} from '@react-navigation/native';

const TrendingCountry: FC<CountryProps> = ({item, onPress, ...props}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [visibleDocuments, setVisibleDocuments] = useState(false);
  const navigation = useNavigation();
  const rightCheck = require('../../../../assets/images/rightTick.png');

  const coverImage =
    item?.basicDetails?.coverImage?.[0] ||
    'https://via.placeholder.com/350x200';

  const applyVisa = (item: typeof yourItemType) => {
    navigation.navigate('Traveller', {
      visaId: item?.id,
      countryName: item?.basicDetails?.countryName,
      visaGaurrentedOn: item?.visaDetails?.visaGaurrentedOn,
      visaProcessingDays: item?.visaDetails?.visaDetails?.visaProcessingDays,
      isExplore: true,
    });
  };

  const getDestinationProfile = id => {
    navigation.navigate('VisaInfo', {visaID: id, isExplore: true});
  };
  return (
    <View style={[styles.trendingItemContainer, {borderRadius: 10}]} {...props}>
      {/* Country Image */}
      {/* Country Image */}
      <View style={{position: 'relative'}}>
        <FastImage
          source={{uri: coverImage, priority: FastImage.priority.high}}
          style={styles.trendingImage}
          resizeMode={FastImage.resizeMode.cover}
          onLoad={() => setImageLoading(false)}
        />

        {imageLoading && (
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              width="100%"
              height={180}
              borderRadius={10}
            />
          </SkeletonPlaceholder>
        )}

        {/* ✅ Success Rate Tag on top-right */}
        {item?.basicDetails?.successRate && (
          <View
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: '#4CAF50',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 16,
              zIndex:9999
            }}>
            <Typography
              title={`${item?.basicDetails?.successRate}% Success Rate`}
              style={{color: '#fff', fontSize: 12, fontWeight: '600'}}
            />
          </View>
        )}
      </View>

      {/* Country Info */}
      <View style={{paddingVertical: 5, paddingHorizontal: 12}}>
        {/* Name + Rating */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={styles.txtTrendingNowCountryTitle}>
            {item?.basicDetails?.countryName ?? 'Unknown Country'}
          </Text>
        </View>

        {/* Visa Type & Application Cost */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 3,
          }}>
          <View
            style={{
              flex: 1,
              height: 60,
              justifyContent: 'space-around',
              backgroundColor: '#F9FAFB',
              paddingHorizontal: 15,
              paddingVertical: 5,

              marginRight: 5,
              borderRadius: 8,
              borderColor: '#E5E7EB',
            }}>
            <Typography
              title="Visa Type"
              style={{
                fontSize: 14,
                color: '#666',
                fontFamily: FONTS.INTER_REGULAR,
              }}
            />
            <Typography
              title={item?.visaDetails?.visaType ?? 'N/A'}
              style={{fontSize: 14, fontFamily: FONTS.INTER_SEMIBOLD}}
            />
          </View>
          <View
            style={{
              flex: 1,
              height: 60,
              justifyContent: 'space-around',
              paddingHorizontal: 15,
              paddingVertical: 5,
              backgroundColor: '#F9FAFB',
              padding: 5,
              marginLeft: 5,
              borderRadius: 8,
              borderColor: '#E5E7EB',
            }}>
            <Typography
              title="Application Cost"
              style={{
                fontSize: 14,
                color: '#666',
                fontFamily: FONTS.INTER_REGULAR,
              }}
            />
            <Typography
              title={item?.visaDetails?.visaFee ?? '—'}
              style={{fontSize: 14, fontFamily: FONTS.INTER_SEMIBOLD}}
            />
          </View>
        </View>

        {/* Required Documents */}
        {item?.documents?.length > 0 && (
          <View style={{marginTop: 10}}>
            <Typography
              title="Required Documents"
              style={{
                fontFamily: FONTS.INTER_REGULAR,
                fontSize: 14,
                marginBottom: 5,
                letterSpacing: 0.5,
              }}
            />

            {/* First 3 Docs */}
            {item.documents.slice(0, 3).map((doc, idx) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 4,
                }}
                key={idx}>
                <Image
                  source={rightCheck}
                  style={{
                    height: 12,
                    width: 12,
                    tintColor: 'green',
                    marginRight: 6,
                  }}
                  resizeMode="contain"
                />
                <Text style={{color: '#4B5563'}}>{doc?.value ?? doc}</Text>
              </View>
            ))}

            {/* Toggle More */}
            {item.documents.length > 3 && (
              <TouchableOpacity
                onPress={() => setVisibleDocuments(prev => !prev)}>
                <Text
                  style={{color: '#2563EB', marginTop: 6, fontWeight: '500'}}>
                  {visibleDocuments
                    ? 'Show less'
                    : `+${item.documents.length - 3} more documents`}
                </Text>
              </TouchableOpacity>
            )}

            {/* Expanded Docs */}
            {visibleDocuments && (
              <View style={{marginTop: 6}}>
                {item.documents.slice(3).map((doc, idx) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 4,
                    }}
                    key={idx}>
                    <Image
                      source={rightCheck}
                      style={{
                        height: 12,
                        width: 12,
                        tintColor: 'green',
                        marginRight: 6,
                      }}
                      resizeMode="contain"
                    />
                    <Text style={{color: '#4B5563'}}>{doc?.value ?? doc}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={{marginTop: 20}}>
          <CommonButton
            btnText={`Start ${item?.basicDetails?.countryName} Application`}
            onPress={() => applyVisa(item)}
            variant={'contained'}
          />
        </View>
        <View style={{marginVertical: 10}}>
          <CommonButton
            btnText={'View Full Country Profile'}
            onPress={() => getDestinationProfile(item?.id)}
          />
        </View>
      </View>
    </View>
  );
};

export default TrendingCountry;
