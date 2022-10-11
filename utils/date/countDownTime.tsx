export const countDownTime = (date: string): string | number => {
  const countDownDate = new Date(date).getTime();
  const now = new Date().getTime();

  const distance = countDownDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
};

export const countDownTimeCheck = (date: string): number => {
  const countDownDate = new Date(date).getTime();
  const now = new Date().getTime();

  const distance = countDownDate - now;
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));

  return days;
};
