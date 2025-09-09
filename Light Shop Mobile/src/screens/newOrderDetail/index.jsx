import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './style';
import {Icon, PickerSheet, Typography} from '../../components';
import {FONTS} from '../../constants/fonts';
import {Routes} from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {COLORS} from '../../theme/colors';
import {useRoute} from '@react-navigation/native';
import {getSingleOrder, uploadPaymentPhoto} from '../../api';
import {convertImageToBase64} from '../../utils/helper';
import Toast from 'react-native-toast-message';
import PhotoModal from './PhotoModal';
import moment from 'moment';
import {useSelector} from 'react-redux';
import Rating from '../newHome/Rating';
import ComplantionModal from './ComplantionModal';

// Order status configuration
const orderStatusOptions = [
  {value: 'admin_approval', label: 'Under Admin Approval'},
  {value: 'approved', label: 'Approved'},
  {value: 'process_for_advance', label: 'In-process For Advance'},
  {value: 'update_receipt', label: 'Advance Received'},
  {value: 'processing', label: 'Processing For Production'},
  {value: 'production', label: 'In Production'},
  {value: 'production_finished', label: 'Production Finished'},
  {value: 'rest_of_payment', label: 'Rest Of Payment'},
  {value: 'admin_final_approval', label: 'Final Approval Given'},
  {value: 'out_for_delivery', label: 'Out For Delivery'},
  {value: 'dispatched', label: 'Dispatched'},
  {value: 'delivered', label: 'Delivered'},
  {value: 'cancelled', label: 'Cancelled'},
];

