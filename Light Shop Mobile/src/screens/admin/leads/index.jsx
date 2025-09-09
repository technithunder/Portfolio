import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Modal,
} from 'react-native';
//relative path imports
import styles from './style';
import {Container, Icon, Typography} from '../../../components';
import {Images, Routes} from '../../../constants';
import {COLORS} from '../../../theme/colors';
import {FONTS} from '../../../constants/fonts';
import AddLead from './AddLead';
import {navigate} from '../../../utils';
import {getAllLead} from '../../../api';
import moment from 'moment';
import Entypo from 'react-native-vector-icons/Entypo';

const bgColor = {
  hot: '#F4929433',
  warm: '#FBBC051A',
  cold: '#F4929433',
};

const textColor = {
  hot: '#C80104',
  warm: '#FBBC05',
  cold: '#C80104',
};

const leadTypeText = {
  hot: 'Hot',
  warm: 'Warm',
  cold: 'Cold',
};

const filterOptions = [
  {
    title: 'Lead Type',
    options: [
      {key: '', title: 'All'},
      {key: 'hot', title: 'Hot'},
      {key: 'warm', title: 'Warm'},
      {key: 'cold', title: 'Cold'},
    ],
  },
  {
    title: 'Upcoming Follow-up Leads',
    options: [
      {key: '', title: 'All'}, // Added All option for follow-up
      {key: 'next_3_day', title: 'Next 3 Days'},
      {key: 'next_7_day', title: 'Next 7 Days'},
      {key: 'next_15_day', title: 'Next 15 Days'},
      {key: 'next_30_day', title: 'Next 30 Days'},
    ],
  },
];

