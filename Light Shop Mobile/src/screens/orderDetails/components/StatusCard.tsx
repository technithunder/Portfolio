import {View} from 'react-native';
import React from 'react';
import {colors, commonSty} from '../../../theme';
import {TouchableImage, Typography} from '../../../components';
import styles from './styles';

const StatusCard = (props: any) => {
  const {order} = props;
  return (
    <View style={styles.statusContainer}>
      <View style={[commonSty.ml20, {width: '70%'}]}>
        <Typography title={order?.order_message} color={colors.white} />
        <Typography
          title={'Rate product to get 5 points for collect.'}
          color={colors.white}
          mt={10}
          size={10}
        />
      </View>
      <TouchableImage
        activeOpacity={1}
        source={order?.image}
        imageStyle={commonSty.size(55)}
      />
    </View>
  );
};

export default StatusCard;
