import { createContext, useReducer, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface IUser {
  id: string;
  username: string;
  email: string;
}

interface IState {
  token: string | null;
  isAuthenticated: boolean | null;
  loading: boolean;
  user: IUser | null;
}

interface IAuthContext extends IState {
  login: (formData: any) => Promise<void>;
  register: (formData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext | null>(null);

type Action =
  | { type: 'LOGIN_SUCCESS'; payload: { token: string; user: IUser } }
  | { type: 'LOGOUT' }
  | { type: 'AUTH_ERROR' }
  | { type: 'USER_LOADED'; payload: IUser };

const authReducer = (state: IState, action: Action): IState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        user: action.payload.user
      };
    case 'LOGOUT':
    case 'AUTH_ERROR':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      };
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const initialState: IState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load User
  const loadUser = async () => {
    if (localStorage.getItem('token')) {
      axios.defaults.headers.common['x-auth-token'] = localStorage.getItem('token');
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
      dispatch({ type: 'AUTH_ERROR' });
      return;
    }

    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if(user) {
          dispatch({ type: 'USER_LOADED', payload: user });
      } else {
          dispatch({ type: 'AUTH_ERROR' });
      }
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (formData: any) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data
      });
    } catch (err: any) {
      console.error(err.response?.data);
      throw err;
    }
  };

  const register = async (formData: any) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data
      });
    } catch (err: any) {
      console.error(err.response?.data);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
