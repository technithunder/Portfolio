import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {COLORS} from '../../config/colors';
import {FONTS} from '../../config/font';
import {moderateScale} from 'react-native-size-matters';

const CommonSelect = ({
  placeHolder,
  onChange,
  value,
  maxHeight = 200,
  selectedItemColor = '#FBD6D6',
  activeBorderColor = COLORS.APP_PRIMARY_MAIN,
  label,
  data,
}) => {
  const [openSelectMenu, setOpenSelectMenu] = useState(false);

  const onPressMenuItem = value => {
    onChange(value);
    setOpenSelectMenu(false);
  };

  return (
    <View>
      <Text style={styles.selectLabel}>{label}</Text>
      <TouchableOpacity
        onPress={() => setOpenSelectMenu(!openSelectMenu)}
        style={styles.selectButton}>
        <View style={styles.selectContainer}>
          <Text
            style={[
              styles.txtPlaceHolder,
              {color: value ? COLORS.APP_BLACK : COLORS.APP_PLACEHOLDER},
            ]}>
            {value || placeHolder}
          </Text>
          <Entypo
            name={openSelectMenu ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={COLORS.APP_COMMON_PLACEHOLDER}
          />
        </View>
      </TouchableOpacity>

      {openSelectMenu && (
        <View
          style={[
            styles.dropdownContainer,
            {
              maxHeight: maxHeight,
              borderColor: activeBorderColor,
            },
          ]}>
          <FlatList
            data={data}
            keyExtractor={(item, index) => `option-${index}`}
            showsVerticalScrollIndicator={true}
            bounces={true}
            nestedScrollEnabled={true}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => onPressMenuItem(item.label)}
                style={[
                  styles.menuItem,
                  {
                    backgroundColor:
                      value === item.value ? selectedItemColor : 'transparent',
                    borderBottomWidth: index === data.length - 1 ? 0 : 1,
                  },
                ]}>
                <Text style={[styles.menuItemLabel, {color: COLORS.APP_BLACK}]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  selectButton: {
    height: moderateScale(45),
    paddingHorizontal: 10,
    borderColor: COLORS.APP_BORDER,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: COLORS.APP_BOTTOMBAR,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  txtPlaceHolder: {
    color: COLORS.APP_COMMON_PLACEHOLDER,
    fontSize: moderateScale(14),
    fontFamily: FONTS.INTER_REGULAR,
  },
  dropdownContainer: {
    position: 'absolute',
    width: '100%',
    top: 90,
    left: 0,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    overflow: 'hidden',
    zIndex: 1000,
  },
  selectMenu: {
    width: '100%',
    borderColor: COLORS.APP_PRIMARY_MAIN,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: 'white',
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.APP_BORDER,
  },
  selectedMenuItem: {
    backgroundColor: '#FBD6D6',
  },
  txtMenuItemLabel: {
    fontSize: moderateScale(16),
    fontFamily: FONTS.INTER_MEDIUM_ITALIC,
  },
  selectLabel: {
    fontSize: moderateScale(14),
    fontFamily: FONTS.INTER_MEDIUM,
    color: COLORS.APP_COMMON_BLACK,
  },
});

export default CommonSelect;
