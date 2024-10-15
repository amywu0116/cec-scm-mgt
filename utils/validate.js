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

// EAN-13 條碼檢查碼的計算規則
// 條碼由 12 位數字 + 1 位檢查碼組成。前 12 位為商品的識別編碼。最後 1 位是 檢查碼，用於驗證條碼是否正確。
// 加權乘法：每個數字根據其位置被乘上不同的加權值：奇數位（索引為 0, 2, 4...）：乘以 1。偶數位（索引為 1, 3, 5...）：乘以 3。
// 總和計算：將加權乘積累加起來。
// 檢查碼計算：用總和的值對 10 取餘數 (sum % 10)。若餘數為 0，檢查碼為 0；否則檢查碼為 (10 - 餘數)。
export const isValidEAN13 = (str) => {
  const EAN13_LENGTH = 13;

  // 檢查是否為 13 位數字
  if (str.length !== EAN13_LENGTH || !/^\d+$/.test(str)) return false;

  // 計算 EAN13 檢查碼
  const generateEAN13CheckDigit = (code) => {
    return (
      code
        .split("")
        .reduce(
          (sum, num, idx) => sum + parseInt(num) * (idx % 2 === 0 ? 1 : 3),
          0
        ) % 10
    );
  };

  const first12Digits = str.slice(0, 12); // 前 12 位
  const expectedCheckDigit = (10 - generateEAN13CheckDigit(first12Digits)) % 10;

  return expectedCheckDigit === parseInt(str[12]);
};
