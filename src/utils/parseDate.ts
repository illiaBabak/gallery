export const parseDate = (date: string): string => {
  const parsed = new Date(date);

  return parsed.toDateString();
};
