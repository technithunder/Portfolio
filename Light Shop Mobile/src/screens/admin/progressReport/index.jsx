import React, {useEffect, useState, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Container, Typography} from '../../../components';
import {Images} from '../../../constants';
import styles from './style';
import {getAllProgressReport} from '../../../api';
import {COLORS} from '../../../theme/colors';
import {useRoute} from '@react-navigation/native';

const ProgressReport = () => {
  const user = useSelector(state => state.auth.user);
  const route = useRoute();
  const staffId = route?.params?.staffId;
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [tempStartDate, setTempStartDate] = useState(null);
  const [tempEndDate, setTempEndDate] = useState(null);
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchProgressReport(true, 1);
  }, []);

  const fetchProgressReport = useCallback(
    async (isInitialLoad = false, page = 1) => {
      // Don't make request if already loading more (except for initial load)
      if (isLoadingMore && !isInitialLoad) {
        console.log('Already loading more, skipping...');
        return;
      }

      // Set loading states
      if (isInitialLoad) {
        setIsLoading(true);
        setError(null);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const formattedStartDate = startDate
          ? formatDateForAPI(startDate)
          : null;
        const formattedEndDate = endDate ? formatDateForAPI(endDate) : null;

        console.log('🔄 API Call - Page:', page);
        console.log('🔄 API Call - Start Date:', formattedStartDate);
        console.log('🔄 API Call - End Date:', formattedEndDate);

        const response = await getAllProgressReport(
          user?.role === 'staff' ? user?.id : staffId,
          page,
          formattedStartDate,
          formattedEndDate,
        );

        console.log(
          '📥 API Response:',
          JSON.stringify(response?.data, null, 2),
        );

        if (response?.data?.status === 'success') {
          const newData = response?.data?.data?.rows || [];
          const totalItems = response?.data?.data?.total || 0;
          const currentPageFromAPI = response?.data?.data?.page || page;

          // Fix: Get pageSize from response or use default
          const pageSize =
            response?.data?.data?.pageSize ||
            response?.data?.pageSize ||
            ITEMS_PER_PAGE;

          console.log('📊 API Response Data:');
          console.log('- New Data Length:', newData.length);
          console.log('- Current Page:', currentPageFromAPI);
          console.log('- Total Items:', totalItems);
          console.log('- Page Size:', pageSize);

          // Calculate total pages
          const calculatedTotalPages = Math.ceil(totalItems / pageSize);
          console.log('- Calculated Total Pages:', calculatedTotalPages);

          if (isInitialLoad || page === 1) {
            console.log('🔄 Setting initial data');
            setData(newData);
            setCurrentPage(currentPageFromAPI);
          } else {
            console.log('🔄 Appending new data to existing data');
            setData(prevData => {
              const filteredNewData = newData.filter(
                newItem =>
                  !prevData.some(
                    existingItem => existingItem.id === newItem.id,
                  ),
              );
              console.log('- Previous data length:', prevData.length);
              console.log(
                '- Filtered new data length:',
                filteredNewData.length,
              );
              const updatedData = [...prevData, ...filteredNewData];
              console.log('- Updated data length:', updatedData.length);
              return updatedData;
            });
            setCurrentPage(currentPageFromAPI);
          }

          setTotalPages(calculatedTotalPages);

          // Updated hasMore logic
          const hasMoreData =
            currentPageFromAPI < calculatedTotalPages && newData.length > 0;
          setHasMore(hasMoreData);

          console.log('✅ Has more data:', hasMoreData);
          console.log(
            '✅ Current page vs total pages:',
            currentPageFromAPI,
            '/',
            calculatedTotalPages,
          );
        } else {
          throw new Error(
            response?.data?.message || 'Failed to fetch progress reports',
          );
        }
      } catch (error) {
        console.error('❌ Error fetching progress reports:', error);
        setError(error.message || 'Something went wrong');

        if (isInitialLoad) {
          Alert.alert(
            'Error',
            'Failed to load progress reports. Please try again.',
            [{text: 'OK'}],
          );
        }
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
        setIsRefreshing(false);
      }
    },
    [user?.id, staffId, startDate, endDate], // Removed isLoadingMore from dependencies
  );

  const onRefresh = useCallback(() => {
    console.log('🔄 Refreshing data...');
    setIsRefreshing(true);
    setCurrentPage(1);
    setHasMore(true);
    setData([]); // Clear existing data
    fetchProgressReport(true, 1);
  }, [fetchProgressReport]);

  const loadMoreData = useCallback(() => {
    console.log('🔄 LoadMoreData called');
    console.log('- isLoadingMore:', isLoadingMore);
    console.log('- hasMore:', hasMore);
    console.log('- isLoading:', isLoading);
    console.log('- currentPage:', currentPage);
    console.log('- data.length:', data.length);

    if (!isLoadingMore && !isLoading && hasMore && data.length > 0) {
      const nextPage = currentPage + 1;
      console.log('✅ Loading next page:', nextPage);
      fetchProgressReport(false, nextPage);
    } else {
      console.log('❌ Load more conditions not met');
      if (isLoadingMore) console.log('- Reason: Already loading more');
      if (isLoading) console.log('- Reason: Already loading');
      if (!hasMore) console.log('- Reason: No more data');
      if (data.length === 0) console.log('- Reason: No data to append to');
    }
  }, [
    currentPage,
    hasMore,
    isLoadingMore,
    isLoading,
    data.length,
    fetchProgressReport,
  ]);

  const openFilterModal = () => {
    setTempStartDate(startDate || null);
    setTempEndDate(endDate || null);
    setShowFilterModal(true);
  };

  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
  };

  const handleStartDateConfirm = date => {
    console.log('Start date selected: ', new Date(date));
    setTempStartDate(date);
    hideStartDatePicker();
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };

  const handleEndDateConfirm = date => {
    console.log('End date selected: ', date);
    setTempEndDate(date);
    hideEndDatePicker();
  };

  const applyDateFilter = useCallback(() => {
    if (!tempStartDate || !tempEndDate) {
      Alert.alert(
        'Incomplete Selection',
        'Please select both start and end dates.',
      );
      return;
    }

    if (moment(tempStartDate).isAfter(moment(tempEndDate))) {
      Alert.alert('Invalid Date Range', 'Start date cannot be after end date.');
      return;
    }

    console.log('🔄 Applying filter - Start:', tempStartDate);
    console.log('🔄 Applying filter - End:', tempEndDate);

    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setCurrentPage(1);
    setData([]);
    setHasMore(true);
    setShowFilterModal(false);
  }, [tempStartDate, tempEndDate]);

  useEffect(() => {
    if (startDate && endDate) {
      console.log('🔄 Dates changed, fetching filtered data...');
      fetchProgressReport(true, 1);
    }
  }, [startDate, endDate, fetchProgressReport]);

  const isApplyButtonEnabled = tempStartDate && tempEndDate;

  const clearFilters = useCallback(() => {
    console.log('🔄 Clearing filters...');
    setStartDate(null);
    setEndDate(null);
    setTempStartDate(null);
    setTempEndDate(null);
    setCurrentPage(1);
    setData([]);
    setHasMore(true);
    setShowFilterModal(false);
  }, []);

  useEffect(() => {
    if (startDate === null && endDate === null) {
      console.log('🔄 Filters cleared, fetching all data...');
      fetchProgressReport(true, 1);
    }
  }, [startDate, endDate, fetchProgressReport]);

  const formatTime = timeString => {
    if (!timeString) return '--';
    return moment(`2000-01-01T${timeString}`).format('hh:mm A');
  };

  const formatDate = dateString => {
    if (!dateString) return '--';
    return moment(dateString).format('DD MMM YYYY');
  };

  const formatFilterDate = date => {
    if (!date) return '';
    return moment(date).format('DD MMM YYYY');
  };

  const formatDateForAPI = date => {
    if (!date) return null;
    return moment(date).format('YYYY-MM-DD');
  };

  const getStatusColor = status => {
    return status ? '#4CAF50' : '#FF5722';
  };

  const getStatusText = status => {
    return status ? 'Yes' : 'No';
  };

  const renderStatusItem = (label, status) => (
    <View style={styles.statusItem}>
      <Text style={styles.statusLabel}>{label}:</Text>
      <Text style={[styles.statusValue, {color: getStatusColor(status)}]}>
        {getStatusText(status)}
      </Text>
    </View>
  );

  const renderDateFilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowFilterModal(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter by Date Range</Text>
            <TouchableOpacity
              onPress={() => setShowFilterModal(false)}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateFilterContainer}>
            <View style={styles.dateInputContainer}>
              <Text style={styles.dateLabel}>Start Date</Text>
              <TouchableOpacity
                style={[
                  styles.dateButton,
                  !tempStartDate && styles.dateButtonEmpty,
                ]}
                onPress={showStartDatePicker}>
                <Text
                  style={[
                    styles.dateButtonText,
                    !tempStartDate && styles.dateButtonTextEmpty,
                  ]}>
                  {tempStartDate
                    ? formatFilterDate(tempStartDate)
                    : 'Select Start Date'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateInputContainer}>
              <Text style={styles.dateLabel}>End Date</Text>
              <TouchableOpacity
                style={[
                  styles.dateButton,
                  !tempEndDate && styles.dateButtonEmpty,
                ]}
                onPress={showEndDatePicker}>
                <Text
                  style={[
                    styles.dateButtonText,
                    !tempEndDate && styles.dateButtonTextEmpty,
                  ]}>
                  {tempEndDate
                    ? formatFilterDate(tempEndDate)
                    : 'Select End Date'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.clearButton]}
              onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Clear Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.applyButton,
                !isApplyButtonEnabled && styles.applyButtonDisabled,
              ]}
              onPress={applyDateFilter}
              disabled={!isApplyButtonEnabled}>
              <Text
                style={[
                  styles.applyButtonText,
                  !isApplyButtonEnabled && styles.applyButtonTextDisabled,
                ]}>
                Apply Filter
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <DateTimePickerModal
        isVisible={isStartDatePickerVisible}
        mode="date"
        onConfirm={handleStartDateConfirm}
        onCancel={hideStartDatePicker}
        date={tempStartDate || new Date()}
        maximumDate={new Date()}
      />

      <DateTimePickerModal
        isVisible={isEndDatePickerVisible}
        mode="date"
        onConfirm={handleEndDateConfirm}
        onCancel={hideEndDatePicker}
        date={tempEndDate || new Date()}
        maximumDate={new Date()}
        minimumDate={tempStartDate}
      />
    </Modal>
  );

  const renderItem = ({item, index}) => {
    return (
      <View style={[styles.card, index === data.length - 1 && styles.lastCard]}>
        <View style={styles.cardHeader}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formatDate(item.date)}</Text>
            <Text style={styles.userText}>
              {item.user?.firstName} {item.user?.lastName}
            </Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeLabel}>In: {formatTime(item.inTime)}</Text>
            <Text style={styles.timeLabel}>
              Out: {formatTime(item.outTime)}
            </Text>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusTitle}>Daily Tasks Status</Text>
          {renderStatusItem('Lead Checked', item.leadChecked)}
          {renderStatusItem('Lead Followed', item.leadFollowed)}
          {renderStatusItem(
            'Tomorrow Tasks Checked',
            item.checkedTomorrowTasks,
          )}
          {renderStatusItem('Reporting Sheet Sent', item.reportingSheetSent)}
          {item?.notes && (
            <View style={{marginTop: 5}}>
              <Text style={styles.statusLabel}>Notes</Text>
              <Typography title={item?.notes} size={12} />
            </View>
          )}
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.footerText}>
            Updated: {formatDate(item.updatedAt)}
          </Text>
          <View
            style={[
              styles.roleTag,
              {
                backgroundColor:
                  item.user?.role === 'staff' ? '#2196F3' : '#FF9800',
              },
            ]}>
            <Text style={styles.roleText}>
              {item.user?.role?.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    console.log('🔄 Rendering footer - isLoadingMore:', isLoadingMore);

    if (!isLoadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.APP_PRIMARY} />
        <Text style={styles.footerLoaderText}>Loading more...</Text>
      </View>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {error ? 'Error loading data' : 'No progress reports found'}
      </Text>
      {error && (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchProgressReport(true, 1)}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <Container
        title="Progress Report"
        leftIcon={Images.back}
        rightIcon={Images.calendar}
        style={[styles.container]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.APP_PRIMARY} />
          <Text style={styles.loadingText}>Loading progress reports...</Text>
        </View>
      </Container>
    );
  }

  return (
    <Container
      title="Progress Report"
      leftIcon={Images.back}
      rightIcon={Images.calendar}
      onRightPress={openFilterModal}
      style={[styles.container]}>
      <View style={styles.contentContainer}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            Total Reports: {data.length}
            {startDate && endDate && (
              <Text style={styles.filterText}>
                {' '}
                (Filtered: {formatFilterDate(startDate)} -{' '}
                {formatFilterDate(endDate)})
              </Text>
            )}
          </Text>
          {startDate && endDate && (
            <TouchableOpacity
              style={styles.clearFilterButton}
              onPress={clearFilters}>
              <Text style={styles.clearFilterText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => `progress-report-${item.id || index}`}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[COLORS.APP_PRIMARY]}
            />
          }
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.2}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyComponent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            data.length === 0 ? styles.emptyListContainer : null
          }
          removeClippedSubviews={false}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={10}
          getItemLayout={null} // This helps with onEndReached detection
        />
      </View>

      {renderDateFilterModal()}
    </Container>
  );
};

export default ProgressReport;
