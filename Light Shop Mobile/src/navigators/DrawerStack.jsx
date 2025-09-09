import React from 'react';
import {Dimensions} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Routes, Screens} from '../constants';
import CustomDrawer from './Drawer';
import { useSelector } from 'react-redux';

const Drawer = createDrawerNavigator();
const {width} = Dimensions.get('window');

const DrawerStack = () => {
    const user = useSelector(state => state.auth.user)
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        drawerType: 'front',
        drawerStyle: {
          width: width * 0.75,
          backgroundColor: '#FFFFFF',
        },
        headerShown: false,
        swipeEnabled: false,
        overlayColor: 'rgba(0, 0, 0, 0.5)',
      }}>
      <Drawer.Screen
        name={Routes.AdminBottomStack}
        component={Screens.AdminBottomStack}
      />
      {user.role !== "staff" && <Drawer.Screen name={Routes.AdminStaff} component={Screens.AdminStaff} />}
      <Drawer.Screen
        name={Routes.AdminDealers}
        component={Screens.AdminDealers}
      />
      <Drawer.Screen
        name={Routes.AdminManufacturer}
        component={Screens.AdminManufacturer}
      />
      {/* <Drawer.Screen
        name={Routes.AdminManufacturer}
        component={Screens.AdminManufacturer}
      /> */}
      <Drawer.Screen
        name={Routes.AdminProducts}
        component={Screens.AdminProducts}
      />
      <Drawer.Screen
        name={Routes.AdminCustomer}
        component={Screens.AdminCustomer}
      />
      <Drawer.Screen
        name={Routes.AdminComplaints}
        component={Screens.AdminComplaints}
      />
    </Drawer.Navigator>
  );
};

export default DrawerStack;
