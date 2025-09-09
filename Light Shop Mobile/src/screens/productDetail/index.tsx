import {
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Container, Icon, Typography} from '../../components';
import {
  categoryData,
  Images,
  productColorData,
  Routes,
  sizeData,
} from '../../constants';
import {colors, commonSty} from '../../theme';
import styles from './styles';
import {AddCart, ProductCarousel, SubColor, SubSize} from './components';
import {sizeType} from './types';

import {goBack, navigate} from '../../utils';
import {categoryItemProps} from '../home/types';
import {MiniProducts} from '../home/components';
import {useRoute} from '@react-navigation/native';
import {addToCart, addToCartAPI, getSingleProducts} from '../../api';
import Toast from 'react-native-toast-message';

const ProductDetail = ({navigation}) => {
  const route = useRoute();
  const {productId} = route.params as {productId: string};
  const rotate = useSharedValue(0);
  const rotateSimilar = useSharedValue(0);
  const rotateSimilarStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${rotateSimilar.value}deg`,
        },
      ],
    };
  });
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${rotate.value}deg`,
        },
      ],
    };
  });

  // Separate state for each selection type
  const [selectedLedColor, setSelectedLedColor] = useState<string | null>(null);
  const [selectedBodyColor, setSelectedBodyColor] = useState<string | null>(
    null,
  );
  const [selectedWatts, setSelectedWatts] = useState<number | null>(null);
  const [selectedReflectors, setSelectedReflectors] = useState<number | null>(
    null,
  );

  // Add state for real-time price
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [basePrice, setBasePrice] = useState<number>(0);

  const [showDescription, setShowDescription] = useState<boolean>(false);
  const [showReadMore, setShowReadMore] = useState<boolean>(false);
  const [showSimilar, setShowSimilar] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchSingleProduct(productId);
  }, [productId]);

  // Set base price when product loads
  useEffect(() => {
    if (product?.productPrice) {
      setBasePrice(product.productPrice);
      setCurrentPrice(product.productPrice);
    }
  }, [product]);

  // Update price whenever any selection changes
  useEffect(() => {
    if (product) {
      const newPrice = calculateFinalPrice();
      setCurrentPrice(newPrice);
    }
  }, [
    selectedLedColor,
    selectedBodyColor,
    selectedWatts,
    selectedReflectors,
    product,
  ]);

  const fetchSingleProduct = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await getSingleProducts(id);
      setProduct(response?.data?.data);
      console.log(response, 'Single product response');
    } catch (error) {
      setIsLoading(false);
      console.log(error, 'Error fetching single product');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate price step by step (cascading)
  const calculateFinalPrice = () => {
    if (!product) return 0;

    let currentCalculationPrice = product.productPrice;

    // Step 1: Apply LED color discount first
    if (selectedLedColor) {
      const ledColorData = product.ledColors?.find(
        item => item.color === selectedLedColor,
      );
      if (ledColorData) {
        currentCalculationPrice =
          currentCalculationPrice +
          (currentCalculationPrice * ledColorData.discount) / 100;
      }
    }

    // Step 2: Apply body color discount on updated price
    if (selectedBodyColor) {
      const bodyColorData = product.bodyColors?.find(
        item => item.color === selectedBodyColor,
      );
      if (bodyColorData) {
        currentCalculationPrice =
          currentCalculationPrice +
          (currentCalculationPrice * bodyColorData.discount) / 100;
      }
    }

    // Step 3: Apply watts discount on updated price
    if (selectedWatts) {
      const wattsData = product.watts?.find(
        item => item.value === selectedWatts,
      );
      if (wattsData) {
        currentCalculationPrice =
          currentCalculationPrice +
          (currentCalculationPrice * wattsData.discount) / 100;
      }
    }

    // Step 4: Apply reflectors discount on updated price
    if (selectedReflectors) {
      const reflectorsData = product.reflectors?.find(
        item => item.value === selectedReflectors,
      );
      if (reflectorsData) {
        currentCalculationPrice =
          currentCalculationPrice +
          (currentCalculationPrice * reflectorsData.discount) / 100;
      }
    }

    return Math.max(currentCalculationPrice, 0); // Ensure price doesn't go below 0
  };

  // Get current base price for calculating individual filter impacts
  const getCurrentBasePrice = () => {
    if (!product) return 0;

    let currentCalculationPrice = product.productPrice;

    // Apply LED color discount first
    if (selectedLedColor) {
      const ledColorData = product.ledColors?.find(
        item => item.color === selectedLedColor,
      );
      if (ledColorData) {
        currentCalculationPrice =
          currentCalculationPrice +
          (currentCalculationPrice * ledColorData.discount) / 100;
      }
    }

    // Apply body color discount on updated price
    if (selectedBodyColor) {
      const bodyColorData = product.bodyColors?.find(
        item => item.color === selectedBodyColor,
      );
      if (bodyColorData) {
        currentCalculationPrice =
          currentCalculationPrice +
          (currentCalculationPrice * bodyColorData.discount) / 100;
      }
    }

    // Apply watts discount on updated price
    if (selectedWatts) {
      const wattsData = product.watts?.find(
        item => item.value === selectedWatts,
      );
      if (wattsData) {
        currentCalculationPrice =
          currentCalculationPrice +
          (currentCalculationPrice * wattsData.discount) / 100;
      }
    }

    return currentCalculationPrice;
  };

  // Get price difference for display
  const getPriceDifference = () => {
    const difference = currentPrice - basePrice;
    if (difference > 0) {
      return `+₹${difference.toFixed(2)}`;
    } else if (difference < 0) {
      return `-₹${Math.abs(difference).toFixed(2)}`;
    }
    return null;
  };

  // Transform API data for LED colors to match component structure
  const getLedColorData = () => {
    if (!product?.ledColors) return [];
    return product.ledColors.map((item, index) => ({
      id: index + 1,
      color: item.color,
      discount: item.discount,
      colorCode: getColorCode(item.color),
    }));
  };

  // Transform API data for body colors
  const getBodyColorData = () => {
    if (!product?.bodyColors) return [];
    return product.bodyColors.map((item, index) => ({
      id: index + 1,
      color: item.color,
      discount: item.discount,
      colorCode: getColorCode(item.color),
    }));
  };

  // Helper function to get color codes
  const getColorCode = (colorName: string) => {
    return colorName?.toLowerCase() || '#CCCCCC';
  };

  // Enhanced render functions with cascading price impact display
  const renderWattsItem = ({item, index}: {item: any; index: number}) => {
    const isSelected = selectedWatts === item.value;
    const onPress = () => {
      setSelectedWatts(isSelected ? null : item.value);
    };

    // Calculate price impact based on current base price (after LED and Body color)
    const currentBase = getCurrentBasePrice();
    const priceImpact = item.discount ? (currentBase * item.discount) / 100 : 0;

    return (
      <View key={index}>
        <SubSize item={item.value} isSelected={isSelected} onPress={onPress} />
        {/* Show price impact */}
        {item.discount !== 0 && (
          <Typography
            title={
              priceImpact > 0
                ? `+₹${priceImpact.toFixed(0)}`
                : `₹${priceImpact.toFixed(0)}`
            }
            size={10}
            color={priceImpact > 0 ? colors.red : colors.green}
            style={{textAlign: 'center', marginTop: 2}}
          />
        )}
      </View>
    );
  };

  const renderReflectorsItem = ({item, index}: {item: any; index: number}) => {
    const isSelected = selectedReflectors === item.value;
    const onPress = () => {
      setSelectedReflectors(isSelected ? null : item.value);
    };

    // Calculate price impact based on current price (after LED, Body, and Watts)
    let currentBase = getCurrentBasePrice();

    // If watts is selected, add its impact too
    if (selectedWatts) {
      const wattsData = product.watts?.find(
        item => item.value === selectedWatts,
      );
      if (wattsData) {
        currentBase = currentBase + (currentBase * wattsData.discount) / 100;
      }
    }

    const priceImpact = item.discount ? (currentBase * item.discount) / 100 : 0;

    return (
      <View key={index}>
        <SubSize item={item.value} isSelected={isSelected} onPress={onPress} />
        {item.discount !== 0 && (
          <Typography
            title={
              priceImpact > 0
                ? `+₹${priceImpact.toFixed(0)}`
                : `₹${priceImpact.toFixed(0)}`
            }
            size={10}
            color={priceImpact > 0 ? colors.red : colors.green}
            style={{textAlign: 'center', marginTop: 2}}
          />
        )}
      </View>
    );
  };

  const renderLedColorItem = ({item}: {item: any}) => {
    const isSelected = selectedLedColor === item.color;
    const onPress = () => {
      setSelectedLedColor(isSelected ? null : item.color);
    };

    // LED color is applied on base price
    const priceImpact = item.discount ? (basePrice * item.discount) / 100 : 0;

    return (
      <View key={item.id}>
        <SubColor
          item={{
            id: item.id,
            color: item.colorCode,
            name: item.color,
          }}
          isSelected={isSelected}
          onPress={onPress}
        />
        {item.discount !== 0 && (
          <Typography
            title={
              priceImpact > 0
                ? `+₹${priceImpact.toFixed(0)}`
                : `₹${priceImpact.toFixed(0)}`
            }
            size={10}
            color={priceImpact > 0 ? colors.red : colors.green}
            style={{textAlign: 'center', marginTop: 2}}
          />
        )}
      </View>
    );
  };

  const renderBodyColorItem = ({item}: {item: any}) => {
    const isSelected = selectedBodyColor === item.color;
    const onPress = () => {
      setSelectedBodyColor(isSelected ? null : item.color);
    };

    // Body color is applied on price after LED color
    let currentBase = product.productPrice;
    if (selectedLedColor) {
      const ledColorData = product.ledColors?.find(
        ledItem => ledItem.color === selectedLedColor,
      );
      if (ledColorData) {
        currentBase = currentBase + (currentBase * ledColorData.discount) / 100;
      }
    }

    const priceImpact = item.discount ? (currentBase * item.discount) / 100 : 0;

    return (
      <View key={item.id}>
        <SubColor
          item={{
            id: item.id,
            color: item.colorCode,
            name: item.color,
          }}
          isSelected={isSelected}
          onPress={onPress}
        />
        {item.discount !== 0 && (
          <Typography
            title={
              priceImpact > 0
                ? `+₹${priceImpact.toFixed(0)}`
                : `₹${priceImpact.toFixed(0)}`
            }
            size={10}
            color={priceImpact > 0 ? colors.red : colors.green}
            style={{textAlign: 'center', marginTop: 2}}
          />
        )}
      </View>
    );
  };

  const renderSimilarProduct = ({
    item,
    index,
  }: {
    item: categoryItemProps;
    index: number;
  }) => {
    return <MiniProducts item={item} index={index} />;
  };

  const handleDescriptionToggle = () => {
    setShowDescription(!showDescription);
    if (showDescription) {
      rotate.value = withTiming(0, {duration: 200});
    } else {
      rotate.value = withTiming(90, {duration: 200});
    }
  };

  const handleSimilarToggle = () => {
    setShowSimilar(!showSimilar);
    rotateSimilar.value = withTiming(rotateSimilar.value === 0 ? 90 : 0, {
      duration: 200,
    });
  };

  const handleToggleReadMore = () => {
    setShowReadMore(!showReadMore);
  };

  const handleAddToCart = async () => {
    let obj = {
      productId: product?.id,
      quantity: 1,
      price: currentPrice,
    };

    if (selectedLedColor) {
      obj['ledcolors'] = selectedLedColor;
    }

    if (selectedBodyColor) {
      obj['bodycolors'] = selectedBodyColor;
    }

    if (selectedWatts) {
      obj['watts'] = selectedWatts;
    }

    if (selectedReflectors) {
      obj['reflectors'] = selectedReflectors;
    }

    try {
      const response = await addToCartAPI(obj);
      if (response?.data?.status === 'success') {
        Toast.show({
          type: 'success',
          text1: response?.data?.message,
        });
        navigation.navigate(Routes.BottomStack, {
          screen: Routes.Cart,
        });
      }
    } catch (e) {
      console.log('Selected options:', e);
    }
  };

  const onLikePress = () => setIsLiked(!isLiked);

  if (isLoading) {
    return (
      <Container
        showHeader={false}
        containerStyle={{backgroundColor: colors.milkWhite}}>
        <View style={styles.loadingContainer}>
          <Typography title="Loading..." />
        </View>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container
        showHeader={false}
        containerStyle={{backgroundColor: colors.milkWhite}}>
        <View style={styles.errorContainer}>
          <Typography title="Product not found" />
        </View>
      </Container>
    );
  }

  return (
    <Container
      showHeader={false}
      containerStyle={{backgroundColor: colors.milkWhite}}>
      <View style={styles.headerContainer}>
        <Icon
          icon="Ionicons"
          name="chevron-back-outline"
          containerStyle={styles.headerImageContainer}
          onPress={goBack}
          size={20}
          color={colors.primary}
          style={commonSty.mr2}
        />
        <Icon
          icon="AntDesign"
          name={isLiked ? 'heart' : 'hearto'}
          color={isLiked ? colors.sunriseOrange : colors.cadetBlue}
          containerStyle={styles.headerImageContainer}
          size={16}
          onPress={onLikePress}
          style={commonSty.pt2}
        />
      </View>
      {product?.image?.length > 0 && <ProductCarousel data={product?.image} />}
      <View style={styles.scrollMainContainer}>
        <View style={styles.bodyContainer}>
          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.bodyScrollContainer}>
            {/* Enhanced Price Display Section */}
            <View style={[commonSty.rowSpaceBetween, commonSty.mt30]}>
              <Typography title={product?.productName} />
              <View style={{alignItems: 'flex-end'}}>
                <Typography
                  title={`₹ ${currentPrice.toFixed(2)}`}
                  size={18}
                  weight="bold"
                />
                {/* Show base price if different */}
                {currentPrice !== basePrice && (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Typography
                      title={`₹ ${basePrice.toFixed(2)}`}
                      size={14}
                      color={colors.grey}
                      style={{textDecorationLine: 'line-through'}}
                    />
                    <Typography
                      title={getPriceDifference()}
                      size={12}
                      color={
                        currentPrice > basePrice ? colors.red : colors.green
                      }
                      style={{marginLeft: 5}}
                    />
                  </View>
                )}
              </View>
            </View>

            <View style={styles.border} />

            {/* LED Color Section */}
            {product?.ledColors && product.ledColors.length > 0 && (
              <View style={commonSty.rowSpaceBetween}>
                <View style={[styles.bodyColorSizeContainer, {width: '100%'}]}>
                  <Typography
                    title={'LED Color'}
                    size={16}
                    color={colors.slateGrey}
                    mb={10}
                  />
                  <FlatList
                    data={getLedColorData()}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderLedColorItem}
                    horizontal={true}
                    keyExtractor={item => item?.id?.toString()}
                  />
                </View>
              </View>
            )}

            {/* Body Color Section */}
            {product?.bodyColors && product.bodyColors.length > 0 && (
              <View
                style={[
                  styles.bodyColorSizeContainer,
                  {width: '100%', marginTop: 14},
                ]}>
                <Typography
                  title={'Body Color'}
                  size={16}
                  color={colors.slateGrey}
                  mb={10}
                />
                <FlatList
                  data={getBodyColorData()}
                  showsVerticalScrollIndicator={false}
                  renderItem={renderBodyColorItem}
                  horizontal={true}
                  keyExtractor={item => item?.id?.toString()}
                />
              </View>
            )}

            {/* Watts and Reflectors Section */}
            <View style={[commonSty.rowSpaceBetween, {marginTop: 14}]}>
              {product?.watts && product.watts.length > 0 && (
                <View style={styles.bodyColorSizeContainer}>
                  <Typography
                    title={'Watts'}
                    size={16}
                    color={colors.slateGrey}
                    mb={10}
                  />
                  <FlatList
                    data={product.watts}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderWattsItem}
                    horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              )}

              {product?.reflectors && product.reflectors.length > 0 && (
                <View style={styles.bodyColorSizeContainer}>
                  <Typography
                    title={'Reflectors'}
                    size={16}
                    color={colors.slateGrey}
                    mb={10}
                  />
                  <FlatList
                    data={product.reflectors}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderReflectorsItem}
                    horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              )}
            </View>
            <View style={styles.border} />
            <TouchableOpacity
              style={commonSty.rowSpaceBetween}
              onPress={handleDescriptionToggle}>
              <Typography title={'Description'} />
              <AnimatedTouchable style={animatedStyle}>
                <Icon
                  icon="AntDesign"
                  name="right"
                  size={18}
                  color={colors.primary}
                />
              </AnimatedTouchable>
            </TouchableOpacity>
            {showDescription && (
              <Typography size={14} color={colors.slateGrey} mt={10}>
                {!showReadMore
                  ? product?.productDescription
                  : product?.productDescription?.substring(0, 100)}
                {product?.productDescription &&
                  product.productDescription.length > 100 && (
                    <Typography
                      title={showReadMore ? ' Read more' : ' Read less'}
                      color={colors.primary}
                      onPress={handleToggleReadMore}
                      size={14}
                    />
                  )}
              </Typography>
            )}
            <View style={styles.border} />
            <TouchableOpacity
              style={commonSty.rowSpaceBetween}
              onPress={handleSimilarToggle}>
              <Typography title={'Similar Product'} />
              <AnimatedTouchable style={rotateSimilarStyle}>
                <Icon
                  icon="AntDesign"
                  name="right"
                  size={18}
                  color={colors.primary}
                />
              </AnimatedTouchable>
            </TouchableOpacity>
            {showSimilar && (
              <FlatList
                data={categoryData}
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled
                renderItem={renderSimilarProduct}
                horizontal={true}
                contentContainerStyle={commonSty.mt20}
                keyExtractor={item => item?.id?.toString()}
              />
            )}
          </ScrollView>
        </View>
      </View>
      <AddCart onPress={handleAddToCart} />
    </Container>
  );
};

export default ProductDetail;
