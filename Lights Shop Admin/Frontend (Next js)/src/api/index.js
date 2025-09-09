import axios from "axios";
import { store } from "../redux/store";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
});

const getAuthHeaders = () => {
  const state = store.getState();
  const { auth } = state;

  return {
    authorization: auth?.userInfo?.token
      ? `Bearer ${auth.userInfo.token}`
      : undefined,
    fcmToken: auth?.fcmToken,
    deviceType: "web",
  };
};

//axios instance
axiosInstance.interceptors.request.use(
  function (config) {
    try {
      if (config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data";
      } else {
        config.headers["Content-Type"] = "application/json";
      }
      const { authorization, fcmToken, deviceType } = getAuthHeaders();

      if (authorization) {
        config.headers["Authorization"] = authorization;
      }

      if (fcmToken) {
        config.headers["fcmtoken"] = fcmToken;
      }

      if (deviceType) {
        config.headers["devicetype"] = deviceType;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  function (error) {
    return Promise.reject(error);
  }
);

//admin login api
export const adminLogin = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/admin/login`, payload);
  } catch (error) {
    result = error;
  }
  return result;
};

//create staff api
export const createUser = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/user/add`, payload);
  } catch (error) {
    result = error;
  }
  return result;
};

//create dealer api
export const createDealer = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/dealer`, payload);
  } catch (error) {
    result = error;
  }
  return result;
};

//create order api
export const createProduct = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/product`, payload);
  } catch (error) {
    result = error;
  }
  return result;
};

//fetch nationaliteis api
export const fetchNationalities = async (payload) => {
  let result;
  try {
    result = await axiosInstance.get(`/staff/fetchNationalities`, payload);
  } catch (error) {
    result = error;
  }
  return result;
};

//fetch status api
export const fetchStatus = async (payload) => {
  let result;
  try {
    result = await axiosInstance.get(`/staff/fetchStatus`, payload);
  } catch (error) {
    result = error;
  }
  return result;
};

//fetch all staff api
export const fetchAllUserDetails = async ({ params }) => {
  let result;
  try {
    result = await axiosInstance.get("/user/getAllUsers", { params });
  } catch (error) {
    result = error;
  }
  return result;
};

//fetch all dealer api
export const fetchAllDealer = async ({ params }) => {
  let result;
  try {
    result = await axiosInstance.get("/dealer/getAllDealers", { params });
  } catch (error) {
    result = error;
  }
  return result;
};

export const fetchAllProduct = async ({ params }) => {
  let result;
  try {
    result = await axiosInstance.get("/product/getAllProducts", { params });
  } catch (error) {
    result = error;
  }
  return result;
};

//fetch all order api
export const fetchAllOrder = async ({ params }) => {
  let result;
  try {
    result = await axiosInstance.get("/order/getAllOrders", { params });
  } catch (error) {
    result = error;
  }
  return result;
};

//delete staff api
export const deleteStaff = async (id) => {
  let result;
  try {
    result = await axiosInstance.delete(`/user/delete-user/${id}`);
  } catch (error) {
    result = error;
  }
  return result;
};

//delete dealer api
export const deleteDealer = async (id) => {
  let result;
  try {
    result = await axiosInstance.delete(`/dealer/${id}`);
  } catch (error) {
    result = error;
  }
  return result;
};

//delete product api
export const deleteProduct = async (id) => {
  let result;
  try {
    result = await axiosInstance.delete(`/product/${id}`);
  } catch (error) {
    result = error;
  }
  return result;
};

//delete order api
export const deleteOrder = async (id) => {
  let result;
  try {
    result = await axiosInstance.delete(`/order/${id}`);
  } catch (error) {
    result = error;
  }
  return result;
};

//get single staff api
export const fetchStaffById = async (id) => {
  let result;
  try {
    result = await axiosInstance.get(`/staff/${id}`);
  } catch (error) {
    result = error;
  }
  return result;
};

//get single dealer by id
export const fetchDealerById = async (id) => {
  let result;
  try {
    result = await axiosInstance.get(`/dealer/${id}`);
  } catch (error) {
    result = error;
  }
  return result;
};

//get users api
export const fetchUserById = async (id) => {
  let result;
  try {
    result = await axiosInstance.get(`/user/get-user/${id}`);
  } catch (error) {
    result = error;
  }
  return result;
};

//get single product by id
export const fetchProductById = async (id) => {
  let result;
  try {
    result = await axiosInstance.get(`/product/${id}`);
  } catch (error) {
    result = error;
  }
  return result;
};

//get single product by id
export const fettchOrderDetailsById = async (id) => {
  let result;
  try {
    result = await axiosInstance.get(`/order/order-detail/${id}`);
  } catch (error) {
    result = error;
  }
  return result;
};

//update staff api
export const updateUser = async (id, payload) => {
  let result;
  try {
    result = await axiosInstance.put(`/user/update-user/${id}`, payload);
  } catch (error) {
    result = error;
  }
  return result;
};

//update dealer api
export const updateDealer = async (id, payload) => {
  let result;
  try {
    result = await axiosInstance.put(`/dealer/${id}`, payload);
  } catch (error) {
    result = error;
  }
  return result;
};

