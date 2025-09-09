import {View} from 'react-native';
import React, {FC} from 'react';
import styles from './styles';
import {colors, commonSty} from '../../../theme';
import {Typography} from '../../../components';
import {OrderCardProps} from '../../orders/types';

const OrderDetailCard: FC<OrderCardProps> = props => {
  const {order} = props;
  
  return (
    <View style={styles.orderDetailContainer}>
      <View style={commonSty.rowSpaceBetween}>
        <Typography title={'Order Number'} size={13} color={colors.osloGrey} />
        <Typography title={order?.orderNumber} size={13} weight="medium" />
      </View>
      
      <View style={[commonSty.rowSpaceBetween,{marginTop:5}]}>
        <Typography
          title={'Customer Name'}
          size={13}
          color={colors.osloGrey}
        />
        <Typography 
          title={order?.customerName || `${order?.user?.firstName} ${order?.user?.lastName}`} 
          size={13} 
          weight="medium"
        />
      </View>

      <View style={[commonSty.rowSpaceBetween,{marginTop:5}]}>
        <Typography
          title={'Customer email'}
          size={13}
          color={colors.osloGrey}
        />
        <Typography 
          title={order?.user?.email} 
          size={13} 
          weight="medium"
        />
      </View>
      
      {/* <View style={[commonSty.rowSpaceBetween, {marginVertical: 8}]}>
        <Typography
          title={'Total Amount'}
          size={13}
          color={colors.osloGrey}
        />
        <Typography title={`${order?.totalAmount?.toFixed(2)}`} size={13} weight="medium" />
      </View>
      
      <View style={[commonSty.rowSpaceBetween, {marginVertical: 8}]}>
        <Typography
          title={'Total Items'}
          size={13}
          color={colors.osloGrey}
        />
        <Typography title={`${order?.totalItems} item${order?.totalItems > 1 ? 's' : ''}`} size={13} weight="medium" />
      </View> */}
      
      <View style={[commonSty.rowSpaceBetween,]}>
        <Typography
          title={'Order Date'}
          size={13}
          color={colors.osloGrey}
        />
        <Typography 
          title={new Date(order?.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })} 
          size={13} 
          weight="medium"
        />
      </View>
    </View>
  );
};

export default OrderDetailCard;