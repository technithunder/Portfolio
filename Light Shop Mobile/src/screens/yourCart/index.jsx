import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  FlatList,
  View,
  Alert,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Image,
  TextInput,
  Keyboard,
  TouchableOpacity,
  Text,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native'; // Add this import
import {Button, Container, Typography} from '../../components';
import {Fonts, Routes} from '../../constants';
import {colors, commonSty} from '../../theme';
import {CartProduct} from './components';
import {categoryItemProps} from '../home/types';
import styles from './styles';
import {
  clearCart,
  deselectAll,
  fetchCart,
  selectAll,
} from '../../redux/cartSlice';
import {COLORS} from '../../theme/colors';
import {replace} from '../../utils';
import {FONTS} from '../../constants/fonts';
import EMPTY_CART from '../../../assets/images/shopping.png';
import {checkoutAPI, getAllAddress, getAllAddressApi} from '../../api';
import {Dropdown} from 'react-native-element-dropdown';
import ChooseAddress from './ChooseAddress';
import moment from 'moment';

const YourCart = ({navigation}) => {
  const dispatch = useDispatch();
  const sheetRef = useRef(null);
  const {items, loading, totalAmount, totalItems, selected, error} =
    useSelector(state => state.cart);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  const [shipping_address, setShippingAddress] = useState('');
  const [addressList, setAddressList] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [openExpectedDatePicker, setOpenExpectedDatePicker] = useState(false);
  const [expectedDate, setExpectedDate] = useState(null);

  const forceRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    setHasInitiallyLoaded(false);
    dispatch(fetchCart()).finally(() => {
      setHasInitiallyLoaded(true);
    });
    fetchAllAddress();
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      forceRefresh();
    }, [forceRefresh]),
  );

  useEffect(() => {
    if (items && items.length > 0) {
      console.log('Cart items updated:', items.length);
    }
  }, [items, totalItems, totalAmount]);

  useEffect(() => {
    fetchAllAddress();
  }, []);

  const fetchAllAddress = async () => {
    try {
      const response = await getAllAddressApi();
      if (response?.data?.status === 'success') {
        const addressList = response.data.data.users;
        setAddressList(addressList);
      }
    } catch (e) {
      console.log(e);
    }
  };


  useEffect(() => {
    dispatch(fetchCart()).finally(() => {
      setHasInitiallyLoaded(true);
    });
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      console.log('Error fetching cart:', error);
    }
  }, [error]);

  const handleCheckoutPress = async () => {
    setIsLoading(true);
    const selectedItems = items.filter(item => selected[item.id]);
    if (selectedItems?.length === 0) {
      Alert.alert(
        'No Items Selected',
        'Please select at least one item to proceed to checkout.',
      );
      setIsLoading(false);
      return;
    }
    let obj = {
      cartItems: selectedItems?.map(ele => ele.id),
      totalAmount: totalAmount,
      shippingAddress: `${selectedAddress?.street || ''}, ${
        selectedAddress?.city || ''
      }-${selectedAddress?.zipCode || ''}, ${selectedAddress?.state || ''}, ${
        selectedAddress?.country || ''
      }`,
      expectedMaterial: expectedDate
        ? moment(expectedDate).format('DD-MM-YYYY')
        : null,
    };
    try {
      const response = await checkoutAPI(obj);
      if (response?.data?.status === 'success') {
        replace(Routes.Checkout);
        setIsLoading(false);
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  const handleSelectAll = () => {
    dispatch(selectAll());
    setTimeout(() => forceRefresh(), 100);
  };

  const handleDeselectAll = () => {
    dispatch(deselectAll());
    setTimeout(() => forceRefresh(), 100);
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            dispatch(clearCart());
            setTimeout(() => forceRefresh(), 500);
          },
        },
      ],
    );
  };

  const handleJoiningDateConfirm = date => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate >= today) {
      setExpectedDate(date);
    } else {
      Alert.alert('Invalid Date', 'Please select a date from today onwards.');
    }

    setOpenExpectedDatePicker(false);
  };

  const handleManualRefresh = useCallback(() => {
    forceRefresh();
  }, [forceRefresh]);

  const safeSelected = selected || {};
  const safeItems = items || [];

  const selectedItemsCount = Object.entries(safeSelected).filter(
    ([key, value]) => value === true,
  ).length;

  const selectedItemsTotal = safeItems
    .filter(item => item?.id && safeSelected[item.id] === true)
    .reduce((sum, item) => {
      const price = Number(item?.price) || 0;
      const quantity = Number(item?.quantity) || 0;
      return sum + price * quantity;
    }, 0);

  const allSelected =
    safeItems.length > 0 && selectedItemsCount === safeItems.length;

  // if (loading && !hasInitiallyLoaded) {
  //   return (
  //     <Container showBack title="Your Cart" key={`loading-${refreshKey}`}>
  //       <View style={styles.loadingContainer}>
  //         <ActivityIndicator size={40} color={COLORS.APP_PRIMARY} />
  //       </View>
  //     </Container>
  //   );
  // }

  if (items.length === 0) {
    return (
      <Container
        showBack
        title="Your Cart"
        key={`empty-${refreshKey}`}
        style={{
          flexGrow: 1,
          backgroundColor: COLORS.APP_WHITE,
        }}>
        <View style={styles.emptyCartContainer}>
          <Image
            source={EMPTY_CART}
            style={{height: 200, width: 200, alignSelf: 'center'}}
          />
          <Typography
            title="Your cart is empty"
            size={18}
            mb={20}
            font={FONTS.INTER_SEMIBOLD}
            align="center"
          />

          <Button
            title="Start Shopping"
            btnStyle={{backgroundColor: COLORS.APP_PRIMARY}}
            btnTextStyle={{fontFamily: FONTS.INTER_SEMIBOLD, fontSize: 16}}
            onPress={() => replace(Routes.BottomStack, {screen: Routes.Home})}
          />
        </View>
      </Container>
    );
  }

  return (
    <Container showBack title="Your Cart" key={`cart-${refreshKey}`}>
      <View style={styles.cartContainer}>
        {/* Fixed Cart Header */}
        <View style={styles.cartHeader}>
          <View style={styles.cartHeaderTop}>
            <Typography
              title={`${totalItems} item${totalItems !== 1 ? 's' : ''} in cart`}
              size={16}
              font={FONTS.INTER_REGULAR}
            />
            <Typography
              title={`${selectedItemsCount} selected`}
              size={14}
              color={colors.seaTurtleGreen}
              font={FONTS.INTER_REGULAR}
            />
          </View>

          <View style={styles.cartActions}>
            <Button
              title={allSelected ? 'Deselect All' : 'Select All'}
              onPress={allSelected ? handleDeselectAll : handleSelectAll}
              btnStyle={[styles.actionBtn, styles.selectBtn]}
              txtSize={12}
            />
            <Button
              title="Clear Cart"
              onPress={handleClearCart}
              btnStyle={[styles.actionBtn, styles.clearBtn]}
              txtSize={12}
              btnTextStyle={{color: 'red'}}
            />
          </View>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleManualRefresh}
              colors={[colors.seaTurtleGreen]}
            />
          }>
          <View style={styles.cartItemsSection}>
            {items.map((item, index) => (
              <View key={`${item.id}-${refreshKey}-${index}`}>
                <CartProduct item={item} onUpdate={forceRefresh} />
                {index < items.length - 1 && (
                  <View style={styles.itemSeparator} />
                )}
              </View>
            ))}
          </View>

          <View style={styles.summarySection}>
            <View style={styles.summaryHeader}>
              <Typography
                title="Order Summary"
                size={16}
                font={FONTS.INTER_REGULAR}
              />
            </View>

            <View style={styles.summaryContent}>
              <View style={styles.summaryRow}>
                <Typography
                  title="Total Items"
                  size={14}
                  color={colors.osloGrey}
                  font={FONTS.INTER_REGULAR}
                />
                <Typography
                  title={totalItems?.toString()}
                  size={14}
                  font={FONTS.INTER_REGULAR}
                />
              </View>

              <View style={styles.summaryRow}>
                <Typography
                  title="Selected Items"
                  size={14}
                  font={FONTS.INTER_REGULAR}
                  color={colors.osloGrey}
                />
                <Typography
                  font={FONTS.INTER_REGULAR}
                  title={selectedItemsCount?.toString()}
                  size={14}
                />
              </View>

              <View style={styles.summaryRow}>
                <Typography
                  title="Shipping"
                  size={14}
                  color={colors.osloGrey}
                  font={FONTS.INTER_REGULAR}
                />
                <Typography
                  title="Free"
                  size={14}
                  font={FONTS.INTER_REGULAR}
                  color={colors.seaTurtleGreen}
                />
              </View>

              <View style={{marginTop: 10}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Typography
                    title="Shipping Address"
                    size={14}
                    color={colors.osloGrey}
                    font={FONTS.INTER_REGULAR}
                  />
                  <TouchableOpacity onPress={() => sheetRef.current?.show()}>
                    <Text style={styles.txtChooseAddress}>Choose address</Text>
                  </TouchableOpacity>
                </View>

                {selectedAddress && (
                  <View style={styles.addressContainer}>
                    <Typography
                      title={selectedAddress?.street || 'N/A'}
                      size={13}
                      font={FONTS.INTER_SEMIBOLD}
                      color={COLORS.APP_BLACK}
                      numberOfLines={1}
                    />
                    <Typography
                      title={`${selectedAddress?.city || ''}-${
                        selectedAddress?.zipCode || ''
                      }`}
                      size={11}
                      font={FONTS.INTER_MEDIUM}
                      color={COLORS.APP_GRAY}
                      numberOfLines={1}
                    />
                    <Typography
                      title={`${selectedAddress?.state || ''}, ${
                        selectedAddress?.country || ''
                      }`}
                      size={11}
                      font={FONTS.INTER_MEDIUM}
                      color={COLORS.APP_GRAY}
                      numberOfLines={1}
                    />
                  </View>
                )}

                <View style={{marginTop: 16}}>
                  <Typography
                    title="Expected Require Material Date"
                    size={14}
                    color={colors.osloGrey}
                    font={FONTS.INTER_REGULAR}
                  />
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setOpenExpectedDatePicker(true)}>
                    <Typography
                      title={
                        expectedDate
                          ? moment(expectedDate).format('DD MMM, YYYY')
                          : 'Select Date'
                      }
                      size={14}
                      color={colors.black}
                      font={FONTS.INTER_REGULAR}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.summaryRow}>
                <Typography
                  title="Cart Total"
                  size={14}
                  font={FONTS.INTER_REGULAR}
                  color={colors.osloGrey}
                />
                <Typography
                  font={FONTS.INTER_REGULAR}
                  title={`₹${totalAmount?.toFixed(2)}`}
                  size={14}
                />
              </View>

              <View style={[styles.summaryRow, styles.totalRow]}>
                <Typography
                  title="Selected Total"
                  size={16}
                  font={FONTS.INTER_REGULAR}
                />
                <Typography
                  title={`₹${selectedItemsTotal?.toFixed(2)}`}
                  size={16}
                  font={FONTS.INTER_REGULAR}
                  color={colors.seaTurtleGreen}
                />
              </View>
            </View>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>

        {selectedItemsCount > 0 && selectedAddress && expectedDate && (
          <View style={styles.checkoutContainer}>
            {/* <Button
              title={`Proceed to Checkout${
                selectedItemsCount > 0
                  ? ` (${selectedItemsCount} item${
                      selectedItemsCount !== 1 ? 's' : ''
                    })`
                  : ''
              }`}
              borderRadius={12}
              btnStyle={[selectedItemsCount === 0 && styles.disabledBtn]}
              txtSize={16}
              onPress={handleCheckoutPress}
              disabled={selectedItemsCount === 0}
              loading={isLoading}
            /> */}

            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={handleCheckoutPress}>
              {isLoading ? (
                <ActivityIndicator size={16} color={COLORS.APP_WHITE} />
              ) : (
                <Typography
                  title={`Proceed to Checkout${
                    selectedItemsCount > 0
                      ? ` (${selectedItemsCount} item${
                          selectedItemsCount !== 1 ? 's' : ''
                        })`
                      : ''
                  }`}
                  size={16}
                  font={FONTS.INTER_MEDIUM}
                  color={COLORS.APP_WHITE}
                />
              )}
            </TouchableOpacity>
          </View>
        )}

        <View></View>
      </View>

      <ChooseAddress
        ref={sheetRef}
        addressList={addressList}
        onAddressSelect={selectedAddress => {
          setSelectedAddress(selectedAddress);
          console.log('Selected address:', selectedAddress);
          sheetRef.current?.hide();
        }}
        onAddAddressPress={() => {
          navigation.navigate('AddAddress');
          sheetRef.current?.hide();
        }}
      />

      <DateTimePickerModal
        isVisible={openExpectedDatePicker}
        mode="date"
        date={expectedDate ? new Date(expectedDate) : new Date()}
        minimumDate={new Date()}
        onConfirm={handleJoiningDateConfirm}
        onCancel={() => setOpenExpectedDatePicker(false)}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      />
    </Container>
  );
};

export default YourCart;
