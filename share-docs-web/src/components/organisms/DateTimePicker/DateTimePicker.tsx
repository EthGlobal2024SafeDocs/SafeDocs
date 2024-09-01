import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker as MuiDateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

import styles from './DateTimePicker.module.css';

type DateTimePickerProps = {
  name: string;
  onChange?: (value: dayjs.Dayjs) => void;
}

const DateTimePicker = ({ name, onChange }: DateTimePickerProps) => {
  const handleChange = (value: dayjs.Dayjs | null) => {
    console.log('datetime = ', value);
    if (value) {
      onChange?.(value);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={styles.datetimePickerContainer}>
      <DemoContainer components={['DateTimePicker']}>
        <MuiDateTimePicker className={styles.datetimePicker} name={name} label="Expires on" minDate={dayjs()} onChange={handleChange} />
      </DemoContainer>
      </div>
    </LocalizationProvider>
  );
}

export default DateTimePicker;