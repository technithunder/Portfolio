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

const MiniApplication: FC<MiniApplicationProps> = props => {
  const {item} = props;
  return (
    <TouchableOpacity style={styles.applicationItemStyle} {...props}>
      <FastImage
        source={{uri: item?.visaDetail?.basicDetails?.coverImage[0]}}
        style={styles.countryImage}
      />
      <View>
        <Text style={styles.txtCountryName}>
          {item?.visaDetail?.basicDetails?.countryName}
        </Text>
        <View style={styles.durationSection}>
          <Image source={Images.watch} style={{height: 16, width: 16}} />
          <Text style={styles.duration}>
            Applied: {moment(item?.createdAt).format('YYYY-MM-DD')}
          </Text>
        </View>
        <View style={styles.durationSection}>
          <Image source={Images.watch} style={{height: 16, width: 16}} />
          <Text style={styles.duration}>
            Est. Approval:{' '}
            {moment(item?.visaDetail?.visaDetails?.visaGaurrentedOn).format(
              'YYYY-MM-DD',
            )}
          </Text>
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
      </View>
    </TouchableOpacity>
  );
};

export default MiniApplication;
