import {View} from 'react-native';
import React, {FC} from 'react';
import {Button, Typography} from '../../../components';
import {colors, commonSty} from '../../../theme';
import styles from './styles';
import {OrderCardProps} from '../types';
import { orderStatus } from '../../../constants/data';



const OrderCard: FC<OrderCardProps> = props => {
  const {item, onPress} = props;
  return (
    <View style={styles.orderCardContainer}>
      <View style={commonSty.rowSpaceBetween}>
        <Typography title={`Order #${item.orderNumber}`} />
        <Typography title={item.date} size={12} color={colors.slateGrey} />
      </View>

      {/* <Typography size={14} color={colors.slateGrey} mv={15}>
        Tracking number:
        <Typography title={` ${item.trackingNumber}`} size={14} />
      </Typography> */}

      <View style={commonSty.rowSpaceBetween}>
        <Typography size={14} color={colors.slateGrey}>
          Quantity: <Typography title={` ${item?.totalItems}`} size={14} />
        </Typography>
        <Typography size={14} color={colors.slateGrey}>
          Subtotal: <Typography title={`₹ ${item?.totalAmount?.toFixed()}`} size={14} />
        </Typography>
      </View>

      <View style={[commonSty.rowSpaceBetween, commonSty.mv20]}>
        <Typography title={orderStatus[item.status]} color={colors.rustyOrange} size={16} />
        <Button
          title="Details"
          width={100}
          height={35}
          backgroundColor={colors.white}
          borderColor={colors.slateGrey}
          borderRadius={50}
          txtClr={colors.black}
          txtSize={14}
          onPress={onPress}
        />
      </View>
    </View>
  );
};

export default OrderCard;
