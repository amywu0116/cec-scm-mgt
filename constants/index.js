export const isUAT = process.env.NEXT_PUBLIC_PROD === "uat";
export const isPROD = process.env.NEXT_PUBLIC_PROD === "prod";

export const APPLY_STATUS = {
  SAVE: 0, // 暫存
  PENDING: 5, // 提報中，待審核
  APPROVED: 10, // 審核通過
  REJECTED: 15, // 審核退件
  CANCELED: 20, // 申請取消
};

export const ORDER_STATUS = {
  RETURN_RECEIVED: "403", // 退貨收貨完成
  RETURN_FAILED: "404", // 退貨收貨失敗
  RETURN_AND_REFUND: "405", // 退貨退款中
  REFUND_COMPLETED: "406", // 退款完成
  RENOVATION: "407", // 整新費付款中
};
