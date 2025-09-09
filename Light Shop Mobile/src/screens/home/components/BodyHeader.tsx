import {TouchableOpacity, View} from 'react-native';
import React, {FC} from 'react';
import {Typography} from '../../../components';
import {colors} from '../../../theme';
import styles from './styles';
import {BodyHeaderProps} from '../types';

const BodyHeader: FC<BodyHeaderProps> = props => {
  const {leftTitle, rightTitle, onRightPress} = props;
  return (
    <View style={styles.bodyHeaderContainer}>
      <Typography title={leftTitle} size={20} />
      <TouchableOpacity onPress={onRightPress}>
        <Typography
          title={rightTitle ? rightTitle : 'View All'}
          size={12}
          color={colors.starDust}
        />
      </TouchableOpacity>
    </View>
  );
};

export default BodyHeader;