const NewOrderDetail = ({navigation}) => {
  const advanceSheetRef = useRef(null);
  const finalSheetRef = useRef(null);
  const route = useRoute();
  const {orderId} = route.params;
  const user = useSelector(state => state.auth.user);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadImage, setUploadImage] = useState(null);
  const [uploadPaymentImage, setUploadPaymentImage] = useState(null);
  const [loadingAdvance, setLoadingAdvance] = useState(false);
  const [loadingFinal, setLoadingFinal] = useState(false);
  const [isOpenPhotoModal, setIsOpenPhotoModal] = useState(false);
  const [isOpenPhotoPaymentModal, setIsOpenPhotoPaymentModal] = useState(false);

  const [isOpenComplantionModal, setIsOpenComplantionModal] = useState(false);
  console.log('===>data', data);

  const handleOpenAdvanceSheet = () => advanceSheetRef.current?.show();
  const handleOpenFinalSheet = () => finalSheetRef.current?.show();

  const handleGetImages = image => {
    advanceSheetRef.current?.hide();
    console.log('Selected image:', image);
    setUploadImage(image);
  };

  const handleGetPaymentImages = image => {
    finalSheetRef.current?.hide();
    console.log('Selected image:', image);
    setUploadPaymentImage(image);
  };

  useEffect(() => {
    fetchSingleOrder(orderId);
  }, [orderId]);

  const fetchSingleOrder = async orderId => {
    setIsLoading(true);
    try {
      const response = await getSingleOrder(orderId, user?.id);
      if (response?.data?.status === 'success') {
        setData(response.data.data.order);
        setUploadImage(response.data.data.order?.orderPayment || null);
        setUploadPaymentImage(response.data.data.order?.finalPayment || null);
        setIsLoading(false);
      }
    } catch (e) {
      setIsLoading(false);
      console.error('Error fetching order details:', e);
    }
  };

  // Advance upload handler
  const onUpload = async () => {
    setLoadingAdvance(true);
    try {
      let obj = {
        orderId: data?.id,
        orderPayment: uploadImage?.path
          ? await convertImageToBase64(uploadImage?.path)
          : uploadImage,
      };
      const response = await uploadPaymentPhoto(obj);
      if (response?.data?.status === 'success') {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Advance payment uploaded successfully',
        });
      }
    } catch (e) {
      console.log('Error uploading advance photo:', e);
    } finally {
      setLoadingAdvance(false);
    }
  };

  // Final upload handler
  const onPaymentUpload = async () => {
    setLoadingFinal(true);
    try {
      let obj = {
        orderId: data?.id,
        finalPayment: uploadPaymentImage?.path
          ? await convertImageToBase64(uploadPaymentImage?.path)
          : uploadPaymentImage,
      };
      const response = await uploadPaymentPhoto(obj);
      if (response?.data?.status === 'success') {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Final payment uploaded successfully',
        });
      }
    } catch (e) {
      console.log('Error uploading final photo:', e);
    } finally {
      setLoadingFinal(false);
    }
  };

  // Get current status index and determine completed steps
  const getCurrentStatusIndex = () => {
    if (!data?.status) return 0;

    // Handle cancelled status separately
    if (data.status === 'cancelled') {
      return orderStatusOptions.findIndex(
        status => status.value === 'cancelled',
      );
    }

    return orderStatusOptions.findIndex(status => status.value === data.status);
  };

  const isStatusCompleted = index => {
    const currentIndex = getCurrentStatusIndex();

    // If order is cancelled, only show cancelled as completed
    if (data?.status === 'cancelled') {
      return (
        index ===
        orderStatusOptions.findIndex(status => status.value === 'cancelled')
      );
    }

    // For normal flow, show all steps up to current as completed
    return index <= currentIndex && data?.status !== 'cancelled';
  };

  const isStatusActive = index => {
    const currentIndex = getCurrentStatusIndex();
    return index === currentIndex;
  };

  const getStatusColor = index => {
    if (
      data?.status === 'cancelled' &&
      orderStatusOptions[index].value === 'cancelled'
    ) {
      return '#FF4444'; // Red for cancelled
    }
    if (isStatusCompleted(index)) {
      return '#4CAF50'; // Green for completed
    }
    if (isStatusActive(index)) {
      return '#2196F3'; // Blue for active
    }
    return '#E0E0E0'; // Gray for pending
  };

  const renderOrderStatus = () => {
    // Filter out cancelled from normal flow if order is not cancelled
    let statusesToShow = orderStatusOptions;
    if (data?.status !== 'cancelled') {
      statusesToShow = orderStatusOptions.filter(
        status => status.value !== 'cancelled',
      );
    } else {
      // If cancelled, show only order_placed and cancelled
      statusesToShow = [
        orderStatusOptions.find(
          status => status.value === 'admin_final_approval',
        ),
        orderStatusOptions.find(status => status.value === 'cancelled'),
      ];
    }

    return (
      <View style={{marginTop: 20}}>
        <Typography
          title={'Order Status'}
          font={FONTS.INTER_MEDIUM}
          size={18}
        />
        <View
          style={{
            marginTop: 20,
            elevation: 2,
            backgroundColor: COLORS.APP_WHITE,
            borderRadius: 12,
            padding: 16,
            marginHorizontal: 6,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}>
          {statusesToShow.map((status, index) => {
            const isCompleted = isStatusCompleted(
              orderStatusOptions.findIndex(s => s.value === status.value),
            );
            const isActive = isStatusActive(
              orderStatusOptions.findIndex(s => s.value === status.value),
            );
            const statusColor = getStatusColor(
              orderStatusOptions.findIndex(s => s.value === status.value),
            );
            const isLastItem = index === statusesToShow.length - 1;

            return (
              <View key={status.value} style={{position: 'relative'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 10,
                  }}>
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 8,
                      backgroundColor:
                        isCompleted || isActive
                          ? COLORS.APP_PRIMARY
                          : COLORS.APP_GRAY,
                      marginRight: 16,
                      borderWidth: isActive ? 3 : 0,
                      borderColor: isActive
                        ? COLORS.APP_PRIMARY
                        : 'transparent',
                    }}
                  />

                  {/* Status Content */}
                  <View style={{flex: 1}}>
                    <Typography
                      title={status.label}
                      font={
                        isActive ? FONTS.INTER_SEMIBOLD : FONTS.INTER_MEDIUM
                      }
                      size={14}
                      color={
                        isCompleted || isActive
                          ? COLORS.APP_BLACK
                          : COLORS.APP_GRAY
                      }
                    />
                  </View>
                </View>

                {/* Connecting Line */}
                {!isLastItem && (
                  <View
                    style={{
                      position: 'absolute',
                      left: 4,
                      top: 30,
                      width: 2,
                      height: 28,
                      backgroundColor: isCompleted
                        ? COLORS.APP_PRIMARY
                        : '#E0E0E0',
                    }}
                  />
                )}
              </View>
            );
          })}
        </View>
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
          <Typography
            title={
              data?.user?.firstName && data?.user?.lastName
                ? `${data.user.firstName} ${data.user.lastName}`
                : data?.customerName || 'Jay Hargudson'
            }
            size={14}
            font={FONTS.INTER_MEDIUM}
          />
          <Typography
            title={data?.user?.email || 'cus004'}
            size={12}
            font={FONTS.INTER_MEDIUM}
            color={COLORS.APP_GRAY}
          />
          {/* <View>
            <View style={{width: '70%', marginTop: 10}}>
              <Typography
                title={data?.shippingAddress}
                size={14}
                color="#667085"
                font={FONTS.INTER_MEDIUM}
              />
            </View>
          </View> */}
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
                    textAlign: 'right',
                    fontSize: 14,
                    color: COLORS.APP_BLACK,
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
            <View style={styles.productCard} key={index}>
              <View style={{flexDirection: 'row', gap: 14}}>
                {ele?.image?.length > 0 && (
                  <Image
                    source={{uri: ele?.image[0]}}
                    style={{height: 70, width: 70, borderRadius: 10}}
                  />
                )}
                <View>
                  <View style={{width: 180, flexDirection: 'row'}}>
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
                  <View style={{marginTop: 5}}>
                    {ele?.bodycolors?.code && (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 5,
                        }}>
                        <Typography
                          title={`Body Color:`}
                          size={12}
                          color={COLORS.APP_LABEL}
                          font={FONTS.INTER_REGULAR}
                        />
                        <View
                          style={{
                            height: 14,
                            width: 14,
                            borderRadius: 50,
                            backgroundColor: ele?.bodycolors?.code,
                            borderWidth: 1,
                            borderColor: COLORS.APP_BLACK,
                          }}
                        />
                      </View>
                    )}

                    {ele?.ledcolors?.code && (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 5,
                        }}>
                        <Typography
                          title={`LED Color:`}
                          size={12}
                          color={COLORS.APP_LABEL}
                          font={FONTS.INTER_REGULAR}
                        />
                        <View
                          style={{
                            height: 14,
                            width: 14,
                            borderRadius: 50,
                            backgroundColor: ele?.ledcolors?.code,
                            borderWidth: 1,
                            borderColor: COLORS.APP_BLACK,
                          }}
                        />
                      </View>
                    )}

                    <View style={{flexDirection: 'row', gap: 10, marginTop: 2}}>
                      {ele?.watts && (
                        <Typography
                          title={`Watts: ${ele?.watts}`}
                          size={12}
                          color={COLORS.APP_LABEL}
                        />
                      )}

                      {ele?.reflectors?.code && (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 5,
                          }}>
                          <Typography
                            title={`Reflectors:`}
                            size={12}
                            color={COLORS.APP_LABEL}
                            font={FONTS.INTER_REGULAR}
                          />
                          <View
                            style={{
                              height: 14,
                              width: 14,
                              borderRadius: 50,
                              backgroundColor: ele?.reflectors?.code,
                              borderWidth: 1,
                              borderColor: COLORS.APP_BLACK,
                            }}
                          />
                        </View>
                      )}
                    </View>

                    <Typography
                      title={`Quantity: ${ele?.quantity}`}
                      size={12}
                      color={COLORS.APP_LABEL}
                    />
                  </View>

                  {ele?.avgrating !== 0 && <Rating rating={ele?.avgrating} />}

                  {data?.status === 'delivered' && (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate(Routes.Review, {
                          orderId: orderId,
                          productId: ele?.productId,
                        })
                      }>
                      <Text style={styles.txtAddReview}>Add Review</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </>
    );
  };

  // Advance receipt section
  const renderUploadPhoto = () => {
    return (
      <View style={{marginTop: 20}}>
        <Typography
          title={'Confirmation amount receipt'}
          size={18}
          font={FONTS.INTER_SEMIBOLD}
        />
        <View style={{marginTop: 10}}>
          {uploadImage ? (
            <TouchableOpacity
              onPress={() => setIsOpenPhotoModal(true)}
              style={[
                styles.uploadPhoto,
                {alignItems: 'center', justifyContent: 'center'},
              ]}>
              <Typography
                title={'View photo'}
                size={14}
                font={FONTS.INTER_REGULAR}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleOpenAdvanceSheet}
              style={[
                styles.uploadPhoto,
                {alignItems: 'center', justifyContent: 'center'},
              ]}>
              <Typography
                title={'Choose photo'}
                size={14}
                color={COLORS.APP_GRAY}
              />
            </TouchableOpacity>
          )}
          {uploadImage && (
            <View style={{flexDirection: 'row', gap: 10, marginTop: 14}}>
              <TouchableOpacity
                onPress={handleOpenAdvanceSheet}
                style={styles.editButton}>
                <Typography
                  title={'Edit'}
                  size={14}
                  color={COLORS.APP_BLACK}
                  font={FONTS.INTER_MEDIUM}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={onUpload} style={styles.detailsButton}>
                {loadingAdvance ? (
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
            </View>
          )}
        </View>
      </View>
    );
  };

  // Final receipt section
  const renderUploadPaymentPhoto = () => {
    return (
      <View style={{marginTop: 20}}>
        <Typography
          title={'Final payment receipt'}
          size={18}
          font={FONTS.INTER_SEMIBOLD}
        />
        <View style={{marginTop: 10}}>
          {uploadPaymentImage ? (
            <TouchableOpacity
              onPress={() => setIsOpenPhotoPaymentModal(true)}
              style={[
                styles.uploadPhoto,
                {alignItems: 'center', justifyContent: 'center'},
              ]}>
              <Typography
                title={'View photo'}
                size={14}
                font={FONTS.INTER_REGULAR}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleOpenFinalSheet}
              style={[
                styles.uploadPhoto,
                {alignItems: 'center', justifyContent: 'center'},
              ]}>
              <Typography
                title={'Choose photo'}
                size={14}
                color={COLORS.APP_GRAY}
              />
            </TouchableOpacity>
          )}
          {uploadPaymentImage && (
            <View style={{flexDirection: 'row', gap: 10, marginTop: 14}}>
              <TouchableOpacity
                onPress={handleOpenFinalSheet}
                style={styles.editButton}>
                <Typography
                  title={'Edit'}
                  size={14}
                  color={COLORS.APP_BLACK}
                  font={FONTS.INTER_MEDIUM}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onPaymentUpload}
                style={styles.detailsButton}>
                {loadingFinal ? (
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
            </View>
          )}
        </View>
      </View>
    );
  };

  console.log('==>data', data);

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.navigate(Routes.BottomStack, {
              screen: Routes.Orders,
            })
          }>
          <Ionicons name="chevron-back" size={20} color={COLORS.APP_BLACK} />
        </TouchableOpacity>
        <Typography
          title={`Order #${data?.orderNumber || ''}`}
          font={FONTS.INTER_MEDIUM}
          size={16}
        />
        {data?.complaints ? (
          <View />
        ) : (
          <TouchableOpacity onPress={() => setIsOpenComplantionModal(true)}>
            <Entypo
              name="help-with-circle"
              size={22}
              color={COLORS.APP_BLACK}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderQuery = () => {
    return (
      <>
        {data?.complaints?.description && (
          <View style={{marginTop: 20}}>
            <Typography
              title="Complaints"
              size={18}
              font={FONTS.INTER_SEMIBOLD}
            />
            <View
              style={{
                marginTop: 10,
                marginHorizontal: 1,
                padding: 15,
                backgroundColor: COLORS.APP_WHITE,
                borderRadius: 10,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.15,
                shadowRadius: 3.5,
                elevation: 2,
              }}>
              <View
                style={{
                  marginTop: 10,
                  padding: 12,
                  backgroundColor: COLORS.APP_LIGHT_GRAY,
                  borderRadius: 6,
                }}>
                <Typography title={data?.complaints?.description} size={14} />
              </View>

              {/* Resolving Date Section */}
              {data?.complaints?.targetCloseDate && (
                <View style={{marginTop: 15}}>
                  <Typography
                    title="Complaints Resolving Date"
                    size={14}
                    font={FONTS.INTER_SEMIBOLD}
                  />
                  <Typography
                    title={moment(data?.complaints?.targetCloseDate).format(
                      'DD MMM, YYYY',
                    )}
                    size={12}
                    color={COLORS.APP_GRAY}
                  />
                </View>
              )}
            </View>
          </View>
        )}
      </>
    );
  };

  console.log('812', data);
  const currentStatusIndex = orderStatusOptions.findIndex(
    opt => opt.value === data?.status,
  );

  const advanceIndex = orderStatusOptions.findIndex(
    opt => opt.value === 'process_for_advance',
  );

  const finalIndex = orderStatusOptions.findIndex(
    opt => opt.value === 'rest_of_payment',
  );
  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size={22} color={COLORS.APP_PRIMARY} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          {renderProducts()}
          {renderSummary()}
          {renderOrderStatus()}
          {/* {data?.status === 'process_for_advance' &&
          orderStatusOptions?.indexOf('process_for_advance') >= 2
            ? renderUploadPhoto()
            : null}

          {data?.status === 'rest_of_payment' &&
          orderStatusOptions?.indexOf('rest_of_payment') >= 8
            ? renderUploadPaymentPhoto()
            : null} */}
          {data?.status &&
            currentStatusIndex >= advanceIndex &&
            renderUploadPhoto()}
          {data?.status &&
            currentStatusIndex >= finalIndex &&
            renderUploadPaymentPhoto()}

          {renderQuery()}
          {renderCustomerInfo()}
          {/* {
            renderAddComplaintsBtn()
          }  */}
        </ScrollView>
      )}

      <PickerSheet
        sheetRef={advanceSheetRef}
        onImagePickerPress={handleGetImages}
      />
      <PickerSheet
        sheetRef={finalSheetRef}
        onImagePickerPress={handleGetPaymentImages}
      />

      {isOpenPhotoModal && (
        <PhotoModal
          visible={isOpenPhotoModal}
          onClose={() => setIsOpenPhotoModal(false)}
          imageUrl={uploadImage?.path ? uploadImage.path : uploadImage}
        />
      )}

      {isOpenPhotoPaymentModal && (
        <PhotoModal
          visible={isOpenPhotoPaymentModal}
          onClose={() => setIsOpenPhotoPaymentModal(false)}
          imageUrl={
            uploadPaymentImage?.path
              ? uploadPaymentImage.path
              : uploadPaymentImage
          }
        />
      )}
      <ComplantionModal
        fetchSingleOrder={() => fetchSingleOrder(orderId)}
        orderId={orderId}
        visible={isOpenComplantionModal}
        handleClose={() => setIsOpenComplantionModal(false)}
      />
    </SafeAreaView>
  );
};

export default NewOrderDetail;
