import { createContext, useEffect, useReducer, useState } from 'react';

import PropTypes from 'prop-types';
import axios from 'axios';
import { encryptText } from 'src/utils/utils';
import moment from 'moment';

const initialAuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  })
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialAuthState,
  method: 'JWT',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialAuthState);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const expirationTime = localStorage.getItem('expiresIn');
        if (accessToken && expirationTime) {
          const date = new Date();
          const parsedTimestamp = moment(date).format(
            'YYYY-MM-DDTHH:mm:ss.SSSSSSS[Z]'
          );
          if (expirationTime < parsedTimestamp) {
            setSession(null);
            localStorage.removeItem('userdata');
            localStorage.removeItem('expiresIn');
            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: false,
                user: null
              }
            });
          } else {
            setSession(accessToken);
            const user = JSON.parse(localStorage.getItem('userdata'));
            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: true,
                user
              }
            });
          }
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);

  const login = async (userName, password) => {
    const encryptedPassword = encryptText(password);
    let obj = { userName: userName, password: encryptedPassword };

    const response = await axios.post(
      'https://www.example.com',
      obj
    );

    if (response) {
      setMessage(response.data.message);
    }

    if (response) {
      const { accessToken } = response.data.data.token;
      const { expiresIn } = response.data.data.token;
      const { user } = response.data.data;
      setSession(accessToken);

      localStorage.setItem('expiresIn', expiresIn);
      localStorage.setItem('userdata', JSON.stringify(user));
      dispatch({
        type: 'LOGIN',
        payload: {
          user
        }
      });
    }
  };

  const logout = async () => {
    setSession(null);
    localStorage.clear('userdata');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'JWT',
        login,
        logout,
        message
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;
