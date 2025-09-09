import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SwipeListView} from 'react-native-swipe-list-view';
import styles from './style';
import {Routes} from '../../constants';
import {COLORS} from '../../theme/colors';
import {Typography} from '../../components';
import {FONTS} from '../../constants/fonts';
import {getAllNotifications, deleteNotification} from '../../api';

const Notification = ({navigation}) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showPopover, setShowPopover] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const LIMIT = 10;

  useEffect(() => {
    fetchNotifications(1, true);
  }, []);

  const fetchNotifications = async (pageNumber, isInitial = false) => {
    try {
      if (isInitial) setIsRefreshing(true);
      else setIsLoadingMore(true);

      const response = await getAllNotifications(pageNumber, LIMIT);
      if (response?.data?.status === 'success') {
        const fetchedData = response?.data?.data?.data || [];
        const totalCount = response?.data?.data?.total;

        if (pageNumber === 1) {
          setData(fetchedData);
        } else {
          setData(prev => [...prev, ...fetchedData]);
        }

        setHasMore(pageNumber * LIMIT < totalCount);
        setPage(pageNumber);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  const handleRefresh = () => {
    fetchNotifications(1, true);
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchNotifications(page + 1);
    }
  };

  const handleDelete = async (rowMap, rowKey) => {
    try {
      // Close the row after deletion
      if (rowMap[rowKey]) {
        rowMap[rowKey].closeRow();
      }

      const updatedList = data.filter(item => item.id !== rowKey);
      setData(updatedList);
      await deleteNotification(rowKey); // Pass ID for individual delete
    } catch (error) {
      console.log('Error deleting notification:', error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      setIsDeleting(true);
      await deleteNotification('all'); // Pass "all" type for delete all
      setData([]); // Clear all data
      setShowPopover(false);
    } catch (error) {
      console.log('Error deleting all notifications:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Typography
        title="No notifications available"
        size={16}
        color={COLORS.APP_GRAY}
      />
    </View>
  );

  const renderItem = dataItem => {
    const item = dataItem.item;
    return (
      <View style={styles.card}>
        <Typography title={item?.title} size={16} color={COLORS.APP_BLACK} />
        <Typography
          title={item?.body}
          size={14}
          color={COLORS.APP_GRAY}
          mt={2}
        />
      </View>
    );
  };

  const renderHiddenItem = (dataItem, rowMap) => (
    <View style={styles.hiddenContainer}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(rowMap, dataItem.item.id)}>
        <AntDesign name="delete" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={{paddingVertical: 10}}>
        <ActivityIndicator color={COLORS.APP_BLACK} />
      </View>
    );
  };

  const renderHeader = () => (
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
      <Typography title={'Notification'} size={18} font={FONTS.INTER_MEDIUM} />
      <View />
      
    </View>
  );

  const renderPopover = () => (
    <Modal
      visible={showPopover}
      transparent
      animationType="fade"
      onRequestClose={() => setShowPopover(false)}>
      <TouchableOpacity
        style={styles.popoverOverlay}
        activeOpacity={1}
        onPress={() => setShowPopover(false)}>
        <View style={styles.popoverContainer}>
          <TouchableOpacity
            style={styles.popoverItem}
            onPress={handleDeleteAll}
            disabled={isDeleting}>
            {isDeleting ? (
              <ActivityIndicator size="small" color={COLORS.APP_BLACK} />
            ) : (
              <AntDesign name="delete" size={18} color={COLORS.APP_BLACK} />
            )}
            <Typography
              title={isDeleting ? 'Deleting...' : 'Delete All'}
              size={16}
              color={COLORS.APP_BLACK}
              ml={8}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <SwipeListView
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-75}
        disableRightSwipe={true}
        disableLeftSwipe={false}
        closeOnRowBeginSwipe={false}
        closeOnRowOpen={false}
        closeOnRowPress={true}
        closeOnScroll={true}
        previewRowKey={'0'}
        previewOpenValue={-40}
        previewOpenDelay={1000}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={{paddingBottom: 100, flexGrow: 1}}
      />
      {renderPopover()}
    </SafeAreaView>
  );
};

export default Notification;
