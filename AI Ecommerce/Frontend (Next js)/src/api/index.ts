import axiosInstanceApi from "./interceptor";

export const loginApi = async (payload) => {
  let result;
  try {
    result = await axiosInstanceApi.post("/login", payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getCustomerList = async (query = "", page, displayLength = 9) => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `/CustomerSelection/GetAllCustomerList?iDisplayLength=${displayLength}${
        query && `&sSearch=${query}`
      }&iDisplayStart=${page}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getProducts = async (
  customerId,
  page,
  ItemsGroup2 = "",
  sSearch = "",
  queryParams = "",
  displayLength = 10,
  orderBy = ''
) => {


  let result;
  try {
    result = await axiosInstanceApi.get(
      `/PriceBook/ProductCatelog?iDisplayLength=${displayLength}${
        customerId && `&CustomerId=${customerId}`
      }${page && `&iDisplayStart=${page}`}${
        ItemsGroup2 && `&ItemsGroup2=${ItemsGroup2}`
      }${sSearch && `&sSearch=${sSearch}`}${queryParams && `&${queryParams}`}${orderBy && `&OrderBy=${orderBy}`}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getProductsHistory = async (
  customerId,
  displayLength = 10,
  page = 1
) => {

  let result;
  try {
    result = await axiosInstanceApi.get(
      `ItemHistory/GetItemHistory?CustomerId=${customerId}&iDisplayLength=${displayLength}&iDisplayStart=${page}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getNavigationList = async () => {
  let result;
  try {
    result = await axiosInstanceApi.get(`/PriceBook/GetNavigationList`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getInvoiceList = async (customerId, displayLength, displayStart, sortColumn, sortOrder) => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `/Invoices/GetInvoices?customerId=${customerId}&iDisplayLength=${displayLength}&iDisplayStart=${displayStart}&sortColumn=${sortColumn}&sortOrder=${sortOrder}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getProductDetails = async (customerId, itemId) => {
  let result;
  try {
    result = await axiosInstanceApi.post(
      `CurrentOrder/GetItemInfoDetails?item_id=${itemId}&CustomerID=${customerId}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getTopPurchasedItem = async (customerId, itemId) => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `CurrentOrder/loadPanels?customerId=${customerId}&itemId=${itemId}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const checkItemId = async ({
  value_additem_no,
  value_order_id,
  CustomerID,
  PageString,
}) => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `CurrentOrder/CheckItemId?value_additem_no=${value_additem_no}&value_order_id=${value_order_id || null
      }&CustomerID=${CustomerID}&PageString=${PageString || null}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const addItemToCart = async (payload) => {
  let result;
  try {
    result = await axiosInstanceApi.post(`CurrentOrder/AddItem`, payload);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getMyHistory = async (customerId, displayStart) => {
  let result;
  try {
    result = await axiosInstanceApi.get(`/ItemHistory/GetItemHistory?CustomerID=${customerId}&iDisplayStart=${displayStart}&iDisplayLength=10`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const changeItemToCart = async (itemID: string, orderID: string, txtValue: number) => {
  let result;
  try {
    result = await axiosInstanceApi.put(`/CurrentOrder/change-item-qty?itemID=${itemID}&orderID=${orderID}&txtValue=${txtValue}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const removeItemFromCart = async (itemID: string, orderID: string, umID: string) => {
  let result;
  try {
    result = await axiosInstanceApi.delete(`/CurrentOrder/DeleteItem?itemID=${itemID}&orderID=${orderID}&umID=${umID}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const getOrderHistory = async (customerId: string, searchValue = '', displayStart: number) => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `/PastOrder/GetPastOrderInfo?customerId=${customerId}&iDisplayStart=${displayStart}&iDisplayLength=10&sSearch=${searchValue}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getCurrentOrder = async (customerId, guidId) => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `CurrentOrder/CurrentOrder?customerId=${customerId}&guidId=${guidId}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getOrderDetails = async (customerId, itemId) => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `CurrentOrder/GetOrderHeader?custID=${customerId}&guidID=${itemId}&pageString=""`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getOrderTotal =async (guidId) => {
  let result;
  try {
    result = await axiosInstanceApi.get(
      `CurrentOrder/GetOrderTotals?GuidID=${guidId}`
    );
  } catch (e) {
    result = e;
  }
  return result;
};

export const getInvoiceDetails = async (invoiceId: string, displayLength: number, displayStart: number)=>{
  let result;
  try {
    result = await axiosInstanceApi.get(
      `/Invoices/GetInvoicesByInvoiceID?InvoiceID=${invoiceId}&iDisplayLength=${displayLength}&iDisplayStart=${displayStart}`
    );
  } catch (e) {
    result = e;
  }
  return result;
}

export const setOrderHeader = async (queryString: any) => {
  let result;
  try {
    result = await axiosInstanceApi.post(`CurrentOrder/SetOrderHeader${queryString}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const handleCancelOrder = async (guidId: string) => {
  let result;
  try {
    result = await axiosInstanceApi.post(`CustomerSelection/CancelCurrentOrder?GuidID=${guidId}`);
  } catch (e) {
    result = e;
  }
  return result;
};

export const saveOrderStatus = async (orderId: string, customerid: string,order_value:number) => {
  let result;
  try {
    result = await axiosInstanceApi.get(`CurrentOrder/UpdateOrderStatus?order_value=${order_value}&orderId=${orderId}&customerid=${customerid}`);
  } catch (e) {
    result = e;
  }
  return result;
};