//update product api
export const updateProduct = async (id, payload) => {
  let result;
  try {
    result = await axiosInstance.put(`/product/${id}`, payload);
  } catch (error) {
    result = error;
  }
  return result;
};

//fetch category api
export const fetchCategory = async () => {
  let result;
  try {
    result = await axiosInstance.get("/product/init/fetchCategory");
  } catch (error) {
    result = error;
  }
  return result;
};

//fetch category api
export const fetchAllQuantity = async () => {
  let result;
  try {
    result = await axiosInstance.get("/product/init/fetchQuantity");
  } catch (error) {
    result = error;
  }
  return result;
};

// assign to api
export const createAssignTo = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/orderStaff/add`, payload);
  } catch (error) {
    result = error;
  }
  return result;
};

// fetch assign api
export const fetchOrderStaff = async (orderId) => {
  let result;
  try {
    result = await axiosInstance.get(`/orderStaff/fetch/${orderId}`);
  } catch (error) {
    result = error;
  }
  return result;
};

//delete staff api
export const removeOrderStaff = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/orderStaff/remove`, payload);
  } catch (error) {
    result = error;
  }
  return result;
};

//Lead api
export const createLead = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/lead/add`, payload);
  } catch (error) {
    result = error;
  }
  return result;
};

//fetch all lead api
export const fetchAllLeadDetails = async ({ params }) => {
  let result;
  try {
    result = await axiosInstance.get("/lead/getAllLead", { params });
  } catch (error) {
    result = error;
  }
  return result;
};

//get lead api
export const fetchLeadById = async (id) => {
  let result;
  try {
    result = await axiosInstance.get(`/lead/fetch/${id}`);
  } catch (error) {
    result = error;
  }
  return result;
};

//update lead api
export const updateLead = async (id, payload) => {
  let result;
  try {
    result = await axiosInstance.put(`/lead/update/${id}`, payload);
  } catch (error) {
    result = error;
  }
  return result;
};

//update lead api
export const convertToUser = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/lead/convert-to-user`, payload);
  } catch (error) {
    result = error;
  }
  return result;
};

//update order status api
export const manageOderStatus = async (id, payload) => {
  let result;
  try {
    result = await axiosInstance.put(`/order/order-status/${id}`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

//fetch all Address api
export const fetchAllAddressDetails = async ({ params }) => {
  let result;
  try {
    result = await axiosInstance.get("/user/address-list", { params });
  } catch (error) {
    result = error;
  }
  return result;
};

//Address api
export const creatAddress = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/user/add-address`, payload);
  } catch (error) {
    result = error;
  }
  return result;
};

//delete address api
export const deleteAddress = async (id) => {
  let result;
  try {
    result = await axiosInstance.delete(`/user/delete-address/${id}`);
  } catch (error) {
    result = error;
  }
  return result;
};

//get Address api
// export const fetchAddressById = async (id) => {
//   let result;
//   try {
//     result = await axiosInstance.get(`/user/get-address/${id}`);
//   } catch (error) {
//     result = error;
//   }
//   return result;
// };

//update lead api
export const updateAddress = async (id, payload) => {
  let result;
  try {
    result = await axiosInstance.put(`/user/update-address/${id}`, payload);
  } catch (error) {
    result = error;
  }
  return result;
};

//Orders api
export const createOrders = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/order/add`, payload);
  } catch (error) {
    result = error;
  }
  return result;
};

// fetch all User api
export const fetchAllUser = async ({ params }) => {
  let result;
  try {
    result = await axiosInstance.get(`/user/user-list`, { params });
  } catch (error) {
    result = error;
  }
  return result;
};

// fetch all product list api
export const fetchAllProductDetails = async ({ params }) => {
  let result;
  try {
    result = await axiosInstance.get(`/product/product-list`, { params });
  } catch (error) {
    result = error;
  }
  return result;
};

//get address api
export const fetchAddressById = async ({ params }) => {
  let result;
  try {
    result = await axiosInstance.get(`/user/fetch-address`, { params });
  } catch (error) {
    result = error;
  }
  return result;
};

//Payment Upload api
export const createPaymentUpload = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/order/payment-upload`, payload);
  } catch (error) {
    result = error;
  }
  return result;
};

//update order approval api
export const manageOderApproval = async (id, payload) => {
  let result;
  try {
    result = await axiosInstance.put(`/order/order-approve/${id}`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

// send notifications api
export const sendNotification = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/order/payment-upload`, payload);
  } catch (error) {
    result = error;
  }
  return result;
};

//fetch notification api
export const fetchAllNotifications = async ({ params }) => {
  let result;
  try {
    result = await axiosInstance.get(`/notification/notification-list`, {
      params,
    });
  } catch (error) {
    result = error;
  }
  return result;
};

//delete Notification api
export const deleteNotification = async ({ params }) => {
  let result;
  try {
    result = await axiosInstance.delete(`/notification/notification-delete`, {
      params,
    });
  } catch (error) {
    result = error;
  }
  return result;
};

