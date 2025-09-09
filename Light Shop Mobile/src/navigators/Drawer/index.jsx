import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {DrawerActions} from '@react-navigation/native';
import {Images, Routes} from '../../constants';
import {COLORS} from '../../theme/colors';
import {Typography} from '../../components';
import {FONTS} from '../../constants/fonts';
import {useDispatch, useSelector} from 'react-redux';
// import {setCredential, setUsersData} from '../../redux';
import {logout} from '../../redux/authSlice';

const bottomTabItems = [
  Routes.Dashboard,
  Routes.AdminLeads,
  Routes.AdminOrder,
  Routes.AdminActivity,
];

const menuItems = [
  {
    id: 1,
    title: 'Staff',
    icon: Images.staff,
    route: Routes.AdminStaff,
  },
  {
    id: 2,
    title: 'Leads',
    icon: Images.inactive_lead,
    route: Routes.AdminLeads,
    isBottomTab: true,
  },
  {
    id: 3,
    title: 'Dealers',
    icon: Images.dealers,
    route: Routes.AdminDealers,
  },
  {
    id: 4,
    title: 'Orders',
    icon: Images.inactive_order,
    route: Routes.AdminOrder,
    isBottomTab: true,
  },
  {
    id: 5,
    title: 'Products',
    icon: Images.manufacture,
    route: Routes.AdminProducts,
  },
  {
    id: 6,
    title: 'Customer',
    icon: Images.lead_icon,
    route: Routes.AdminCustomer,
  },
  {
    id: 6,
    title: 'Complaints',
    icon: Images.complaints,
    route: Routes.AdminComplaints,
  },
];

const CustomDrawer = ({navigation}) => {
    const user = useSelector(state => state.auth.user)
  // const state = navigation.getState();
  // const currentRouteName =
  // state.routes[state.index]?.state?.routes?.[state.routes[state.index]?.state?.index || 0]?.name ||
  // state.routes[state.index]?.name;
  const dispatch = useDispatch();

  const handleNavigation = (route, isBottomTab) => {
    navigation.dispatch(DrawerActions.closeDrawer());

    if (isBottomTab) {
      navigation.navigate(Routes.AdminBottomStack, {
        screen: route,
      });
    } else {
      navigation.navigate(route);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typography
          title={'Virtual Lights'}
          size={18}
          font={FONTS.INTER_SEMIBOLD}
        />
      </View>

      <View style={styles.menuContainer}>
        {menuItems
          .filter(item => !(item.title === 'Staff' && user?.role === 'staff'))
          .map(item => {
            const isBottomTab = bottomTabItems.includes(item.route);
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleNavigation(item.route, isBottomTab)}>
                <View style={styles.iconContainer}>
                  <Image source={item.icon} style={styles.icon} />
                </View>
                <Typography
                  title={item.title}
                  size={16}
                  ml={10}
                  font={FONTS.INTER_REGULAR}
                  color={COLORS.APP_LIGHTER_GRAY}
                />
              </TouchableOpacity>
            );
          })}
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.menuItem, {paddingHorizontal: 0, marginTop: 10}]}>
          <View style={styles.iconContainer}>
            <Image source={Images.setting} style={styles.icon} />
          </View>
          <Typography
            title={'Setting'}
            size={16}
            ml={10}
            font={FONTS.INTER_REGULAR}
            color={COLORS.APP_LIGHTER_GRAY}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, {paddingHorizontal: 0}]}
          onPress={handleLogout}>
          <View style={styles.iconContainer}>
            <Image source={Images.logout} style={styles.icon} />
          </View>
          <Typography
            title={'Log out'}
            size={16}
            ml={10}
            font={FONTS.INTER_REGULAR}
            color={COLORS.APP_LIGHTER_GRAY}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.APP_WHITE,
  },
  header: {
    padding: 20,
    marginTop: 40,
    // borderBottomWidth: 1,
    // borderBottomColor: '#F0F0F0',
  },
  menuContainer: {
    flex: 1,
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  activeMenuItem: {
    backgroundColor: '#F0F8FF',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.APP_PRIMARY,
  },
  iconContainer: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  bottomContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingBottom: 20,
    marginHorizontal: 20,
  },
  activeMenuItem: {
    backgroundColor: '#00ABDC0D',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.APP_PRIMARY,
    borderRadius: 6,
  },
});

export default CustomDrawer;
