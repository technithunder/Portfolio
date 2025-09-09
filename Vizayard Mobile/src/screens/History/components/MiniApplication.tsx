import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import FastImage from 'react-native-fast-image';
import dayjs from 'dayjs';
import styles from './styles';
import {
  applicationStatusBgColor,
  applicationStatusText,
  applicationStatusTextColor,
  Images,
} from '../../../config';
import {MiniApplicationProps} from '../types';
import moment from 'moment';
import {FONTS} from '../../../config/font';

const MiniApplication: FC<MiniApplicationProps> = props => {
  const {item} = props;
  return (
    <TouchableOpacity style={styles.applicationItemStyle} {...props}>
      <FastImage
        source={{uri: item?.visaDetail?.basicDetails?.coverImage[0]}}
        style={styles.countryImage}
      />
      <View style={{padding: 12}}>
        <Text style={styles.txtCountryName}>
          {item?.visaDetail?.basicDetails?.countryName}
        </Text>
        <View style={styles.durationSection}>
          <Image source={Images.calender} style={{height: 16, width: 16,resizeMode:"contain"}} />
          <Text style={styles.duration}>Applied:</Text>
          <Text style={{fontSize: 14, fontFamily: FONTS.INTER_REGULAR}}>
            {moment(item?.createdAt).format('DD MMMM, YYYY')}
          </Text>
        </View>
        <View style={styles.durationSection}>
          <Image source={Images.calenderTick} style={{height: 16, width: 16,resizeMode:"contain"}} />
          <Text style={styles.duration}>Est. Approval:</Text>
          <Text style={{fontSize: 14, fontFamily: FONTS.INTER_REGULAR}}>
            {moment(item?.visaDetail?.visaDetails?.visaGaurrentedOn).format(
              'DD MMMM, YYYY',
            )}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.statusView,
          {
            backgroundColor:
              applicationStatusBgColor[
                item.status as keyof typeof applicationStatusBgColor
              ],
          },
        ]}>
        <Text
          style={[
            styles.txtStatus,
            {
              color:
                applicationStatusTextColor[
                  item.status as keyof typeof applicationStatusTextColor
                ],
            },
          ]}>
          {
            applicationStatusText[
              item.status as keyof typeof applicationStatusText
            ]
          }
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default MiniApplication;
