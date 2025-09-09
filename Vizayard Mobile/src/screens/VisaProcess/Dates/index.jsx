import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
// import DateTimePicker from 'react-native-ui-datepicker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import dayjs from 'dayjs';
// Relative path imports
import StyledButton from '../../../components/StyledButton';
import {COLORS} from '../../../config/colors';
import {FONTS} from '../../../config/font';
import DateTimePicker from 'react-native-modal-datetime-picker';

const Dates = ({onSubmit, stepInfo, isLoading, setActiveStep}) => {
  const [date, setDate] = useState(stepInfo ? dayjs(stepInfo) : dayjs());

  const onPressProceedSelfieBtn = () => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    let obj = {
      expectedVisaDate: formattedDate,
    };
    if (dayjs(stepInfo).isSame(date, 'day')) {
      setActiveStep(1);
    } else {
      onSubmit(obj);
    }
  };
  return (
    <View style={{width: '100%', height: '100%', paddingHorizontal: 20}}>
      <View style={{paddingTop: 10, height: '85%'}}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}
          extraScrollHeight={30}
          enableOnAndroid={false}
          resetScrollToCoords={{x: 0, y: 0}}>
          <View>
            <Text style={styles.txtHeading}>
              Select your departure date from India
            </Text>
            <View style={{marginTop: 20}}>
              <DateTimePicker
                mode="single"
                date={date.toDate()}
                onChange={params => {
                  setDate(dayjs(params.date));
                }}
                selectedItemColor={COLORS.APP_PRIMARY_MAIN}
                minDate={new Date().setHours(0, 0, 0, 0)}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
      <View style={{height: '15%', justifyContent: 'center'}}>
        <StyledButton
          isLoading={isLoading}
          onPress={onPressProceedSelfieBtn}
          title="Proceed to Selfie"
          style={{height: 40, borderRadius: 10}}
          textStyle={{fontSize: 16}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  txtHeading: {
    color: COLORS.APP_COMMON_BLACK,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: FONTS.INTER_MEDIUM,
  },
});

export default Dates;
