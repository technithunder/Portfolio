import {View} from 'react-native';
import React, {FC} from 'react';
import styles from './styles';
import {Typography} from '../../../components';
import {colors} from '../../../theme';
import {MiniNotifyProps} from '../types';

const MiniNotify: FC<MiniNotifyProps> = props => {
  const {item} = props;
  return (
    <View style={styles.miniNotifyContainer}>
      <Typography title={item.title} size={16} />
      <Typography
        title={item?.description}
        color={colors.cloudyGrey}
        size={12}
        mt={5}
      />
    </View>
  );
};

export default MiniNotify;
