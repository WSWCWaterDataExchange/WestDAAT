export const parseDateOnly = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map((s) => parseInt(s, 10));
  return new Date(year, month - 1, day);
};
