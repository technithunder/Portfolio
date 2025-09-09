import {FlatList, View} from 'react-native';
import React, {useState} from 'react';
import {ProfileOptions, ProfileView} from './components';
import styles from './styles';
import {ProfileItem} from './types';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../../../redux/authSlice';
import {navigate} from '../../../utils';
import {Images, Routes} from '../../../constants';
import {Container, CustomConfirmModal} from '../../../components';
import {commonSty} from '../../../theme';

const profileData = [
  {
    id: 1,
    title: 'Deleted User',
    image: Images.recycle_bin,
    icoName: '',
    icon: 'AntDesign',
    onPress: false,
  },
  {
    id: 2,
    title: 'Log out',
    image: Images.logout,
    icoName: '',
    icon: 'AntDesign',
    onPress: false,
  },
];

const AdminProfile = ({navigation}) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleItemPress = (item: ProfileItem) => {
    console.log(item)
    if (item.id == 1) {
      navigation.navigate(Routes.RecycleBin);
    }
    if (item.id == 2) {
      setShowLogoutModal(true);
    } else {
      if (!!item.onPress) {
        item.onPress();
      }
    }
  };
  const renderItem = ({item}: {item: ProfileItem}) => {
    return <ProfileOptions item={item} onPress={() => handleItemPress(item)} />;
  };
  const handleCloseLogoutModal = () => setShowLogoutModal(false);
  const handleLogout = () => {
    setShowLogoutModal(false);
    setTimeout(() => {
      dispatch(logout());
    }, 300);
  };
  const handleProfileViewPress = () => navigate(Routes.AdminEditProfile);

  const filteredProfileData = profileData.filter(item => {
    if (item.id === 1 && user?.role !== 'admin') {
      return false;
    }
    return true;
  });

  return (
    <Container title="Profile">
      <ProfileView onPress={handleProfileViewPress} />
      <View
        style={[
          styles.profileItemContainer,
          {height: user?.role === 'admin' ? 140 : 80},
        ]}>
        <FlatList
          data={filteredProfileData}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={commonSty.pb5}
        />
      </View>
      <CustomConfirmModal
        open={showLogoutModal}
        message="Are you sure you want to logout?"
        title="Virtual Lights"
        submitLabel="Yes"
        cancelLabel="No"
        handleConfirm={handleLogout}
        handleClose={handleCloseLogoutModal}
        handleCancel={handleCloseLogoutModal}
      />
    </Container>
  );
};

export default AdminProfile;
