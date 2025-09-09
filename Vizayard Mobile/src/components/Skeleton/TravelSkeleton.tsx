import React, {FC} from 'react';
import {FlatList, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {moderateScale} from 'react-native-size-matters';
import {COLORS} from '../../config/colors';
import {loaderData} from '../../config';
import {loaderProps} from '../../utils';
import {commonSty} from '../../theme';

const TravelSkeleton: FC<loaderProps> = props => {
  const {loading} = props;
  if (loading) {
    return (
      <FlatList
        data={loaderData}
        style={commonSty.mt20}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => <ItemSkeleton />}
      />
    );
  }
  return null;
};

export default TravelSkeleton;

const ItemSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        backgroundColor={COLORS.APP_PLACEHOLDER}
        borderRadius={moderateScale(8)}
        borderBottomColor={COLORS.APP_PLACEHOLDER}
        borderBottomWidth={moderateScale(1)}
        marginHorizontal={moderateScale(10)}
        paddingBottom={moderateScale(10)}
        marginVertical={moderateScale(5)}>
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
          <SkeletonPlaceholder.Item
            width={moderateScale(36)}
            height={moderateScale(36)}
            borderRadius={moderateScale(8)}
            backgroundColor={COLORS.APP_PLACEHOLDER}
          />
          <SkeletonPlaceholder.Item
            width={moderateScale(36)}
            height={moderateScale(36)}
            borderRadius={moderateScale(8)}
            backgroundColor={COLORS.APP_PLACEHOLDER}
            marginLeft={moderateScale(10)}
          />
          <View>
            <SkeletonPlaceholder.Item
              width={moderateScale(100)}
              height={moderateScale(12)}
              backgroundColor={COLORS.APP_PLACEHOLDER}
              marginLeft={moderateScale(10)}
              borderRadius={moderateScale(4)}
            />
            <SkeletonPlaceholder.Item
              width={moderateScale(100)}
              height={moderateScale(12)}
              backgroundColor={COLORS.APP_PLACEHOLDER}
              marginLeft={moderateScale(10)}
              borderRadius={moderateScale(4)}
              marginTop={moderateScale(5)}
            />
          </View>
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          width={moderateScale(24)}
          height={moderateScale(24)}
          backgroundColor={COLORS.APP_PLACEHOLDER}
          borderRadius={moderateScale(8)}
        />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};
