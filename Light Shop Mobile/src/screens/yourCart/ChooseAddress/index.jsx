import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import React, {useState} from 'react';
import {Sheet, Typography} from '../../../components';
import {FONTS} from '../../../constants/fonts';
import {COLORS} from '../../../theme/colors';

const ChooseAddress = ({
  ref,
  addressList,
  onAddressSelect,
  onAddAddressPress,
  isAddAddressEnabled = true, // Default to true if not provided
}) => {
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleAddressSelect = (address, index) => {
    setSelectedAddress(index);
    onAddressSelect?.(address);
  };

  const renderAddressItem = ({item, index}) => {
    const isSelected = selectedAddress === index;

    return (
      <TouchableOpacity
        style={[
          styles.addressContainer,
          isSelected && styles.selectedAddressContainer,
        ]}
        onPress={() => handleAddressSelect(item, index)}
        activeOpacity={0.7}>
        <View style={styles.addressContent}>
          <Typography
            title={item?.street || 'N/A'}
            size={13}
            font={FONTS.INTER_SEMIBOLD}
            color={isSelected ? COLORS.APP_WHITE : COLORS.APP_BLACK}
            numberOfLines={1}
          />
          <Typography
            title={`${item?.city || ''}-${item?.zipCode || ''}`}
            size={11}
            font={FONTS.INTER_MEDIUM}
            color={isSelected ? COLORS.APP_WHITE : COLORS.APP_GRAY}
            numberOfLines={1}
          />
          <Typography
            title={`${item?.state || ''}, ${item?.country || ''}`}
            size={11}
            font={FONTS.INTER_MEDIUM}
            color={isSelected ? COLORS.APP_WHITE : COLORS.APP_GRAY}
            numberOfLines={1}
          />
        </View>

        {isSelected && (
          <View style={styles.selectionIndicator}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderAddAddressBox = () => {
    return (
      <TouchableOpacity
        style={styles.addAddressContainer}
        onPress={onAddAddressPress}
        activeOpacity={0.7}>
        <View style={styles.addAddressContent}>
          <View style={styles.plusIcon}>
            <Text style={styles.plusText}>+</Text>
          </View>

          <Typography
            title="Add Address"
            size={12}
            font={FONTS.INTER_SEMIBOLD}
            color={COLORS.APP_PRIMARY}
          />

          <Typography
            title="Add new delivery address"
            size={10}
            font={FONTS.INTER_REGULAR}
            color={COLORS.APP_GRAY}
            numberOfLines={1}
            align="center"
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderItem = ({item, index}) => {
    if (item.isAddAddress) {
      return renderAddAddressBox();
    }
    return renderAddressItem({item, index});
  };

  // Add address item sirf tab add karo jab isAddAddressEnabled true ho
  const dataWithAddAddress = isAddAddressEnabled 
    ? [...addressList, {isAddAddress: true, id: 'add-address'}]
    : addressList;

  return (
    <Sheet ref={ref}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography
            title={'Choose Address'}
            font={FONTS.INTER_SEMIBOLD}
            size={16}
          />
          <Typography
            title={'Select your preferred delivery address'}
            font={FONTS.INTER_REGULAR}
            size={12}
            color={COLORS.APP_GRAY}
          />
        </View>

        {dataWithAddAddress?.length > 0 ? <View style={styles.addressListContainer}>
          <FlatList
            data={dataWithAddAddress}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContainer}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            keyExtractor={(item, index) =>
              item.id?.toString() || index.toString()
            }
          />
        </View> :( 
          <View>
            <Typography
              title="No addresses available"
              size={14}
              font={FONTS.INTER_MEDIUM}
              color={COLORS.APP_GRAY}
              align="center"
            />
          </View>
        )}
      </View>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 16,
  },
  addressListContainer: {
    marginTop: 8,
  },
  addressContainer: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.APP_STROKE,
    backgroundColor: COLORS.APP_WHITE,
    width: 160,
    height: 90,
    position: 'relative',
    justifyContent: 'space-between',
  },
  selectedAddressContainer: {
    borderColor: COLORS.APP_PRIMARY,
    backgroundColor: COLORS.APP_PRIMARY,
    borderWidth: 2,
  },
  addressContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  selectionIndicator: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.APP_WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: COLORS.APP_PRIMARY,
    fontSize: 10,
    fontWeight: 'bold',
  },
  addAddressContainer: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.APP_PRIMARY,
    backgroundColor: COLORS.APP_WHITE,
    borderStyle: 'dashed',
    width: 160,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addAddressContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.APP_PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  plusText: {
    color: COLORS.APP_WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  flatListContainer: {
    paddingHorizontal: 5,
  },
  separator: {
    width: 10,
  },
});

export default ChooseAddress