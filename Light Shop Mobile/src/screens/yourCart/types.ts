import {categoryItemProps} from '../home/types';

export interface AddRemoveBtnProps {
  onAddPress?: () => void;
  onRemovePress?: () => void;
  count?: number;
  disabled?: boolean;
}
export interface CartProductProps {
  item: categoryItemProps;
}
