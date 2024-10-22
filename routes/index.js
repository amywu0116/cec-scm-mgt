export const routes = {
  index: `/`,
  login: `/login`,
  passwordReset: `/password-reset`,
  passwordForgot: `/password-forgot`,
  announcement: {
    message: `/announcement/message`,
    inquiry: `/announcement/inquiry`,
    msgRecord: `/announcement/msgRecord`,
  },
  product: {
    list: `/product/list`,
    info: (id) => `/product/${id}`,
    application: `/product/application`,
    applicationAdd: (type) => `/product/application/add/${type}`,
    applicationEdit: (id) => `/product/application/edit/${id}`,
    batchImgUpload: `/product/batch-img-upload`,
    promotion: `/product/promotion`,
    promotionAdd: `/product/promotion/add`,
    promotionEdit: (id) => `/product/promotion/edit/${id}`,
    stock: `/product/stock`,
    imageMaintenanceProduct: (id) => `/product/image-maintenance/product/${id}`,
    imageMaintenanceApply: (id) => `/product/image-maintenance/apply/${id}`,
    variation: `/product/variation`,
    variationAdd: `/product/variation/add`,
    variationEdit: (id) => `/product/variation/edit/${id}`,
  },
  order: {
    list: `/order/list`,
    info: (id) => `/order/${id}`,
  },
  logistics: {
    list: `/logistics`,
    add: `/logistics/add`,
    edit: (id) => `/logistics/edit/${id}`,
  },
  vendor: `/vendor`,
  billing: {
    report: `/billing/report`,
  },
  account: {
    passwordChange: `/account/password-change`,
  },
};
