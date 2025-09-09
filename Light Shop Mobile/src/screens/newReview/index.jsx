import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import styles from './style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useRoute} from '@react-navigation/native';
import {Images, Routes} from '../../constants';
import {COLORS} from '../../theme/colors';
import {FONTS} from '../../constants/fonts';
import {PickerSheet, Typography} from '../../components';
import PhotoModal from '../newOrderDetail/PhotoModal';
import {convertImageToBase64} from '../../utils/helper';
import { addFeedback } from '../../api';

const Review = ({navigation}) => {
  const route = useRoute();
  const orderId = route.params?.orderId;
  const productId = route.params?.productId;
  const editSheetRef = useRef(null);
  const user = useSelector(state => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadImage, setUploadImage] = useState(null);
  const [isOpenPhotoModal, setIsOpenPhotoModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [summary, setSummary] = useState('');

  const handleGetImages = image => {
    editSheetRef.current?.hide();
    setUploadImage(image);
  };

  const handleOpenActionSheet = () => {
    editSheetRef.current?.show();
  };

  const handleStarPress = selectedRating => {
    setRating(selectedRating);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }
    if (summary.trim() === '') {
      Alert.alert('Error', 'Please enter a summary');
      return;
    }

    // Here you can add your submit logic
    const obj = {
      userId:user?.id,
      productId,
      rating:rating,
      reviewText: summary.trim(),
    }

    if (uploadImage) {
      obj.reviewImage = uploadImage?.path
        ? await convertImageToBase64(uploadImage?.path)
        : uploadImage;
    }
    console.log('Review Object:', obj);
    try{
      setIsLoading(true);
      const reviewData = await addFeedback(obj);
      if (reviewData?.data?.status === 'success') {
        navigation.navigate(Routes.OrderDetails, {orderId: orderId});
        Toast.show({
          type: 'success',
          text1: 'Review submitted successfully',
        }); 
      } 
    }catch(e){
      console.error('Error submitting review:', e);
    }finally{
      setIsLoading(false)
    }
  };

  const getRatingData = () => {
    if (rating === 0) return {text: 'Tap to rate', emoji: '⭐'};
    if (rating <= 1) return {text: 'Poor', emoji: '😞'};
    if (rating <= 2) return {text: 'Fair', emoji: '😐'};
    if (rating <= 3) return {text: 'Good', emoji: '😊'};
    if (rating <= 4) return {text: 'Very Good', emoji: '😄'};
    return {text: 'Excellent', emoji: '🤩'};
  };

  //   const getEmojiForRating = (starValue) => {
  //     if (starValue <= 1) return '😞';
  //     if (starValue <= 2) return '😐';
  //     if (starValue <= 3) return '😊';
  //     if (starValue <= 4) return '😄';
  //     return '🤩';
  //   };

  const renderRatingStars = () => {
    const ratingData = getRatingData();

    return (
      <View style={styles.ratingContainer}>
        <Typography
          title="Rate your experience"
          font={FONTS.INTER_MEDIUM}
          size={16}
          color={COLORS.APP_BLACK}
        />

        {/* Emoji Display */}
        <View style={styles.emojiContainer}>
          <Text style={styles.ratingEmoji}>{ratingData.emoji}</Text>
        </View>

        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map(star => (
            <View key={star} style={styles.singleStarContainer}>
              {/* Left half for half star */}
              <TouchableOpacity
                style={styles.halfStarButton}
                onPress={() => handleStarPress(star - 0.5)}
                activeOpacity={0.7}>
                <View style={styles.invisibleTouchArea} />
              </TouchableOpacity>

              {/* Right half for full star */}
              <TouchableOpacity
                style={styles.fullStarButton}
                onPress={() => handleStarPress(star)}
                activeOpacity={0.7}>
                <View style={styles.invisibleTouchArea} />
              </TouchableOpacity>

              {/* Star icon */}
              <View style={styles.starIconContainer}>
                <Ionicons
                  name={
                    rating >= star
                      ? 'star'
                      : rating >= star - 0.5
                      ? 'star-half'
                      : 'star-outline'
                  }
                  size={32}
                  color={
                    rating >= star - 0.5 ? COLORS.APP_PRIMARY : COLORS.APP_GRAY
                  }
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.ratingTextContainer}>
          <Typography
            title={
              rating > 0
                ? `${rating} stars - ${ratingData.text}`
                : ratingData.text
            }
            font={FONTS.INTER_REGULAR}
            size={12}
            color={COLORS.APP_GRAY}
          />
        </View>
      </View>
    );
  };

  const renderSummaryInput = () => {
    return (
      <View style={styles.summaryContainer}>
        <Typography
          title="Write a feedback"
          font={FONTS.INTER_MEDIUM}
          size={16}
          color={COLORS.APP_BLACK}
        />
        <TextInput
          style={styles.summaryInput}
          placeholder="Share your experience..."
          placeholderTextColor={COLORS.APP_GRAY}
          multiline
          numberOfLines={4}
          value={summary}
          onChangeText={setSummary}
          textAlignVertical="top"
        />
      </View>
    );
  };

  const renderSubmitButton = () => {
    return (
      <TouchableOpacity
        style={[
          styles.submitButton,
          {
            backgroundColor:
              rating > 0 && summary.trim() !== ''
                ? COLORS.APP_PRIMARY
                : COLORS.APP_GRAY,
          },
        ]}
        onPress={handleSubmit}
        disabled={rating === 0 || summary.trim() === ''}>
          {isLoading ? (
            <ActivityIndicator size={18} color={COLORS.APP_WHITE}/>
          ) : (
        <Typography
          title="Submit Review"
          font={FONTS.INTER_MEDIUM}
          size={16}
          color={COLORS.APP_WHITE}
        />
          )}
      </TouchableOpacity>
    );
  };

  const renderAttachment = () => {
    return (
      <View style={styles.attachmentSection}>
        <Typography
          title="Add Attachment (Optional)"
          font={FONTS.INTER_MEDIUM}
          size={16}
          color={COLORS.APP_BLACK}
        />
        <View style={styles.attachmentActions}>
          <TouchableOpacity
            style={styles.attachmentContainer}
            onPress={handleOpenActionSheet}>
            <Typography
              title={uploadImage ? 'Change Attachment' : 'Add Attachment'}
              font={FONTS.INTER_MEDIUM}
              size={14}
              color={COLORS.APP_WHITE}
            />
          </TouchableOpacity>
          {uploadImage && (
            <TouchableOpacity onPress={() => setIsOpenPhotoModal(true)}>
              <Text style={styles.txtAddReview}>View Attachment</Text>
            </TouchableOpacity>
          )}
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
            navigation.navigate(Routes.OrderDetails, {orderId: orderId})
          }>
          <Ionicons name="chevron-back" size={20} color={COLORS.APP_BLACK} />
        </TouchableOpacity>
        <Typography title={`Feedback `} font={FONTS.INTER_MEDIUM} size={16} />
        <View />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {renderRatingStars()}
        {renderSummaryInput()}
        {renderAttachment()}
      </ScrollView>
      {renderSubmitButton()}
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
    </SafeAreaView>
  );
};

export default Review;
