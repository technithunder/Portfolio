import React, {FC} from 'react';
import DateTimePickerModal, {
  DateTimePickerProps,
} from 'react-native-modal-datetime-picker';
import {commonSty} from '../../theme';

interface PickerProps extends Partial<DateTimePickerProps> {}

const DatePicker: FC<PickerProps> = props => {
  const {...rest} = props;
  return (
    <DateTimePickerModal
      mode="date"
      {...rest}
      isVisible={props.isVisible}
      // maximumDate={props.maximumDate || new Date('1800-01-01')}
      pickerContainerStyleIOS={commonSty.itemsCenter}
    />
  );
};

export default DatePicker;
