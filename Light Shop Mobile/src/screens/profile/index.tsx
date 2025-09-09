import {FlatList, View} from 'react-native';
import React, {useState} from 'react';
import {Container, CustomConfirmModal} from '../../components';
import {commonSty} from '../../theme';
import {ProfileOptions, ProfileView} from './components';
import styles from './styles';
import {profileData, Routes} from '../../constants';
import {ProfileItem} from './types';
import {useDispatch, useSelector} from 'react-redux';
import {setCredential, setUsersData} from '../../redux';
import {navigate} from '../../utils';
import { logout } from '../../redux/authSlice';

const Profile = () => {
 
  const dispatch = useDispatch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleItemPress = (item: ProfileItem) => {
    if (item.id === 4) {
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
     dispatch(logout())
    }, 300);
  };
  const handleProfileViewPress = () => navigate(Routes.NewEditProfile);
  return (
    <Container title='Profile'>
      <ProfileView onPress={handleProfileViewPress} />
      <View style={styles.profileItemContainer}>
        <FlatList
          data={profileData}
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

export default Profile;
