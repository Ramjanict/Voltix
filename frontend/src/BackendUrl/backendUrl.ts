export interface ApiEndpoint {
  url: string;
  method: string;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

const ApiSummary: Record<string, ApiEndpoint> = {
  signup: {
    url: `${backendUrl}/api/signup`,
    method: "post",
  },
  login: {
    url: `${backendUrl}/api/login`,
    method: "post",
  },
  current_user: {
    url: `${backendUrl}/api/user-details`,
    method: "get",
  },
  logout_user: {
    url: `${backendUrl}/api/user-logout`,
    method: "get",
  },
  all_users: {
    url: `${backendUrl}/api/all-users`,
    method: "get",
  },
  update_user: {
    url: `${backendUrl}/api/update-user`,
    method: "post",
  },
  uploadProduct: {
    url: `${backendUrl}/api/upload-product`,
    method: "post",
  },
  AllProduct: {
    url: `${backendUrl}/api/get-product`,
    method: "get",
  },
  updateaProduct: {
    url: `${backendUrl}/api/update-product`,
    method: "post",
  },
  delteAdminProduct: {
    url: `${backendUrl}/api/delete-admin-product`,
    method: "post",
  },
  categoryProduct: {
    url: `${backendUrl}/api/get-categoryProduct`,
    method: "get",
  },
  categoryWiseProduct: {
    url: `${backendUrl}/api/category-product`,
    method: "post",
  },
  productDetails: {
    url: `${backendUrl}/api/product-details`,
    method: "post",
  },
  addtocart: {
    url: `${backendUrl}/api/addtocart`,
    method: "post",
  },
  countAddToCart: {
    url: `${backendUrl}/api/countAddToCart`,
    method: "get",
  },
  addToCartProductView: {
    url: `${backendUrl}/api/view-card-product`,
    method: "get",
  },
  updateCartProduct: {
    url: `${backendUrl}/api/update-cart-product`,
    method: "post",
  },
  deleteCartProduct: {
    url: `${backendUrl}/api/delete-cart-product`,
    method: "post",
  },
  searchProduct: {
    url: `${backendUrl}/api/search`,
    method: "get",
  },
  filter_product: {
    url: `${backendUrl}/api/filter-product`,
    method: "post",
  },
  payment: {
    url: `${backendUrl}/api/checkout`,
    method: "post",
  },
  myOrders: {
    url: `${backendUrl}/api/order/my-orders`,
    method: "get",
  },
  allOrders: {
    url: `${backendUrl}/api/order/all-orders`,
    method: "get",
  },
  updateOrderStatus: {
    url: `${backendUrl}/api/order/update-status`,
    method: "post",
  },
};

export default ApiSummary;
