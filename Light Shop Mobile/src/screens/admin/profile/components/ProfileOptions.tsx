import {TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import {moderateScale} from 'react-native-size-matters';
import styles from './styles';
import {ProfileOptionsProps} from '../types';
import FastImage from 'react-native-fast-image';
import { commonSty } from '../../../../theme';
import { Icon, Typography } from '../../../../components';
import { COLORS } from '../../../../theme/colors';
import { FONTS } from '../../../../constants/fonts';

const ProfileOptions: FC<ProfileOptionsProps> = props => {
  const {item} = props;
  const handleItemPress = () => {
    if (item.onPress) {
      item.onPress();
    } else {
      props.onPress();
    }
  };
  return (
    <TouchableOpacity
      style={styles.profileItemContainer}
      activeOpacity={0.7}
      onPress={handleItemPress}>
      <View style={styles.profileItemTextContainer}>
        {item?.image ? (
          <FastImage source={item.image} style={commonSty.size(18)} />
        ) : (
          <Icon
            icon={item.icon}
            name={item.icoName}
            size={moderateScale(16)}
            color={COLORS.APP_PRIMARY}
          />
        )}

        <Typography
          title={item.title}
          ml={10}
          size={14}
          font={FONTS.INTER_REGULAR}
        />
      </View>
      <Icon icon="AntDesign" name="right" size={15} color={COLORS.APP_PRIMARY} />
    </TouchableOpacity>
  );
};

export default ProfileOptions;
