export const workDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return [hours ? `${hours} hr` : '', remainder ? `${remainder} min` : ''].filter(Boolean).join(' ') || '0 min';
};
