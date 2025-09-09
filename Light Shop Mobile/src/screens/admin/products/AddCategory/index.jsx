import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Typography} from '../../../../components';
import styles from './style';
import {Images} from '../../../../constants';
import {FONTS} from '../../../../constants/fonts';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  addProductCategory,
  deleteProductCategory,
  getProductCategories,
  updateProductCategory,
} from '../../../../api';
import Toast from 'react-native-toast-message';
import DeleteModal from '../../../../components/DeleteModal';
import {COLORS} from '../../../../theme/colors';

const AddCategory = ({navigation}) => {
  const [openModal, setOpenModal] = useState(false);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    getAllCategories(1, true);
  }, []);

  const handleAddCategory = async () => {
    if (!category.trim()) return;

    setLoading(true);
    let obj = {name: category};

    try {
      let response;
      if (editId) {
        response = await updateProductCategory(editId, obj);
      } else {
        response = await addProductCategory(obj);
      }

      if (response?.data?.status === 'success') {
        Toast.show({type: 'success', text1: response?.data?.message});
        setCategory('');
        setEditId(null);
        getAllCategories(1, true);
      } else {
        Toast.show({type: 'error', text1: 'Failed to save category'});
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'An error occurred while saving the category',
      });
    } finally {
      setLoading(false);
      setOpenModal(false);
    }
  };

  const getAllCategories = async (pageNum = 1, isInitial = false) => {
    if (isInitial) setLoading(true);
    else setIsFetchingMore(true);

    try {
      const response = await getProductCategories(pageNum);
      if (response?.data?.status === 'success') {
        const res = response?.data?.data?.categories || [];

        if (isInitial) {
          setCategories(res);
        } else {
          setCategories(prev => [...prev, ...res]);
        }

        setHasMore(res.length >= 15);
      } else {
        Toast.show({type: 'error', text1: 'Failed to fetch categories'});
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (isInitial) setLoading(false);
      else setIsFetchingMore(false);
    }
  };

  const loadMore = () => {
    if (!hasMore || isFetchingMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    getAllCategories(nextPage, false);
  };

  const editCategory = item => {
    setCategory(item.name);
    setEditId(item.id);
    setOpenModal(true);
  };

  const onConfirm = async () => {
    try {
      setDeleteLoading(true);
      const response = await deleteProductCategory(selectedItem);
      if (response?.data?.status === 'success') {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: response?.data?.message || 'Category deleted successfully',
        });
        getAllCategories(1, true);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response?.data?.message || 'Failed to delete category',
        });
      }
    } catch (error) {
      console.log('Error deleting category:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong',
      });
    } finally {
      setDeleteModalVisible(false);
      setSelectedItem(null);
      setDeleteLoading(false);
    }
  };

  const onCloseDeleteModal = () => {
    setDeleteModalVisible(false);
    setSelectedItem(null);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image source={Images.back} style={{height: 18, width: 18}} />
      </TouchableOpacity>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
        <Typography title={'Category'} size={20} font={FONTS.INTER_MEDIUM} />
      </View>
      <TouchableOpacity
        onPress={() => {
          setCategory('');
          setEditId(null);
          setOpenModal(true);
        }}>
        <Image source={Images.plus} style={{height: 18, width: 18}} />
      </TouchableOpacity>
    </View>
  );

  const renderCategoryItem = ({item}) => (
    <View style={styles.card}>
      <Text style={styles.categoryText}>{item?.name}</Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => editCategory(item)}>
          <AntDesign name="edit" size={22} style={styles.editIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelectedItem(item.id);
            setDeleteModalVisible(true);
          }}>
          <MaterialIcons name="delete" size={22} style={styles.deleteIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      {renderHeader()}

      {loading && page === 1 ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator
            size="large"
            color={COLORS.APP_PRIMARY}
            style={{marginTop: 20}}
          />
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderCategoryItem}
          contentContainerStyle={styles.container}
          onEndReached={loadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={
            isFetchingMore ? (
              <View style={{paddingVertical: 15}}>
                <ActivityIndicator size="small" color="#000" />
              </View>
            ) : null
          }
        />
      )}

      {/* Modal for Add/Edit */}
      <Modal
        transparent
        visible={openModal}
        animationType="slide"
        onRequestClose={() => setOpenModal(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.title}>
                {editId ? 'Edit Category' : 'Add Category'} <Text style={{color: 'red'}}>*</Text>
              </Text>
              <TouchableOpacity onPress={() => setOpenModal(false)}>
                <Entypo name="cross" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Enter category name"
              placeholderTextColor="#999"
              value={category}
              onChangeText={setCategory}
            />

            <TouchableOpacity
              style={[
                styles.addButton,
                (!category.trim() || loading) && {backgroundColor: '#ccc'},
              ]}
              onPress={handleAddCategory}
              disabled={!category.trim() || loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.addButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        onClose={onCloseDeleteModal}
        onConfirm={onConfirm}
        visible={deleteModalVisible}
        isLoading={deleteLoading}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
      />
    </SafeAreaView>
  );
};

export default AddCategory;
