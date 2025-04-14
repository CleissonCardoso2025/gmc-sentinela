
import { Dispatch, SetStateAction } from 'react';

export interface DateRange {
  from: Date;
  to: Date;
}

export interface DateRangePickerProps {
  date: DateRange;
  setDate: Dispatch<SetStateAction<DateRange>>;
  className?: string;
}
