export const routes = {
  index: "/",
  announcement: {
    message: "/announcement/message",
    inquiry: "/announcement/inquiry",
  },
  product: {
    list: "/product/list",
    info: (id) => `/product/${id}`,
    application: "/product/application",
    applicationEdit: (id) => `/product/application/edit/${id}`,
    batchImgUpload: "/product/batch-img-upload",
    promotion: "/product/promotion",
    stock: "/product/stock",
  },
  order: {
    list: "/order/list",
  },
  logistics: "/logistics",
  vendor: "/vendor",
  account: {
    passwordChange: "/account/password-change",
  },
};
