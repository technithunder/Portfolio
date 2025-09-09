import axiosInstanceApi from './interceptor';

export const loginApi = payload => {
  let result;
  try {
    result = axiosInstanceApi.post('/admin/login', payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const signUpApi = payload => {
  let result;
  try {
    result = axiosInstanceApi.post('/user/signUp', payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllProducts = (page, search, categoryId) => {
  console.log('24', search);
  let result;
  try {
    result = axiosInstanceApi.get(
      `/product/getAllProducts?limit=4&page=${page}${
        search && `&search=${search}`
      }${categoryId ? `&categoryId=${categoryId}` : ''}`,
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getSingleProducts = id => {
  let result;
  try {
    result = axiosInstanceApi.get(`/product/${id}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const addToCartAPI = payload => {
  let result;
  try {
    result = axiosInstanceApi.post('/cart/add', payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllCarts = () => {
  let result;
  try {
    result = axiosInstanceApi.get('/cart/fetch');
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateCartAPI = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.put('/cart/update', payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteCartProductApi = cartItemId => {
  let result;
  try {
    result = axiosInstanceApi.put(`/cart/remove/${cartItemId}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const clearCartAPI = () => {
  let result;
  try {
    result = axiosInstanceApi.put(`/cart/clear-cart`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const checkoutAPI = payload => {
  let result;
  try {
    result = axiosInstanceApi.post(`/cart/checkout`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllOrders = async (status = null, page = 1, search = '') => {
  let result;
  try {
    let queryParams = `page=${page}&limit=10`;

    if (status && status !== 'all') {
      queryParams += `&status=${status}`;
    }

    if (search) {
      queryParams += `&search=${search}`;
    }
    result = await axiosInstanceApi.get(
      `/order/fetch-user-order?${queryParams}`,
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getSingleOrder = (orderId, userId) => {
  let result;
  try {
    result = axiosInstanceApi.get(
      `/order/order-detail/${orderId}${userId ? `?userId=${userId}` : ''}`,
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllOrdersAdmin = async (
  status = null,
  page = 1,
  search = '',
  staffId = null,
) => {
  let result;
  try {
    let queryParams = `page=${page}&limit=10`;

    if (status && status !== 'all') {
      queryParams += `&status=${status}`;
    }

    if (search) {
      queryParams += `&search=${search}`;
    }

    if (staffId) {
      queryParams += `&staffId=${staffId}`;
    }

    result = await axiosInstanceApi.get(`/order/getAllOrders?${queryParams}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllUsers = (role, page, search, limit = 10) => {
  let result;
  try {
    result = axiosInstanceApi.get(
      `/user/getAllUsers?role=${role}&limit=${limit}&page=${page}${
        search ? `&search=${search?.trim()}` : ''
      }`,
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const addOrderStaff = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post('/orderStaff/add', payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllAssignStaff = async orderId => {
  let result;
  try {
    result = await axiosInstanceApi.get(`/orderStaff/fetch/${orderId}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const removeAssignStaff = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post(`/orderStaff/remove`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const uploadPaymentPhoto = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post(`/order/payment-upload`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const fetchStaffProfileApi = async staffId => {
  let result;
  try {
    result = await axiosInstanceApi.get(`/user/get-user/${staffId}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const addStaffApi = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post(`/user/add`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateStaffApi = async (id, payload) => {
  let result;
  try {
    result = await axiosInstanceApi.put(`/user/update-user/${id}`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllDealerOrders = (
  userId,
  status = null, // Changed default to null
  page,
  search,
) => {
  let result;
  try {
    let url = `/order/getAllOrders?userId=${userId}&limit=10&page=${page}`;

    if (status !== null && status !== undefined) {
      url += `&status=${status}`;
    }

    if (search) {
      url += `&search=${search}`;
    }

    console.log('API URL:', url);
    result = axiosInstanceApi.get(url);
  } catch (e) {
    console.error('API Error:', e);
    result = e;
  }
  return result;
};

export const updateDealerProfile = async (id, payload) => {
  let result;
  try {
    result = await axiosInstanceApi.put(`/user/update-user/${id}`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const addWishList = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post(`/wishlist/add`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllWishlist = async (page = 1, pageSize = 10) => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `/wishlist/list?page=${page}&pageSize=${pageSize}`,
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const removeWishList = async productId => {
  let result;
  try {
    result = await axiosInstanceApi.get(`/wishlist/remove-item/${productId}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllLead = async (
  page = 1,
  limit = 5,
  search = '',
  type = '',
  dateFilter = '',
) => {
  let result;
  try {
    let url = `/lead/getAllLead?page=${page}&limit=${limit}`;
    if (search) {
      url += `&search=${search}`;
    }
    if (type) {
      url += `&type=${type}`;
    }
    if (dateFilter) {
      url += `&dateFilter=${dateFilter}`;
    }
    result = await axiosInstanceApi.get(url);
  } catch (e) {
    result = e;
  }
  return result;
};

export const addLead = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post(`/lead/add`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getSingleLead = async id => {
  let result;
  try {
    result = await axiosInstanceApi.get(`/lead/fetch/${id}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateLead = async (id, payload) => {
  let result;
  try {
    result = await axiosInstanceApi.put(`/lead/update/${id}`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const convertToUser = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post(`/lead/convert-to-user`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const manageOderStatus = async (id, payload) => {
  let result;
  try {
    result = await axiosInstanceApi.put(`/order/order-status/${id}`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const forgotPasswordApi = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post(`/user/forgetPassword`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllAddress = async (page, search) => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `/user/address-list?limit=10&page=${page}${
        search ? `&search=${search}` : ''
      }`,
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getSingleAddress = async id => {
  let result;
  try {
    result = await axiosInstanceApi.get(`/user/get-address/${id}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateAddress = async (id, payload) => {
  let result;
  try {
    result = await axiosInstanceApi.put(`/user/update-address/${id}`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteAddress = async id => {
  let result;
  try {
    result = await axiosInstanceApi.delete(`/user/delete-address/${id}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const addAddress = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post(`/user/add-address`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllAddressApi = async () => {
  let result;
  try {
    result = await axiosInstanceApi.get(`/user/address-list`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllUserInfo = async role => {
  let result;
  try {
    result = await axiosInstanceApi.get(`/user/user-list?role=${role}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllUserProducts = async dealerId => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `/product/product-list?userId=${dealerId}`,
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllAddressByUserId = async userId => {
  let result;
  try {
    result = await axiosInstanceApi.get(`/user/fetch-address?userId=${userId}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const createOrderByAdmin = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post(`/order/add`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const orderApproveApi = async (orderId, payload) => {
  let result;
  try {
    result = await axiosInstanceApi.put(
      `/order/order-approve/${orderId}`,
      payload,
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllCities = async () => {
  let result;
  try {
    result = await axiosInstanceApi.get('/staff/fetchNationalities');
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllNotifications = async (page, limit) => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `/notification/notification-list?page=${page}&limit=${limit}`,
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteNotification = async idOrType => {
  let result;
  try {
    const url =
      idOrType === 'all'
        ? `/notification/notification-delete?type=${idOrType}`
        : `/notification/notification-delete?id=${idOrType}`;

    result = await axiosInstanceApi.delete(url); // Changed from get to delete
  } catch (e) {
    result = e;
  }
  return result;
};

export const addFeedback = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post('/review/add-review', payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const addComplaints = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post('/complaint/add', payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const deleteDealerAndStaff = async id => {
  let result;
  try {
    result = await axiosInstanceApi.delete(`/user/delete-user/${id}`);
  } catch (error) {
    result = error;
  }
  return result;
};

export const getAllCategories = async () => {
  let result;
  try {
    result = await axiosInstanceApi.get('/category/list-category?type=all');
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllDeletedUser = async (page, search, limit = 10) => {
  let result;
  try {
    result = axiosInstanceApi.get(
      `/user/deleted-staff?limit=${limit}&page=${page}${
        search ? `&search=${search?.trim()}` : ''
      }`,
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const restoreUser = async id => {
  let result;
  try {
    result = await axiosInstanceApi.get(`/user/restore-user/${id}`);
  } catch (error) {
    result = error;
  }
  return result;
};

export const addStaffProgress = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post(`/daily-progress/add`, payload);
  } catch (error) {
    result = error;
  }
  return result;
};

export const updateStaffProgress = async (id, payload) => {
  let result;
  try {
    result = await axiosInstanceApi.put(
      `/daily-progress/update/${id}`,
      payload,
    );
  } catch (error) {
    result = error;
  }
  return result;
};

export const getStaffProgress = async () => {
  let result;
  try {
    result = await axiosInstanceApi.get(`/daily-progress/fetch`);
  } catch (error) {
    result = error;
  }
  return result;
};

export const getAllProgressReport = async (
  userId,
  page,
  startDate,
  endDate,
) => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `/daily-progress/list?userId=${userId}&limit=10&page=${page}${
        startDate && `&startDate=${startDate}`
      }${endDate && `&endDate=${endDate}`}`,
    );
  } catch (error) {
    result = error;
  }
  return result;
};

export const addLeadStaff = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post(`/leadStaff/add`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const addProductCategory = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post(`/category/add-category`, payload);
  } catch (error) {
    result = error;
  }
  return result;
};

export const removeLeadStaff = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post(`/leadStaff/remove`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};
export const getProductCategories = async page => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `/category/list-category?limit=12&page=${page}`,
    );
  } catch (error) {
    result = error;
  }
  return result;
};

export const getAllLeadStaff = async id => {
  let result;
  try {
    result = await axiosInstanceApi.get(`/leadStaff/fetch/${id}`);
  } catch (e) {
    result = e;
  }
  return result;
};
export const deleteProductCategory = async id => {
  let result;
  try {
    result = await axiosInstanceApi.delete(`/category/delete-category/${id}`);
  } catch (error) {
    result = error;
  }
  return result;
};

export const updateProductCategory = async (id, payload) => {
  let result;
  try {
    result = await axiosInstanceApi.put(
      `/category/update-category/${id}`,
      payload,
    );
  } catch (error) {
    result = error;
  }
  return result;
};

export const addProduct = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post(`/product`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateProduct = async (id, payload) => {
  let result;
  try {
    result = await axiosInstanceApi.put(`/product/${id}`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const removeProduct = async id => {
  let result;
  try {
    result = await axiosInstanceApi.delete(`/product/${id}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getSingleProduct = async id => {
  let result;
  try {
    result = await axiosInstanceApi.get(`/product/${id}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getDashboardData = async () => {
  let result;
  try {
    result = await axiosInstanceApi.get(`/dashboard/fetch`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateNote = async (id, payload) => {
  let result;
  try {
    result = await axiosInstanceApi.put(
      `/daily-progress/update-notes/${id}`,
      payload,
    );
  } catch (e) {
    result = e;
  }
  return result;
};
export const dashboardAllDataApi = async (
  page,
  list_type,
  limit = 4,
  expectedDate,
) => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `/dashboard/list?limit=${limit}&page=${page}&listType=${list_type}${
        expectedDate ? `&expectedDate=${expectedDate}` : ''
      }`,
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const addNotes = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post(`/lead/add-notes`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllNotes = async (page, limit = 20, leadId) => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `/lead/list-notes?limit=${limit}&page=${page}&leadId=${leadId}`,
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const addNotesOrder = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post(`/order/add-notes`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllNotesOrder = async (page, limit = 20, orderId) => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `/order/list-notes?limit=${limit}&page=${page}&orderId=${orderId}`,
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const addNotesComplaints = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post(`/complaint/add-notes`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllNotesComplaints = async (page, limit = 20, complaintsId) => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `/complaint/list-notes?limit=${limit}&page=${page}&complaintId=${complaintsId}`,
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllComplaints = async (page, search) => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `/complaint/list?limit=10&page=${page}${
        search ? `&search=${search?.trim()}` : ''
      }`,
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getSingleComplaint = async id => {
  let result;
  try {
    result = await axiosInstanceApi.get(`/complaint/fetch/${id}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const removeComplaintStaff = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post('/complaint/remove-staff', payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getAllComplaintStaff = async id => {
  let result;
  try {
    result = await axiosInstanceApi.get(`/complaint/fetch-staff/${id}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const addComplaintStaff = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post(`/complaint/assign-staff`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const updateComplaintStatus = async (id, payload) => {
  let result;
  try {
    result = await axiosInstanceApi.put(`/complaint/update/${id}`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};


export const changePassword = async payload => {
  let result;
  try {
    result = await axiosInstanceApi.post(`/user/change-password`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};


