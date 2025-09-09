import {FlatList, StyleSheet, View} from 'react-native';
import React, {FC} from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {commonSty} from '../../theme';
import {loaderData} from '../../config';
import {loaderProps} from '../../utils';

const ApplicationSkeleton: FC<loaderProps> = ({loading}) => {
  if (!loading) return null;

  return (
    <FlatList
      data={loaderData}
      keyExtractor={(item, index) => index.toString()}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
      renderItem={() => <MiniApplicationSkeleton />}
    />
  );
};

export default ApplicationSkeleton;

const MiniApplicationSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={4}>
      <View style={styles.applicationItemStyle}>
        {/* Country Image Skeleton */}
        <SkeletonPlaceholder.Item
          height={140}
          borderTopRightRadius={12}
          borderTopLeftRadius={12}
        />

        {/* Content Section */}
        <View style={{padding: 12}}>
          {/* Country Name */}
          <SkeletonPlaceholder.Item
            width={160}
            height={20}
            borderRadius={4}
            marginBottom={10}
          />

          {/* Duration Section */}
          <View style={{flexDirection: 'row', gap: 8, marginBottom: 10}}>
            <SkeletonPlaceholder.Item width={80} height={14} borderRadius={4} />
            <SkeletonPlaceholder.Item width={50} height={14} borderRadius={4} />
          </View>

          {/* Status Badge */}
          <SkeletonPlaceholder.Item
            width={100}
            height={24}
            borderRadius={50}
            alignSelf="flex-start"
          />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    margin: 16,
    borderRadius: 12,
    gap: 16,
  },
  applicationItemStyle: {
    borderWidth: 1,
    borderColor:'#E5E7EB',
    margin:16,
    gap: 16,
    borderRadius:12
  },
});
