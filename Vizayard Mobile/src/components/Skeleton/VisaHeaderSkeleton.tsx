import React, {FC} from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {WIDTH} from '../../theme/commSty';
import {moderateScale} from 'react-native-size-matters';
import {loaderProps} from '../../utils';

const VisaHeaderSkeleton: FC<loaderProps> = props => {
  const {loading} = props;
  if (loading) {
    return (
      <SkeletonPlaceholder backgroundColor="#E1E9EE" highlightColor="#F2F8FC">
        <SkeletonPlaceholder.Item
          width={WIDTH}
          marginBottom={moderateScale(15)}>
          <SkeletonPlaceholder.Item
            width={WIDTH}
            height={moderateScale(180)}
            borderRadius={8}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    );
  }
  return null;
};

export default VisaHeaderSkeleton;
