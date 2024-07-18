// 統一編號規則：
// 是一組長度八碼的數字
// 統編號碼的每一個數字分別相對應乘以 1, 2, 1, 2, 1, 2, 4, 1
// 乘完後如果該數字大於 9 的話，把該數字的十位數和個位數相加，然後把所有數字加起來
// 總數能夠被 10 整除的話，統編為正確
// 如果不能被 10 整除的話，但統編的第七碼為 7，那麼總數加 1 後若能被 10 整除的話，統編為正確
// 以上規則不符合的話，統編為錯誤
export const isValidTaxId = (taxId) => {
  if (!taxId) return true;
  if (!/^\d{8}$/.test(taxId)) return false;
  const taxIdArray = String(taxId)
    .split("")
    .map((str) => Number(str));
  const factorArray = [1, 2, 1, 2, 1, 2, 4, 1];
  const multiplyArray = factorArray.map((factoryNum, idx) => {
    const multiply = factorArray[idx] * taxIdArray[idx];
    return multiply > 9
      ? Math.floor(multiply / 10) + (multiply % 10)
      : multiply;
  });
  const sum = multiplyArray.reduce((acc, current) => {
    return acc + current;
  }, 0);
  return sum % 5 === 0 || (taxId[6] === "7" && (sum + 1) % 5 === 0);
};
