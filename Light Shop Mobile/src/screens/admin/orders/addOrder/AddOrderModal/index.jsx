import React, {useEffect, useState} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {View, Text, Modal, TouchableOpacity, Pressable} from 'react-native';
import styles from './style';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {COLORS} from '../../../../../theme/colors';
import {FONTS} from '../../../../../constants/fonts';
import {Typography} from '../../../../../components';

const AddOrderModal = ({visible, onClose, productData, onSave}) => {
  console.log(productData, 'productData');
  const [productNameList, setProductNameList] = useState([]);
  const [selectProduct, setSelectProduct] = useState('');
  const [ledColorList, setLedColorList] = useState([]);
  const [selectLedColor, setSelectLedColor] = useState('');
  const [bodyColorList, setBodyColorList] = useState([]);
  const [selectBodyColor, setSelectBodyColor] = useState('');
  const [reflectorList, setReflectorList] = useState([]);
  const [selectReflector, setSelectReflector] = useState('');
  const [wattList, setWattList] = useState([]);
  const [selectWatt, setSelectWatt] = useState('');
  const [finalPrice, setFinalPrice] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const getSelectedProductData = () => {
    return productData?.find(item => item?.id === selectProduct);
  };

  // Helper function to get selected object by value
  const getSelectedObject = (list, selectedValue) => {
    if (!selectedValue || selectedValue === '') return null;
    const item = list.find(item => item.value === selectedValue);
    return item ? item.originalObject : null;
  };

  // Get unique options from variants
  const getUniqueOptions = (variants, key) => {
    if (!variants || !Array.isArray(variants)) return [];

    const uniqueItems = [];
    const seen = new Set();

    variants.forEach(variant => {
      const item = variant[key];
      if (item) {
        let identifier;
        if (key === 'watts') {
          identifier = item.value;
        } else if (key === 'reflector') {
          identifier = item.name;
        } else {
          identifier = item.name;
        }

        if (!seen.has(identifier)) {
          seen.add(identifier);
          uniqueItems.push(item);
        }
      }
    });

    return uniqueItems;
  };

  // Find matching variants based on selected options
  const getMatchingVariants = () => {
    const selectedProductData = getSelectedProductData();
    if (!selectedProductData?.variants) return [];

    return selectedProductData.variants.filter(variant => {
      let matches = true;

      if (selectLedColor !== '') {
        matches = matches && variant.ledColor?.name === selectLedColor;
      }
      if (selectBodyColor !== '') {
        matches = matches && variant.bodyColor?.name === selectBodyColor;
      }
      if (selectReflector !== '') {
        matches = matches && variant.reflector?.name === selectReflector;
      }
      if (selectWatt !== '') {
        matches = matches && variant.watts?.value.toString() === selectWatt;
      }

      return matches;
    });
  };

  // Update available options based on current selections
  const updateAvailableOptions = () => {
    const selectedProductData = getSelectedProductData();
    if (!selectedProductData?.variants) return;

    const matchingVariants = getMatchingVariants();
    const variantsToUse =
      matchingVariants.length > 0
        ? matchingVariants
        : selectedProductData.variants;

    // Update LED Colors
    const ledColors = getUniqueOptions(variantsToUse, 'ledColor');
    setLedColorList([
      {label: 'None', value: '', originalObject: null},
      ...ledColors.map(item => ({
        label: `${item.name} (${item.discount}% off)`,
        value: item.name,
        discount: item.discount,
        originalObject: item, // Store the complete object
      })),
    ]);

    // Update Body Colors
    const bodyColors = getUniqueOptions(variantsToUse, 'bodyColor');
    setBodyColorList([
      {label: 'None', value: '', originalObject: null},
      ...bodyColors.map(item => ({
        label: `${item.name} (${item.discount}% off)`,
        value: item.name,
        discount: item.discount,
        originalObject: item, // Store the complete object
      })),
    ]);

    // Update Reflectors
    const reflectors = getUniqueOptions(variantsToUse, 'reflector');
    setReflectorList([
      {label: 'None', value: '', originalObject: null},
      ...reflectors.map(item => ({
        label: `${item.name} (${item.discount}% off)`,
        value: item.name,
        discount: item.discount,
        originalObject: item, // Store the complete object
      })),
    ]);

    // Update Watts
    const watts = getUniqueOptions(variantsToUse, 'watts');
    setWattList([
      {label: 'None', value: '', originalObject: null},
      ...watts.map(item => ({
        label: `${item.value}W (${item.discount}% off)`,
        value: item.value.toString(),
        discount: item.discount,
        originalObject: item, // Store the complete object
      })),
    ]);
  };

  const calculateFinalPrice = () => {
    const selectedProductData = getSelectedProductData();
    if (!selectedProductData) return 0;

    let basePrice =
      selectedProductData.afterDiscountPrice ||
      selectedProductData.productPrice;
    const matchingVariants = getMatchingVariants();

    if (matchingVariants.length > 0) {
      // Use the first matching variant to calculate discounts
      const variant = matchingVariants[0];
      setSelectedVariant(variant);

      let totalDiscount = 0;

      if (selectLedColor && variant.ledColor?.name === selectLedColor) {
        totalDiscount += variant.ledColor.discount;
      }
      if (selectBodyColor && variant.bodyColor?.name === selectBodyColor) {
        totalDiscount += variant.bodyColor.discount;
      }
      if (selectReflector && variant.reflector?.name === selectReflector) {
        totalDiscount += variant.reflector.discount;
      }
      if (selectWatt && variant.watts?.value.toString() === selectWatt) {
        totalDiscount += variant.watts.discount;
      }

      basePrice = basePrice - (basePrice * totalDiscount) / 100;
    } else {
      setSelectedVariant(null);
    }

    return Math.round(basePrice * 100) / 100;
  };

  const resetForm = () => {
    setSelectProduct('');
    setSelectLedColor('');
    setSelectBodyColor('');
    setSelectReflector('');
    setSelectWatt('');
    setFinalPrice(0);
    setSelectedVariant(null);
  };

  useEffect(() => {
    if (productData?.length > 0) {
      const temp = productData?.map(item => ({
        label: item?.productName,
        value: item?.id,
      }));
      setProductNameList(temp);
    }
  }, [productData]);

  useEffect(() => {
    if (selectProduct) {
      updateAvailableOptions();
      // Reset selections when product changes
      setSelectLedColor('');
      setSelectBodyColor('');
      setSelectReflector('');
      setSelectWatt('');
    }
  }, [selectProduct]);

  useEffect(() => {
    updateAvailableOptions();
  }, [selectLedColor, selectBodyColor, selectReflector, selectWatt]);

  useEffect(() => {
    setFinalPrice(calculateFinalPrice());
  }, [
    selectProduct,
    selectLedColor,
    selectBodyColor,
    selectReflector,
    selectWatt,
  ]);

  const getDiscountValue = (optionName, optionType) => {
    if (!selectedVariant) return 0;

    switch (optionType) {
      case 'ledColor':
        return selectedVariant.ledColor?.name === optionName
          ? selectedVariant.ledColor.discount
          : 0;
      case 'bodyColor':
        return selectedVariant.bodyColor?.name === optionName
          ? selectedVariant.bodyColor.discount
          : 0;
      case 'reflector':
        return selectedVariant.reflector?.name === optionName
          ? selectedVariant.reflector.discount
          : 0;
      case 'watts':
        return selectedVariant.watts?.value.toString() === optionName
          ? selectedVariant.watts.discount
          : 0;
      default:
        return 0;
    }
  };

  const handleSave = () => {
    const selectedProductData = getSelectedProductData();
    if (!selectedProductData) {
      alert('Please select a product');
      return;
    }

    // Get complete objects for selected options
    const selectedLedColorObject = getSelectedObject(
      ledColorList,
      selectLedColor,
    );
    const selectedBodyColorObject = getSelectedObject(
      bodyColorList,
      selectBodyColor,
    );
    const selectedReflectorObject = getSelectedObject(
      reflectorList,
      selectReflector,
    );
    const selectedWattObject = getSelectedObject(wattList, selectWatt);

    const orderData = {
      productId: selectProduct,
      productName: selectedProductData.productName,
      basePrice:
        selectedProductData.afterDiscountPrice ||
        selectedProductData.productPrice,
      selectedVariant: selectedVariant,
      // Complete objects with name and discount
      ledColor: selectedLedColorObject, // Now contains complete object {name, discount, etc}
      bodyColor: selectedBodyColorObject, // Now contains complete object {name, discount, etc}
      reflector: selectedReflectorObject, // Now contains complete object {name, discount, etc}
      watts: selectedWattObject, // Now contains complete object {value, discount, etc}
      // Legacy fields for backward compatibility
      ledColorName: selectLedColor,
      bodyColorName: selectBodyColor,
      reflectorName: selectReflector,
      wattValue: selectWatt,
      ledColorDiscount: getDiscountValue(selectLedColor, 'ledColor'),
      bodyColorDiscount: getDiscountValue(selectBodyColor, 'bodyColor'),
      reflectorDiscount: getDiscountValue(selectReflector, 'reflector'),
      wattDiscount: getDiscountValue(selectWatt, 'watts'),
      finalPrice: finalPrice,
      totalDiscount:
        (selectedProductData.afterDiscountPrice ||
          selectedProductData.productPrice) - finalPrice,
      stock: selectedVariant?.stock || 0,
    };

    console.log('Order Data:', orderData);
    console.log('LED Color Object:', selectedLedColorObject);
    console.log('Body Color Object:', selectedBodyColorObject);
    console.log('Reflector Object:', selectedReflectorObject);
    console.log('Watts Object:', selectedWattObject);

    onSave(orderData);
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={handleClose}
      transparent={true}
      animationType="fade">
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.container} onPress={e => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Product</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View>
              <Typography
                title={'Product Name'}
                size={14}
                font={FONTS.INTER_MEDIUM}
              />
              <Dropdown
                style={[styles.inputField, styles.dropdown]}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelectedText}
                inputSearchStyle={styles.dropdownSearch}
                iconStyle={styles.dropdownIcon}
                data={productNameList}
                maxHeight={180}
                labelField="label"
                valueField="value"
                placeholder="Select Product"
                itemTextStyle={{color: COLORS.APP_BLACK}}
                value={selectProduct}
                onChange={item => {
                  setSelectProduct(item.value);
                }}
                search={true}
                searchPlaceholder="Search Product"
                renderRightIcon={() => (
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={20}
                    color={COLORS.APP_GRAY}
                  />
                )}
              />
            </View>

            <View style={{marginTop: 10}}>
              <Typography
                title={'LED Color'}
                size={14}
                font={FONTS.INTER_MEDIUM}
              />
              <Dropdown
                style={[styles.inputField, styles.dropdown]}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelectedText}
                inputSearchStyle={styles.dropdownSearch}
                iconStyle={styles.dropdownIcon}
                data={ledColorList}
                maxHeight={180}
                labelField="label"
                valueField="value"
                placeholder="Select LED Color"
                searchPlaceholder="Search LED Color"
                search={true}
                itemTextStyle={{color: COLORS.APP_BLACK}}
                value={selectLedColor}
                onChange={item => {
                  setSelectLedColor(item.value);
                }}
                renderRightIcon={() => (
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={20}
                    color={COLORS.APP_GRAY}
                  />
                )}
              />
            </View>

            <View style={{marginTop: 10}}>
              <Typography
                title={'Body Color'}
                size={14}
                font={FONTS.INTER_MEDIUM}
              />
              <Dropdown
                style={[styles.inputField, styles.dropdown]}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelectedText}
                inputSearchStyle={styles.dropdownSearch}
                iconStyle={styles.dropdownIcon}
                data={bodyColorList}
                maxHeight={180}
                labelField="label"
                valueField="value"
                placeholder="Select Body Color"
                search={true}
                searchPlaceholder="Search Body Color"
                itemTextStyle={{color: COLORS.APP_BLACK}}
                value={selectBodyColor}
                onChange={item => {
                  setSelectBodyColor(item.value);
                }}
                renderRightIcon={() => (
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={20}
                    color={COLORS.APP_GRAY}
                  />
                )}
              />
            </View>

            <View style={{marginTop: 10}}>
              <Typography
                title={'Reflectors'}
                size={14}
                font={FONTS.INTER_MEDIUM}
              />
              <Dropdown
                style={[styles.inputField, styles.dropdown]}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelectedText}
                inputSearchStyle={styles.dropdownSearch}
                iconStyle={styles.dropdownIcon}
                data={reflectorList}
                maxHeight={180}
                labelField="label"
                valueField="value"
                placeholder="Select Reflectors"
                search={true}
                searchPlaceholder="Search Reflectors"
                itemTextStyle={{color: COLORS.APP_BLACK}}
                value={selectReflector}
                onChange={item => {
                  setSelectReflector(item.value);
                }}
                renderRightIcon={() => (
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={20}
                    color={COLORS.APP_GRAY}
                  />
                )}
              />
            </View>

            <View style={{marginTop: 10}}>
              <Typography title={'Watts'} size={14} font={FONTS.INTER_MEDIUM} />
              <Dropdown
                style={[styles.inputField, styles.dropdown]}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelectedText}
                inputSearchStyle={styles.dropdownSearch}
                iconStyle={styles.dropdownIcon}
                data={wattList}
                maxHeight={180}
                labelField="label"
                valueField="value"
                search={true}
                placeholder="Select watts"
                searchPlaceholder="Search Watts"
                itemTextStyle={{color: COLORS.APP_BLACK}}
                value={selectWatt}
                onChange={item => {
                  setSelectWatt(item.value);
                }}
                renderRightIcon={() => (
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={20}
                    color={COLORS.APP_GRAY}
                  />
                )}
              />
            </View>

            {/* Show final price */}
            {finalPrice > 0 && (
              <View
                style={{
                  marginTop: 10,
                  padding: 10,
                  backgroundColor: '#f0f0f0',
                  borderRadius: 5,
                }}>
                <Typography
                  title={`Final Price: ₹${finalPrice}`}
                  size={16}
                  font={FONTS.INTER_MEDIUM}
                />
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!selectedVariant ||
                  !selectWatt ||
                  !selectLedColor ||
                  !selectBodyColor ||
                  !selectReflector) && {backgroundColor: COLORS.APP_GRAY},
              ]}
              onPress={handleSave}
              disabled={
                !selectedVariant ||
                !selectWatt ||
                !selectLedColor ||
                !selectBodyColor ||
                !selectReflector
              }>
              <Text style={styles.submitText}>Save</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default AddOrderModal;
