import React, {useState} from 'react';
import {View, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Icon, TouchableImage, Typography} from '../../../components';
import {colors, commonSty} from '../../../theme';
import AddRemoveBtn from './AddRemoveBtn';
import styles from './styles';
import {
  deleteCartItem,
  toggleSelect,
  updateCart,
} from '../../../redux/cartSlice';
import {FONTS} from '../../../constants/fonts';
import {COLORS} from '../../../theme/colors';

const CartProduct = ({item}) => {
  console.log(item, 'CartProduct item');
  const dispatch = useDispatch();
  const {selected} = useSelector(state => state.cart || {});
  const isSelected = (selected || {})[item.id] || false;
  // const dynamicCheckStyle = {
  //   backgroundColor: isSelected ? colors.seaTurtleGreen : colors.davyGrey,
  // };

  const handleCheckPress = () => {
    dispatch(toggleSelect(item.id));
  };

  const handleUpdateQuantity = async newQuantity => {
    if (newQuantity <= 0) {
      handleDeleteItem();
      return;
    }
    const updatePayload = {
      cartItemId: item.id,
      quantity: newQuantity,
    };

    try {
      await dispatch(updateCart(updatePayload));
    } catch (error) {
      console.error('Error updating cart:', error);
      // Alert.alert('Error', 'Failed to update cart item');
    }
  };

  const handleDeleteItem = () => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from cart?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteCartItem(item.id));
            } catch (error) {
              console.error('Error deleting cart item:', error);
              // Alert.alert('Error', 'Failed to remove item from cart');
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.cartMainContainer}>
      <TouchableImage
        source={{uri: item?.product?.image?.[0]}}
        imageStyle={commonSty.size(40)}
        resizeMode="cover"
      />
      <View style={styles.cartSideContainer}>
        <View style={styles.headerRow}>
          <Typography
            title={item?.product?.productName}
            size={14}
            font={FONTS.INTER_REGULAR}
          />
          {/* <Icon
            icon="MaterialIcons"
            name="delete"
            size={20}
            color={colors.red}
            onPress={handleDeleteItem}
          /> */}
        </View>

        <Icon
          icon="Fontisto"
          name={isSelected ? 'checkbox-active' : 'checkbox-passive'}
          size={14}
          color={COLORS.APP_WHITE}
          onPress={handleCheckPress}
          containerStyle={[styles.cartCheckStyle]}
        />

        <Typography
          title={`₹ ${item?.price.toFixed(2)}`}
          size={14}
          mt={5}
          font={FONTS.INTER_REGULAR}
        />

        <View style={styles.cartSubContainer}>
          <View style={{marginTop: 5}}>
            {item.size && (
              <Typography
                title={`Size: ${item.size}`}
                size={12}
                color={COLORS.APP_LABEL}
                font={FONTS.INTER_REGULAR}
              />
            )}
            {item.bodycolors && (
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                <Typography
                  title={`Body Color:`}
                  size={12}
                  color={COLORS.APP_LABEL}
                  font={FONTS.INTER_REGULAR}
                />
                <View
                  style={{
                    height: 14,
                    width: 14,
                    borderRadius: 50,
                    borderWidth:1,
                    borderColor:COLORS.APP_BLACK,
                    backgroundColor: item.bodycolors?.code,
                  }}
                />
              </View>
            )}
            {item.ledcolors && (
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                <Typography
                  title={`LED Color:`}
                  size={12}
                  color={COLORS.APP_LABEL}
                  font={FONTS.INTER_REGULAR}
                />
                <View
                  style={{
                    height: 14,
                    width: 14,
                    borderRadius: 50,
                    borderWidth:1,
                    borderColor:COLORS.APP_BLACK,
                    backgroundColor: item.ledcolors?.code,
                  }}
                />
              </View>
            )}
            {item.reflectors && (
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                <Typography
                  title={`Reflectors Color:`}
                  size={12}
                  color={COLORS.APP_LABEL}
                  font={FONTS.INTER_REGULAR}
                />
                <View
                  style={{
                    height: 14,
                    width: 14,
                    borderRadius: 50,
                    borderWidth:1,
                    borderColor:COLORS.APP_BLACK,
                    backgroundColor: item.reflectors?.code,
                  }}
                />
              </View>
            )}
            {item.watts && (
              <Typography
                title={`Watts: ${item.watts}`}
                size={12}
                color={COLORS.APP_LABEL}
                font={FONTS.INTER_REGULAR}
              />
            )}
          </View>
          <AddRemoveBtn
            disabled={!isSelected}
            count={item?.quantity}
            onAddPress={() => handleUpdateQuantity(item.quantity + 1)}
            onRemovePress={() => handleUpdateQuantity(item.quantity - 1)}
            onQuantityChange={handleUpdateQuantity}
          />
        </View>
      </View>
    </View>
  );
};

export default CartProduct;
