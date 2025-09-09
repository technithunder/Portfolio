import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Container, Typography} from '../../../../components';
import {Images, Routes} from '../../../../constants';
import styles from './style';
import {
  createOrderByAdmin,
  getAllAddressByUserId,
  getAllUserInfo,
  getAllUserProducts,
} from '../../../../api';
import {FONTS} from '../../../../constants/fonts';
import {COLORS} from '../../../../theme/colors';
import AddOrderModal from './AddOrderModal';
import ChooseAddress from '../../../yourCart/ChooseAddress';
import Toast from 'react-native-toast-message';

const AddOrder = ({navigation}) => {
  const [dealerData, setDealerData] = useState([]);
  const [selectDealer, setSelectDealer] = useState('');
  const [productData, setProductData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [addedProducts, setAddedProducts] = useState([]);
  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const sheetRef = useRef(null);

  useEffect(() => {
    fetchAllDealers();
  }, []);

  useEffect(() => {
    if (selectDealer) {
      fetchAllProducts(selectDealer);
      fetchAllAddress(selectDealer);
    }
  }, [selectDealer]);

  const fetchAllAddress = async dealerId => {
    try {
      const response = await getAllAddressByUserId(dealerId);
      if (response?.data?.status === 'success') {
        setAddressList(response?.data?.data?.address);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchAllDealers = async () => {
    try {
      const response = await getAllUserInfo('dealer');
      if (response?.data?.status === 'success') {
        let temp = [];
        response?.data?.data?.users?.forEach((ele, index) => {
          temp.push({
            label: `${ele?.firstName} ${ele?.lastName}`,
            value: ele?.id,
          });
        });
        setDealerData(temp);
      }
    } catch (e) {
      console.loge(e);
    }
  };

  const fetchAllProducts = async dealerId => {
    try {
      const response = await getAllUserProducts(dealerId);
      if (response?.data?.status === 'success') {
        setProductData(response?.data?.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleProductSave = orderData => {
    const newProduct = {
      ...orderData,
      quantity: 1,
      id: Date.now().toString(),
    };
    setAddedProducts([...addedProducts, newProduct]);
    setOpenModal(false);
  };

  const handleQuantityChange = (productId, quantity) => {
    const numericQuantity = parseInt(quantity);
    if (numericQuantity === 0) {
      const product = addedProducts.find(p => p.id === productId);
      Alert.alert(
        'Remove Product',
        `Are you sure you want to remove "${product?.productName}" from your order?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => handleDeleteProduct(productId),
          },
        ],
        {cancelable: true},
      );
      return;
    }

    // If quantity is NaN, keep the existing quantity
    if (isNaN(numericQuantity)) {
      return;
    }

    setAddedProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? {...product, quantity: numericQuantity}
          : product,
      ),
    );
  };

  const handleDeleteProduct = productId => {
    setAddedProducts(prev => prev.filter(product => product.id !== productId));
  };

  const onPressAddOrderBtn = async () => {
  const getDisplayValueForOrder = (item, type) => {
    const selectedProductData = productData?.find(
      prod => prod?.id === item.productId,
    );

    if (!selectedProductData || !selectedProductData.variants) {
      return null;
    }

    // First preference: Already available in item
    switch (type) {
      case 'ledColor':
        if (item.ledColor && item.ledColor.name) {
          return {name: item.ledColor.name, code: item.ledColor.code};
        }
        break;
      case 'bodyColor':
        if (item.bodyColor && item.bodyColor.name) {
          return {name: item.bodyColor.name, code: item.bodyColor.code};
        }
        break;
      case 'reflector':
        if (item.reflector && item.reflector.name) {
          return {name: item.reflector.name, code: item.reflector.code};
        }
        break;
      case 'watt':
        if (item.watts && item.watts.value) {
          return item.watts.value;
        }
        break;
    }

    // Otherwise match via discount
    let discountValue;
    switch (type) {
      case 'ledColor':
        discountValue = item.ledColorDiscount || item.selectedLedColorDiscount;
        break;
      case 'bodyColor':
        discountValue = item.bodyColorDiscount || item.selectedBodyColorDiscount;
        break;
      case 'reflector':
        discountValue = item.reflectorDiscount || item.selectedReflectorDiscount;
        break;
      case 'watt':
        discountValue = item.wattDiscount || item.selectedWattDiscount;
        break;
    }

    if (!discountValue && discountValue !== 0) return null;

    for (const variant of selectedProductData.variants) {
      let foundSpec = null;

      switch (type) {
        case 'ledColor':
          if (variant.ledColor && variant.ledColor.discount === discountValue) {
            foundSpec = variant.ledColor;
          }
          break;
        case 'bodyColor':
          if (variant.bodyColor && variant.bodyColor.discount === discountValue) {
            foundSpec = variant.bodyColor;
          }
          break;
        case 'reflector':
          if (variant.reflector && variant.reflector.discount === discountValue) {
            foundSpec = variant.reflector;
          }
          break;
        case 'watt':
          if (variant.watts && variant.watts.discount === discountValue) {
            foundSpec = variant.watts;
          }
          break;
      }

      if (foundSpec) {
        switch (type) {
          case 'ledColor':
          case 'bodyColor':
          case 'reflector':
            return {name: foundSpec.name, code: foundSpec.code};
          case 'watt':
            return {value: foundSpec.value};
        }
      }
    }

    return null;
  };

  const orderItems = addedProducts.map(item => ({
    productId: item.productId,
    productName: item.productName,
    quantity: item.quantity,
    ledcolors: getDisplayValueForOrder(item, 'ledColor'),
    bodycolors: getDisplayValueForOrder(item, 'bodyColor'),
    reflectors: getDisplayValueForOrder(item, 'reflector'),
    watts: getDisplayValueForOrder(item, 'watt'),
    unitPrice: item.finalPrice,
  }));

  let obj = {
    isAdmin: true,
    totalAmount: addedProducts
      .reduce((sum, item) => sum + item.finalPrice * item.quantity, 0)
      .toFixed(2),
    totalItems: addedProducts.reduce((sum, item) => sum + item.quantity, 0),
    shippingAddress: `${selectedAddress?.street || ''}, ${
      selectedAddress?.city || ''
    }-${selectedAddress?.zipCode || ''}, ${selectedAddress?.state || ''}, ${
      selectedAddress?.country || ''
    }`,
    orderItems,
    userId: selectDealer,
  };
  console.log(obj)
  try {
    const response = await createOrderByAdmin(obj);
    if (response?.data?.status === 'success') {
      Toast.show({
        type: 'success',
        text1: 'Order Created Successfully',
      });
      navigation.navigate(Routes.DrawerStack, {
        screen: Routes.AdminOrder,
      });
    }
  } catch (e) {
    console.log(e);
  } finally {
    setLoading(false);
  }
};

  const renderProductCard = ({item}) => {
    const getDisplayValue = (value, type) => {
      if (!value || value === '') return 'None';

      const selectedProductData = productData?.find(
        prod => prod?.id === item?.productId,
      );
      if (!selectedProductData) return 'None';

      switch (type) {
        case 'ledColor':
          const ledColor = selectedProductData?.ledColors?.find(
            color => color?.discount === value,
          );
          return ledColor ? `${ledColor.color} (${ledColor.code})` : 'None';

        case 'bodyColor':
          const bodyColor = selectedProductData?.bodyColors?.find(
            color => color?.discount === value,
          );
          return bodyColor ? `${bodyColor.color} (${bodyColor.code})` : 'None';

        case 'reflector':
          const reflector = selectedProductData?.reflectors?.find(
            ref => ref?.discount === value,
          );
          return reflector
            ? reflector.code
              ? `${reflector.value} (${reflector.code})`
              : reflector.value
            : 'None';

        case 'watt':
          const watt = selectedProductData?.watts?.find(
            w => w?.discount === value,
          );
          return watt ? `${watt.value}W` : 'None';

        default:
          return 'None';
      }
    };

    return (
      <View style={styles.productCard}>
        <View style={styles.productHeader}>
          <Typography
            title={item.productName}
            size={16}
            font={FONTS.INTER_MEDIUM}
          />
          <TouchableOpacity
            onPress={() => handleDeleteProduct(item.id)}
            style={styles.deleteButton}>
            <MaterialIcons name="delete" size={20} color={'red'} />
          </TouchableOpacity>
        </View>

        <View style={styles.productDetails}>
          <Typography
            title={`Final Price: ₹${item.finalPrice}`}
            size={12}
            font={FONTS.INTER_MEDIUM}
            color={COLORS.APP_PRIMARY}
          />
        </View>

        {/* Product Specifications */}
        <View style={styles.specificationsContainer}>
          <Typography
            title="Specifications:"
            size={14}
            font={FONTS.INTER_MEDIUM}
          />

          {/* LED Color */}
          {item.ledColor?.name && (
            <View style={styles.specRow}>
              <Typography
                title="LED Color:"
                size={12}
                font={FONTS.INTER_REGULAR}
                color={COLORS.APP_GRAY}
              />
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: item.ledColor?.code || '#ccc',
                    marginRight: 6,
                    borderWidth: 1,
                    borderColor: COLORS.APP_GRAY,
                  }}
                />
                <Typography
                  title={item.ledColor?.name || 'N/A'}
                  size={12}
                  font={FONTS.INTER_MEDIUM}
                />
              </View>
            </View>
          )}

          {/* Body Color */}
          {item.bodyColor?.name && (
            <View style={styles.specRow}>
              <Typography
                title="Body Color:"
                size={12}
                font={FONTS.INTER_REGULAR}
                color={COLORS.APP_GRAY}
              />
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: item.bodyColor?.code || '#ccc',
                    marginRight: 6,
                    borderWidth: 1,
                    borderColor: COLORS.APP_GRAY,
                  }}
                />
                <Typography
                  title={item.bodyColor?.name || 'N/A'}
                  size={12}
                  font={FONTS.INTER_MEDIUM}
                />
              </View>
            </View>
          )}

          {/* Reflector */}
          {item.reflector?.name && (
            <View style={styles.specRow}>
              <Typography
                title="Reflector:"
                size={12}
                font={FONTS.INTER_REGULAR}
                color={COLORS.APP_GRAY}
              />
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: item.reflector?.code || '#ccc',
                    marginRight: 6,
                    borderWidth: 1,
                    borderColor: COLORS.APP_GRAY,
                  }}
                />
                <Typography
                  title={item.reflector?.name || 'N/A'}
                  size={12}
                  font={FONTS.INTER_MEDIUM}
                />
              </View>
            </View>
          )}

          {/* Watts */}
          {item.watts?.value && (
            <View style={styles.specRow}>
              <Typography
                title="Watts:"
                size={12}
                font={FONTS.INTER_REGULAR}
                color={COLORS.APP_GRAY}
              />
              <Typography
                title={`${item.watts?.value || 0} W`}
                size={12}
                font={FONTS.INTER_MEDIUM}
              />
            </View>
          )}
        </View>

        <View style={styles.quantityContainer}>
          <Typography title="Quantity:" size={14} font={FONTS.INTER_MEDIUM} />
          <View style={styles.quantityInputContainer}>
            <TouchableOpacity
              onPress={() =>
                handleQuantityChange(item.id, (item.quantity - 1).toString())
              }
              style={styles.quantityButton}
              disabled={item.quantity <= 1}>
              <Text
                style={[
                  styles.quantityButtonText,
                  item.quantity <= 1 && {color: COLORS.APP_GRAY},
                ]}>
                -
              </Text>
            </TouchableOpacity>

            <TextInput
              style={styles.quantityInput}
              value={item.quantity.toString()}
              onChangeText={text => handleQuantityChange(item.id, text)}
              keyboardType="numeric"
              textAlign="center"
            />

            <TouchableOpacity
              onPress={() =>
                handleQuantityChange(item.id, (item.quantity + 1).toString())
              }
              style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.totalContainer}>
          <Typography
            title={`Total: ₹${(item.finalPrice * item.quantity).toFixed(2)}`}
            size={16}
            font={FONTS.INTER_MEDIUM}
            color={COLORS.PRIMARY}
          />
        </View>
      </View>
    );
  };

  console.log('Product Data:', productData);

  return (
    <Container
      title="Add Order"
      showBack={true}
      // leftIcon={Images.back}
      onLeftPress={() =>
        navigation.navigate(Routes.DrawerStack, {
          screen: Routes.AdminOrder,
        })
      }
      style={styles.container}>
      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20}}>
        <View style={{marginHorizontal: 20, marginTop: 20}}>
          <View>
            <Typography
              title={'Dealer Name'}
              size={14}
              font={FONTS.INTER_MEDIUM}
            />
            <Dropdown
              style={[styles.inputField, styles.dropdown]}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              inputSearchStyle={styles.dropdownSearch}
              iconStyle={styles.dropdownIcon}
              data={dealerData}
              maxHeight={180}
              labelField="label"
              valueField="value"
              placeholder="Select Dealer"
              itemTextStyle={{color: COLORS.APP_BLACK}}
              value={selectDealer}
              onChange={item => {
                setSelectDealer(item.value);
              }}
              search={true}
              searchPlaceholder="Search Dealer"
              renderRightIcon={() => (
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={20}
                  color={COLORS.APP_GRAY}
                />
              )}
            />
          </View>

          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Typography title={'Product'} size={18} font={FONTS.INTER_MEDIUM} />
            <TouchableOpacity
              onPress={() => setOpenModal(true)}
              style={[
                styles.addButton,
                {
                  backgroundColor: selectDealer
                    ? COLORS.APP_PRIMARY
                    : COLORS.APP_LIGHT_GRAY,
                },
              ]}
              disabled={!selectDealer}>
              <Text
                style={[
                  styles.txtAddProduct,
                  !selectDealer && {color: COLORS.APP_GRAY},
                ]}>
                Add Product
              </Text>
            </TouchableOpacity>
          </View>

          {/* Added Products List */}
          {addedProducts.length > 0 && (
            <View>
              <Typography
                title="Added Products"
                size={16}
                font={FONTS.INTER_MEDIUM}
                style={{marginBottom: 10}}
              />
              <FlatList
                data={addedProducts}
                renderItem={renderProductCard}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                nestedScrollEnabled={true}
              />
            </View>
          )}

          <View style={{marginTop: 20}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Typography
                title="Shipping Address"
                size={14}
                color={COLORS.APP_GRAY}
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
          </View>

          {/* Order Summary */}
          {addedProducts.length > 0 && (
            <View style={styles.orderSummary}>
              <Typography
                title="Order Summary"
                size={16}
                font={FONTS.INTER_SEMIBOLD}
              />
              <View style={styles.summaryRow}>
                <Typography
                  title="Total Items:"
                  size={12}
                  font={FONTS.INTER_REGULAR}
                />
                <Typography
                  title={addedProducts
                    .reduce((sum, item) => sum + item.quantity, 0)
                    .toString()}
                  size={12}
                  font={FONTS.INTER_MEDIUM}
                />
              </View>
              <View style={styles.summaryRow}>
                <Typography
                  title="Total Amount:"
                  size={14}
                  font={FONTS.INTER_MEDIUM}
                />
                <Typography
                  title={`₹${addedProducts
                    .reduce(
                      (sum, item) => sum + item.finalPrice * item.quantity,
                      0,
                    )
                    .toFixed(2)}`}
                  size={14}
                  font={FONTS.INTER_MEDIUM}
                  color={COLORS.PRIMARY}
                />
              </View>
            </View>
          )}

          {selectDealer && selectedAddress && (
            <View>
              <TouchableOpacity
                onPress={onPressAddOrderBtn}
                style={styles.addOrderButton}>
                <Typography
                  title={'Submit'}
                  size={16}
                  font={FONTS.INTER_SEMIBOLD}
                  color={COLORS.APP_WHITE}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <AddOrderModal
        visible={openModal}
        onClose={() => setOpenModal(false)}
        productData={productData}
        onSave={handleProductSave}
      />

      <ChooseAddress
        ref={sheetRef}
        addressList={addressList}
        onAddressSelect={selectedAddress => {
          setSelectedAddress(selectedAddress);
          console.log('Selected address:', selectedAddress);
          sheetRef.current?.hide();
        }}
        isAddAddressEnabled={false}
      />
    </Container>
  );
};

export default AddOrder;