const Leads = ({navigation}) => {
  const sheetRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);

  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [isFilterChanging, setIsFilterChanging] = useState(false);

  // Filter states
  const [selectedLeadType, setSelectedLeadType] = useState('');
  const [selectedFollowUp, setSelectedFollowUp] = useState('');

  const ITEMS_PER_PAGE = 10;

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    fetchAllLeads(1, true);
  }, []);

  // Handle filter changes
  useEffect(() => {
    if (isFilterChanging) {
      fetchAllLeads(1, true, search);
      setIsFilterChanging(false);
    }
  }, [isFilterChanging]);

  // Handle search changes
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchAllLeads(1, true, search);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search]);

  const fetchAllLeads = async (
    pageNumber = 1,
    reset = false,
    searchQuery = search,
  ) => {
    try {
      if (!isMountedRef.current) return;

      if (isLoading || isLoadingMore) return;

      if (reset) {
        setIsLoading(true);
        setPage(1);
        setHasMoreData(true);
        setError(null);
      } else {
        setIsLoadingMore(true);
      }

      // Pass both filters to API
      const response = await getAllLead(
        pageNumber,
        ITEMS_PER_PAGE,
        searchQuery,
        selectedLeadType, // type parameter
        selectedFollowUp, // dateFilter parameter
      );

      if (!isMountedRef.current) return;

      if (response?.data?.status === 'success') {
        const data = response?.data?.data?.leads || [];
        const pagination = response?.data?.data?.pagination || {};

        if (reset) {
          setLeads(data);
        } else {
          setLeads(prevLeads => [...prevLeads, ...data]);
        }

        setTotalPages(pagination.totalPages || 0);
        setHasMoreData(pageNumber < (pagination.totalPages || 0));

        if (!reset) {
          setPage(pageNumber);
        }

        setError(null);
      } else {
        throw new Error(response?.data?.message || 'Failed to fetch leads');
      }
    } catch (e) {
      console.log('Error fetching leads:', e);

      if (isMountedRef.current) {
        setError(e.message || 'Failed to load leads');

        if (!reset && leads.length === 0) {
          setLeads([]);
        }

        setHasMoreData(false);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
        setIsLoadingMore(false);
        setIsRefreshing(false);
      }
    }
  };

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setSearch('');
    setSelectedLeadType('');
    setSelectedFollowUp('');
    fetchAllLeads(1, true, '');
  }, []);

  const loadMoreData = useCallback(() => {
    if (hasMoreData && !isLoadingMore && !isLoading && !error) {
      const nextPage = page + 1;
      fetchAllLeads(nextPage, false, search);
    }
  }, [
    hasMoreData,
    isLoadingMore,
    isLoading,
    page,
    search,
    selectedLeadType,
    selectedFollowUp,
  ]);

  const handleSearchChange = text => {
    setSearch(text);
    setPage(1);
    setHasMoreData(true);
    setError(null);
  };

  const onPressPlusIcon = () => {
    navigation.navigate(Routes.ManageLead);
  };

  const onLead = () => {
    fetchAllLeads(1, true, search);
  };

  const handleFilterSelect = (filterKey, sectionIndex) => {
    if (sectionIndex === 0) {
      setSelectedLeadType(filterKey);
    } else if (sectionIndex === 1) {
      setSelectedFollowUp(filterKey);
    }
  };

  // Add retry function for error handling
  const handleRetry = () => {
    setError(null);
    fetchAllLeads(1, true, search);
  };

  // Clear all filters function
  const clearAllFilters = () => {
    setSearch('');
    setSelectedLeadType('');
    setSelectedFollowUp('');
    setIsFilterChanging(true);
  };

  // Check if any filters are active
  const hasActiveFilters = selectedLeadType || selectedFollowUp || search;

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.APP_PRIMARY} />
      </View>
    );
  };

  const renderEmptyComponent = () => {
    if (isLoading) return null;
    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <TouchableOpacity
            style={[styles.clearSearchButton, {marginTop: 16}]}
            onPress={handleRetry}>
            <Typography title="Retry" size={14} color={COLORS.APP_PRIMARY} />
          </TouchableOpacity>
        </View>
      );
    }

    const getEmptyMessage = () => {
      if (hasActiveFilters) {
        return 'No leads found for the applied filters';
      } else {
        return 'No leads available';
      }
    };

    return (
      <View style={styles.emptyContainer}>
        <Typography
          title={getEmptyMessage()}
          size={16}
          color={COLORS.APP_GRAY}
          align="center"
        />
        {hasActiveFilters && (
          <TouchableOpacity
            style={styles.clearSearchButton}
            onPress={clearAllFilters}>
            <Typography
              title="Clear All Filters"
              size={14}
              color={COLORS.APP_PRIMARY}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.card}>
        <View>
          <Typography
            title={item?.customerName}
            size={16}
            font={FONTS.INTER_REGULAR}
          />
          <Typography
            title={item?.mobileNumber}
            size={10}
            font={FONTS.INTER_REGULAR}
            color={COLORS.APP_GRAY}
          />
          <View
            style={[
              styles.chipView,
              {backgroundColor: bgColor[item.leadType || item.type]},
            ]}>
            <Typography
              title={leadTypeText[item?.leadType || item?.type]}
              size={10}
              color={textColor[item.leadType || item.type]}
            />
          </View>
        </View>
        <View style={{alignItems: 'center', gap: 3}}>
          <Icon
            onPress={() => navigate(Routes.AdminLeadView, {leadId: item?.id})}
            name="eye"
            icon="AntDesign"
            size={22}
            color={COLORS.APP_BLACK}
          />
          <Typography
            title={moment(item.followUpDate).format('DD MMM, YYYY')}
            size={10}
            color={COLORS.APP_GRAY}
          />
        </View>
      </View>
    );
  };

  const renderFilterPopover = () => (
    <Modal
      visible={showFilterPopover}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowFilterPopover(false)}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-start',
          alignItems: 'flex-end',
          paddingTop: 50,
          paddingRight: 12,
        }}>
        <View
          style={{
            backgroundColor: COLORS.APP_WHITE,
            borderRadius: 8,
            padding: 4,
            minWidth: 300,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}>
          <View style={{padding: 16}}>
            {/* Main Title */}
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Typography
                title="Filters"
                size={18}
                font={FONTS.INTER_BOLD}
                color={COLORS.APP_BLACK}
              />
              <Entypo
                name="cross"
                size={24}
                onPress={() => setShowFilterPopover(false)}
                color={COLORS.APP_BLACK}
              />
            </View>

            <View
              style={{
                borderBottomWidth: 1,
                borderColor: '#cccccc',
                marginTop: 10,
              }}
            />

            {filterOptions.map((section, sectionIndex) => {
              const selectedKey =
                sectionIndex === 0 ? selectedLeadType : selectedFollowUp;

              return (
                <View key={section.title}>
                  <Typography
                    title={section.title}
                    size={16}
                    font={FONTS.INTER_SEMIBOLD}
                    color={COLORS.APP_BLACK}
                    paddingVertical={14}
                  />

                  <View
                    style={{
                      flexDirection: sectionIndex === 0 ? 'row' : 'column',
                      flexWrap: sectionIndex === 0 ? 'wrap' : 'nowrap',
                      gap: sectionIndex === 0 ? 8 : 0,
                    }}>
                    {section.options.map(option => {
                      const isSelected = selectedKey === option.key;

                      return (
                        <TouchableOpacity
                          key={option.key + section.title}
                          onPress={() =>
                            handleFilterSelect(option.key, sectionIndex)
                          }
                          style={{
                            paddingVertical: 10,
                            paddingHorizontal: sectionIndex === 0 ? 16 : 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor:
                              isSelected && sectionIndex === 0
                                ? COLORS.APP_PRIMARY + '20'
                                : 'transparent',

                            borderRadius: 8,
                            marginRight: sectionIndex === 0 ? 8 : 0,
                          }}>
                          {sectionIndex === 1 && (
                            <View
                              style={{
                                height: 18,
                                width: 18,
                                borderRadius: 3,
                                borderWidth: 1,
                                borderColor: COLORS.APP_PRIMARY,
                                marginRight: 15,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: isSelected
                                  ? COLORS.APP_PRIMARY
                                  : 'transparent',
                              }}>
                              {isSelected && (
                                <Text style={{color: 'white', fontSize: 12}}>
                                  ✓
                                </Text>
                              )}
                            </View>
                          )}
                          <Typography
                            title={option.title}
                            size={14}
                            color={
                              isSelected ? COLORS.APP_PRIMARY : COLORS.APP_BLACK
                            }
                            font={
                              isSelected
                                ? FONTS.INTER_MEDIUM
                                : FONTS.INTER_REGULAR
                            }
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })}

            {/* Clear All and Apply Filter buttons */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              {hasActiveFilters && (
                <TouchableOpacity
                  style={[
                    styles.applyFilterbtn,
                    {
                      backgroundColor: 'transparent',
                      borderWidth: 1,
                      borderColor: COLORS.APP_PRIMARY,
                      flex: 1,
                      marginRight: 10,
                    },
                  ]}
                  onPress={() => {
                    setSelectedLeadType('');
                    setSelectedFollowUp('');
                  }}>
                  <Text
                    style={[
                      styles.txtapplyfilter,
                      {color: COLORS.APP_PRIMARY},
                    ]}>
                    Clear All
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.applyFilterbtn, {flex: 1}]}
                onPress={() => {
                  console.log('Selected Lead Type:', selectedLeadType || 'All');
                  console.log(
                    'Selected Follow-up Filter:',
                    selectedFollowUp || 'All',
                  );
                  setIsFilterChanging(true);
                  setShowFilterPopover(false);
                }}>
                <Text style={styles.txtapplyfilter}>Apply Filter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Active filters indicator
  const renderActiveFilters = () => {
    const activeFilters = [];

    if (selectedLeadType) {
      activeFilters.push(`Lead: ${leadTypeText[selectedLeadType]}`);
    }

    if (selectedFollowUp) {
      const followUpText = filterOptions[1].options.find(
        opt => opt.key === selectedFollowUp,
      )?.title;
      activeFilters.push(`Follow-up: ${followUpText}`);
    }

    if (activeFilters.length === 0) return null;

    return (
      <View style={styles.activeFilterContainer}>
        <Text style={{color: COLORS.APP_PRIMARY, fontSize: 12, marginLeft: 20}}>
          Active filters: {activeFilters.join(', ')}
        </Text>
        <TouchableOpacity onPress={clearAllFilters} style={{marginRight: 20}}>
          <Icon
            icon="AntDesign"
            name="close"
            size={12}
            color={COLORS.APP_PRIMARY}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Container
      title="Leads"
      showBack={true}
      onLeftPress={() =>
        navigation.navigate(Routes.AdminBottomStack, {screen: Routes.Dashboard})
      }
      rightIcon={Images.filter}
      rightIconColor={{tintColor: 'black'}}
      onRightPress={() => setShowFilterPopover(true)}
      style={[styles.container]}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputView}>
          <View style={{width: '10%'}}>
            <Icon
              icon="AntDesign"
              name="search1"
              size={16}
              color={COLORS.APP_LIGHTER_GRAY}
            />
          </View>
          <View style={{width: '80%'}}>
            <TextInput
              placeholder="Search leads by name or number"
              onChangeText={handleSearchChange}
              value={search}
              style={styles.searchInput}
              placeholderTextColor={COLORS.APP_LIGHTER_GRAY}
            />
          </View>
          {search !== '' && (
            <Icon
              icon="AntDesign"
              name="close"
              size={16}
              color={COLORS.APP_GRAY}
              onPress={() => setSearch('')}
            />
          )}
        </View>

        {/* Show active filter indicator */}
        {renderActiveFilters()}

        <FlatList
          data={leads}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={{
            marginHorizontal: 20,
            paddingBottom: 100,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[COLORS.APP_PRIMARY]}
              tintColor={COLORS.APP_PRIMARY}
            />
          }
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyComponent}
          showsVerticalScrollIndicator={false}
        />

        {/* Loading Indicator for initial load */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.APP_PRIMARY} />
            <Typography
              title="Loading leads..."
              size={14}
              color={COLORS.APP_GRAY}
              style={{marginTop: 10}}
            />
          </View>
        )}
      </KeyboardAvoidingView>

      {/* Add Button */}
      <View style={styles.addButton}>
        <Icon
          onPress={onPressPlusIcon}
          icon="AntDesign"
          name="plus"
          size={22}
          color={COLORS.APP_WHITE}
        />
      </View>

      <AddLead sheetRef={sheetRef} onLead={onLead} />

      {renderFilterPopover()}
    </Container>
  );
};

export default Leads;
