import { createHeaders } from "../../helper/constants";
import Promises from "../../helper/Promises";

export const FETCH_USER_DATA_BY_ID = 'fetch_user_data_by_id'
export const fetchUserDataById = () => async (dispatch, getState, api) => {
  const userId = await Promises.getUsersKey();
  const token = await Promises.getUserToken();
  return new Promise((resolve, reject) => {
    api.get(`User/GetById?userId=${userId}`, {
      headers: createHeaders(token),
    })
      .then((res) => {
        if (res.data.status == 200) {
          dispatch({
            type: FETCH_USER_DATA_BY_ID,
            payload: res.data.data
          })
          resolve(res.data.data)
        } else if (res.data.status === 403) {
          reject('You are suspended');
        }
      })
      .catch((e) => {
        reject(e)
      });
  })
}