import {Image, TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import {useSelector} from 'react-redux';
import styles from './styles';
import {ProfileViewProps} from '../types';
import {commonSty} from '../../../../theme';
import {Icon, TouchableImage, Typography} from '../../../../components';
import {Images} from '../../../../constants';
import {FONTS} from '../../../../constants/fonts';
import {COLORS} from '../../../../theme/colors';

const ProfileView: FC<ProfileViewProps> = props => {
  const userData = useSelector(state => state.auth.user);
  const userName = userData?.firstName + ' ' + userData?.lastName;
  return (
    <View
      style={[commonSty.rowSpaceBetween, commonSty.ph20]}
      activeOpacity={0.6}
      {...props}>
      <Image
        source={userData?.image ? {uri: userData?.image} : Images.user}
        style={{
          height: 70,
          width: 70,
          borderRadius: 50,
          borderWidth: 1,
          borderColor: COLORS.APP_LIGHT_GRAY,
        }}
        resizeMode="cover"
      />
      <View style={styles.profileTxtContainer}>
        {userData?.firstName && (
          <Typography
            title={`${userData?.firstName} ${userData?.lastName}`}
            font={FONTS.INTER_SEMIBOLD}
            size={16}
          />
        )}
        <Typography
          title={userData?.email || 'Test@gmail.com'}
          size={12}
          mt={5}
          font={FONTS.INTER_REGULAR}
        />
      </View>
      <Icon
        icon="AntDesign"
        name="edit"
        size={20}
        color={COLORS.APP_BLACK}
        onPress={props.onPress}
      />
    </View>
  );
};

export default ProfileView;
