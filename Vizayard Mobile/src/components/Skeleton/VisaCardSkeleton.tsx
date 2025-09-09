import React, {FC} from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {COLORS} from '../../config/colors';
import {moderateScale, scale} from 'react-native-size-matters';
import {FlatList} from 'react-native';
import {loaderData} from '../../config';
import {commonSty} from '../../theme';
import {loaderProps} from '../../utils';

const VisaCardSkeleton: FC<loaderProps> = props => {
  const {loading} = props;
  if (loading) {
    return (
      <FlatList
        data={loaderData}
        renderItem={({item, index}) => <MiniVisa index={index} />}
        numColumns={2}
        contentContainerStyle={commonSty.selfCenter}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
    );
  }
  return null;
};

export default VisaCardSkeleton;

const MiniVisa = ({index}: any) => {
  const isOdd = index % 2 === 0;
  const marginRight = isOdd ? scale(20) : 0;
  return (
    <SkeletonPlaceholder borderRadius={moderateScale(16)}>
      <SkeletonPlaceholder.Item
        width={scale(140)}
        height={moderateScale(220)}
        borderRadius={moderateScale(16)}
        backgroundColor={COLORS.APP_PLACEHOLDER}
        marginVertical={moderateScale(5)}
        borderWidth={moderateScale(1)}
        marginRight={marginRight}
        borderColor={COLORS.APP_BORDER}>
        {/* Image Placeholder */}
        <SkeletonPlaceholder.Item
          width="100%"
          height={moderateScale(110)}
          borderTopLeftRadius={moderateScale(16)}
          borderTopRightRadius={moderateScale(16)}
          borderBottomEndRadius={0}
          borderBottomStartRadius={0}
          borderBottomLeftRadius={0}
          borderBottomRightRadius={0}
        />

        <SkeletonPlaceholder.Item padding={moderateScale(12)}>
          {/* Country Name */}
          <SkeletonPlaceholder.Item
            width="80%"
            height={moderateScale(18)}
            marginBottom={moderateScale(12)}
          />

          {/* Duration Section */}
          <SkeletonPlaceholder.Item
            flexDirection="row"
            alignItems="center"
            marginBottom={moderateScale(8)}>
            <SkeletonPlaceholder.Item
              width={moderateScale(20)}
              height={moderateScale(20)}
              marginRight={moderateScale(8)}
            />
            <SkeletonPlaceholder.Item
              width={moderateScale(80)}
              height={moderateScale(14)}
            />
          </SkeletonPlaceholder.Item>

          {/* Price and Success Rate */}
          <SkeletonPlaceholder.Item
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center">
            <SkeletonPlaceholder.Item
              width={moderateScale(30)}
              height={moderateScale(18)}
            />
            <SkeletonPlaceholder.Item
              width={moderateScale(70)}
              height={moderateScale(14)}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};
