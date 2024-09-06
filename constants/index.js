export const isUAT = process.env.NEXT_PUBLIC_PROD === "uat";
export const isPROD = process.env.NEXT_PUBLIC_PROD === "prod";

export const APPLY_STATUS = {
  SAVE: 0, // 暫存
  PENDING: 5, // 提報中，待審核
  APPROVED: 10, // 審核通過
  REJECTED: 15, // 審核退件
  CANCELED: 20, // 申請取消
};
