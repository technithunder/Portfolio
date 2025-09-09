import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRoute} from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './style';
import {COLORS} from '../../theme/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {Routes} from '../../constants';
import {
  addToCartAPI,
  addWishList,
  getAllProducts,
  getSingleProducts,
} from '../../api';
import ProductCarousel from './ProductCarousel';
import {Typography} from '../../components';
import {FONTS} from '../../constants/fonts';
import {commonSty} from '../../theme';
import SubColor from './SubColor';
import SubSize from './SubSize';
import Toast from 'react-native-toast-message';
import Rating from '../newHome/Rating';

const NewProductDetail = ({navigation}) => {
  const route = useRoute();
  const {productId} = route.params;

  const [isLiked, setIsLiked] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);

  // Selection states
  const [selectedLedColor, setSelectedLedColor] = useState(null);
  const [selectedBodyColor, setSelectedBodyColor] = useState(null);
  const [selectedWatts, setSelectedWatts] = useState(null);
  const [selectedReflectors, setSelectedReflectors] = useState(null);

  // Price states
  const [currentPrice, setCurrentPrice] = useState(0);
  const [basePrice, setBasePrice] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [isExpandedDescription, setIsExpandedDescription] = useState(true);
  const [isExpandedSimilarProducts, setIsExpandedSimilarProducts] = useState(false);
  const [isLoader, setIsLoader] = useState(false);

  useEffect(() => {
    fetchSingleProduct(productId);
  }, [productId]);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (product) {
      setIsLiked(product.isWishlisted || false);
    }
  }, [product]);

  useEffect(() => {
    if (product?.productPrice) {
      setBasePrice(product.productPrice);
      setCurrentPrice(product.afterDiscountPrice || product.productPrice);
    }
  }, [product]);

  // Update price and variant when selections change
  useEffect(() => {
    if (product) {
      updatePriceAndVariant();
    }
  }, [selectedLedColor, selectedBodyColor, selectedWatts, selectedReflectors, product]);

  const fetchAllProducts = async () => {
    try {
      const response = await getAllProducts(1);
      setSimilarProducts(response?.data?.data?.products);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchSingleProduct = async id => {
    setIsLoading(true);
    try {
      const response = await getSingleProducts(id);
      console.log(response, 'Single product response');
      setProduct(response?.data?.data);
    } catch (error) {
      setIsLoading(false);
      console.log(error, 'Error fetching single product');
    } finally {
      setIsLoading(false);
    }
  };

  // Extract unique options from variants
  const getUniqueOptions = () => {
    if (!product?.variants) return {
      ledColors: [],
      bodyColors: [],
      watts: [],
      reflectors: []
    };

    const ledColors = [];
    const bodyColors = [];
    const watts = [];
    const reflectors = [];

    product.variants.forEach(variant => {
      // LED Colors
      if (variant.ledColor && !ledColors.find(item => item.name === variant.ledColor.name)) {
        ledColors.push({
          color: variant.ledColor.name,
          colorCode: variant.ledColor.code,
          discount: variant.ledColor.discount
        });
      }

      // Body Colors
      if (variant.bodyColor && !bodyColors.find(item => item.name === variant.bodyColor.name)) {
        bodyColors.push({
          color: variant.bodyColor.name,
          colorCode: variant.bodyColor.code,
          discount: variant.bodyColor.discount
        });
      }

      // Watts
      if (variant.watts && !watts.find(item => item.value === variant.watts.value)) {
        watts.push({
          value: variant.watts.value,
          discount: variant.watts.discount
        });
      }

      // Reflectors
      if (variant.reflector && !reflectors.find(item => item.name === variant.reflector.name)) {
        reflectors.push({
          color: variant.reflector.name,
          colorCode: variant.reflector.code,
          discount: variant.reflector.discount
        });
      }
    });

    return { ledColors, bodyColors, watts, reflectors };
  };

  // Find matching variant and calculate price
  const updatePriceAndVariant = () => {
    if (!product?.variants) {
      setCurrentPrice(product?.afterDiscountPrice || product?.productPrice || 0);
      return;
    }

    // Find exact matching variant
    const matchingVariant = product.variants.find(variant => {
      const ledMatch = !selectedLedColor || variant.ledColor?.name === selectedLedColor;
      const bodyMatch = !selectedBodyColor || variant.bodyColor?.name === selectedBodyColor;
      const wattsMatch = !selectedWatts || variant.watts?.value === selectedWatts;
      const reflectorMatch = !selectedReflectors || variant.reflector?.name === selectedReflectors;

      return ledMatch && bodyMatch && wattsMatch && reflectorMatch;
    });

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
      
      // Calculate price with all selected discounts
      let calculatedPrice = product.afterDiscountPrice || product.productPrice;
      
      if (selectedLedColor && matchingVariant.ledColor) {
        calculatedPrice += (calculatedPrice * matchingVariant.ledColor.discount) / 100;
      }
      
      if (selectedBodyColor && matchingVariant.bodyColor) {
        calculatedPrice += (calculatedPrice * matchingVariant.bodyColor.discount) / 100;
      }
      
      if (selectedWatts && matchingVariant.watts) {
        calculatedPrice += (calculatedPrice * matchingVariant.watts.discount) / 100;
      }
      
      if (selectedReflectors && matchingVariant.reflector) {
        calculatedPrice += (calculatedPrice * matchingVariant.reflector.discount) / 100;
      }

      setCurrentPrice(Math.max(calculatedPrice, 0));
    } else {
      // No exact match, use base price
      setCurrentPrice(product?.afterDiscountPrice || product?.productPrice || 0);
      setSelectedVariant(null);
    }
  };

  const handleLikePress = async () => {
    if (isLikeLoading) return;

    setIsLikeLoading(true);
    const previousLikeState = isLiked;

    try {
      setIsLiked(!isLiked);

      const obj = {
        productId: product.id,
      };

      const response = await addWishList(obj);

      if (response?.data?.status === 'success') {
        setProduct(prev => ({
          ...prev,
          isWishlisted: !previousLikeState,
        }));

        Toast.show({
          type: 'success',
          text1: !previousLikeState
            ? 'Added to wishlist'
            : 'Removed from wishlist',
        });
      } else {
        setIsLiked(previousLikeState);
        Toast.show({
          type: 'error',
          text1: response?.data?.message || 'Failed to update wishlist',
        });
      }
    } catch (error) {
      setIsLiked(previousLikeState);
      console.log('Wishlist API Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to update wishlist',
      });
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleSimilarProductLike = async productItem => {
    try {
      const obj = {
        productId: productItem.id,
      };

      const response = await addWishList(obj);

      if (response?.data?.status === 'success') {
        setSimilarProducts(prev =>
          prev.map(item =>
            item.id === productItem.id
              ? {...item, isWishlisted: !item.isWishlisted}
              : item,
          ),
        );

        Toast.show({
          type: 'success',
          text1: !productItem.isWishlisted
            ? 'Added to wishlist'
            : 'Removed from wishlist',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: response?.data?.message || 'Failed to update wishlist',
        });
      }
    } catch (error) {
      console.log('Similar product wishlist error:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to update wishlist',
      });
    }
  };

  const renderWattsItem = ({item, index}) => {
    const isSelected = selectedWatts === item.value;
    const onPress = () => {
      setSelectedWatts(isSelected ? null : item.value);
    };

    return (
      <View key={index}>
        <SubSize item={item.value} isSelected={isSelected} onPress={onPress} />
      </View>
    );
  };

  const renderReflectorsItem = ({item, index}) => {
    const isSelected = selectedReflectors === item.color;
    const onPress = () => {
      setSelectedReflectors(isSelected ? null : item.color);
    };

    return (
      <View key={index}>
        <SubColor
          item={{
            id: index,
            color: item.colorCode,
            name: item.color,
          }}
          isSelected={isSelected}
          onPress={onPress}
        />
      </View>
    );
  };

  const renderLedColorItem = ({item}) => {
    const isSelected = selectedLedColor === item.color;
    const onPress = () => {
      setSelectedLedColor(isSelected ? null : item.color);
    };
    return (
      <View key={item.color}>
        <SubColor
          item={{
            id: item.color,
            color: item.colorCode,
            name: item.color,
          }}
          isSelected={isSelected}
          onPress={onPress}
        />
      </View>
    );
  };

  const renderBodyColorItem = ({item}) => {
    const isSelected = selectedBodyColor === item.color;
    const onPress = () => {
      setSelectedBodyColor(isSelected ? null : item.color);
    };

    return (
      <View key={item.color}>
        <SubColor
          item={{
            id: item.color,
            color: item.colorCode,
            name: item.color,
          }}
          isSelected={isSelected}
          onPress={onPress}
        />
      </View>
    );
  };

  const getFilteredOptions = () => {
  if (!product?.variants) return {
    ledColors: [],
    bodyColors: [],
    watts: [],
    reflectors: []
  };

  let availableVariants = product.variants;

  // Only filter if something is selected, otherwise show all
  if (selectedLedColor || selectedBodyColor || selectedWatts || selectedReflectors) {
    availableVariants = product.variants.filter(variant => {
      const ledMatch = !selectedLedColor || variant.ledColor?.name === selectedLedColor;
      const bodyMatch = !selectedBodyColor || variant.bodyColor?.name === selectedBodyColor;
      const wattsMatch = !selectedWatts || variant.watts?.value === selectedWatts;
      const reflectorMatch = !selectedReflectors || variant.reflector?.name === selectedReflectors;
      
      return ledMatch && bodyMatch && wattsMatch && reflectorMatch;
    });
  }

  const ledColors = [];
  const bodyColors = [];
  const watts = [];
  const reflectors = [];

  availableVariants.forEach(variant => {

    if (variant.ledColor && !ledColors.find(item => item.color === variant.ledColor.name)) {
      ledColors.push({
        color: variant.ledColor.name,
        colorCode: variant.ledColor.code,
        discount: variant.ledColor.discount
      });
    }

    if (variant.bodyColor && !bodyColors.find(item => item.color === variant.bodyColor.name)) {
      bodyColors.push({
        color: variant.bodyColor.name,
        colorCode: variant.bodyColor.code,
        discount: variant.bodyColor.discount
      });
    }

    if (variant.watts && !watts.find(item => item.value === variant.watts.value)) {
      watts.push({
        value: variant.watts.value,
        discount: variant.watts.discount
      });
    }

    if (variant.reflector && !reflectors.find(item => item.color === variant.reflector.name)) {
      reflectors.push({
        color: variant.reflector.name,
        colorCode: variant.reflector.code,
        discount: variant.reflector.discount
      });
    }
  });

  return { ledColors, bodyColors, watts, reflectors };
};

  const renderProductVariant = () => {
  const filteredOptions = getFilteredOptions();

  return (
    <View>
      {filteredOptions.ledColors.length > 0 && (
        <View style={commonSty.rowSpaceBetween}>
          <View style={[styles.bodyColorSizeContainer, {width: '100%'}]}>
            <Text style={styles.variantLabel}>LED Color</Text>
            <FlatList
              data={filteredOptions.ledColors}
              showsVerticalScrollIndicator={false}
              renderItem={renderLedColorItem}
              horizontal={true}
              keyExtractor={item => item.color}
            />
          </View>
        </View>
      )}

      {filteredOptions.bodyColors.length > 0 && (
        <View style={[styles.bodyColorSizeContainer, {width: '100%',marginTop:10}]}>
          <Text style={styles.variantLabel}>Body Color</Text>
          <FlatList
            data={filteredOptions.bodyColors}
            showsVerticalScrollIndicator={false}
            renderItem={renderBodyColorItem}
            horizontal={true}
            keyExtractor={item => item.color}
          />
        </View>
      )}

      <View>
        {filteredOptions.watts.length > 0 && (
          <View style={[styles.bodyColorSizeContainer,{width: '100%',marginTop:10}]}>
            <Text style={styles.variantLabel}>Watts</Text>
            <FlatList
              data={filteredOptions.watts}
              showsVerticalScrollIndicator={false}
              renderItem={renderWattsItem}
              horizontal={true}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )}

      </View>
        {filteredOptions.reflectors.length > 0 && (
          <View style={[styles.bodyColorSizeContainer,{width: '100%'}]}>
            <Text style={styles.variantLabel}>Reflectors</Text>
            <FlatList
              data={filteredOptions.reflectors}
              showsVerticalScrollIndicator={false}
              renderItem={renderReflectorsItem}
              horizontal={true}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )}
    </View>
  );
};

  const Divider = () => {
    return <View style={styles.horizontalLine} />;
  };

  const renderSimilarProducts = () => {
    return (
      <View style={{marginTop: 6}}>
        <TouchableOpacity
          onPress={() =>
            setIsExpandedSimilarProducts(!isExpandedSimilarProducts)
          }
          style={styles.descriptionAccordian}>
          <Typography
            title={'Similar Product'}
            size={16}
            font={FONTS.INTER_REGULAR}
          />
          <Entypo name="chevron-thin-down" size={16} color={COLORS.APP_BLACK} />
        </TouchableOpacity>
        {isExpandedSimilarProducts && (
          <View style={{marginTop: 16}}>
            <FlatList
              data={similarProducts}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{flexDirection: 'row', gap: 18}}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity>
                    <View style={{position: 'relative'}}>
                      <Image
                        source={{uri: item.image[0]}}
                        style={{height: 120, width: 130, borderRadius: 10}}
                      />
                      <TouchableOpacity
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: 15,
                          padding: 6,
                        }}
                        onPress={() => handleSimilarProductLike(item)}>
                        <MaterialIcons
                          name={
                            item.isWishlisted ? 'favorite' : 'favorite-border'
                          }
                          size={16}
                          color={item.isWishlisted ? 'red' : COLORS.APP_BLACK}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={{marginTop: 10}}>
                      <Typography
                        title={item.productName}
                        size={12}
                        font={FONTS.INTER_REGULAR}
                      />
                      {item?.productPrice && (
                        <Typography
                          title={`₹ ${item?.productPrice?.toFixed(2)}`}
                          font={FONTS.INTER_MEDIUM}
                          size={14}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}
      </View>
    );
  };

  const renderProductDescription = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => setIsExpandedDescription(!isExpandedDescription)}
          style={styles.descriptionAccordian}>
          <Typography
            title={'Description'}
            size={16}
            font={FONTS.INTER_REGULAR}
          />
          <Entypo name="chevron-thin-down" size={16} color={COLORS.APP_BLACK} />
        </TouchableOpacity>
        {isExpandedDescription && (
          <View style={{marginTop: 16}}>
            <Text style={styles.productDesc}>
              {product?.productDescription}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderProductInfo = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{width: '70%'}}>
            <Typography
              title={product?.productName}
              size={18}
              font={FONTS.INTER_REGULAR}
              color={COLORS.APP_BLACK}
            />
          </View>

          <View style={{alignItems: 'flex-end'}}>
            {/* Show current calculated price */}
            <Typography
              title={`₹ ${currentPrice.toFixed(2)}`}
              font={FONTS.INTER_MEDIUM}
              size={16}
              color={COLORS.APP_PRIMARY}
            />
            
            {/* Show original price if there's a discount */}
            {product?.productPrice && currentPrice !== product.productPrice && (
              <Typography
                title={`₹ ${product.productPrice.toFixed(2)}`}
                font={FONTS.INTER_REGULAR}
                size={14}
                color={COLORS.APP_LIGHT_GRAY}
                style={{textDecorationLine: 'line-through'}}
              />
            )}
            
            {/* Show afterDiscountPrice if available and different from current */}
            {/* {product?.afterDiscountPrice && 
             product.afterDiscountPrice !== product.productPrice && 
             currentPrice === (product.afterDiscountPrice || product.productPrice) && (
              <Typography
                title={`Base: ₹ ${product.afterDiscountPrice.toFixed(2)}`}
                font={FONTS.INTER_REGULAR}
                size={12}
                color={COLORS.APP_GRAY}
              />
            )} */}
          </View>
        </View>
        
        {product?.averageRating !== 0 && <Rating rating={product?.averageRating} />}
        
        {/* Show selected variant info */}
        {selectedVariant && (
          <View style={{marginTop: 10, padding: 10, backgroundColor: COLORS.APP_LIGHT_GRAY, borderRadius: 8}}>
            <Typography
              title="Selected Configuration:"
              size={14}
              font={FONTS.INTER_MEDIUM}
              color={COLORS.APP_BLACK}
            />
            <Text style={{fontSize: 12, color: COLORS.APP_GRAY, marginTop: 4}}>
              {selectedLedColor && `LED: ${selectedLedColor}`}
              {selectedBodyColor && ` • Body: ${selectedBodyColor}`}
              {selectedWatts && ` • ${selectedWatts}W`}
              {selectedReflectors && ` • ${selectedReflectors}`}
              {/* {selectedVariant?.stock && ` • Stock: ${selectedVariant.stock}`} */}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderProductCarousel = () => {
    if (Array.isArray(product?.image) && product.image.length > 0) {
      return <ProductCarousel data={product.image} />;
    }
    return null;
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.navigate(Routes.BottomStack, {
              screen: Routes.Home,
            })
          }>
          <Ionicons name="chevron-back" size={20} color={COLORS.APP_BLACK} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.backButton, isLikeLoading && {opacity: 0.6}]}
          onPress={handleLikePress}
          disabled={isLikeLoading}>
          {isLikeLoading ? (
            <ActivityIndicator size={16} color={COLORS.APP_BLACK} />
          ) : (
            <MaterialIcons
              name={isLiked ? 'favorite' : 'favorite-border'}
              size={20}
              color={isLiked ? 'red' : COLORS.APP_BLACK}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderAddToCartButton = () => {
    return (
      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={onPressAddToCartBtn}>
        {isLoader ? (
          <ActivityIndicator size={16} color={COLORS.APP_WHITE} />
        ) : (
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <MaterialCommunityIcons
              name="cart"
              size={20}
              color={COLORS.APP_WHITE}
            />
            <Typography
              title={'Add To Cart'}
              size={16}
              font={FONTS.INTER_MEDIUM}
              color={COLORS.APP_WHITE}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const onPressAddToCartBtn = async () => {
  setIsLoader(true);

  try {
    if (selectedVariant) {
      if (!selectedLedColor || !selectedBodyColor || !selectedWatts || !selectedReflectors) {
        setIsLoader(false);
        Alert.alert("Please select all variants before adding to cart")
        return;
      }
    }



    let obj = {
      productId: product?.id,
      quantity: 1,
      price: currentPrice,
    };

    // Add variant details if selected
    if (selectedVariant) {
      if (selectedLedColor) {
        const ledColorData = getFilteredOptions().ledColors.find(item => item.color === selectedLedColor);
        obj['ledColor'] = {
          name: selectedLedColor,
          code: ledColorData?.colorCode
        };
      }
      
      if (selectedBodyColor) {
        const bodyColorData = getFilteredOptions().bodyColors.find(item => item.color === selectedBodyColor);
        obj['bodyColor'] = {
          name: selectedBodyColor,
          code: bodyColorData?.colorCode
        };
      }
      
      if (selectedWatts) {
        obj['watts'] = selectedWatts;
      }
      
      if (selectedReflectors) {
        const reflectorData = getFilteredOptions().reflectors.find(item => item.color === selectedReflectors);
        obj['reflector'] = {
          name: selectedReflectors,
          code: reflectorData?.colorCode
        };
      }
      
      obj['variantId'] = selectedVariant.id;
    }

    const response = await addToCartAPI(obj);
    if (response?.data?.status === 'success') {
      Toast.show({
        type: 'success',
        text1: response?.data?.message,
      });
      setIsLoader(false);
      navigation.navigate(Routes.BottomStack, {
        screen: Routes.Cart,
      });
    }
  } catch (e) {
    setIsLoader(false);
    console.log('Add to cart error:', e);
    Toast.show({
      type: 'error',
      text1: 'Failed to add to cart',
    });
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size={22} color={COLORS.APP_PRIMARY} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}>
          {renderProductCarousel()}
          <View style={styles.card}>
            {renderProductInfo()}
            <Divider />
            {renderProductVariant()}
            <Divider />
            {product?.productDescription && <>{renderProductDescription()}</>}
            {renderSimilarProducts()}
          </View>
          {renderAddToCartButton()}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default NewProductDetail;