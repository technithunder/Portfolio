import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {Dropdown} from 'react-native-element-dropdown';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './style';
import {
  getAllAssignStaff,
  getSingleOrder,
  manageOderStatus,
  orderApproveApi,
  removeAssignStaff,
  uploadPaymentPhoto,
} from '../../../../api';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Icon, PickerSheet, Typography} from '../../../../components';
import {FONTS} from '../../../../constants/fonts';
import {COLORS} from '../../../../theme/colors';
import {Images, Routes} from '../../../../constants';
import {navigate} from '../../../../utils';
import PhotoModal from './PhotoModal';
import {
  convertImageToBase64,
  orderStatusOptions,
} from '../../../../utils/helper';
import Toast from 'react-native-toast-message';
import LinearButton from '../../../../components/LinearButton';
import moment from 'moment';
import Rating from '../../../newHome/Rating';

const orderStatusOption = {
  approve: 'Approved',
  reject: 'Rejected',
  pending: 'Pending',
};

const NewOrderDetail = ({navigation}) => {
  const user = useSelector(state => state.auth.user);
  const editSheetRef = useRef(null);

  const route = useRoute();
  const {orderId,customerId} = route.params;
  const [data, setData] = useState(null);
  const [assignStaff, setAssignStaff] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [isOpenPhotoModal, setIsOpenPhotoModal] = useState(false);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('');
  const [isLoadingOrderStatus, setIsLoadingOrderStatus] = useState(false);
  const [originalOrderStatus, setOriginalOrderStatus] = useState(null);
  const [uploadImage, setUploadImage] = useState(null);
  console.log('==>data', data);

  useEffect(() => {
    fetchSingleOrder(orderId);
    fetchAssignStaff(orderId);
  }, [orderId]);

  const fetchAssignStaff = async orderId => {
    try {
      const response = await getAllAssignStaff(orderId);
      if (response?.data?.status === 'success') {
        setAssignStaff(response?.data?.data?.data?.assignedStaff);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchSingleOrder = async orderId => {
    setIsLoading(true);
    try {
      const response = await getSingleOrder(orderId);
      if (response?.data?.status === 'success') {
        console.log('Order Details:', response.data.data.order);
        setData(response.data.data.order);
        setSelectedOrderStatus(response?.data?.data?.order?.status);
        setUploadImage(response.data.data.order?.orderPayment || null);
        setIsLoading(false);
      }
    } catch (e) {
      setIsLoading(false);
      console.error('Error fetching order details:', e);
    }
  };

  const handleOpenActionSheet = () => {
    editSheetRef.current?.show();
  };

  const handleGetImages = image => {
    editSheetRef.current?.hide();
    setUploadImage(image);
  };

  const onDelete = async id => {
    try {
      let obj = {
        orderId: orderId,
        staffId: id,
      };
      const response = await removeAssignStaff(obj);
      if (response?.data?.status === 'success') {
        fetchAssignStaff(orderId);
        setLoading(false);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Staff deleted successfully',
        });
      }
    } catch (e) {
      setLoading(false);
      console.error('Error deleting staff:', e);
    }
  };

  const onClickUpdateStatusBtn = async () => {
    try {
      setIsLoadingOrderStatus(true);
      let obj = {
        status: selectedOrderStatus,
      };
      const response = await manageOderStatus(orderId, obj);
      if (response?.data?.status === 'success') {
        console.log(response?.data?.data);
        setSelectedOrderStatus('');
        fetchSingleOrder(orderId);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Order status updated successfully',
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoadingOrderStatus(false);
    }
  };

  const onUpload = async () => {
    setLoading(true);
    try {
      let obj = {
        orderId: data?.id,
        orderPayment: uploadImage.path
          ? await convertImageToBase64(uploadImage.path)
          : uploadImage,
      };
      const response = await uploadPaymentPhoto(obj);
      if (response?.data?.status === 'success') {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Payment Photo uploaded successfully',
        });
      }
    } catch (e) {
      console.log('Error uploading payment photo:', e);
    } finally {
      setLoading(false);
    }
  };

  const onPressUpload = async () => {
    // try{
    //   setUploadLoading(true)
    //   const formData = new FormData();
    //   formData.append('orderId', orderId);
    //   formData.append('image', profileImage)
    //   const response = await uploadPaymentPhoto(formData);
    //   if(response?.data?.status === 'success'){
    //     console.log("==>welcome",response?.data?.data);
    //     setUploadLoading(false)
    //     Toast.show({
    //       type: 'success',
    //       text1: 'Success',
    //       text2: 'Photo uploaded successfully',
    //     });
    //   }
    // }catch(e){
    //   console.log(e)
    // }
  };

  // const renderCustomerInfo = () => {
  //   return (
  //     <View style={{marginTop: 20, marginBottom: 40}}>
  //       <Typography
  //         title={'Customer info'}
  //         font={FONTS.INTER_MEDIUM}
  //         size={18}
  //       />
  //       <View style={{marginTop: 14}}>
  //         <Typography
  //           title={'Jay Hargudson'}
  //           size={14}
  //           font={FONTS.INTER_MEDIUM}
  //         />
  //         <Typography
  //           title={'cus004'}
  //           size={12}
  //           font={FONTS.INTER_MEDIUM}
  //           color={COLORS.APP_GRAY}
  //         />
  //         <View style={{marginLeft: 10}}>
  //           <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
  //             <Icon
  //               icon="Feather"
  //               color="#667085"
  //               name="headphones"
  //               size={16}
  //             />
  //             <Typography
  //               title={'+91 2345678906'}
  //               size={14}
  //               font={FONTS.INTER_MEDIUM}
  //               color="#667085"
  //             />
  //           </View>
  //           <View style={{width: '70%', marginTop: 10}}>
  //             <Typography
  //               title={
  //                 'A-101,TCS Apartment, Happy street ,CG road, ahmnedabad - 380015'
  //               }
  //               size={14}
  //               color="#667085"
  //               font={FONTS.INTER_MEDIUM}
  //             />
  //           </View>
  //         </View>
  //       </View>
  //     </View>
  //   );
  // };

  const onPressOrderStatusBtn = async status => {
    try {
      let obj = {
        approvedStatus: status,
      };
      const response = await orderApproveApi(orderId, obj);
      if (response?.data?.status === 'success') {
        console.log('Order status updated successfully:', response.data);
        fetchSingleOrder(orderId);
      }
    } catch (e) {
      console.log('Error in onPressOrderStatusBtn:', e);
    } finally {
      console.log(e);
    }
  };

  const renderOrderStatus = () => {
    return (
      <View style={{marginTop: 20}}>
        <Typography
          title={'Order Status'}
          font={FONTS.INTER_MEDIUM}
          size={18}
        />
        <View
          style={{
            marginTop: 14,
          }}>
          <Dropdown
            style={[styles.inputField, styles.dropdown]}
            placeholderStyle={styles.dropdownPlaceholder}
            selectedTextStyle={styles.dropdownSelectedText}
            inputSearchStyle={styles.dropdownSearch}
            iconStyle={styles.dropdownIcon}
            data={orderStatusOptions}
            maxHeight={240}
            labelField="label"
            valueField="value"
            placeholder="Select Order Status"
            itemTextStyle={{color: COLORS.APP_BLACK}}
            value={selectedOrderStatus}
            disable={
              data?.approvedStatus === 'pending' || data?.status === 'cancelled'
            }
            onChange={item => {
              setOriginalOrderStatus(item.value);
              setSelectedOrderStatus(item.value);
            }}
            renderRightIcon={() => (
              <MaterialIcons
                name="keyboard-arrow-down"
                size={20}
                color={COLORS.APP_GRAY}
              />
            )}
          />
          {selectedOrderStatus === originalOrderStatus && (
            <TouchableOpacity
              onPress={onClickUpdateStatusBtn}
              style={styles.detailsButton}>
              <Typography
                title={'Update'}
                size={14}
                color={COLORS.APP_WHITE}
                font={FONTS.INTER_MEDIUM}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderSummary = () => {
    return (
      <View style={{marginTop: 20}}>
        <Typography
          title={'Payment Summary'}
          size={18}
          font={FONTS.INTER_SEMIBOLD}
        />
        <View style={{marginTop: 14}}>
          {data?.expectedDate && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <Typography
                title={'Expected Delivery Date'}
                size={14}
                color={COLORS.APP_GRAY}
              />
              <Typography
                title={moment(data?.expectedDate).format('DD MMM, YYYY')}
                size={14}
              />
            </View>
          )}
          {data?.shippingAddress && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 10,
              }}>
              <Typography
                title={'Shipping Address'}
                style={{
                  flex: 1,
                  color: COLORS.APP_GRAY,
                  fontSize: 14,
                  fontFamily: FONTS.INTER_REGULAR,
                }}
              />
              <View style={{flex: 2, paddingLeft: 10}}>
                <Typography
                  title={data?.shippingAddress}
                  style={{
                    flexWrap: 'wrap',
                    fontSize: 14,
                    textAlign: 'right',
                    fontFamily: FONTS.INTER_REGULAR,
                  }}
                />
              </View>
            </View>
          )}
          {data?.totalAmount && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <Typography
                title={'Order Subtotal'}
                size={14}
                color={COLORS.APP_GRAY}
              />

              {data?.totalAmount && (
                <Typography
                  title={`₹ ${data?.totalAmount.toFixed(2)}`}
                  size={14}
                />
              )}
            </View>
          )}
          {data?.totalItems && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <Typography
                title={'Total Items'}
                size={14}
                color={COLORS.APP_GRAY}
              />
              <Typography title={data.totalItems} size={14} />
            </View>
          )}
          <View style={styles.divider} />
          {data?.totalAmount && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <Typography
                title={'Order Total'}
                size={14}
                color={COLORS.APP_GRAY}
              />
              <Typography
                title={`₹ ${data?.totalAmount.toFixed(2)}`}
                size={14}
              />
            </View>
          )}
        </View>
      </View>
    );
  };
  const renderProducts = () => {
    return (
      <>
        {data?.orderItems?.map((ele, index) => {
          return (
            <View style={styles.productCard}>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 14,
                }}
                key={index}>
                {ele?.image && ele?.image?.length > 0 ? (
                  <Image
                    source={{uri: ele?.image[0]}}
                    style={{height: 70, width: 70, borderRadius: 10}}
                  />
                ) : null}
                <View>
                  <View
                    style={{
                      width: 180,
                      flexDirection: 'row',
                    }}>
                    <Typography
                      title={ele?.productName}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={{
                        flex: 1,
                        color: COLORS.APP_BLACK,
                        fontSize: 16,
                        fontFamily: FONTS.INTER_SEMIBOLD,
                      }}
                    />
                  </View>
                  <View style={{marginTop:5}}>
                  {ele?.bodycolors && (
                    <Typography
                      title={`Body Color: ${ele?.bodycolors}`}
                      size={12}
                      color={COLORS.APP_LABEL}
                    />
                  )}
                  {ele?.ledcolors && (
                    <Typography
                      title={`LED Color: ${ele?.ledcolors}`}
                      size={12}
                      color={COLORS.APP_LABEL}
                    />
                  )}
                  <View style={{flexDirection: 'row', gap: 10, marginTop: 2}}>
                    {ele?.watts && (
                      <Typography
                        title={`Watts: ${ele?.watts}`}
                        size={12}
                        color={COLORS.APP_LABEL}
                      />
                    )}
                    {ele?.reflectors && (
                      <Typography
                        title={`Reflectors: ${ele?.reflectors}`}
                        size={12}
                        color={COLORS.APP_LABEL}
                      />
                    )}
                  </View>
                  <Typography
                    title={`Quantity:${ele?.quantity}`}
                    size={12}
                    color={COLORS.APP_LABEL}
                  />
                  </View>
                  {ele?.avgrating !== 0 && <Rating rating={ele?.avgrating} />}
                </View>
              </View>
            </View>
          );
        })}
      </>
    );
  };

  const renderAssignUser = () => {
    return (
      <View style={{marginTop: 10, marginBottom: 20}}>
        <Typography title={'Assign User'} size={18} font={FONTS.INTER_MEDIUM} />
        <TouchableOpacity
          onPress={() => navigate(Routes.SelectStaff, {orderId: orderId})}
          style={[
            styles.uploadButton,
            {alignItems: 'center', justifyContent: 'center'},
          ]}>
          <Typography
            title={'Select Staff'}
            font={FONTS.INTER_REGULAR}
            size={14}
          />
        </TouchableOpacity>

        {assignStaff?.length > 0 && (
          <View style={styles.assignUserCard}>
            <FlatList
              data={assignStaff}
              renderItem={({item, index}) => {
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      justifyContent: 'space-between',
                      borderBottomWidth: 1,
                      borderBottomColor: COLORS.APP_LIGHT_GRAY,
                      paddingVertical: 10,
                    }}
                    key={index}>
                    <Typography
                      title={`${item?.firstName} ${item?.lastName}`}
                      font={FONTS.INTER_REGULAR}
                    />
                    {loading ? (
                      <ActivityIndicator size={16} color={'red'} />
                    ) : (
                      <Icon
                        onPress={() => onDelete(item.id)}
                        icon="MaterialCommunityIcons"
                        name="delete"
                        size={24}
                        color={'red'}
                      />
                    )}
                  </View>
                );
              }}
            />
          </View>
        )}
      </View>
    );
  };

  const renderUploadPhoto = () => {
    return (
      <>
        {data?.orderPayment && (
          <View style={{marginTop: 20}}>
            <Typography
              title={'Proof Of Payment'}
              size={18}
              font={FONTS.INTER_SEMIBOLD}
            />
            <TouchableOpacity
              onPress={() => setIsOpenPhotoModal(true)}
              style={styles.paymentPhotoContainer}>
              <Typography
                title={'View photo'}
                size={14}
                font={FONTS.INTER_REGULAR}
              />
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  };

  const renderProofOfPayment = () => {
    return (
      <View style={{marginTop: 20}}>
        <Typography
          title={'Proof Of Payment'}
          size={18}
          font={FONTS.INTER_SEMIBOLD}
        />
        <View style={{marginTop: 10}}>
          {uploadImage ? (
            <TouchableOpacity
              onPress={() => setIsOpenPhotoModal(true)}
              style={[
                styles.uploadPhoto,
                {width: '100%', alignItems: 'center', justifyContent: 'center'},
              ]}>
              <Typography
                title={'View photo'}
                size={14}
                font={FONTS.INTER_REGULAR}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleOpenActionSheet}
              style={[
                styles.uploadPhoto,
                {width: '100%', alignItems: 'center', justifyContent: 'center'},
              ]}>
              <Typography
                title={'Choose photo'}
                size={14}
                color={COLORS.APP_GRAY}
              />
            </TouchableOpacity>
          )}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              marginTop: 14,
            }}>
            {uploadImage && (
              <TouchableOpacity
                onPress={handleOpenActionSheet}
                style={styles.editButton}>
                <Typography
                  title={'Edit'}
                  size={14}
                  color={COLORS.APP_BLACK}
                  font={FONTS.INTER_MEDIUM}
                />
              </TouchableOpacity>
            )}
            {uploadImage && (
              <TouchableOpacity onPress={onUpload} style={styles.detailsButton}>
                {loading ? (
                  <ActivityIndicator size={22} color={COLORS.APP_WHITE} />
                ) : (
                  <Typography
                    title={'Upload'}
                    size={14}
                    color={COLORS.APP_WHITE}
                    font={FONTS.INTER_MEDIUM}
                  />
                )}
              </TouchableOpacity>
            )}
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
          onPress={() =>
            navigate(Routes.AdminCustomerOrder, {customerId: customerId})
          }>
          <Ionicons name="chevron-back" size={20} color={COLORS.APP_BLACK} />
        </TouchableOpacity>
        <Typography title={'OrderID 004'} font={FONTS.INTER_MEDIUM} size={16} />
        <View style={styles.headerChip}>
          <Typography
            title={orderStatusOption[data?.approvedStatus]}
            size={12}
          />
        </View>
      </View>
    );
  };

  const renderQuery = () => {
    return (
      <>
        {data?.query && (
          <View style={{marginTop: 20}}>
            <Typography title={'Query'} size={18} font={FONTS.INTER_SEMIBOLD} />
            <View
              style={{
                marginTop: 10,
                width: '100%',
                height: 'auto',
                padding: 10,
                backgroundColor: COLORS.APP_WHITE,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: COLORS.APP_GRAY,
              }}>
              <Typography title={data?.query} size={14} />
            </View>
          </View>
        )}
      </>
    );
  };

  const renderApproveFlow = () => {
    return (
      <View style={styles.approveFlowContainer}>
        <TouchableOpacity
          style={[
            styles.approveRejectBtn,
            {backgroundColor: COLORS.REJECT_RED || '#FF4444'},
          ]}
          onPress={() => {
            onPressOrderStatusBtn('reject');
          }}>
          <MaterialIcons
            name="close"
            size={20}
            color={COLORS.APP_WHITE}
            style={styles.buttonIcon}
          />
          <Typography
            title={'Reject'}
            size={16}
            font={FONTS.INTER_SEMIBOLD}
            color={COLORS.APP_WHITE}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.approveRejectBtn,
            {backgroundColor: COLORS.APPROVE_GREEN || '#4CAF50'},
          ]}
          onPress={() => {
            onPressOrderStatusBtn('approve');
          }}>
          <MaterialIcons
            name="check"
            size={20}
            color={COLORS.APP_WHITE}
            style={styles.buttonIcon}
          />
          <Typography
            title={'Approve'}
            size={16}
            font={FONTS.INTER_SEMIBOLD}
            color={COLORS.APP_WHITE}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderCustomerInfo = () => {
    return (
      <View style={{marginTop: 20, marginBottom: 40}}>
        <Typography
          title={'Customer info'}
          font={FONTS.INTER_MEDIUM}
          size={18}
        />
        <View style={{marginTop: 14}}>
          {data?.user?.firstName && (
            <Typography
              title={`${data?.user?.firstName} ${data?.user?.lastName}`}
              size={14}
              font={FONTS.INTER_MEDIUM}
            />
          )}
          {data?.user?.email && (
            <Typography
              title={data?.user?.email}
              size={12}
              font={FONTS.INTER_MEDIUM}
              color={COLORS.APP_GRAY}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size={22} color={COLORS.APP_PRIMARY} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}>
          {renderProducts()}
          {renderOrderStatus}
          {renderSummary()}
          {renderOrderStatus()}
          {data?.isAdmin ? renderProofOfPayment() : renderUploadPhoto()}
          {user.role !== 'staff' &&
            data?.approvedStatus !== 'pending' &&
            data?.status !== 'cancelled' &&
            renderAssignUser()}
          {renderQuery()}
          {renderCustomerInfo()}

          {/* <View style={{height: 20}} /> */}
        </ScrollView>
      )}

      <PickerSheet
        sheetRef={editSheetRef}
        onImagePickerPress={handleGetImages}
      />

      {isOpenPhotoModal && (
        <PhotoModal
          visible={isOpenPhotoModal}
          onClose={() => setIsOpenPhotoModal(false)}
          imageUrl={uploadImage?.path ? uploadImage.path : uploadImage}
        />
      )}

      {data?.approvedStatus === 'pending' && renderApproveFlow()}
    </SafeAreaView>
  );
};

export default NewOrderDetail;
