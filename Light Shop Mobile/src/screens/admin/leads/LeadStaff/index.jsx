import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TextInput} from 'react-native-gesture-handler';
import {useRoute} from '@react-navigation/native';
import { addLeadStaff, getAllUsers } from '../../../../api';
import { Routes } from '../../../../constants';
import { FONTS } from '../../../../constants/fonts';
import { COLORS } from '../../../../theme/colors';
import { Icon, Typography } from '../../../../components';

const LeadStaff = ({navigation}) => {
  const route = useRoute();
  const leadId = route?.params?.leadId
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    fetchAllStaff(1, '');
  }, []);

  // Search with debounce
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (search !== '') {
        fetchAllStaff(1, search, true);
      } else {
        fetchAllStaff(1, '', true);
      }
    }, 500);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [search]);

  const fetchAllStaff = async (
    pageNum = 1,
    searchTerm = '',
    isNewSearch = false,
  ) => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await getAllUsers('staff',pageNum, searchTerm, 10);
      if (response?.data?.status === 'success') {
        // Updated to access the correct nested structure
        const newData = response?.data?.data?.users || [];

        if (isNewSearch || pageNum === 1) {
          setData(newData);
          setPage(1);
        } else {
          setData(prevData => [...prevData, ...newData]);
        }

        setHasMore(newData.length === 10);
        if (!isNewSearch && pageNum > 1) {
          setPage(pageNum);
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      fetchAllStaff(nextPage, search);
    }
  };

  const toggleStaffSelection = staff => {
    // Use id as unique identifier since there's no direct id
    const isSelected = selectedStaff.some(
      s => s.BasicInfo?.id === staff.BasicInfo?.id,
    );

    if (isSelected) {
      setSelectedStaff(
        selectedStaff.filter(
          s => s.BasicInfo?.id !== staff.BasicInfo?.id,
        ),
      );
    } else {
      setSelectedStaff([...selectedStaff, staff]);
    }
  };

  const handleAddStaff = async () => {
    if (selectedStaff.length === 0) {
      Alert.alert(
        'Selection Required',
        'Please select at least one staff member.',
      );
      return;
    }
    const selectedStaffIds = selectedStaff.map(s => s.BasicInfo?.id);
    let obj = {
      staffIds: selectedStaffIds,
      leadId: leadId,
    };
    console.log(obj)
    try {
      const response = await addLeadStaff(obj);
      if (response?.data?.status === 'success') {
        console.log("Welcome")
        navigation.navigate(Routes.AdminLeadView,{leadId: leadId});
      }
    } catch (e) {
      console.log(e);
    }

    // Navigate back with selected staff or handle the selection
    // console.log('Selected Staff:', selectedStaff);
    // navigation.navigate(Routes.PreviousScreen, { selectedStaff });
  };

  const renderStaffCard = ({item}) => {
    // Use id as unique identifier
    const isSelected = selectedStaff.some(
      s => s.BasicInfo?.id === item.BasicInfo?.id,
    );

    // Extract data from nested structure
    const fullName = `${item.BasicInfo?.firstName || ''} ${
      item.BasicInfo?.lastName || ''
    }`.trim();
    const email = item.ContactInfo?.email || 'No email';
    const phone = item.ContactInfo?.mobileNumber || null;
    const id = item.BasicInfo?.empId;

    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={() => toggleStaffSelection(item)}>
        <View style={styles.cardContent}>
          <View style={styles.staffInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {fullName ? fullName.charAt(0).toUpperCase() : 'S'}
              </Text>
            </View>
            <View style={styles.staffDetails}>
              <Typography
                title={fullName || 'Staff Member'}
                font={FONTS.INTER_MEDIUM}
                size={16}
                color={COLORS.APP_BLACK}
              />
              <Typography
                title={`Email: ${email}`}
                font={FONTS.INTER_REGULAR}
                size={12}
                color={COLORS.APP_LIGHTER_GRAY}
              />
              {phone && (
                <Typography
                  title={`Phone No: ${phone}`}
                  font={FONTS.INTER_REGULAR}
                  size={12}
                  color={COLORS.APP_LIGHTER_GRAY}
                />
              )}
              {id && (
                <Typography
                  title={`ID: ${id}`}
                  font={FONTS.INTER_REGULAR}
                  size={12}
                  color={COLORS.APP_LIGHTER_GRAY}
                />
              )}
            </View>
          </View>
          <View style={styles.checkboxContainer}>
            <View style={[styles.checkbox, isSelected && styles.checkedBox]}>
              {isSelected && (
                <Ionicons name="checkmark" size={16} color={COLORS.APP_WHITE} />
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  };

  const renderSearchBar = () => {
    return (
      <View style={styles.searchContainer}>
        <View style={styles.inputView}>
          <View style={{width: '10%'}}>
            <Icon
              icon="AntDesign"
              name="search1"
              size={16}
              color={COLORS.APP_LIGHTER_GRAY}
            />
          </View>
          <View style={{width: '90%'}}>
            <TextInput
              placeholder="Search staff members..."
              onChangeText={setSearch}
              value={search}
              style={styles.searchInput}
              placeholderTextColor={COLORS.APP_LIGHTER_GRAY}
            />
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={COLORS.APP_BLACK} />
        </TouchableOpacity>
        <Typography
          title={'Select Staff'}
          font={FONTS.INTER_MEDIUM}
          size={16}
        />
        <View style={styles.selectedCount}>
          {selectedStaff.length > 0 && (
            <Text style={styles.selectedCountText}>
              {selectedStaff.length} selected
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      {renderSearchBar()}

      <FlatList
        data={data}
        renderItem={renderStaffCard}
        keyExtractor={(item, index) =>
          item.BasicInfo?.id?.toString() || index.toString()
        }
        contentContainerStyle={styles.listContainer}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Add Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.addButton,
            selectedStaff.length === 0 && styles.disabledButton,
          ]}
          onPress={handleAddStaff}
          disabled={selectedStaff.length === 0}>
          <Text
            style={[
              styles.addButtonText,
              selectedStaff.length === 0 && styles.disabledButtonText,
            ]}>
            Add Selected Staff ({selectedStaff.length})
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LeadStaff;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.APP_LIGHT_GRAY,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCount: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
  selectedCountText: {
    fontSize: 12,
    color: COLORS.APP_PRIMARY,
    fontFamily: FONTS.INTER_MEDIUM,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.APP_LIGHT_GRAY,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 45,
  },
  searchInput: {
    color: COLORS.APP_BLACK,
    fontFamily: FONTS.INTER_REGULAR,
    fontSize: 14,
    flex: 1,
    marginLeft: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Space for bottom button
  },
  card: {
    backgroundColor: COLORS.APP_WHITE,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    shadowColor: COLORS.APP_BLACK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.APP_LIGHT_GRAY,
  },
  selectedCard: {
    borderColor: COLORS.APP_PRIMARY,
    borderWidth: 2,
    backgroundColor: '#f8f9ff',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  staffInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.APP_PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: COLORS.APP_WHITE,
    fontSize: 18,
    fontFamily: FONTS.INTER_BOLD,
  },
  staffDetails: {
    flex: 1,
  },
  checkboxContainer: {
    marginLeft: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.APP_LIGHTER_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: COLORS.APP_PRIMARY,
    borderColor: COLORS.APP_PRIMARY,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.APP_LIGHTER_GRAY,
    fontFamily: FONTS.INTER_REGULAR,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: COLORS.APP_WHITE,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.APP_LIGHT_GRAY,
  },
  addButton: {
    backgroundColor: COLORS.APP_PRIMARY,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: COLORS.APP_LIGHTER_GRAY,
  },
  addButtonText: {
    color: COLORS.APP_WHITE,
    fontSize: 16,
    fontFamily: FONTS.INTER_MEDIUM,
  },
  disabledButtonText: {
    color: COLORS.APP_GRAY,
  },
});
