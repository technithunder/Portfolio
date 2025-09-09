import {Text, TouchableOpacity, View} from 'react-native';
import React, {FC, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {commonSty} from '../../../theme';
import {Images} from '../../../config';
import styles from './styles';
import {COLORS} from '../../../config/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {navigate} from '../../../utils';
import {CountryProps} from '../types';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const Country: FC<CountryProps> = props => {
  const {item} = props;
  const [imageLoading, setImageLoading] = useState(true);
  const onPressVisa = () => {
    navigate('VisaInfo', {visaID: item?.id});
  };
  return (
    <TouchableOpacity
      onPress={onPressVisa}
      style={styles.countryCard}
      activeOpacity={0.4}>
      <View>
        <FastImage
          source={{
            uri: item?.basicDetails?.coverImage[0]
              ? item?.basicDetails?.coverImage[0]
              : item?.basicDetails?.coverImage[0]
          }}
          style={styles.countryImage}
          onLoad={() => setImageLoading(false)}>
          {imageLoading && (
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item
                width={240}
                height={120}
                borderRadius={10}
                alignSelf="center"
                zIndex={-999}
                position="absolute"
                top={0}
                bottom={0}
                left={0}
                right={0}
              />
            </SkeletonPlaceholder>
          )}
        </FastImage>
      </View>
      <View style={styles.countryChip}>
        <MaterialCommunityIcons
          name="flag-variant-outline"
          size={14}
          color={COLORS.APP_PRIMARY_MAIN}
        />
        <Text style={styles.txtCountryChip}>
          {item?.basicDetails?.countryName}
        </Text>
      </View>
      <View style={commonSty.m10}>
        <Text style={styles.txtCountryName}>
          {item?.basicDetails?.countryName}
        </Text>
        <View style={styles.duractionSection}>
          <FastImage
            source={Images.watch}
            style={commonSty.size(14)}
            resizeMode="contain"
          />
          <Text
            style={
              styles.txtDuration
            }>{`${item?.basicDetails?.expectedTime} days`}</Text>
        </View>
        <View style={styles.priceSection}>
          <Text style={styles.txtPrice}>
            ₹{parseInt(item?.visaDetails?.visaFee) || 0}
          </Text>
          <Text
            style={
              styles.txtSuccessRate
            }>{`${item?.basicDetails?.successRate}% success`}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Country;
