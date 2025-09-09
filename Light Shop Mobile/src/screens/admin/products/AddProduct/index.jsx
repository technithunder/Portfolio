import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import styles from './style';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation, useRoute} from '@react-navigation/native';
import {colors, COLORS} from '../../../../theme/colors';
import {Dropdown} from 'react-native-element-dropdown';
import {
  addProduct,
  getProductCategories,
  getSingleProduct,
  updateProduct,
} from '../../../../api';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Images, Routes} from '../../../../constants';
import {Icon, Typography} from '../../../../components';
import {FONTS} from '../../../../constants/fonts';
import Toast from 'react-native-toast-message';

const SimpleColorPicker = ({selectedColor, onColorSelect}) => {
  const [customColor, setCustomColor] = useState(selectedColor);

  const predefinedColors = [
    '#FF0000',
    '#FF6B6B',
    '#FF3333',
    '#CC0000',
    '#8B0000',
    '#00FF00',
    '#32CD32',
    '#90EE90',
    '#006400',
    '#228B22',
    '#0000FF',
    '#4169E1',
    '#87CEEB',
    '#000080',
    '#191970',
    '#FFFF00',
    '#FFD700',
    '#FFA500',
    '#FF8C00',
    '#FF4500',
    '#FF00FF',
    '#DDA0DD',
    '#BA55D3',
    '#8B008B',
    '#FFB6C1',
    '#00FFFF',
    '#20B2AA',
    '#48D1CC',
    '#008B8B',
    '#5F9EA0',
    '#000000',
    '#FFFFFF',
    '#808080',
    '#C0C0C0',
    '#696969',
    '#A52A2A',
    '#D2691E',
    '#CD853F',
    '#F4A460',
    '#DEB887',
  ];

  const handleCustomColorChange = text => {
    setCustomColor(text);
    if (text.length === 7 && /^#[0-9A-F]{6}$/i.test(text)) {
      onColorSelect(text);
    } else if (text.length === 4 && /^#[0-9A-F]{3}$/i.test(text)) {
      const expandedHex = text.replace(
        /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
        '#$1$1$2$2$3$3',
      );
      onColorSelect(expandedHex);
    }
  };

  return (
    <View style={styles.simpleColorPickerContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.selectedColorDisplay}>
          <View style={styles.selectedColorBox}>
            <View
              style={[
                styles.selectedColorSwatch,
                {backgroundColor: selectedColor},
              ]}
            />
          </View>
        </View>

        <Text style={styles.selectedColorLabel}>Predefined Colors</Text>
        <View style={styles.colorGrid}>
          {predefinedColors.map((color, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.colorOption,
                {backgroundColor: color},
                selectedColor.toLowerCase() === color.toLowerCase() &&
                  styles.selectedColorOption,
              ]}
              onPress={() => onColorSelect(color)}>
              {selectedColor.toLowerCase() === color.toLowerCase() && (
                <View style={styles.selectedCheckmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.customColorSection}>
          <Text style={styles.sectionLabel}>Custom Color</Text>
          <View style={styles.customColorInputContainer}>
            <TextInput
              style={styles.customColorInput}
              value={customColor}
              onChangeText={handleCustomColorChange}
              placeholder="#000000"
              placeholderTextColor="#999"
              maxLength={7}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={styles.applyColorButton}
              onPress={() => onColorSelect(customColor)}>
              <Text style={styles.applyColorButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.colorFormatHint}>
            Format: #RRGGBB (e.g., #FF0000 for red)
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const AddProduct = () => {
  const route = useRoute();
  const productId = route?.params?.productId;

  // Initialize with proper default values
  const getInitialFormData = () => ({
    images: [],
    productName: '',
    productDescription: '',
    discount: '',
    discountPrice: '',
    productPrice: '',
    addedStock: '',
    openingStock: '',
    remainingStock: '',
    ledColors: [{color: '#000000', discount: ''}],
    bodyColors: [{color: '#000000', discount: ''}],
    reflectors: [{color: '#000000', discount: ''}],
    watts: [{value: '', discount: ''}],
    categoryId: '',
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const navigation = useNavigation();
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [currentColorField, setCurrentColorField] = useState(null);
  const [imagePickerVisible, setImagePickerVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [allCategories, setAllCategories] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchSingleProduct(productId);
    }
  }, [productId]);

  useEffect(() => {
    getAllCategories(1, true);
  }, []);

  const fetchSingleProduct = async id => {
    try {
      setLoader(true);
      const response = await getSingleProduct(id);
      if (response?.data?.status === 'success') {
        const productData = response?.data?.data;
        console.log('==>response', response?.data?.data);

        // Properly handle the data conversion
        setFormData({
          images: productData?.image || [],
          productName: productData?.productName || '',
          productDescription: productData?.productDescription || '',
          // Convert numbers to strings for controlled inputs
          discount: productData?.discount ? String(productData.discount) : '',
          discountPrice: productData?.discountPrice
            ? String(productData.discountPrice)
            : '',
          productPrice: productData?.productPrice
            ? String(productData.productPrice)
            : '',
          addedStock: productData?.addedStock
            ? String(productData.addedStock)
            : '',
          openingStock: productData?.openingStock
            ? String(productData.openingStock)
            : '',
          remainingStock: productData?.remainingStock
            ? String(productData.remainingStock)
            : '',

          // Handle array fields with proper fallbacks
          ledColors:
            productData?.ledColors && productData.ledColors.length > 0
              ? productData.ledColors.map(item => ({
                  color: item.color || '#000000',
                  discount: item.discount ? String(item.discount) : '',
                }))
              : [{color: '#000000', discount: ''}],

          bodyColors:
            productData?.bodyColors && productData.bodyColors.length > 0
              ? productData.bodyColors.map(item => ({
                  color: item.color || '#000000',
                  discount: item.discount ? String(item.discount) : '',
                }))
              : [{color: '#000000', discount: ''}],

          reflectors:
            productData?.reflectors && productData.reflectors.length > 0
              ? productData.reflectors.map(item => ({
                  color: item.color || '#000000',
                  discount: item.discount ? String(item.discount) : '',
                }))
              : [{color: '#000000', discount: ''}],

          watts:
            productData?.watts && productData.watts.length > 0
              ? productData.watts.map(item => ({
                  value: item.value ? String(item.value) : '',
                  discount: item.discount ? String(item.discount) : '',
                }))
              : [{value: '', discount: ''}],

          categoryId: productData?.categoryId || '',
        });
      }
    } catch (e) {
      console.log('Error fetching product:', e);
      Alert.alert('Error', 'Failed to load product data');
    } finally {
      setLoader(false);
    }
  };

  const getAllCategories = async (pageNum = 1, isInitial = false) => {
    if (isInitial) setLoading(true);
    else setIsFetchingMore(true);

    try {
      const response = await getProductCategories(pageNum);
      console.log('RAW API RESPONSE:', JSON.stringify(response?.data, null, 2));

      if (response?.data?.status === 'success') {
        const res = response?.data?.data?.categories || [];

        const mappedList = res.map(cat => ({
          label: cat.name || cat.category_name || 'No Name',
          value: cat.id || cat.category_id || null,
        }));

        if (pageNum === 1) {
          setAllCategories(mappedList);
        } else {
          setAllCategories(prev => [...prev, ...mappedList]);
        }

        setHasMore(res.length >= 15);
      } else {
        Alert.alert('Error', 'Failed to fetch categories');
      }
    } catch (error) {
      console.log('Error fetching categories:', error);
      Alert.alert('Error', 'Failed to fetch categories');
    } finally {
      if (isInitial) setLoading(false);
      else setIsFetchingMore(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayFieldChange = (arrayName, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) =>
        i === index ? {...item, [field]: value} : item,
      ),
    }));
  };

  const addArrayItem = arrayName => {
    const newItem =
      arrayName === 'watts'
        ? {value: '', discount: ''}
        : {color: '#000000', discount: ''};

    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], newItem],
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    if (formData[arrayName].length > 1) {
      setFormData(prev => ({
        ...prev,
        [arrayName]: prev[arrayName].filter((_, i) => i !== index),
      }));
    }
  };

  const openColorPicker = (arrayName, index) => {
    try {
      const currentColor = formData[arrayName][index]?.color || '#000000';
      setCurrentColorField({arrayName, index});
      setSelectedColor(currentColor);
      setColorPickerVisible(true);
    } catch (error) {
      console.log('Error opening color picker:', error);
      Alert.alert('Error', 'Unable to open color picker');
    }
  };

  const handleColorSelect = color => {
    let hexColor = color;

    if (color && !color.startsWith('#')) {
      hexColor = `#${color}`;
    }

    if (/^#[0-9A-F]{6}$/i.test(hexColor)) {
      setSelectedColor(hexColor.toUpperCase());
    } else if (/^#[0-9A-F]{3}$/i.test(hexColor)) {
      const expanded = hexColor.replace(
        /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
        '#$1$1$2$2$3$3',
      );
      setSelectedColor(expanded.toUpperCase());
    } else if (/^#[0-9A-F]{0,6}$/i.test(hexColor)) {
      setSelectedColor(hexColor.toUpperCase());
    }
  };

  const confirmColorSelection = () => {
    try {
      if (currentColorField && selectedColor) {
        if (/^#[0-9A-F]{6}$/i.test(selectedColor)) {
          handleArrayFieldChange(
            currentColorField.arrayName,
            currentColorField.index,
            'color',
            selectedColor,
          );
        }
      }
    } catch (error) {
      console.log('Error confirming color selection:', error);
      Alert.alert('Error', 'Unable to apply color selection');
    }
    setColorPickerVisible(false);
    setCurrentColorField(null);
  };

  const cancelColorSelection = () => {
    setColorPickerVisible(false);
    setCurrentColorField(null);
    if (currentColorField) {
      const originalColor =
        formData[currentColorField.arrayName][currentColorField.index]?.color ||
        '#000000';
      setSelectedColor(originalColor);
    }
  };

  const selectImages = () => {
    setImagePickerVisible(true);
  };

  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.7,
    };

    launchCamera(options, response => {
      if (response.assets && response.assets[0]) {
        const base64 = `data:${response.assets[0].type};base64,${response.assets[0].base64}`;
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, base64],
        }));
      }
      setImagePickerVisible(false);
    });
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.7,
      selectionLimit: 0,
    };

    launchImageLibrary(options, response => {
      if (response.assets) {
        const newImages = response.assets.map(
          asset => `data:${asset.type};base64,${asset.base64}`,
        );
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newImages],
        }));
      }
      setImagePickerVisible(false);
    });
  };

  const removeImage = index => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleDirectColorInput = (arrayName, index, value) => {
    let colorValue = value;
    if (value && !value.startsWith('#')) {
      colorValue = `#${value}`;
    }

    if (!value || /^#[0-9A-F]{0,6}$/i.test(colorValue)) {
      handleArrayFieldChange(arrayName, index, 'color', colorValue);
    }
  };

  const prepareDataForSubmission = data => {
    return {
      ...data,
      discount: data.discount ? parseFloat(data.discount) : 0,
      discountPrice: data.discountPrice ? parseFloat(data.discountPrice) : 0,
      productPrice: data.productPrice ? parseFloat(data.productPrice) : 0,
      addedStock: data.addedStock ? parseInt(data.addedStock) : 0,
      openingStock: data.openingStock ? parseInt(data.openingStock) : 0,
      remainingStock: data.remainingStock ? parseInt(data.remainingStock) : 0,
      ledColors: data.ledColors.map(item => ({
        color: item.color,
        discount: item.discount ? parseFloat(item.discount) : 0,
      })),
      bodyColors: data.bodyColors.map(item => ({
        color: item.color,
        discount: item.discount ? parseFloat(item.discount) : 0,
      })),
      reflectors: data.reflectors.map(item => ({
        color: item.color,
        discount: item.discount ? parseFloat(item.discount) : 0,
      })),
      watts: data.watts.map(item => ({
        value: item.value ? parseInt(item.value) : 0,
        discount: item.discount ? parseFloat(item.discount) : 0,
      })),
    };
  };

  const handleSubmit = async () => {
    if (!formData.productName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Product name is required',
      });
      return;
    }

    if (!formData.categoryId) {
      Toast.show({
        type: 'error',
        text1: 'Please select a product category',
      });
      return;
    }

    if (!formData.productPrice || parseFloat(formData.productPrice) <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Please enter a valid product price',
      });
      return;
    }

    const submissionData = prepareDataForSubmission(formData);
    setIsLoading(true);

    try {
      let response;
      if (productId) {
        response = await updateProduct(productId, submissionData);
      } else {
        response = await addProduct(submissionData);
      }

      if (response?.data?.status === 'success') {
        Toast.show({
          type: 'success',
          text1: `Product ${productId ? 'updated' : 'added'} successfully`,
        });

        navigation.navigate(Routes.DrawerStack, {
          screen: Routes.AdminProducts,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: response?.data?.message || 'Something went wrong',
        });
      }
    } catch (e) {
      console.log('Submit error:', e);
      Toast.show({
        type: 'error',
        text1: 'Failed to save product. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderImageItem = ({item, index}) => (
    <View style={styles.imageItemContainer}>
      <Image source={{uri: item}} style={styles.imageItem} />
      <TouchableOpacity
        style={styles.removeImageButton}
        onPress={() => removeImage(index)}>
        <Text style={styles.removeImageText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  const renderArraySection = (title, arrayName, isWatts = false) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title} <Text style={{color: 'red'}}>*</Text></Text>
      {formData[arrayName].map((item, index) => (
        <View key={index} style={styles.arrayItemContainer}>
          <View style={styles.arrayItemHeader}>
            <Text style={styles.arrayItemTitle}>
              {title.slice(0, -1)}  {index + 1}
            </Text>
            {formData[arrayName].length > 1 && (
              <TouchableOpacity
                onPress={() => removeArrayItem(arrayName, index)}
                style={styles.removeButton}>
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.arrayItemFields}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                {isWatts ? 'Watts Value' : 'Color'}
              </Text>
              {isWatts ? (
                <TextInput
                  style={styles.input}
                  value={String(item.value)}
                  onChangeText={value =>
                    handleArrayFieldChange(arrayName, index, 'value', value)
                  }
                  keyboardType="numeric"
                  placeholder="Enter watts value"
                  placeholderTextColor="#999"
                />
              ) : (
                <View style={styles.colorInputContainer}>
                  <TouchableOpacity
                    style={[
                      styles.colorPreview,
                      {backgroundColor: item.color || '#000000'},
                    ]}
                    onPress={() => openColorPicker(arrayName, index)}
                    activeOpacity={0.7}
                  />
                  <Text>{item.color || '#000000'}</Text>
                </View>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Discount (%)</Text>
              <TextInput
                style={styles.input}
                value={String(item.discount)}
                onChangeText={value =>
                  handleArrayFieldChange(arrayName, index, 'discount', value)
                }
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>
          </View>
        </View>
      ))}

      <TouchableOpacity
        onPress={() => addArrayItem(arrayName)}
        style={styles.addButton}>
        <Text style={styles.addButtonText}>Add {title.slice(0, -1)}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <View style={{alignItems: 'center'}}>
            <View style={[styles.smallContainer]}>
              <Icon
                icon="Ionicons"
                name="chevron-back-outline"
                containerStyle={styles.leftIconSubContainer}
                onPress={() =>
                  navigation.navigate(Routes.DrawerStack, {
                    screen: Routes.AdminProducts,
                  })
                }
                size={20}
                color={colors.primary}
              />
            </View>
          </View>
          <Typography
            title={productId ? 'Edit Product' : 'Add Product'}
            size={20}
            font={FONTS.INTER_MEDIUM}
          />
          <View />
        </View>
        {loader ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size={22} color={COLORS.APP_PRIMARY} />
          </View>
        ) : (
          <>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>
                Basic Information <Text style={{color: 'red'}}>*</Text>
              </Text>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Product Images *</Text>

                {formData.images.length > 0 && (
                  <FlatList
                    data={formData.images}
                    renderItem={renderImageItem}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.imagesList}
                  />
                )}

                <TouchableOpacity
                  onPress={selectImages}
                  style={styles.imageUploadButton}>
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.imagePlaceholderText}>
                      Tap to add images
                    </Text>
                    <Text style={styles.imageCountText}>
                      {formData.images.length} image(s) selected
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Product Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.productName}
                  onChangeText={value =>
                    handleFieldChange('productName', value)
                  }
                  placeholder="Enter product name"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Product Description *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.productDescription}
                  onChangeText={value =>
                    handleFieldChange('productDescription', value)
                  }
                  placeholder="Enter product description"
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>
                Product category <Text style={{color: 'red'}}>*</Text>
              </Text>

              <View style={styles.fieldContainer}>
                {loading ? (
                  <ActivityIndicator size="small" color={COLORS.APP_PRIMARY} />
                ) : (
                  <Dropdown
                    style={[styles.input, styles.dropdown]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={allCategories}
                    itemTextStyle={{color: COLORS.APP_BLACK}}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? 'Select Category' : '...'}
                    searchPlaceholder="Search..."
                    value={formData.categoryId}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                      setFormData({...formData, categoryId: item.value});
                      setIsFocus(false);
                    }}
                    containerStyle={{color: COLORS.APP_BLACK}}
                  />
                )}
                {!loading && allCategories.length === 0 && (
                  <Text style={{color: 'gray', marginTop: 5}}>
                    No categories found
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Pricing <Text style={{color: 'red'}}>*</Text></Text>

              <View style={styles.row}>
                <View style={[styles.fieldContainer, styles.halfWidth]}>
                  <Text style={styles.label}>Discount (%) *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.discount}
                    onChangeText={value => handleFieldChange('discount', value)}
                    placeholder="0"
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={[styles.fieldContainer, styles.halfWidth]}>
                  <Text style={styles.label}>Discount Price *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.discountPrice}
                    onChangeText={value =>
                      handleFieldChange('discountPrice', value)
                    }
                    placeholder="0.00"
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Product Price *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.productPrice}
                  onChangeText={value =>
                    handleFieldChange('productPrice', value)
                  }
                  placeholder="0.00"
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Stock Management <Text style={{color: 'red'}}>*</Text></Text>

              <View style={styles.row}>
                <View style={[styles.fieldContainer, styles.halfWidth]}>
                  <Text style={styles.label}>Added Stock *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.addedStock}
                    onChangeText={value =>
                      handleFieldChange('addedStock', value)
                    }
                    placeholder="0"
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={[styles.fieldContainer, styles.halfWidth]}>
                  <Text style={styles.label}>Opening Stock *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.openingStock}
                    onChangeText={value =>
                      handleFieldChange('openingStock', value)
                    }
                    placeholder="0"
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Remaining Stock *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.remainingStock}
                  onChangeText={value =>
                    handleFieldChange('remainingStock', value)
                  }
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {renderArraySection('LED Colors ', 'ledColors')}
            {renderArraySection('Body Colors ', 'bodyColors')}
            {renderArraySection('Reflectors', 'reflectors')}
            {renderArraySection('Watts', 'watts', true)}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}>
              {isLoading ? (
                <ActivityIndicator size={18} color={COLORS.APP_WHITE} />
              ) : (
                <Text style={styles.submitButtonText}>Save</Text>
              )}
            </TouchableOpacity>

            <View style={{height: 50}} />
          </>
        )}
      </ScrollView>

      <Modal
        visible={colorPickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={cancelColorSelection}>
        <View style={styles.modalContainer}>
          <View style={styles.colorPickerContainer}>
            <Text style={styles.modalTitle}>Select Color</Text>

            <SimpleColorPicker
              selectedColor={selectedColor}
              onColorSelect={handleColorSelect}
            />

            <View style={styles.colorPreviewContainer}>
              <View
                style={[
                  styles.selectedColorPreview,
                  {backgroundColor: selectedColor},
                ]}
              />
              <Text style={styles.selectedColorText}>{selectedColor}</Text>
            </View>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmColorSelection}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelColorSelection}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={imagePickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setImagePickerVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.imagePickerContainer}>
            <Text style={styles.modalTitle}>Add Images</Text>
            <TouchableOpacity style={styles.optionButton} onPress={openCamera}>
              <Text style={styles.optionButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={openGallery}>
              <Text style={styles.optionButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setImagePickerVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AddProduct;
