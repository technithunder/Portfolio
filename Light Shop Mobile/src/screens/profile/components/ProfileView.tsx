import {Image, TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import {colors, commonSty} from '../../../theme';
import {Icon, TouchableImage, Typography} from '../../../components';
import {Images} from '../../../constants';
import {useSelector} from 'react-redux';
import {getUser} from '../../../redux';
import styles from './styles';
import {ProfileViewProps} from '../types';
import {moderateScale} from 'react-native-size-matters';
import {FONTS} from '../../../constants/fonts';
import {COLORS} from '../../../theme/colors';

const ProfileView: FC<ProfileViewProps> = props => {
  const userData = useSelector(state => state.auth.user);
  const userName = userData?.firstName + ' ' + userData?.lastName;
  return (
    <View style={[commonSty.rowSpaceBetween, commonSty.ph20]} {...props}>
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
        <Typography
          title={`${userData?.firstName} ${userData?.lastName}`}
          font={FONTS.INTER_SEMIBOLD}
          size={16}
        />
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
        color={colors.primary}
        onPress={props.onPress}
      />
    </View>
  );
};

export default ProfileView;
