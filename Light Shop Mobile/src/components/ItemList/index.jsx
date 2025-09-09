import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialDesignIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../../theme/colors';
import {Images} from '../../constants';
import {Icon, Typography} from '..';
import {FONTS} from '../../constants/fonts';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';

const ItemList = ({onPress, type = true, item, onPressDeleteIcon,isCustomer =false}) => {
  const user = useSelector(state => state.auth.user);
  return (
    <View style={styles.listContainer}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
        {item?.PersonalInfo?.profilePic ? (
          <FastImage
            source={{uri: item?.PersonalInfo?.profilePic}}
            style={styles.userPicture}
          />
        ) : (
          <Image source={Images.user} style={styles.userPicture} />
        )}
        <View>
          {item?.BasicInfo?.firstName ? (
            <Typography
              title={
                item?.BasicInfo?.firstName + ' ' + item?.BasicInfo?.lastName
              }
              size={18}
              font={FONTS.INTER_MEDIUM}
            />
          ) : (
            <Typography
              title={'Customer Name'}
              size={18}
              font={FONTS.INTER_MEDIUM}
            />
          )}
          {item?.BasicInfo.empId && (
            <Typography
              title={`${isCustomer ? "Customer Id" :!type ? 'Dealer Id' : 'Staff Id'}: ${
                item?.BasicInfo.empId
              }`}
              size={12}
              font={FONTS.INTER_REGULAR}
              color={COLORS.APP_GRAY}
            />
          )}

          {type && item?.BasicInfo?.position && (
            <Typography
              title={`Position: ${item?.BasicInfo?.position || 'N/A'}`}
              size={12}
              font={FONTS.INTER_REGULAR}
              color={COLORS.APP_GRAY}
            />
          )}
        </View>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
        <TouchableOpacity onPress={onPress}>
          <AntDesign name="eye" size={24} color={COLORS.APP_GRAY} />
        </TouchableOpacity>
        {user?.role !== 'staff' && (
          <TouchableOpacity onPress={onPressDeleteIcon}>
            <AntDesign name="close" size={20} color="red" />
          </TouchableOpacity>
        )}
      </View>
      {/* <Icon
        icon="Entypo"
        name="chevron-thin-right"
        size={22}
        color={COLORS.APP_BLACK}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    borderWidth: 1,
    borderColor: COLORS.APP_LIGHT_GRAY,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userPicture: {
    width: 56,
    height: 56,
    borderRadius: 50,
    marginRight: 10,
  },
});

export default ItemList;
