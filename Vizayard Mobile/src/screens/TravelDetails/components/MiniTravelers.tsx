import {Image, TouchableOpacity, View} from 'react-native';
import React, {FC, useState} from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Icon, Typography} from '../../../components';
import FastImage from 'react-native-fast-image';
import {COLORS} from '../../../config/colors';
import styles from './styles';
import {Images} from '../../../config';
import {commonSty} from '../../../theme';
import {MiniTravelersProps} from '../types';
import {FONTS} from '../../../config/font';

const MiniTravelers: FC<MiniTravelersProps> = props => {
  const {
    item,
    isSelected,
    onPressChildCard,
    onItemPress,
    onDelete,
    additionalDocuments,
  } = props;
  console.log("==>item",item)
  const [imageLoading, setImageLoading] = useState(true);

  const isBasicDetailsComplete =
    !!item?.details?.firstName && !!item?.details?.lastName;

  // Check if all additional documents are fulfilled
  // const areAdditionalDocumentsFulfilled = () => {
  //   if (!additionalDocuments || additionalDocuments.length === 0) {
  //     return true; 
  //   }

  //   return additionalDocuments.every(doc => {
  //     return item?.documents?.some(
  //       userDoc => userDoc.documentName === doc.label,
  //     );
  //   });
  // };
  const isCompletedUser = isBasicDetailsComplete
  // const isCompletedUser =
  //   isBasicDetailsComplete && areAdditionalDocumentsFulfilled();
  const userName = item?.details?.firstName + ' ' + item?.details?.lastName;

  return (
    <View style={styles.detailContainer}>
      <TouchableOpacity
        onPress={() => onItemPress(item)}
        disabled={!isCompletedUser}>
        <Image
          resizeMode="contain"
          source={isSelected ? Images.active_radio : Images.inactive_radio}
          style={[commonSty.size(20), commonSty.mr10]}
          tintColor={COLORS.APP_PRIMARY_MAIN}
        />
      </TouchableOpacity>
      <View>
        {imageLoading && (
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              width={styles.profileImg.width}
              height={styles.profileImg.height}
              borderRadius={6}
              backgroundColor={COLORS.APP_PLACEHOLDER}
              position="absolute"
              zIndex={-99}
            />
          </SkeletonPlaceholder>
        )}
        <FastImage
          resizeMode="cover"
          source={{uri: item?.photo, priority: FastImage.priority.high}}
          style={styles.profileImg}
          onLoad={() => setImageLoading(false)}
        />
      </View>
      <View style={styles.detailText}>
        {isCompletedUser ? (
          <View>
            <Typography title={userName} size={14} numberOfLines={1} />
            <Typography
              title={`Place Of Birth: ${item?.details?.placeOfBirth || ''}`}
              size={10}
              color={COLORS.APP_PLACEHOLDER}
              mt={1}
              numberOfLines={1}
            />
          </View>
        ) : (
          <View>
            <Typography
              color={COLORS.APP_PRIMARY_MAIN}
              title={'Draft'}
              font={FONTS.INTER_REGULAR}
              size={14}
              txtStyle={{fontStyle: 'italic'}}
            />
          </View>
        )}
      </View>
      <View style={styles.rightContainer}>
        {/* <Icon
          icon="MaterialCommunityIcons"
          name="delete"
          size={22}
          color={COLORS.APP_RED}
          onPress={() => onDelete(item)}
        /> */}
        <View
          style={{
            backgroundColor: COLORS.APP_LIGHT_GRAY,
            height: 30,
            width: 30,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon
            icon="MaterialIcons"
            name="edit"
            color={COLORS.APP_PRIMARY}
            size={16}
            onPress={() => onPressChildCard(item)}
          />
        </View>
      </View>
    </View>
  );
};

export default MiniTravelers;
