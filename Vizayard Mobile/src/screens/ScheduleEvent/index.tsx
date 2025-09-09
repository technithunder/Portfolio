import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {Button, Container, Typography} from '../../components';
import {COLORS} from '../../config/colors';
import {commonSty} from '../../theme';
import {Routes} from '../../config';
import {timeSlotProps} from './types';
import {MiniSlot} from './components';
import styles from './styles';
import dayjs from 'dayjs';
import CalendarStrip from 'react-native-calendar-strip';
import {navigate} from '../../utils';
import {getAvailableSlots} from '../../api';

const ScheduleEvent = () => {
  const route = useRoute();
  const params = route?.params;
  const today = dayjs().startOf('day');
  const paramDate = params?.data?.date ? dayjs(params?.data?.date) : null;
  console.log('==>paramDate',  params?.data?.timeSlot);

  const initialSelectedDate =
    paramDate && paramDate.isAfter(today)
      ? paramDate.format('YYYY-MM-DD')
      : dayjs().add(1, 'day').format('YYYY-MM-DD');
  
      const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
      const [selectedTime, setSelectedTime] = useState(
        params?.data?.timeSlot || null,
      );
      const [timeSlots, setTimeSlots] = useState([]);
      const [isLoading, setIsLoading] = useState(false);
  console.log('==>params', params);
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableTimeSlots();
    }
  }, [selectedDate]);

  const fetchAvailableTimeSlots = async () => {
    setIsLoading(true);
    try {
      const response = await getAvailableSlots(selectedDate);
      let availableSlots = response?.data?.data || [];

      const hasParams = !!params?.data;
      const incomingSlot = params?.data?.timeSlot;
      const incomingDate = params?.data?.date;

      if (hasParams && incomingSlot && selectedDate === incomingDate) {
        const exists = availableSlots.some(
          slot => slot === incomingSlot, 
        );
        if (!exists) {
          availableSlots = [...availableSlots, incomingSlot];
        }
      }

      availableSlots.sort((a, b) => {
        const startA = a?.split(' - ')[0];
        const startB = b?.split(' - ')[0];
        return dayjs(startA, 'HH:mm').isBefore(dayjs(startB, 'HH:mm')) ? -1 : 1;
      });

      if (hasParams && incomingSlot && selectedDate === incomingDate) {
        console.log('==>incomingSlot', incomingSlot);
        setSelectedTime(incomingSlot);
      } else {
        
        setSelectedTime(null);
      }

      setTimeSlots(availableSlots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTimeSlot = ({item}) => {
    return (
      <MiniSlot
        item={item}
        selectedTime={selectedTime}
        onPress={() => setSelectedTime(item)}
      />
    );
  };

  const onDayHandle = day => {
    const sDate = day.dateString ? day.dateString : day;
    setSelectedDate(dayjs(sDate).format('YYYY-MM-DD'));
  };

  const handleNext = () => {
    navigate(Routes.UserDetails, {
      date: selectedDate,
      time: selectedTime,
      id: params?.data?.id || null,
      userEmail: params?.data?.userEmail || null,
      userName: params?.data?.userName || null,
      userPhone: params?.data?.userPhone || null,
      description: params?.data?.description || null,
    });
  };

  const disablePastDatesIncludingToday = date => {
    const today = dayjs().startOf('day');
    return dayjs(date).isSame(today) || dayjs(date).isBefore(today);
  };

  return (
    <Container
      title="Select Date and Time"
      showBack
      containerStyle={commonSty.mainNoCenter}>
      <View style={styles.subContainer}>
        <Typography
          title={'Select Date'}
          color={COLORS.DOVY_GREY}
          ml={25}
          mt={10}
        />
        <View>
        <CalendarStrip
            iconLeft={null}
            iconRight={null}
            scrollable
            useIsoWeekday={false} 
            updateWeek={true}
            startingDate={initialSelectedDate}
            style={styles.calendarContainer}
            calendarHeaderStyle={styles.calendarHeaderStyle}
            selectedDate={selectedDate}
            dateNumberStyle={styles.dateNumberStyle}
            dateNameStyle={styles.dateNameStyle}
            highlightDateNumberStyle={styles.highlightDateNumberStyle}
            highlightDateNameStyle={styles.highlightDateNameStyle}
            disabledDateNameStyle={{color: COLORS.APP_GRAY_LIGHT}}
            disabledDateNumberStyle={{color: COLORS.APP_GRAY_LIGHT}}
            minDate={dayjs().add(1, 'day').format('YYYY-MM-DD')}
            maxDate={dayjs().endOf('year').format('YYYY-MM-DD')}
            onDateSelected={date => onDayHandle(date)}
            datesBlacklist={disablePastDatesIncludingToday}
          />
        </View>
        <View style={styles.border} />
        <Typography
          title={'Select Time Slot'}
          color={COLORS.DOVY_GREY}
          ml={25}
        />
        {isLoading ? (
          <View style={[commonSty.center, {flex: 1}]}>
            <ActivityIndicator size={'small'} color={COLORS.APP_PRIMARY_MAIN} />
          </View>
        ) : timeSlots.length === 0 ? (
          <Typography
            title="No time slots available for this date"
            color={COLORS.DOVY_GREY}
            ml={25}
          />
        ) : (
          <FlatList
            data={timeSlots}
            renderItem={renderTimeSlot}
            showsHorizontalScrollIndicator={false}
            numColumns={2}
            contentContainerStyle={{marginHorizontal: 15}}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
      <Button title="Next" onPress={handleNext} disabled={!selectedTime} />
    </Container>
  );
};

export default ScheduleEvent;
