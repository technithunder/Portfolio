import React, { useEffect, useState } from 'react';
import TextField from "@component/text-field";

type Props = {
  value: number;
  onChange: (val: number) => void;
  delay?: number;
  min?: number;
  max?: number;
  style?: React.CSSProperties;
  disabled?: boolean;
  className?: string;
  initialValue?: number;
  ref?: any
  onKeyDown?: any
  onPaste?: any
  onKeyUp?: any
  onKeyPress?: any
  tabIndex?: number
};


const DebouncedNumberInput: React.FC<Props> = ({
  value,
  onChange,
  delay = 0,
  min,
  max,
  className,
  style,
  initialValue,
  disabled,
  ref,
  onKeyDown,
  onPaste,
  onKeyUp,
  onKeyPress,
  tabIndex
}) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!isNaN(internalValue) && internalValue !== initialValue) {
        onChange(internalValue);
      }
    }, delay);
  
    return () => clearTimeout(handler);
  }, [internalValue]);
  
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const parsed = parseInt(raw);
    if (!isNaN(parsed)) {
      if ((min !== undefined && parsed < min) || (max !== undefined && parsed > max)) return;
      setInternalValue(parsed);
    }
  };

  return (
    <TextField
      type="text"
      value={internalValue}
      onChange={handleChange}
      inputProps={{ style: { textAlign: 'center' } }}
      className={className}
      disabled={disabled}
      ref={ref}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
      onKeyUp={onKeyUp}
      tabIndex={tabIndex}
      onKeyPress={onKeyPress}
      style={{
        padding: '3px !important',
        width: '40px',
        maxHeight: '30px',
        ...style,
      }}
    />
  );
};

export default DebouncedNumberInput;
