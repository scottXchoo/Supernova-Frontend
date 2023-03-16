import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DATE_FORMAT } from "../constants/constants";

export const DEFAULT_TIMESTAMP_STRING = "--";
export const EMPTY_DATE = "0001-01-01T00:00:00Z";
export const emptyDateToDate = new Date(EMPTY_DATE);
export const currentDateForError = dayjs().format(DATE_FORMAT);

export const localizeTime = (time: string): string => {
  dayjs.extend(LocalizedFormat);
  if (time === EMPTY_DATE) return DEFAULT_TIMESTAMP_STRING;
  return dayjs(time).format("LLLL");
};

export const formatTimeDiff = (time: string): string | null => {
  dayjs.extend(relativeTime);
  dayjs.extend(duration);
  dayjs.extend(customParseFormat);
  const timeDiff = dayjs.duration(dayjs(time).diff(dayjs()));
  if (timeDiff.asSeconds() > 0) {
    return dayjs.duration(dayjs(time).diff(dayjs())).format("D[d] HH[h] mm[m]");
  } else {
    return null;
  }
};
