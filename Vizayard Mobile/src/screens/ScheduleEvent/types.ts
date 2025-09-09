import {TouchableOpacityProps} from 'react-native';

export interface timeSlotProps {
  id: number;
  time: string;
}

export interface MiniSlotProps extends TouchableOpacityProps {
  item: timeSlotProps;
  selectedTime: timeSlotProps | null;
  onPress: () => void;
}
