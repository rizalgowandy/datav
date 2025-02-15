import { TimeOption, TimeRange, TimeZone, rangeUtil, dateTimeFormat, dateTimeFormatISO } from 'src/packages/datav-core/src';

export const mapOptionToTimeRange = (option: TimeOption, timeZone?: TimeZone): TimeRange => {
  return rangeUtil.convertRawToRange({ from: option.from, to: option.to }, timeZone);
};

export const mapRangeToTimeOption = (range: TimeRange, timeZone?: TimeZone): TimeOption => {
  const from = dateTimeFormat(range.from, { timeZone });
  const to = dateTimeFormat(range.to, { timeZone });

  return {
    from: dateTimeFormatISO(range.from, { timeZone }),
    to: dateTimeFormatISO(range.to, { timeZone }),
    display: `${from} to ${to}`,
  };
};
