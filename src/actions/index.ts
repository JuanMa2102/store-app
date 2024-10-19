import { loginUser, logout, registerUser } from './auth';
import { loadProductsFromCart } from './cart/load-products-from-cart.action';
import { createUpdateProduct } from './products/create-update-products.action';
import { getProductsByPage } from './products/get-products-by-page-action';
import { getProductsBySlug } from './products/get-products-by-slug-action';
import { deleteProductImage } from './products/delete-product-image.actions';


export const server = {
  // actions

  // Auth
  loginUser,
  logout,
  registerUser,

  // products
  getProductsByPage,
  getProductsBySlug,
  loadProductsFromCart,

  // admin
  createUpdateProduct,
  deleteProductImage
};
