import {Image, View} from 'react-native';
import React from 'react';
import {Button, Container, Typography} from '../../components';
import {Images, Routes} from '../../constants';
import {commonSty} from '../../theme';
import styles from './styles';
import {replace} from '../../utils';
import { FONTS } from '../../constants/fonts';
import { COLORS } from '../../theme/colors';

const Checkout = () => {
  const handleShoppingPress = () => replace(Routes.BottomStack);
  return (
    <Container showBack>
      <View style={styles.subContainer}>
        <Typography title={'Order Completed'} size={25} mt={70} font={FONTS.INTER_MEDIUM}/>
        <Image
          resizeMode="cover"
          source={Images.order_complete}
          style={[commonSty.size(120), commonSty.mt30,{tintColor:COLORS.APP_PRIMARY}]}
        />
        <Typography
          title={
            'Thank you for your purchase.You can view your order in ‘My Orders’ section.'
          }
          align="center"
          mh={20}
          mt={20}
          size={14}
          font={FONTS.INTER_REGULAR}
        />
      </View>
      <Button
        title="Continue shopping"
        borderRadius={50}
        onPress={handleShoppingPress}
        btnStyle={{backgroundColor: COLORS.APP_PRIMARY,}}
        btnTextStyle={{fontFamily:FONTS.INTER_SEMIBOLD,fontSize:16}}
      />
    </Container>
  );
};

export default Checkout;
