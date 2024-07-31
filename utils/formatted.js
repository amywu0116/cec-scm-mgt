// 千位位符號
export const numWithCommas = (number) => {
  if ([null, undefined].includes(number)) return;
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