//fetch notification read api
export const fetchNotificationById = async ({ params }) => {
  let result;
  try {
    result = await axiosInstance.get(`/notification/notification-read`, {
      params,
    });
  } catch (error) {
    result = error;
  }
  return result;
};

//fetch product review api
export const fetchProductReview = async ({ params }) => {
  let result;
  try {
    result = await axiosInstance.get(`/review/review-list`, {
      params,
    });
  } catch (error) {
    result = error;
  }
  return result;
};

//delete category api
export const deleteCategory = async (id) => {
  let result;
  try {
    result = await axiosInstance.delete(`/category/delete-category/${id}`);
  } catch (error) {
    result = error;
  }
  return result;
};

//fetch category read api
export const fetchCategoryById = async (id) => {
  let result;
  try {
    result = await axiosInstance.get(`/category/fetch-category/${id}`);
  } catch (error) {
    result = error;
  }
  return result;
};

//fetch category api
export const fetchAllCategory = async ({ params }) => {
  let result;
  try {
    result = await axiosInstance.get(`/category/list-category`, {
      params,
    });
  } catch (error) {
    result = error;
  }
  return result;
};

//Category api
export const createCategory = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/category/add-category`, payload);
  } catch (error) {
    result = error;
  }
  return result;
};

//update Category api
export const updateCategory = async (id, payload) => {
  let result;
  try {
    result = await axiosInstance.put(
      `/category/update-category/${id}`,
      payload
    );
  } catch (e) {
    result = e;
  }
  return result;
};

//update status api
export const updateStatus = async (id, payload) => {
  let result;
  try {
    result = await axiosInstance.put(`/user/active-user/${id}`, payload);
  } catch (error) {
    result = error;
  }
  return result;
};

//fetch all deleted users api
export const fetchAllDeletedUserDetails = async ({ params }) => {
  let result;
  try {
    result = await axiosInstance.get("/user/deleted-staff", { params });
  } catch (error) {
    result = error;
  }
  return result;
};

// restore deleted user api
export const restoreDeletedUser = async (id) => {
  let result;
  try {
    result = await axiosInstance.get(`/user/restore-user/${id}`);
  } catch (error) {
    result = error;
  }
  return result;
};

//fetch users progress api
export const fetchUserProgressDetails = async ({ params }) => {
  let result;
  try {
    result = await axiosInstance.get("/daily-progress/list", { params });
  } catch (error) {
    result = error;
  }
  return result;
};

// lead assign to staff api
export const createLeadAssignToStaff = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/leadStaff/add`, payload);
  } catch (error) {
    result = error;
  }
  return result;
};

// fetch Lead Staff api
export const fetchLeadStaff = async (orderId) => {
  let result;
  try {
    result = await axiosInstance.get(`/leadStaff/fetch/${orderId}`);
  } catch (error) {
    result = error;
  }
  return result;
};

//delete Lead staff api
export const removeLeadStaff = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post(`/leadStaff/remove`, payload);
  } catch (error) {
    result = error;
  }
  return result;
};

// fetch dashboard api
export const fetchDashboardTable = async () => {
  let result;
  try {
    result = await axiosInstance.get(`/dashboard/fetch`);
  } catch (error) {
    result = error;
  }
  return result;
};

//Add notes api
export const addNotes = async (id, payload) => {
  let result;
  try {
    result = await axiosInstance.put(`/update-notes/${id}`, payload);
  } catch (error) {
    result = error;
  }
  return result;
};

//fetch all dashboard details api
export const fetchDashboardList = async ({ params }) => {
  let result;
  try {
    result = await axiosInstance.get("/dashboard/list", { params });
  } catch (error) {
    result = error;
  }
  return result;
};

export const fetchChatMessage = async (complaintId, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get("/complaint/list-notes", {
      params: {
        complaintId,
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    throw error;
  }
};

export const fetchChatMessageLead = async (leadId, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get("/lead/list-notes", {
      params: {
        leadId,
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    throw error;
  }
};

export const fetchChatMessageOrder = async (orderId, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get("/order/list-notes", {
      params: {
        orderId,
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    throw error;
  }
};

export const addMessage = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post("/complaint/add-notes", payload);
  } catch (error) {
    result = error;
  }
  return result;
};

export const addMessageLead = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post("/lead/add-notes", payload);
  } catch (error) {
    result = error;
  }
  return result;
};

export const addMessageOrder = async (payload) => {
  let result;
  try {
    result = await axiosInstance.post("/order/add-notes", payload);
  } catch (error) {
    result = error;
  }
  return result;
};

export const updateStatusForOrder = async (id, status) => {
  try {
    const response = await axiosInstance.put(`/order/order-status/${id}`, {
      status,
    });
    return response;
  } catch (error) {
    console.error("Failed to update order status:", error);
    throw error;
  }
};

export const addNotesForStaff = async (id, payload) => {
  try {
    const response = await axiosInstance.put(
      `/daily-progress/update-notes/${id}`,
      payload
    );
    return response;
  } catch (error) {
    console.error("Failed to update order status:", error);
    throw error;
  }
};
