export const convertDateToTimestamp = (date: Date) => {
  return new Date(date).getTime();
};

export const convertTimestampToString = (timestamp: number): string => {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const formattedDate = date.toLocaleString("en-US", options);
  return formattedDate;
};
