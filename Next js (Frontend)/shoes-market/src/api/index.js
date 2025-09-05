import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (
      response.status === 200 ||
      response.status === 201 ||
      response.status === 202
    ) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    return new Promise(async (resolve, reject) => {
      if (error.response?.data) {
        return reject(error.response.data);
      }
    });
  }
);

//get all product
export const getAllProduct = async () => {
  let result;
  try {
    result = await axiosInstance.get("/api");
  } catch (e) {
    throw (result = e);
  }
  return result;
};

//fetchProduct with Pagination
export const getProducts = async (category, payload) => {
  let result;
  try {
    result = await axiosInstance.post(
      `/api/product-category/men-footwear/sort/${category}`,
      payload
    );
  } catch (e) {
    throw (result = e);
  }
  return result;
};

//fetch Perticuler Product
export const fetchProduct = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/api/product`, payload);
  } catch (e) {
    throw (result = e);
  }
  return result;
};

//add to cart

//add product in cart
export const addProduct = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post("/api/cart", payload);
  } catch (e) {
    throw (result = e);
  }
  return result;
};

//fetch cart Product
export const fetchCartProduct = async (id) => {
  console.log("==>",id)
  const uid = id.userId;
  let result;
  try {
    result = await axiosInstance.get(`/api/cart/${uid}`);
  } catch (e) {
    throw (result = e);
  }
  return result;
};

//delete cart product
export const deleteProduct = async (id) => {
  let result;
  try {
    result = await axiosInstance.delete(`/api/cart/${id}`);
  } catch (e) {
    throw (result = e);
  }
  return result;
};

export const getCheckoutProduct = async () => {
  let result;
  try {
    result = await axiosInstance.get(`/api/checkout`);
  } catch (e) {
    throw (result = e);
  }
  return result;
};

export const updateProduct = async (payload) => {
  let result;
  try {
    result = await axiosInstance.patch(`/api/cartItem`, payload);
  } catch (e) {
    throw (result = e);
  }
  return result;
};

//related products
export const relatedProduct = async () => {
  let result;
  try {
    result = await axiosInstance.get(`/api/related`);
  } catch (e) {
    throw (result = e);
  }
  return result;
};

//order
export const orderProduct = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/api/order`, payload);
  } catch (e) {
    throw (result = e);
  }
  return result;
};

export const getOrder = async (id) => {
  let result;
  try {
    result = await axiosInstance.get(`/api/order/${id}`);
  } catch (e) {
    throw (result = e);
  }
  return result;
};

//search Product By Title
export const filterProduct = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/api/search`, payload);
  } catch (e) {
    throw (result = e);
  }
  return result;
};

export const getAds = async () => {
  let result;
  try {
    result = await axiosInstance.get(`/api/admin/advertizes`);
  } catch (error) {
    throw (result = error);
  }
  return result;
};

//getOrder
export const getOrders = async (id) => {
  let result;
  try {
    result = await axiosInstance.get(`/api/orders/${id}`);
  } catch (error) {
    throw (result = error);
  }
  return result;
};

export const getSettings = async () => {
  let result;
  try {
    result = await axiosInstance.get(`/api/admin/settings`);
  } catch (error) {
    throw (result = error);
  }
  return result;
};

//Tracking Order API
export const trakingOrder = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/api/product/tracking`, payload);
  } catch (error) {
    throw (result = error);
  }
  return result;
};

//get Categories

export const getCategorys = async () => {
  let result;
  try {
    result = await axiosInstance.get(`/api/admin/categorys`);
  } catch (error) {
    throw (result = error);
  }
  return result;
};

export const fetchPageContents = async () => {
  let result;
  try {
    result = await axiosInstance.get(`/api/contents`);
  } catch (error) {
    throw (result = error);
  }
  return result;
};
