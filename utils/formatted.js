// 千位位符號
export const numWithCommas = (number) => {
  if ([null, undefined].includes(number)) return;
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// 字串超出長度後以 '...' 顯示
export const truncateString = (str, maxLength) => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  }
  return str;
};
