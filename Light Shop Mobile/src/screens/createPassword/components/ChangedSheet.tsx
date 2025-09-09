import {Image, View} from 'react-native';
import React, {FC, memo} from 'react';
import {Images} from '../../../constants';
import {colors, commonSty} from '../../../theme';
import {Button, Sheet, Typography} from '../../../components';
import styles from './styles';
import {ChangedSheetProps} from '../types';

const ChangedSheet: FC<ChangedSheetProps> = props => {
  const {ref, onHomePress} = props;

  return (
    <Sheet ref={ref}>
      <View style={styles.sheetSubContainer}>
        <Image
          resizeMode="contain"
          source={Images.passCreated}
          style={commonSty.size(60)}
        />
      </View>
      <Typography title={'Your password has been changed'} align={'center'} />
      <Typography
        title={'Welcome back! Discover now!'}
        align={'center'}
        color={colors.woodRush}
        size={15}
        mv={15}
      />
      <Button
        title="Browse Home"
        borderRadius={30}
        backgroundColor={colors.black}
        btnStyle={[commonSty.mb20, commonSty.mt10]}
        onPress={onHomePress}
      />
    </Sheet>
  );
};

export default memo(ChangedSheet);
