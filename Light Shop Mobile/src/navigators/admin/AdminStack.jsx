import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {Routes, Screens} from '../../constants';
import {StatusBar} from 'react-native';

const AdminStack = () => {
  const Stack = createStackNavigator();

  return (
    <>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle="dark-content"
      />
      <Stack.Navigator
        initialRouteName={Routes.DrawerStack}
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        <Stack.Screen
          name={Routes.DrawerStack}
          component={Screens.DrawerStack}
        />
        <Stack.Screen
          name={Routes.AdminStaffProfile}
          component={Screens.AdminStaffProfiile}
        />
        <Stack.Screen
          name={Routes.AdminStaffEditProfile}
          component={Screens.AdminStaffEditProfile}
        />
        <Stack.Screen
          name={Routes.AdminLeadView}
          component={Screens.AdminLeadView}
        />
        <Stack.Screen
          name={Routes.AdminDealersProfile}
          component={Screens.AdminDealersProfile}
        />
        <Stack.Screen
          name={Routes.AdminDealersOrder}
          component={Screens.AdminDealersOrder}
        />
        <Stack.Screen
          name={Routes.AdminDealersEditProfile}
          component={Screens.AdminDealersEditProfile}
        />
        <Stack.Screen
          name={Routes.AdminCustomerProfile}
          component={Screens.AdminCustomerProfile}
        />
        <Stack.Screen
          name={Routes.AdminCustomerOrder}
          component={Screens.AdminCustomerOrder}
        />
        <Stack.Screen
          name={Routes.AdminCustomerEditProfile}
          component={Screens.AdminCustomerEditProfile}
        />
        <Stack.Screen
          name={Routes.AdminOrdersDetail}
          component={Screens.AdminOrdersDetail}
        />
        <Stack.Screen
          name={Routes.AdminEditProfile}
          component={Screens.AdminEditProfile}
        />
        <Stack.Screen
          name={Routes.SelectStaff}
          component={Screens.SelectStaff}
        />
        <Stack.Screen
          name={Routes.AdminDealerOrderDetail}
          component={Screens.AdminDealerOrderDetail}
        />
        <Stack.Screen
          name={Routes.AdminCustomerOrderDetail}
          component={Screens.AdminCustomerOrderDetail}
        />
        <Stack.Screen name={Routes.AddOrder} component={Screens.AddOrder} />
        <Stack.Screen
          name={Routes.ProgressReport}
          component={Screens.ProgressReport}
        />
        <Stack.Screen name={Routes.ManageLead} component={Screens.ManageLead} />
        <Stack.Screen name={Routes.AddProduct} component={Screens.AddProduct} />
        <Stack.Screen name={Routes.LeadStaff} component={Screens.LeadStaff} />
        <Stack.Screen
          name={Routes.AddCategory}
          component={Screens.AddCategory}
        />
        <Stack.Screen name={Routes.ViewOrder} component={Screens.ViewOrders} />
        <Stack.Screen name={Routes.ViewLead} component={Screens.ViewLeads} />
        <Stack.Screen
          name={Routes.ViewComplaints}
          component={Screens.ViewComplaints}
        />
        <Stack.Screen name={Routes.ViewStaff} component={Screens.ViewStaff} />
        <Stack.Screen name={Routes.RecycleBin} component={Screens.RecycleBin} />
        <Stack.Screen name={Routes.ManageNote} component={Screens.ManageNote} />
        <Stack.Screen name={Routes.AdminViewComplaints} component={Screens.AdminViewComplaints} />
        <Stack.Screen name={Routes.AdminComplaintStaff} component={Screens.AdminComplaintStaff} />
        <Stack.Screen name={Routes.ViewAdminTodayLead} component={Screens.ViewAdminTodayLeads} />
        <Stack.Screen name={Routes.ViewAdminTodayOrder} component={Screens.ViewAdminTodayOrders} />
      </Stack.Navigator>
    </>
  );
};

export default AdminStack;
