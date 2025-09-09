import React, {FC} from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {FlatList, View} from 'react-native';
import {loaderData} from '../../config';
import {commonSty} from '../../theme';
import {loaderProps} from '../../utils';

const TrendingSkeleton: FC<loaderProps> = props => {
  const {loading} = props;
  if (loading) {
    return (
      <View>
        <FlatList
          data={loaderData}
          renderItem={({item, index}) => <Trending index={index} />}
          contentContainerStyle={[
            commonSty.selfCenter,
            commonSty.mb20,
            commonSty.mt10,
          ]}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          horizontal
        />
      </View>
    );
  }
  return null;
};

export default TrendingSkeleton;

const Trending = ({index}: any) => {
  return (
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item marginLeft={25}>
        <SkeletonPlaceholder.Item
          width={150}
          height={120}
          borderRadius={10}
          alignSelf="center"
        />
        <SkeletonPlaceholder.Item
          width={150}
          height={10}
          borderRadius={10}
          alignSelf="center"
          marginTop={6}
        />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};
