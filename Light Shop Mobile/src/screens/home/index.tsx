import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Container} from '../../components';
import {categoryData, emptyData, Images, Routes} from '../../constants';
import {categoryItemProps} from './types';
import {
  Banner,
  BodyHeader,
  HomeCarousel,
  MiniCategory,
  MiniProducts,
  MiniRecommended,
  TopBanners,
} from './components';
import styles from './styles';
import {commonSty} from '../../theme';
import {navigate} from '../../utils';
import {getAllProducts} from '../../api';
import {COLORS} from '../../theme/colors';
const Home = () => {
  const navigation = useNavigation<any>();
  const [selectedCategory, setSelectedCategory] = useState(categoryData[0].id);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    setIsLoading(true);
    try {
      const response = await getAllProducts();
      if (response?.data?.status === 'success') {
        setData(response?.data?.data);
      }
    } catch (e) {
      console.log('Error fetching products:', e);
    } finally {
      setIsLoading(false);
    }
  };

  console.log('data', data);

  const renderItem = ({
    item,
    index,
  }: {
    item: categoryItemProps;
    index: number;
  }) => {
    const isSelected = selectedCategory === item?.id;
    return (
      <MiniCategory
        index={index}
        item={item}
        isSelected={isSelected}
        onPress={() => setSelectedCategory(item.id)}
      />
    );
  };
  const renderFeatureProducts = ({
    item,
    index,
  }: {
    item: categoryItemProps;
    index: number;
  }) => {
    const handleProductPress = () => {
      navigate(Routes.ProductDetail, {productId: item.id});
    };
    return (
      <MiniProducts item={item} index={index} onPress={handleProductPress} />
    );
  };
  const renderRecommendedProducts = ({
    item,
    index,
  }: {
    item: categoryItemProps;
    index: number;
  }) => {
    const handleProductPress = () => {
      navigate(Routes.ProductDetail, {productId: item.id});
    };
    return (
      <MiniRecommended item={item} index={index} onPress={handleProductPress} />
    );
  };
  const renderTopCollection = ({}) => {
    return <TopBanners />;
  };
  const handleNotifyPress = () => navigation.jumpTo(Routes.Notify);
  return (
    <Container
      title="Virtual Lights"
      rightIcon={Images.bell}
      leftIcon={Images.drawer}
      isScroll
      onRightPress={handleNotifyPress}>
      <View style={styles.mainCategoryContainer}>
        <FlatList
          data={categoryData}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          bounces={false}
          contentContainerStyle={[commonSty.pl10, commonSty.center]}
        />
      </View>
      <HomeCarousel />
      <View style={styles.featureProductsContainer}>
        <BodyHeader leftTitle="Feature Products" />
        {isLoading ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={28} color={COLORS.APP_PRIMARY} />
          </View>
        ) : (
          <View>
            <FlatList
              data={data?.products}
              renderItem={renderFeatureProducts}
              horizontal
              bounces={false}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContainers}
            />
          </View>
        )}
      </View>
      <Banner />
      <View style={styles.recommendedContainer}>
        <BodyHeader leftTitle="Recommended" />
        <FlatList
          data={data?.products}
          renderItem={renderRecommendedProducts}
          horizontal
          bounces={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainers}
        />
      </View>
      <View>
        <BodyHeader leftTitle="Top Collection" />
        <FlatList
          data={emptyData.slice(0, 3)}
          renderItem={renderTopCollection}
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={commonSty.pb100}
        />
      </View>
    </Container>
  );
};

export default Home;
