import {ScrollView, StyleSheet} from 'react-native';
import React, {FC} from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {moderateScale} from 'react-native-size-matters';
import {loaderProps} from '../../utils';

const VisaInfoSkeleton: FC<loaderProps> = props => {
  const {loading} = props;
  if (loading) {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item padding={moderateScale(16)}>
            {/* Header */}
            <SkeletonPlaceholder.Item
              flexDirection="row"
              alignItems="center"
              marginTop={moderateScale(10)}></SkeletonPlaceholder.Item>

            {/* Banner Image */}
            <SkeletonPlaceholder.Item
              width="100%"
              height={moderateScale(200)}
              borderRadius={moderateScale(10)}
            />

            {/* Title */}
            <SkeletonPlaceholder.Item
              marginTop={moderateScale(10)}
              width="60%"
              height={moderateScale(20)}
              borderRadius={moderateScale(4)}
            />

            {/* Date & Time Section */}
            <SkeletonPlaceholder.Item
              flexDirection="row"
              justifyContent="space-between"
              marginTop={moderateScale(15)}>
              <SkeletonPlaceholder.Item
                width="40%"
                height={moderateScale(30)}
                borderRadius={moderateScale(5)}
              />
              <SkeletonPlaceholder.Item
                width="40%"
                height={moderateScale(30)}
                borderRadius={moderateScale(5)}
              />
            </SkeletonPlaceholder.Item>

            {/* Fees Section */}
            <SkeletonPlaceholder.Item marginTop={moderateScale(20)}>
              <SkeletonPlaceholder.Item
                width="100%"
                height={moderateScale(60)}
                borderRadius={moderateScale(5)}
              />
              <SkeletonPlaceholder.Item
                width="100%"
                height={moderateScale(60)}
                borderRadius={moderateScale(5)}
                marginTop={moderateScale(10)}
              />
            </SkeletonPlaceholder.Item>

            {/* Start Visa Button */}
            <SkeletonPlaceholder.Item
              marginTop={moderateScale(20)}
              width="100%"
              height={moderateScale(50)}
              borderRadius={moderateScale(8)}
            />

            {/* Required Documents */}
            <SkeletonPlaceholder.Item
              marginTop={moderateScale(20)}
              flexDirection="row"
              flexWrap="wrap"
              justifyContent="space-between">
              {[1, 2, 3, 4].map((_, index) => (
                <SkeletonPlaceholder.Item
                  key={index}
                  width="48%"
                  height={moderateScale(70)}
                  borderRadius={moderateScale(5)}
                  marginBottom={moderateScale(10)}
                />
              ))}
            </SkeletonPlaceholder.Item>

            {/* Visa Details */}
            <SkeletonPlaceholder.Item
              marginTop={moderateScale(20)}
              flexDirection="row"
              justifyContent="space-between">
              <SkeletonPlaceholder.Item
                width="48%"
                height={moderateScale(70)}
                borderRadius={moderateScale(5)}
              />
              <SkeletonPlaceholder.Item
                width="48%"
                height={moderateScale(70)}
                borderRadius={moderateScale(5)}
              />
            </SkeletonPlaceholder.Item>

            {/* Bottom Button */}
            <SkeletonPlaceholder.Item
              marginTop={moderateScale(20)}
              width="100%"
              height={moderateScale(50)}
              borderRadius={moderateScale(8)}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </ScrollView>
    );
  }
  return null;
};

export default VisaInfoSkeleton;
